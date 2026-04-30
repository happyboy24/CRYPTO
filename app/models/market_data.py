"""Market data dataclasses/ORM if needed."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class OHLCVData:
    symbol: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    timestamp: datetime

