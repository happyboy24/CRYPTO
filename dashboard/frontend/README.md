# Crypto-Forex Trading Dashboard (React + Vite + TypeScript)

A modern React frontend for the Crypto-Forex Signal Giver & Execution Bot platform.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **TypeScript** — Type safety
- **CSS Variables** — Dark trading theme (no CSS framework needed)

## Features

- **Dashboard Tab** — Real-time signal display with confidence bar, price/TP/SL cards, chart placeholder, and signal history table
- **Signals Tab** — Active symbols grid with filtering
- **Bot Control Tab** — Backtest/Live controls, system health monitoring (API/Redis), and live log terminal
- **Analytics Tab** — Performance metric cards (Win Rate, Profit Factor, Sharpe Ratio, Max Drawdown)
- **WebSocket** — Live signal streaming with auto-reconnect
- **REST API** — Health checks and signal fetching from FastAPI backend

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root layout with tab routing
├── types/
│   └── index.ts          # TypeScript interfaces (Signal, MarketData, etc.)
├── api/
│   └── client.ts         # REST API client
├── hooks/
│   ├── useSignalSocket.ts # WebSocket hook with auto-reconnect
│   └── useHealth.ts      # Health polling hook
├── components/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── SignalCard.tsx
│   └── tabs/
│       ├── DashboardTab.tsx
│       ├── SignalsTab.tsx
│       ├── BotControlTab.tsx
│       └── AnalyticsTab.tsx
└── styles/
    └── global.css        # Dark trading theme
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:8001` and proxies API requests to the FastAPI backend (`http://app:8000` in Docker, `http://localhost:8000` locally).

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — serve with any static file server.

## Docker

Included in the root `docker-compose.yml` as the `dashboard` service on port `8001`.
