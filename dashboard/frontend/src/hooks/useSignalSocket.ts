import { useEffect, useRef, useState, useCallback } from 'react'
import type { Signal } from '@/types'

interface UseSignalSocketOptions {
  symbol: string
  onMessage?: (signal: Signal) => void
}

export function useSignalSocket({ symbol, onMessage }: UseSignalSocketOptions) {
  const [connected, setConnected] = useState(false)
  const [lastSignal, setLastSignal] = useState<Signal | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<number>(0)

  const connect = useCallback(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/${encodeURIComponent(symbol)}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setConnected(true)
      reconnectRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const data: Signal = JSON.parse(event.data)
        setLastSignal(data)
        onMessage?.(data)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      setConnected(false)
      const delay = Math.min(30000, 1000 * 2 ** reconnectRef.current)
      reconnectRef.current += 1
      setTimeout(connect, delay)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [symbol, onMessage])

  useEffect(() => {
    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [connect])

  return { connected, lastSignal }
}

