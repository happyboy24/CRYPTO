from typing import Any, Dict
from datetime import datetime
from app.models.schemas import MarketData

def normalize_data(raw_data: Dict[str, Any]) -> MarketData:
    \"\"\"Normalize Binance/CoinAPI data to unified schema.\"\"\"
    # Example for Binance ticker
    return MarketData(
        symbol=raw_data["s"],
        price=float(raw_data["c"]),
        volume=float(raw_data["v"]),
        timestamp=raw_data.get("E", datetime.now())
    )

# Extend for CoinAPI format etc.

