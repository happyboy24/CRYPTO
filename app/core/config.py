from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    redis_url: str = "redis://localhost:6379"
    binance_api_key: Optional[str] = None
    coinapi_key: Optional[str] = None
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

