import { useState, useEffect, useCallback } from 'react'
import { useSignalSocket } from '@/hooks/useSignalSocket'
import { getSignal } from '@/api/client'
import SignalCard from '@/components/SignalCard'
import type { Signal } from '@/types'

interface DashboardTabProps {
  symbol: string
}

export default function DashboardTab({ symbol }: DashboardTabProps) {
  const [signalHistory, setSignalHistory] = useState<Signal[]>([])
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null)

  const fetchSignal = useCallback(async () => {
    try {
      const s = await getSignal(symbol)
      setCurrentSignal(s)
      setSignalHistory((prev) => [s, ...prev].slice(0, 50))
    } catch {
      // ignore fetch errors
    }
  }, [symbol])

  useEffect(() => {
    fetchSignal()
  }, [fetchSignal])

  const { connected: wsConnected, lastSignal } = useSignalSocket({
    symbol,
    onMessage: (s) => {
      setCurrentSignal(s)
      setSignalHistory((prev) => [s, ...prev].slice(0, 50))
    },
  })

  const displaySignal = lastSignal ?? currentSignal

  return (
    <section className="tab-content active">
      <div className="cards-grid">
        <SignalCard signal={displaySignal} />

        <div className="card">
          <div className="card-header">
            <span className="card-title">Price</span>
            <span className="card-badge live">LIVE</span>
          </div>
          <div className="card-body">
            <div className="price-value">$0.00</div>
            <div className="price-change">0.00%</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Take Profit</span>
          </div>
          <div className="card-body">
            <div className="tp-value">
              {displaySignal?.take_profit?.toFixed(2) ?? '--'}
            </div>
            <div className="tp-label">Target</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Stop Loss</span>
          </div>
          <div className="card-body">
            <div className="sl-value">
              {displaySignal?.stop_loss?.toFixed(2) ?? '--'}
            </div>
            <div className="sl-label">Risk Limit</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Price Chart</h2>
          <div className="timeframes">
            <button className="tf-btn active">1H</button>
            <button className="tf-btn">4H</button>
            <button className="tf-btn">1D</button>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-placeholder">
            Chart integration placeholder (e.g. TradingView Lightweight Charts)
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Signal History</h2>
          <button
            className="btn btn-clear"
            onClick={() => setSignalHistory([])}
          >
            Clear
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Symbol</th>
                <th>Action</th>
                <th>Confidence</th>
                <th>TP</th>
                <th>SL</th>
              </tr>
            </thead>
            <tbody>
              {signalHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-row">
                    No signals yet
                  </td>
                </tr>
              )}
              {signalHistory.map((s, i) => (
                <tr key={i}>
                  <td>{new Date(s.timestamp).toLocaleTimeString()}</td>
                  <td>{s.symbol}</td>
                  <td>
                    <span className={`badge-${s.action}`}>
                      {s.action.toUpperCase()}
                    </span>
                  </td>
                  <td>{Math.round(s.confidence * 100)}%</td>
                  <td>{s.take_profit?.toFixed(2) ?? '--'}</td>
                  <td>{s.stop_loss?.toFixed(2) ?? '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ws-status-bar">
        <span className={`status-dot ${wsConnected ? 'ok' : 'err'}`} />
        <span className="status-text">
          WebSocket {wsConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </section>
  )
}

