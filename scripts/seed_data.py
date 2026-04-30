#!/usr/bin/env python3
import asyncio
from app.queue.redis_queue import RedisQueue
from app.models.market_data import OHLCVData
from datetime import datetime, timedelta

async def seed():
    rq = RedisQueue()
    symbol = "BTCUSDT"
    for i in range(100):
        data = OHLCVData(
            symbol=symbol,
            open=50000 + i * 10,
            high=50000 + i * 10 + 100,
            low=50000 + i * 10 - 100,
            close=50000 + i * 10 + (i % 2 * 200 - 100),
            volume=1000 + i,
            timestamp=datetime.now() - timedelta(hours=i)
        )
        await rq.produce(data)
    print("Seeded 100 BTCUSDT candles")

if __name__ == "__main__":
    asyncio.run(seed())

