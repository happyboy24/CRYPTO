import redis.asyncio as redis
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from .config import settings

redis_client = None

@asynccontextmanager
async def init_redis() -> AsyncGenerator[None, None]:
    global redis_client
    redis_client = redis.from_url(settings.redis_url)
    await redis_client.ping()
    yield

async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()

