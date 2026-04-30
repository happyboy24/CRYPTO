import pandas as pd
import pandas_ta as ta
from typing import Dict, List
from app.models.market_data import OHLCVData

def calculate_indicators(data: List[OHLCVData]) -> Dict[str, pd.Series]:
    """Compute TA indicators using pandas-ta."""
    df = pd.DataFrame([d.__dict__ for d in data])
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)

    rsi = ta.rsi(df['close'], length=14)
    macd = ta.macd(df['close'])
    bb = ta.bbands(df['close'])

    return {
        'rsi': rsi,
        'macd': macd,
        'bb_upper': bb['BBU_20_2.0'],
        'bb_lower': bb['BBL_20_2.0']
    }

