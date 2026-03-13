from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    app_name: str = os.getenv('AUREA_APP_NAME', 'AUREA')
    env: str = os.getenv('AUREA_ENV', 'development')
    debug: bool = os.getenv('AUREA_DEBUG', 'true').lower() == 'true'
    database_url: str = os.getenv('AUREA_DATABASE_URL', 'sqlite:///./aurea.db')
    frontend_origin: str = os.getenv('AUREA_FRONTEND_ORIGIN', 'http://localhost:5173')
    secret_key: str = os.getenv('AUREA_SECRET_KEY', 'change-me-32-bytes-minimum')


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
