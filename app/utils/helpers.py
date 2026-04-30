from datetime import datetime
from typing import Dict

def parse_symbol_data(raw: Dict) -> Dict:
    raw['timestamp'] = datetime.fromtimestamp(raw.get('timestamp', 0) / 1000)
    return raw

def validate_signal(signal: Dict) -> bool:
    return 0 <= signal.get('confidence', 0) <= 1

