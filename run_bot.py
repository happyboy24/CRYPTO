#!/usr/bin/env python3
"""Simple entry point for the bot."""
import argparse
import sys
from pathlib import Path
from rich.console import Console
from rich.panel import Panel

from bot.nodes.backtest_node import run_backtest
from bot.nodes.live_node import run_live
from bot.config.settings import BotSettings

console = Console()

def main() -> None:
    parser = argparse.ArgumentParser(description="Crypto-Forex Execution Bot")
    parser.add_argument("mode", choices=["backtest", "live"], help="Run mode")
    parser.add_argument("--config", default="bot/config/live_config.toml", help="Config path")
    args = parser.parse_args()

    settings = BotSettings(config_path=args.config)

    if args.mode == "backtest":
        console.print(Panel("Starting BACKTEST...", title="Bot"))
        run_backtest(settings)
    elif args.mode == "live":
        console.print(Panel("Starting LIVE trading...", title="LIVE"))
        run_live(settings)
    else:
        console.print("[red]Invalid mode[/red]")
        sys.exit(1)

if __name__ == "__main__":
    main()
