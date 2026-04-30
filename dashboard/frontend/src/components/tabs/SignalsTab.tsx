import { useState } from 'react'

const defaultSymbols = [
  'BTCUSDT',
  'ETHUSDT',
  'SOLUSDT',
  'BNBUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'AVAXUSDT',
]

export default function SignalsTab() {
  const [filter, setFilter] = useState('')

  const filtered = defaultSymbols.filter((s) =>
    s.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <section className="tab-content active">
      <div className="section">
        <div className="section-header">
          <h2>Active Symbols</h2>
          <input
            type="text"
            className="filter-input"
            placeholder="Filter symbols..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="symbols-grid">
          {filtered.map((sym) => (
            <div key={sym} className="symbol-card">
              <div className="symbol-name">{sym}</div>
              <div className="symbol-price">$--.--</div>
              <div className="symbol-signal">Waiting for signal...</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">No symbols match your filter.</div>
          )}
        </div>
      </div>
    </section>
  )
}

