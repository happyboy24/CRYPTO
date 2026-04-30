from fastapi import APIRouter, Depends, HTTPException
from typing import List
import asyncio
from app.analysis.signal_generator import generate_signal
from app.models.market_data import OHLCVData
from app.models.schemas import Signal
from app.core.database import redis_client
from app.api.deps import get_redis
from app.queue.redis_queue import RedisQueue

router = APIRouter()

@router.get("/signals/{symbol}", response_model=Signal)
async def get_signal(symbol: str, redis=Depends(get_redis)):
    # Mock OHLCV
    ohlcv = []  # TODO: from Redis
    signal = await generate_signal(symbol, ohlcv)
    return signal

@router.get("/health")
async def health():
    if redis_client is None:
        return {"status": "healthy", "redis_ping": "not initialized"}
    return {"status": "healthy", "redis_ping": await redis_client.ping()}

api_router = router

