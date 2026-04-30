from typing import Dict, List, Optional
import pandas as pd
import numpy as np

from nautilustrader.trading.strategy import StrategyConfig
from nautilustrader.model.data import Bar
from nautilustrader.model.enums import OrderSide, TimeInForce
from nautilustrader.model.objects import Quantity

from .base_strategy import BaseStrategy, BaseStrategyConfig

class EMACrossConfig(BaseStrategyConfig):
    """EMA Cross configuration."""
    fast_period: int = 10
    slow_period: int = 20

class EMACross(BaseStrategy):
    """EMA Crossover strategy."""

    def __init__(self, config: EMACrossConfig):
        super().__init__(config)
        self.config = config
        self.bars_list: List[float] = []
        self.position = 0.0

    def on_start(self) -> None:
        super().on_start()

    def on_bars(self, bars: List[Bar]) -> None:
        bar = bars[0]
        close = bar.close.as_double()
        self.bars_list.append(close)
        
        if len(self.bars_list) < self.config.slow_period:
            return  # Not enough data
        
        # Calculate EMAs using Series
        series = pd.Series(self.bars_list)
        fast_ema_val = series.ewm(span=self.config.fast_period).mean().iloc[-1]
        slow_ema_val = series.ewm(span=self.config.slow_period).mean().iloc[-1]
        
        # Get previous values for crossover detection
        fast_ema_prev = series.ewm(span=self.config.fast_period).mean().iloc[-2]
        slow_ema_prev = series.ewm(span=self.config.slow_period).mean().iloc[-2]

        if fast_ema_val > slow_ema_val and fast_ema_prev <= slow_ema_prev:
            if self.position <= 0:
                self.buy(Quantity(1, Quantity.precision_for_decimals(0)))  
                self.position += 1

        elif fast_ema_val < slow_ema_val and fast_ema_prev >= slow_ema_prev:
            if self.position >= 0:
                self.sell(Quantity(1, Quantity.precision_for_decimals(0)))
                self.position -= 1

    def on_stop(self) -> None:
        self.close_all_positions()
        self.logger.info("EMA Cross stopped")

