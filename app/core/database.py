import redis.asyncio as redis
from .config import settings

redis_client = None

async def init_redis() -> None:
    global redis_client
    redis_client = redis.from_url(settings.redis_url)
    await redis_client.ping()

async def close_redis() -> None:
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None

