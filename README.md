# Crypto-Forex Unified Platform

A unified platform combining a **Signal Giver** (real-time trading signals via FastAPI) and an **Execution Bot** (NautilusTrader-based algorithmic trading).

## Project Structure

```
.
├── app/                    # Signal Giver FastAPI application
│   ├── api/                # REST + WebSocket endpoints
│   ├── analysis/           # TA indicators, ML models, sentiment
│   ├── core/               # Config, database (Redis), logging
│   ├── ingestion/          # WebSocket/data ingestion
│   ├── models/             # Pydantic schemas + dataclasses
│   ├── queue/              # Redis queue
│   ├── risk/               # Position sizing / risk manager
│   └── utils/              # Helpers + exceptions
├── bot/                    # Execution Bot (NautilusTrader)
│   ├── config/             # Settings + live TOML config
│   ├── nodes/              # Backtest + Live runners
│   ├── strategies/         # EMA Cross, RSI strategies
│   ├── risk/               # Bot-specific risk rules
│   └── utils/              # Logging + helpers
├── dashboard/              # Monitoring dashboard (TBD)
├── data/                   # Market data for backtests
├── logs/                   # Application logs
├── scripts/                # Seed data scripts
├── tests/                  # Test suite
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── bot/                # Bot tests
├── run.sh                  # Start Signal Giver API
├── run_bot.py              # Start Execution Bot (backtest/live)
├── requirements.txt        # Unified dependencies
├── docker-compose.yml      # All services (redis, app, bot, dashboard)
└── Dockerfile              # Unified container image
```

## Quick Start

### 1. Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
# OR with uv:
uv sync
```

### 3. Start Redis

```bash
docker compose up -d redis
```

### 4. Run Signal Giver API

```bash
./run.sh
# OR
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Visit http://localhost:8000/docs for the API docs.

### 5. Run Execution Bot (Backtest)

```bash
python run_bot.py backtest
```

### 6. Run Execution Bot (Live - DANGER)

```bash
python run_bot.py live
```

### 7. Run Dashboard (Frontend)

```bash
cd dashboard/frontend
npm install
npm run dev
```

Visit http://localhost:8001 for the React dashboard.

## Docker

Run everything together:

```bash
docker compose up --build
```

Services:
- `redis` on port `6379`
- `app` (Signal API) on port `8000`
- `bot` (Execution Bot) - no exposed ports
- `dashboard` (React frontend) on port `8001`

## Features

### Signal Giver
- Live data from Binance / CoinAPI via WebSocket
- Technical analysis (RSI, MACD, Bollinger Bands)
- ML-based signal prediction
- Sentiment analysis integration
- Risk-managed position sizing
- REST + WebSocket delivery

### Execution Bot
- EMA Crossover strategy
- RSI Mean Reversion strategy
- Backtest engine
- Live trading node (NautilusTrader)
- Custom risk manager

## Tests

```bash
pytest
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection string |
| `BINANCE_API_KEY` | Binance API key |
| `BINANCE_API_SECRET` | Binance API secret |
| `COINAPI_KEY` | CoinAPI key |

## License

MIT
# CRYPTO
# CRYPTO
