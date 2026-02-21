from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self) -> None:
        self.API_TITLE = os.getenv("ECHO_LOCATOR_TITLE", "Echo-Locator API")
        self.API_VERSION = "1.1.0"
        self.DATABASE_PATH = os.getenv("ECHO_LOCATOR_DB", "echolocator.db")
        self.UPLOAD_DIR = os.getenv("ECHO_LOCATOR_UPLOAD_DIR", "uploads")

        cors_origins = os.getenv(
            "ECHO_LOCATOR_CORS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
        )
        self.ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

        try:
            self.DEFAULT_THRESHOLD = float(os.getenv("ECHO_LOCATOR_DEFAULT_THRESHOLD", "0.6"))
        except ValueError:
            self.DEFAULT_THRESHOLD = 0.6

@lru_cache()
def get_settings() -> Settings:
    return Settings()