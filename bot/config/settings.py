from __future__ import annotations

import tomli
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

from nautilustrader.config import LiveNodeConfig


class BotSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    log_level: str = "INFO"
    trader_id: str = "BOT-001"
    max_notional: float = 1000.0  # USD
    config_path: Optional[str] = "bot/config/live_config.toml"

    @property
    def live_node_config(self) -> LiveNodeConfig:
        config_path = Path(self.config_path or "bot/config/live_config.toml")
        with open(config_path, "rb") as f:
            config_dict = tomli.load(f)
        return LiveNodeConfig(**config_dict)

    class Config:
        arbitrary_types_allowed = True


if __name__ == "__main__":
    settings = BotSettings()
    print(settings.model_dump_json(indent=2))
