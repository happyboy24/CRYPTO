import pytest
from app.models.schemas import MarketData, Signal

def test_market_data():
    data = MarketData(symbol="BTCUSDT", price=50000.0, volume=1000.0, timestamp="2024-01-01T00:00:00")
    assert data.symbol == "BTCUSDT"

def test_signal():
    signal = Signal(symbol="BTCUSDT", action="buy", confidence=0.8)
    assert signal.action in ["buy", "sell", "hold"]
    assert 0 <= signal.confidence <= 1

