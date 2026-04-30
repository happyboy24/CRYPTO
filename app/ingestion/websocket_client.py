import asyncio
import json
from typing import AsyncGenerator, Optional
import websockets
from app.models.schemas import MarketData
from datetime import datetime

class BinanceWebSocketClient:
    def __init__(self, symbols: list[str] = ["btcusdt"]):
        self.symbols = [s.lower() for s in symbols]
        self.ws_url = "wss://stream.binance.com:9443/ws"

    async def connect(self) -> AsyncGenerator[MarketData, None]:
        streams = "/".join([f"{s}@ticker" for s in self.symbols])
        url = f"{self.ws_url}/{streams}"
        
        try:
            async with websockets.connect(url) as ws:
                while True:
                    try:
                        data = json.loads(await ws.recv())
                        yield MarketData(
                            symbol=data["s"],
                            price=float(data["c"]),
                            volume=float(data["v"]),
                            timestamp=datetime.now()
                        )
                    except Exception as e:
                        print(f"WS error: {e}")
                        await asyncio.sleep(5)
                        break
        except Exception as e:
            print(f"Connection error: {e}")
            await asyncio.sleep(5)

# Note: Use in background task: asyncio.create_task(client.connect())

