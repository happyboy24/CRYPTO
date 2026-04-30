import { useEffect, useState } from 'react'
import { getHealth } from '@/api/client'
import type { HealthStatus } from '@/types'

export function useHealth(pollInterval = 5000) {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      try {
        const data = await getHealth()
        if (!cancelled) {
          setHealth(data)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    const id = setInterval(fetch, pollInterval)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [pollInterval])

  return { health, loading, error }
}

