# Back2U – AI Powered Lost & Found

Back2U is a semantic lost and found platform built during a hackathon. It helps students find lost items on campus using natural language search instead of exact keyword matching.

Instead of manually tagging objects, the system uses OpenAI’s CLIP model to generate embeddings for uploaded images and compare them to text queries. You can upload a found item, search using descriptions like “black water bottle near library,” and get ranked results based on similarity.

Built with FastAPI, React (Vite), SQLite, PyTorch, and CLIP.

---

## What It Does

- Upload a found item with image and location
- Prevent duplicate image uploads using SHA256 hashing
- Search items using natural language
- Rank results by semantic similarity
- Optional location-based filtering
- View recent uploads
- See platform statistics (top locations, activity, totals)
- Serve uploaded images statically

---

## Tech Stack

### Backend
- FastAPI
- SQLite
- PyTorch
- OpenAI CLIP (ViT-B/16)
- PIL
- NumPy

### Frontend
- React (Vite)
- Tailwind CSS
- Lucide Icons

---

## How It Works

### Image Upload Flow
1. User uploads an image.
2. The image is saved in `/uploads`.
3. Backend hashes the image to prevent duplicates.
4. The image is encoded using CLIP.
   - Full image embedding
   - Center-cropped embedding
5. The embeddings are averaged and normalized.
6. The vector is stored in SQLite as a float32 BLOB.


### Search Flow
1. User enters a natural language query.
2. Backend encodes the query using CLIP text templates.
3. Cosine similarity is computed between query and stored image vectors.
4. Results are filtered by threshold and ranked.
5. Top matches are returned.

No manual tagging required.

## Project Structure

BACK2U/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── engine.py
│   │   ├── schemas.py
│   │   ├── config.py
│   │   └── __init__.py
│   │
│   ├── uploads/              # Stored item images
│   ├── echolocator.db        # SQLite database
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── UploadForm.jsx
│   │   │   ├── ResearchForm.jsx
│   │   │   ├── RecentItems.jsx
│   │   │   └── StatsPanel.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── node_modules/
│
└── README.md
---

## Key Design Decisions

SQLite for portability and simplicity during hackathon

SHA256 hashing to prevent duplicate uploads

Embeddings stored directly in database

Cropped + full image embeddings for stronger matching

Location filtering handled at SQL level

Thread-safe SQLite access with locking
---
## Limitations

No authentication

No claim or messaging system yet

SQLite not ideal for large-scale deployment

CLIP inference may be slow on CPU

No object detection, purely semantic similarity

Future Improvements

User accounts and claim flow

Vector database (FAISS or Pinecone)

Dockerized deployment

Admin moderation tools

Image-to-image search


---
## Why We Built This

Campus lost and found systems are usually manual and slow. People describe objects differently, and keyword search often fails.

We wanted to build something that understands what an object looks like, not just what someone typed.

Back2U connects images and text using vision-language models to make lost and found smarter.
