export interface MarketData {
  symbol: string
  price: number
  volume: number
  timestamp: string
}

export interface Signal {
  symbol: string
  action: 'buy' | 'sell' | 'hold'
  confidence: number
  take_profit?: number
  stop_loss?: number
  timestamp: string
}

export interface HealthStatus {
  status: string
  redis_ping: boolean
}

export interface BotLog {
  id: number
  time: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
}

