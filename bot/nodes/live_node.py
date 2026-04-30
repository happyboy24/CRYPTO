from nautilustrader.live.node import LiveNode

from bot.config.settings import BotSettings
from bot.strategies.ema_cross import EMACross, EMACrossConfig
from bot.strategies.rsi_strategy import RSIStrategy, RSIStrategyConfig

def run_live(settings: BotSettings) -> None:
    node = LiveNode(settings.live_node_config)
    
    # Add strategies
    ema_config = EMACrossConfig(
        instrument_id="BTCUSDT.BINANCE",
        # load from config
    )
    node.trader.add_strategy(EMACross(ema_config))
    
    rsi_config = RSIStrategyConfig(
        instrument_id="BTCUSDT.BINANCE",
    )
    node.trader.add_strategy(RSIStrategy(rsi_config))
    
    print("Live bot running. Press Ctrl+C to stop.")
    node.run()

