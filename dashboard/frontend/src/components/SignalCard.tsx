import type { Signal } from '@/types'

interface SignalCardProps {
  signal: Signal | null
}

export default function SignalCard({ signal }: SignalCardProps) {
  const action = signal?.action ?? 'hold'
  const confidence = signal?.confidence ?? 0
  const actionText = action.toUpperCase()
  const actionIcon = action === 'buy' ? '🟢' : action === 'sell' ? '🔴' : '⏸'

  return (
    <div className="card card-signal">
      <div className="card-header">
        <span className="card-title">Current Signal</span>
        <span className={`card-badge badge-${action}`} id="signal-badge">
          {actionText}
        </span>
      </div>
      <div className="card-body">
        <div className={`signal-display signal-${action}`}>
          <div className="signal-icon">{actionIcon}</div>
          <div className="signal-text">{actionText}</div>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <div className="confidence-label">
          Confidence: <span id="confidence-value">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

