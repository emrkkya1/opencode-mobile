import EventSource from "react-native-sse"
import type { SSEEvent } from "@/types"
import { getAPIConfig } from "./api"

type EventStreamConfig = {
  onEvent: (event: SSEEvent) => void
  onError?: (error: Error) => void
  onOpen?: () => void
  onClose?: () => void
}

export function createEventStream(config: EventStreamConfig) {
  const apiConfig = getAPIConfig()
  if (!apiConfig) throw new Error("API not configured")

  const headers: Record<string, string> = {}
  if (apiConfig.password) {
    const auth = btoa(`opencode:${apiConfig.password}`)
    headers["Authorization"] = `Basic ${auth}`
  }

  const url = `${apiConfig.url}/global/event`

  const es = new EventSource(url, {
    headers,
    pollingInterval: 5000,
  })

  es.addEventListener("open", () => {
    config.onOpen?.()
  })

  es.addEventListener("message", (event: any) => {
    try {
      if (event.data) {
        const data = JSON.parse(event.data) as SSEEvent
        config.onEvent(data)
      }
    } catch (error) {
      console.error("Failed to parse SSE event:", error)
    }
  })

  es.addEventListener("error", (event: any) => {
    config.onError?.(new Error(event.message ?? "Event stream error"))
  })

  return {
    close: () => es.close(),
  }
}
