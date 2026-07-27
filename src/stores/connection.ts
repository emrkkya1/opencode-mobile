import { create } from 'zustand'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

type ConnectionState = {
  status: ConnectionStatus
  error?: string
  isHealthy: boolean
  lastHealthCheck: number
  setStatus: (status: ConnectionStatus) => void
  setError: (error: string | undefined) => void
  setHealth: (healthy: boolean) => void
  reset: () => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'disconnected',
  error: undefined,
  isHealthy: false,
  lastHealthCheck: 0,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setHealth: (healthy) => set({ isHealthy: healthy, lastHealthCheck: Date.now() }),
  reset: () =>
    set({
      status: 'disconnected',
      error: undefined,
      isHealthy: false,
      lastHealthCheck: 0,
    }),
}))
