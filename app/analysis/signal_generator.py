import asyncio
from datetime import datetime
from typing import Dict
from app.models.schemas import Signal
from .indicators import calculate_indicators
from .ml_models import SignalMLModel
from .sentiment import get_sentiment
from app.models.market_data import OHLCVData
from app.queue.redis_queue import RedisQueue

ml_model = SignalMLModel()
rq = RedisQueue()

async def generate_signal(symbol: str, ohlcv_data: list[OHLCVData]) -> Signal:
    if not ohlcv_data:
        # Return default signal if no data
        return Signal(
            symbol=symbol,
            action='hold',
            confidence=0.5,
            timestamp=datetime.now()
        )
    
    indicators = calculate_indicators(ohlcv_data)
    features = ml_model.prepare_features(indicators)
    confidence, action = ml_model.predict(features)
    
    sentiment = await get_sentiment(symbol)
    confidence = (confidence + (sentiment + 1) / 2) / 2  # average
    
    # Simple rules
    if 'rsi' in indicators and len(indicators['rsi']) > 0:
        rsi = indicators['rsi'].iloc[-1]
        if rsi < 30:
            action = 'buy'
        elif rsi > 70:
            action = 'sell'
    
    return Signal(
        symbol=symbol,
        action=action,
        confidence=min(1.0, max(0.0, confidence)),  # Clamp to [0, 1]
        timestamp=datetime.now()
    )

# Background task
async def signal_loop():
    while True:
        try:
            data = await rq.consume()
            if data is None:
                await asyncio.sleep(1)
                continue
            # Assume we have OHLCV history (fetch from Redis or something)
            ohlcv = []  # TODO: get recent data
            signal = await generate_signal(data.symbol, ohlcv)
            print(f"Generated: {signal}")
            # Note: Currently only producing to queue, not actually sending signals
            await asyncio.sleep(1)
        except Exception as e:
            print(f"Error in signal_loop: {e}")
            await asyncio.sleep(5)

