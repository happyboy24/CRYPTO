from nautilustrader.backtest.engine import BacktestEngine, BacktestEngineConfig
from nautilustrader.backtest.node import BacktestNode, BacktestNodeConfig

from bot.config.settings import BotSettings
from bot.strategies.ema_cross import EMACross, EMACrossConfig
from bot.strategies.rsi_strategy import RSIStrategy, RSIStrategyConfig

def run_backtest(settings: BotSettings) -> None:
    config = BacktestNodeConfig(
        trader_id=settings.trader_id,
        engine=BacktestEngineConfig(
            log_level="INFO",
        ),
    )
    
    node = BacktestNode(config)
    
    # Add data (TBD - load from data/ or download)
    
    # Add strategies
    ema_config = EMACrossConfig(instrument_id="BTCUSDT.BINANCE")
    node.trader.add_strategy(EMACross(ema_config))
    
    rsi_config = RSIStrategyConfig(instrument_id="BTCUSDT.BINANCE")
    node.trader.add_strategy(RSIStrategy(rsi_config))
    
    node.run()

