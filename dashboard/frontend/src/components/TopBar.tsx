import DripsEarnings from './DripsEarnings'

interface TopBarProps {
  symbol: string
  onSymbolChange: (symbol: string) => void
}

export default function TopBar({ symbol, onSymbolChange }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="search-box">
        <input
          type="text"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
          placeholder="Search symbol (e.g. BTCUSDT)"
        />
      </div>
      <div className="topbar-actions">
        <DripsEarnings />
        <button
          className="btn btn-refresh"
          onClick={() => window.location.reload()}
          title="Refresh"
        >
          ↻
        </button>
      </div>
    </header>
  )
}

