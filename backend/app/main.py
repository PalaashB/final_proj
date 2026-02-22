from pathlib import Path
from typing import Optional
from fastapi import BackgroundTasks, Depends, FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import Settings, get_settings
from .engine import SemanticEngine
from .schemas import ItemCreateResponse, ItemPublic, ItemsResponse, SearchResponse, StatsSnapshot

settings = get_settings()
app = FastAPI(title=settings.API_TITLE, version=settings.API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)

engine = SemanticEngine(db_path=settings.DATABASE_PATH, upload_dir=upload_dir)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "version": settings.API_VERSION}

@app.post("/api/items", response_model=ItemCreateResponse, status_code=201)
async def create_item(
    background_tasks: BackgroundTasks,
    location: str = Form(..., min_length=2, max_length=120),
    finder_contact: Optional[str] = Form(None, max_length=200),
    image: UploadFile = File(...),
):
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="Upload JPG, PNG, or WEBP images only.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image payload was empty.")

    try:
        item = engine.add_item(
            image_bytes=image_bytes,
            location=location.strip(),
            finder_contact=(finder_contact or "").strip(),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to store item.") from exc

    return {"message": "Item stored successfully.", "item": item}

@app.get("/api/items", response_model=ItemsResponse)
async def list_items(limit: int = Query(25, ge=1, le=100)):
    return {"items": engine.list_items(limit=limit)}

@app.get("/api/items/recent", response_model=ItemsResponse)
async def recent_items(limit: int = Query(8, ge=1, le=24)):
    return {"items": engine.list_items(limit=limit)}

@app.get("/api/items/{item_id}", response_model=ItemPublic)
async def retrieve_item(item_id: int):
    item = engine.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item

@app.get("/api/search", response_model=SearchResponse)
async def search_items(
    query: str = Query(..., min_length=2),
    threshold: float = Query(0.6, ge=0.0, le=1.0),
    top_k: int = Query(10, ge=1, le=50),
    location: Optional[str] = Query(None, description="Optional location filter"),
):
    try:
        results = engine.search_items(query=query, threshold=threshold, top_k=top_k, location=location)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Search failed.") from exc

    return {"query": query, "threshold": threshold, "count": len(results), "results": results}

@app.get("/api/stats", response_model=StatsSnapshot)
async def stats():
    return engine.get_stats()