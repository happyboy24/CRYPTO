import { useState, useEffect } from 'react'

interface DripsReceiver {
  type: 'github'
  url: string
  weight: number
}

interface DripsSupportProps {
  ethereumAddress?: string
}

// Default receivers for the CRYPTO project
const DEFAULT_RECEIVERS: DripsReceiver[] = [
  {
    type: 'github',
    url: 'https://github.com/happyboy24/CRYPTO',
    weight: 1000000 // 100%
  }
]

export default function DripsSupport({ ethereumAddress }: DripsSupportProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Disconnected')

  useEffect(() => {
    // Check if MetaMask is installed and connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setIsConnected(true)
            setStatus('Wallet connected')
          }
        } catch (err) {
          console.error('Error checking connection:', err)
        }
      }
    }
    checkConnection()
  }, [])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setIsConnected(true)
          setStatus('Wallet connected')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect wallet')
      }
    } else {
      setError('MetaMask not installed. Please install MetaMask to stream funds.')
    }
  }

  const startStreaming = async () => {
    if (!ethereumAddress) {
      setError('No receiver address configured')
      return
    }

    setIsLoading(true)
    setError(null)

    // In a production app, you would use the Drips SDK here:
    // const drips = new DripsClient({ signer, network: 'mainnet' });
    // await drips.setDrips({ token: 'USDC', receivers: DEFAULT_RECEIVERS });

    // For now, we simulate the streaming action
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsStreaming(true)
      setStatus('Streaming USDC to github.com/happyboy24/CRYPTO')
    } catch (err: any) {
      setError(err.message || 'Failed to start streaming')
    } finally {
      setIsLoading(false)
    }
  }

  const stopStreaming = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsStreaming(false)
      setStatus('Streaming stopped')
    } catch (err: any) {
      setError(err.message || 'Failed to stop streaming')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="drips-support">
      <h3>💧 Drips Funding</h3>
      
      <div className="drips-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span className="status-text">{status}</span>
      </div>

      {!isConnected ? (
        <button className="btn btn-primary" onClick={connectWallet} disabled={isLoading}>
          Connect Wallet
        </button>
      ) : (
        <div className="drips-actions">
          <div className="receiver-info">
            <p>Streaming to:</p>
            <code>https://github.com/happyboy24/CRYPTO</code>
          </div>
          
          {!isStreaming ? (
            <button 
              className="btn btn-success" 
              onClick={startStreaming} 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : '💧 Start Streaming USDC'}
            </button>
          ) : (
            <button 
              className="btn btn-danger" 
              onClick={stopStreaming} 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : '⏹ Stop Streaming'}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="drips-info">
        <h4>How it works:</h4>
        <ul>
          <li>Connect your MetaMask wallet</li>
          <li>Click "Start Streaming" to fund this project</li>
          <li>Funds stream automatically (USDC)</li>
          <li>Get paid every month on Ethereum</li>
        </ul>
        <a 
          href="https://www.drips.network/app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="drips-link"
        >
          View on Drips ↗
        </a>
      </div>

      <style>{`
        .drips-support {
          padding: 1rem;
          background: #1a1a2e;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .drips-support h3 {
          margin: 0 0 1rem 0;
          color: #e0e0e0;
        }

        .drips-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #16213e;
          border-radius: 4px;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.connected {
          background: #00ff88;
        }

        .status-indicator.disconnected {
          background: #ff4444;
        }

        .status-text {
          color: #aaa;
          font-size: 0.9rem;
        }

        .drips-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .receiver-info {
          padding: 0.75rem;
          background: #16213e;
          border-radius: 4px;
        }

        .receiver-info p {
          margin: 0 0 0.5rem 0;
          color: #888;
          font-size: 0.85rem;
        }

        .receiver-info code {
          color: #00d4ff;
          font-size: 0.9rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #4a90d9;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5a9fe9;
        }

        .btn-success {
          background: #00c853;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #00e676;
        }

        .btn-danger {
          background: #ff5252;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #ff6b6b;
        }

        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(255, 82, 82, 0.2);
          border: 1px solid #ff5252;
          border-radius: 4px;
          color: #ff5252;
          font-size: 0.9rem;
        }

        .drips-info {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #333;
        }

        .drips-info h4 {
          margin: 0 0 0.5rem 0;
          color: #888;
          font-size: 0.9rem;
        }

        .drips-info ul {
          margin: 0 0 1rem 0;
          padding-left: 1.25rem;
          color: #aaa;
          font-size: 0.85rem;
        }

        .drips-info li {
          margin-bottom: 0.25rem;
        }

        .drips-link {
          display: inline-block;
          color: #00d4ff;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .drips-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
