import { useCallback, useEffect, useRef } from "react"
import { api } from "@/lib/api"
import { useConnectionStore } from "@/stores/connection"

const HEALTH_CHECK_INTERVAL = 30_000

export function useConnection() {
  const status = useConnectionStore((s) => s.status)
  const setStatus = useConnectionStore((s) => s.setStatus)
  const setHealth = useConnectionStore((s) => s.setHealth)
  const setError = useConnectionStore((s) => s.setError)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const checkHealth = useCallback(async () => {
    try {
      const result = await api.get<{ healthy: boolean }>("/global/health")
      setHealth(result.healthy)
      setStatus("connected")
      setError(undefined)
      return true
    } catch {
      setHealth(false)
      return false
    }
  }, [setHealth, setStatus, setError])

  const connect = useCallback(
    async (url: string, password?: string) => {
      setStatus("connecting")
      try {
        const { configureAPI } = await import("@/lib/api")
        configureAPI({ url, password })
        await api.get<{ healthy: boolean }>("/global/health")
        setStatus("connected")
        setError(undefined)

        const { saveCredentials, addRecentServer } = await import("@/lib/storage")
        await saveCredentials({ url, password, savedAt: Date.now() })
        await addRecentServer(url)
        return true
      } catch (err) {
        setStatus("error")
        if (err instanceof Error) {
          setError(err.message)
        }
        return false
      }
    },
    [setStatus, setError]
  )

  useEffect(() => {
    if (status === "connected") {
      intervalRef.current = setInterval(checkHealth, HEALTH_CHECK_INTERVAL)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, checkHealth])

  return {
    status,
    isConnected: status === "connected",
    checkHealth,
    connect,
  }
}
