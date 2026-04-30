from fastapi import WebSocket, WebSocketDisconnect
from app.models.schemas import Signal
import json
import asyncio

async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await websocket.accept()
    try:
        while True:
            # TODO: fetch latest signal from Redis
            signal_data = {"symbol": symbol, "action": "hold", "confidence": 0.5}
            await websocket.send_text(json.dumps(signal_data))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass

