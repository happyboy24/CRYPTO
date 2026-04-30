import pytest
import pandas as pd
from datetime import datetime, timedelta
from app.models.market_data import OHLCVData
from app.analysis.indicators import calculate_indicators

@pytest.fixture
def mock_ohlcv():
    return [OHLCVData("BTCUSDT", 50000, 50100, 49900, 50050, 1000, datetime.now() - timedelta(days=i)) for i in range(20)]

def test_calculate_indicators(mock_ohlcv):
    ind = calculate_indicators(mock_ohlcv)
    assert 'rsi' in ind
    assert len(ind['rsi']) == len(mock_ohlcv)

