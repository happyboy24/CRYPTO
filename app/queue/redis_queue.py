import json
from typing import Any, Optional
from app.core.database import redis_client
from app.models.schemas import MarketData

class RedisQueue:
    def __init__(self, stream_name: str = "market_data"):
        self.stream_name = stream_name

    async def produce(self, data: MarketData):
        if redis_client is None:
            raise RuntimeError("Redis client not initialized")
        await redis_client.xadd(self.stream_name, {"data": data.model_dump_json()})

    async def consume(self) -> Optional[MarketData]:
        """Consume one message from the queue."""
        if redis_client is None:
            raise RuntimeError("Redis client not initialized")
        messages = await redis_client.xread({self.stream_name: "0"}, block=1000, count=1)
        for stream, msgs in messages:
            for msg_id, msg in msgs:
                data_json = json.loads(msg[b"data"])
                await redis_client.xdel(self.stream_name, msg_id)
                return MarketData(**data_json)
        return None

