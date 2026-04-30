import type { Signal, HealthStatus } from '@/types'

const API_BASE = '/api/v1'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>(`${API_BASE}/health`)
}

export async function getSignal(symbol: string): Promise<Signal> {
  return fetchJson<Signal>(`${API_BASE}/signals/${encodeURIComponent(symbol)}`)
}

