from fastapi import Depends
from app.core.database import redis_client
from typing import Optional, Any

async def get_redis() -> Optional[Any]:
    """Dependency to get redis client."""
    return redis_client

