"""Logging configuration."""
import logging
import sys
from loguru import logger
from .config import settings

# Remove default loguru handlers
logger.remove()

# Configure loguru
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | <level>{message}</level>",
    level="DEBUG" if settings.debug else "INFO",
    serialize=False,
)

# Configure stdlib logging to loguru
class LoguruHandler(logging.Handler):
    def emit(self, record):
        logger.log(record.levelno, record.getMessage())

logging.basicConfig(handlers=[LoguruHandler()], level=0, force=True)

