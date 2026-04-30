import pandas as pd
from typing import List

from nautilustrader.model.data import Bar
from nautilustrader.model.enums import OrderSide
from nautilustrader.model.objects import Quantity

from .base_strategy import BaseStrategy, BaseStrategyConfig

class RSIStrategyConfig(BaseStrategyConfig):
    """RSI Strategy configuration."""
    rsi_period: int = 14
    oversold: int = 30
    overbought: int = 70

class RSIStrategy(BaseStrategy):
    """RSI Mean Reversion strategy."""

    def __init__(self, config: RSIStrategyConfig):
        super().__init__(config)
        self.config = config
        self.closes: List[float] = []
        self.rsi: float = 50.0
        self.position = 0.0

    def on_bars(self, bars: List[Bar]) -> None:
        bar = bars[0]
        close = bar.close.as_double()
        self.closes.append(close)

        if len(self.closes) < self.config.rsi_period:
            return

        series = pd.Series(self.closes)
        delta = series.diff()
        gain = delta.where(delta > 0, 0).rolling(window=self.config.rsi_period).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=self.config.rsi_period).mean()
        rs = gain / loss
        rsi_series = 100 - (100 / (1 + rs))
        self.rsi = rsi_series.iloc[-1]

        if self.rsi < self.config.oversold and self.position <= 0:
            self.buy(Quantity(1, Quantity.precision_for_decimals(0)))
            self.position = 1
        elif self.rsi > self.config.overbought and self.position >= 0:
            self.sell(Quantity(1, Quantity.precision_for_decimals(0)))
            self.position = -1

    def on_stop(self) -> None:
        self.logger.info(f"RSI Strategy stopped. Final RSI: {self.rsi:.2f}")

