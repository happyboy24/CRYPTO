from abc import ABC, abstractmethod
from typing import Dict, List
from nautilustrader.trading.strategy import Strategy, StrategyConfig
from nautilustrader.model.identifiers import StrategyId
from nautilustrader.model.objects import Price, Quantity
from nautilustrader.model.enums import OrderSide

class BaseStrategyConfig(StrategyConfig, ABC):
    """Base strategy configuration."""
    strategy_id: str = "BASE"
    instrument_id: str = "BTCUSDT.BINANCE"
    fast_ema_period: int = 10
    slow_ema_period: int = 20
    rsi_period: int = 14

class BaseStrategy(Strategy, ABC):
    """Base trading strategy."""

    def __init__(self, config: BaseStrategyConfig):
        super().__init__(config)
        self.config = config
        # logger is inherited from Strategy parent class

    def on_start(self) -> None:
        self.logger.info(f"BaseStrategy {self.config.strategy_id} started")

    @abstractmethod
    def on_bars(self, bars):
        """Handle new bars."""
        raise NotImplementedError

    def buy(self, quantity: Quantity):
        self.submit_order(self.instrument_id, OrderSide.BUY, quantity)

    def sell(self, quantity: Quantity):
        self.submit_order(self.instrument_id, OrderSide.SELL, quantity)
</xai:function_call name="create_file">

<xai:function_call name="create_file">
<parameter name="absolute_path">crypto-forex-execution-bot/bot/strategies/ema_cross.py
