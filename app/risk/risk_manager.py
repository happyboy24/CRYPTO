from typing import Tuple, Optional
from app.models.schemas import Signal, MarketData
import math

class RiskManager:
    def __init__(self, account_balance: float = 10000, max_risk_per_trade: float = 0.02):
        self.balance = account_balance
        self.max_risk = max_risk_per_trade

    def calculate_position_size(self, signal: Signal, current_price: float, atr: float = 100) -> Tuple[float, float, Optional[float], Optional[float]]:
        """Kelly-like sizing + ATR for TP/SL.
        
        Returns: (position_size, risk_amount, take_profit, stop_loss)
        """

        risk_amount = self.balance * self.max_risk
        sl_distance = atr  # approximate
        position_size = risk_amount / sl_distance

        tp_distance = sl_distance * 2  # R:R 1:2
        if signal.action == 'buy':
            take_profit = current_price + tp_distance
            stop_loss = current_price - sl_distance
        elif signal.action == 'sell':
            take_profit = current_price - tp_distance
            stop_loss = current_price + sl_distance
        else:
            take_profit = None
            stop_loss = None

        return position_size, risk_amount, take_profit, stop_loss

