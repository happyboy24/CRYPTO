import { useState } from 'react'

interface Metric {
  key: string
  label: string
  value: string
}

const defaultMetrics: Metric[] = [
  { key: 'win-rate', label: 'Win Rate', value: '--' },
  { key: 'profit-factor', label: 'Profit Factor', value: '--' },
  { key: 'sharpe-ratio', label: 'Sharpe Ratio', value: '--' },
  { key: 'max-drawdown', label: 'Max Drawdown', value: '--' },
]

export default function AnalyticsTab() {
  const [metrics] = useState<Metric[]>(defaultMetrics)

  return (
    <section className="tab-content active">
      <div className="section">
        <div className="section-header">
          <h2>Performance Metrics</h2>
        </div>
        <div className="cards-grid">
          {metrics.map((m) => (
            <div className="card" key={m.key}>
              <div className="card-header">
                <span className="card-title">{m.label}</span>
              </div>
              <div className="card-body">
                <div className="metric-value">{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

