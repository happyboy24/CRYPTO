from nautilustrader.risk import RiskEngine
from nautilustrader.model.enums import RiskEventType

class CustomRiskManager:
    """Custom risk rules."""

    def __init__(self):
        self.max_risk_pct = 0.02  # 2% risk per trade
        self.max_daily_loss = 100.0  # USD

    def check_order(self, order):
        # Implement risk checks
        # e.g. position sizing
        size = abs(order.quantity.as_double()) * order.price.as_double()
        account_balance = 10000  # Get from account
        if size / account_balance > self.max_risk_pct:
            return False, "Risk limit exceeded"
        return True, ""

# Register with node.trader
# node.trader.register_risk_handler(CustomRiskManager())

