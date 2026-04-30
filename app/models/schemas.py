from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MarketData(BaseModel):
    symbol: str = Field(..., description="Trading pair, e.g., BTCUSDT")
    price: float = Field(..., description="Current price")
    volume: float = Field(..., description="Volume")
    timestamp: datetime = Field(..., description="Data timestamp")

class Signal(BaseModel):
    symbol: str
    action: str = Field(..., regex="^(buy|sell|hold)$")
    confidence: float = Field(ge=0.0, le=1.0)
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.now)

