import hashlib
import io
import sqlite3
import threading
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import clip 
import numpy as np
import torch
from PIL import Image

class EchoLocatorEngine:
    def __init__(self, db_path: str, upload_dir: Path) -> None:
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.preprocess = clip.load("ViT-B/32", device=self.device, jit=False)
        self.model.eval()

        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.lock = threading.Lock()

        self._init_tables()

    def _init_tables(self) -> None:
        with self.lock:
            self.conn.execute(
                """
                CREATE TABLE IF NOT EXISTS items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    location TEXT,
                    finder_contact TEXT,
                    image_filename TEXT,
                    vector BLOB NOT NULL,
                    vector_dim INTEGER NOT NULL,
                    image_hash TEXT UNIQUE,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                """
            )
            self.conn.commit()

    def _encode_image(self, image: Image.Image) -> torch.Tensor:
        with torch.no_grad():
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)
            embedding = self.model.encode_image(image_input)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)
        return embedding.cpu()[0]

    def _encode_text(self, text: str) -> torch.Tensor:
        with torch.no_grad():
            tokens = clip.tokenize([text]).to(self.device)
            embedding = self.model.encode_text(tokens)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)
        return embedding.cpu()[0]

    def add_item(
        self,
        *,
        image_bytes: bytes,
        title: str,
        location: str,
        description: str,
        finder_contact: str,
    ) -> Dict[str, Any]:
        if not image_bytes:
            raise ValueError("Image upload is empty.")

        image_hash = hashlib.sha256(image_bytes).hexdigest()

        with self.lock:
            existing = self.conn.execute(
                "SELECT id FROM items WHERE image_hash = ?",
                (image_hash,),
            ).fetchone()

            if existing:
                raise ValueError("This item image was already uploaded. Preventing duplicates.")

        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        embedding = self._encode_image(pil_image)
        vector_numpy = embedding.numpy().astype(np.float32)
        vector_bytes = vector_numpy.tobytes()
        vector_dim = vector_numpy.shape[0]

        timestamp = datetime.utcnow().isoformat(timespec="seconds") + "Z"
        safe_title = "".join(ch if ch.isalnum() else "_" for ch in title)[:40]
        image_name = f"{timestamp.replace(':', '').replace('-', '')}_{safe_title or 'item'}.jpg"
        image_path = self.upload_dir / image_name
        pil_image.save(image_path, format="JPEG", quality=92)

        payload = (
            title,
            description or "",
            location or "",
            finder_contact or "",
            image_name,
            sqlite3.Binary(vector_bytes),
            vector_dim,
            image_hash,
            timestamp,
            timestamp,
        )

        with self.lock:
            cursor = self.conn.execute(
                """
                INSERT INTO items (
                    title, description, location, finder_contact,
                    image_filename, vector, vector_dim, image_hash,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                payload,
            )
            self.conn.commit()
            item_id = cursor.lastrowid

            row = self.conn.execute(
                """
                SELECT id, title, description, location, finder_contact,
                       image_filename, created_at, updated_at
                FROM items WHERE id = ?
                """,
                (item_id,),
            ).fetchone()

        return self._row_to_public(row)

    def list_items(self, limit: int = 30) -> List[Dict[str, Any]]:
        with self.lock:
            rows = self.conn.execute(
                """
                SELECT id, title, description, location, finder_contact,
                       image_filename, created_at, updated_at
                FROM items
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

        return [self._row_to_public(row) for row in rows]

    def get_item(self, item_id: int) -> Optional[Dict[str, Any]]:
        with self.lock:
            row = self.conn.execute(
                """
                SELECT id, title, description, location, finder_contact,
                       image_filename, created_at, updated_at
                FROM items
                WHERE id = ?
                """,
                (item_id,),
            ).fetchone()

        if not row:
            return None
        return self._row_to_public(row)

    def search_items(
        self,
        *,
        query: str,
        threshold: float,
        top_k: int,
        location: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        if not query.strip():
            return []

        text_embedding = self._encode_text(query.lower())

        sql = """
            SELECT id, title, description, location, finder_contact,
                   image_filename, vector, created_at, updated_at
            FROM items
        """
        params: List[Any] = []

        if location:
            sql += " WHERE LOWER(location) LIKE ?"
            params.append(f"%{location.lower()}%")

        sql += " ORDER BY created_at DESC"

        with self.lock:
            rows = self.conn.execute(sql, tuple(params)).fetchall()

        results: List[Dict[str, Any]] = []

        for row in rows:
            vector = torch.from_numpy(np.frombuffer(row["vector"], dtype=np.float32))
            
            # 1. Get the raw CLIP score (usually 0.15 to 0.35)
            raw_similarity = torch.nn.functional.cosine_similarity(text_embedding, vector, dim=0).item()
            
            # 2. Multiply by 3.0 to scale it into a human-readable 0 to 1.0 percentage
            scaled_similarity = min(float(raw_similarity) * 3.0, 1.0)
            
            # 3. Now check it against the frontend slider threshold
            if scaled_similarity < threshold:
                continue

            item = self._row_to_public(row)
            item["similarity"] = round(scaled_similarity, 4)
            results.append(item)

        results.sort(key=lambda r: r["similarity"], reverse=True)
        return results[:top_k]

    def get_stats(self) -> Dict[str, Any]:
        with self.lock:
            total_items = self.conn.execute("SELECT COUNT(*) FROM items").fetchone()[0]
            unique_locations = self.conn.execute(
                "SELECT COUNT(DISTINCT location) FROM items WHERE location <> ''"
            ).fetchone()[0]

            last_uploaded = self.conn.execute(
                "SELECT created_at FROM items ORDER BY created_at DESC LIMIT 1"
            ).fetchone()
            last_uploaded_at = last_uploaded[0] if last_uploaded else None

            items_last_7_days = self.conn.execute(
                """
                SELECT COUNT(*) FROM items
                WHERE datetime(created_at) >= datetime('now', '-7 days')
                """
            ).fetchone()[0]

            top_locations_rows = self.conn.execute(
                """
                SELECT location, COUNT(*) as cnt
                FROM items
                WHERE location <> ''
                GROUP BY location
                ORDER BY cnt DESC
                LIMIT 5
                """
            ).fetchall()

        top_locations = [{"location": row["location"], "count": row["cnt"]} for row in top_locations_rows]

        return {
            "total_items": total_items,
            "unique_locations": unique_locations,
            "items_last_7_days": items_last_7_days,
            "last_uploaded_at": last_uploaded_at,
            "top_locations": top_locations,
        }

    def _row_to_public(self, row: sqlite3.Row) -> Dict[str, Any]:
        image_filename = row.get("image_filename") if isinstance(row, dict) else row["image_filename"]

        return {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "location": row["location"],
            "finder_contact": row["finder_contact"],
            "image_url": f"/uploads/{image_filename}" if image_filename else None,
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }