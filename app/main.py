from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn

from .core.config import settings
from .core.database import redis_client, init_redis, close_redis
from .api.router import api_router, router

@asynccontextmanager
async def lifespan(app_: FastAPI):
    
    await init_redis()
    yield
    
    await close_redis()

app = FastAPI(title="Crypto-Forex Signal Giver", lifespan=lifespan)

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.debug)

