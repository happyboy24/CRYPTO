import logging
from rich.logging import RichHandler

def setup_logging(level="INFO"):
    logging.basicConfig(
        level=level,
        format="%(message)s",
        datefmt="[%X]",
        handlers=[RichHandler()]
    )

def load_data(path: str):
    # Placeholder for loading bar data for backtest
    return []


