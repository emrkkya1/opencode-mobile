import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { configureAPI, resetAPI, getAPIConfig } from "@/lib/api"
import { loadCredentials } from "@/lib/storage"
import { useConnectionStore } from "@/stores/connection"

type SDKContextType = {
  isInitialized: boolean
  serverUrl: string | null
}

const SDKContext = createContext<SDKContextType>({
  isInitialized: false,
  serverUrl: null,
})

export function SDKProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [serverUrl, setServerUrl] = useState<string | null>(null)
  const status = useConnectionStore((s) => s.status)
  const setStatus = useConnectionStore((s) => s.setStatus)

  useEffect(() => {
    ;(async () => {
      const creds = await loadCredentials()
      if (creds) {
        configureAPI({ url: creds.url, password: creds.password })
        setServerUrl(creds.url)
        setStatus("connected")
      }
      setIsInitialized(true)
    })()
  }, [])

  return (
    <SDKContext.Provider value={{ isInitialized, serverUrl }}>
      {children}
    </SDKContext.Provider>
  )
}

export function useSDKContext() {
  return useContext(SDKContext)
}

export function useConfigureServer() {
  const setStatus = useConnectionStore((s) => s.setStatus)

  return async (url: string, password?: string) => {
    configureAPI({ url, password })
    setStatus("connected")
  }
}

export function useDisconnect() {
  const reset = useConnectionStore((s) => s.reset)

  return async () => {
    resetAPI()
    reset()
    const { deleteCredentials } = await import("@/lib/storage")
    await deleteCredentials()
  }
}
