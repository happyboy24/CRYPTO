import { useState, useRef, useEffect } from 'react'
import { useHealth } from '@/hooks/useHealth'
import type { BotLog } from '@/types'

export default function BotControlTab() {
  const [botStatus, setBotStatus] = useState<'STOPPED' | 'BACKTEST' | 'LIVE'>('STOPPED')
  const [logs, setLogs] = useState<BotLog[]>([
    { id: 1, time: new Date().toISOString(), level: 'info', message: '[System] Dashboard initialized' },
    { id: 2, time: new Date().toISOString(), level: 'info', message: '[System] Waiting for bot connection...' },
  ])
  const logsEndRef = useRef<HTMLDivElement>(null)
  const { health, error } = useHealth(5000)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const addLog = (level: BotLog['level'], message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        time: new Date().toISOString(),
        level,
        message,
      },
    ])
  }

  const runBacktest = () => {
    setBotStatus('BACKTEST')
    addLog('success', '[Bot] Backtest started')
    setTimeout(() => addLog('info', '[Bot] Backtest completed'), 3000)
    setTimeout(() => setBotStatus('STOPPED'), 3500)
  }

  const startLive = () => {
    if (!confirm('Are you sure you want to start LIVE trading?')) return
    setBotStatus('LIVE')
    addLog('warning', '[Bot] LIVE trading started')
  }

  const stopBot = () => {
    setBotStatus('STOPPED')
    addLog('info', '[Bot] Bot stopped')
  }

  const apiOk = !!health && !error
  const redisOk = health?.redis_ping ?? false

  return (
    <section className="tab-content active">
      <div className="cards-grid two-col">
        <div className="card card-bot">
          <div className="card-header">
            <span className="card-title">Execution Bot</span>
            <span
              className={`card-badge ${
                botStatus === 'LIVE'
                  ? 'live'
                  : botStatus === 'BACKTEST'
                  ? 'ok'
                  : 'warn'
              }`}
            >
              {botStatus}
            </span>
          </div>
          <div className="card-body">
            <div className="bot-controls">
              <button
                className="btn btn-primary"
                onClick={runBacktest}
                disabled={botStatus !== 'STOPPED'}
              >
                Run Backtest
              </button>
              <button
                className="btn btn-danger"
                onClick={startLive}
                disabled={botStatus !== 'STOPPED'}
              >
                Start Live
              </button>
              {botStatus !== 'STOPPED' && (
                <button className="btn btn-secondary" onClick={stopBot}>
                  Stop
                </button>
              )}
            </div>
            <div className="bot-info">
              <div className="info-row">
                <span>Mode:</span>
                <span>{botStatus === 'STOPPED' ? '--' : botStatus}</span>
              </div>
              <div className="info-row">
                <span>Strategies:</span>
                <span>EMA Cross, RSI</span>
              </div>
              <div className="info-row">
                <span>Risk Limit:</span>
                <span>2% / trade</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">System Health</span>
            <span className={`card-badge ${apiOk ? 'ok' : 'err'}`}>
              {apiOk ? 'OK' : 'ERR'}
            </span>
          </div>
          <div className="card-body">
            <div className="health-items">
              <div className="health-item">
                <span className="health-label">API</span>
                <span className={`health-status ${apiOk ? 'ok' : 'err'}`}>
                  {apiOk ? '● Online' : '● Offline'}
                </span>
              </div>
              <div className="health-item">
                <span className="health-label">Redis</span>
                <span className={`health-status ${redisOk ? 'ok' : 'err'}`}>
                  {redisOk ? '● Online' : '● Offline'}
                </span>
              </div>
              <div className="health-item">
                <span className="health-label">WebSocket</span>
                <span className="health-status">● See dashboard tab</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Bot Logs</h2>
        </div>
        <div className="log-terminal">
          {logs.map((log) => (
            <div key={log.id} className={`log-line log-${log.level}`}>
              <span className="log-time">
                {new Date(log.time).toLocaleTimeString()}
              </span>{' '}
              {log.message}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </section>
  )
}

