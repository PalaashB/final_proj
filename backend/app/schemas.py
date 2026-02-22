from typing import List, Optional
from pydantic import BaseModel, Field

class ItemPublic(BaseModel):
    id: int
    location: Optional[str] = None
    finder_contact: Optional[str] = None
    image_url: Optional[str] = None
    created_at: str
    updated_at: str
    similarity: Optional[float] = Field(default=None, description="Cosine similarity in range [0,1].")

class ItemCreateResponse(BaseModel):
    message: str
    item: ItemPublic

class ItemsResponse(BaseModel):
    items: List[ItemPublic]

class SearchResponse(BaseModel):
    query: str
    threshold: float
    count: int
    results: List[ItemPublic]

class StatsSnapshot(BaseModel):
    total_items: int
    unique_locations: int
    items_last_7_days: int
    last_uploaded_at: Optional[str] = None
    top_locations: List[dict]