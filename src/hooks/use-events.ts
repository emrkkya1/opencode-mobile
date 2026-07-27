import { useEffect, useRef } from 'react'
import { useConnectionStore } from '@/stores/connection'
import { usePermissionStore } from '@/stores/permission'
import { createEventStream } from '@/lib/events'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import type { SSEEvent, Session, Message, MessagePart } from '@/types'

export function useEvents() {
  const status = useConnectionStore((s) => s.status)
  const queryClient = useQueryClient()
  const { enqueue, remove } = usePermissionStore()
  const streamRef = useRef<ReturnType<typeof createEventStream> | null>(null)

  useEffect(() => {
    if (status !== 'connected') {
      streamRef.current?.close()
      streamRef.current = null
      return
    }

    const stream = createEventStream({
      onEvent: (event: SSEEvent) => handleEvent(event),
      onError: (error) => console.error('SSE error:', error),
    })

    streamRef.current = stream

    return () => {
      stream.close()
      streamRef.current = null
    }
  }, [status])

  function handleEvent(event: SSEEvent) {
    switch (event.type) {
      case 'session.created':
      case 'session.updated': {
        const session = event.properties.info
        queryClient.setQueryData(queryKeys.session(session.id), session)
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() })
        break
      }
      case 'session.deleted': {
        const id = event.properties.id
        queryClient.removeQueries({ queryKey: queryKeys.session(id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() })
        break
      }
      case 'message.updated': {
        const message = event.properties.info
        const sessionID = message.sessionID
        queryClient.setQueryData(queryKeys.messages(sessionID), (old: Message[] | undefined) => {
          if (!old) return old
          const idx = old.findIndex((m) => m.id === message.id)
          if (idx >= 0) {
            const updated = [...old]
            updated[idx] = message
            return updated
          }
          return [...old, message]
        })
        break
      }
      case 'message.part.updated': {
        const part = event.properties.part
        const sessionID = part.sessionID
        queryClient.setQueryData(queryKeys.messages(sessionID), (old: Message[] | undefined) => {
          if (!old) return old
          return old.map((msg) => {
            if (msg.id !== part.messageID) return msg
            const existingParts = msg.parts ?? []
            const partIdx = existingParts.findIndex((p) => p.id === part.id)
            if (partIdx >= 0) {
              const updatedParts = [...existingParts]
              updatedParts[partIdx] = part
              return { ...msg, parts: updatedParts }
            }
            return { ...msg, parts: [...existingParts, part] }
          })
        })
        break
      }
      case 'permission.v2.asked': {
        enqueue(event.properties)
        break
      }
      case 'permission.v2.replied': {
        remove(event.properties.requestID)
        break
      }
      case 'session.status': {
        const { sessionID, status: syncStatus } = event.properties
        queryClient.setQueryData(queryKeys.session(sessionID), (old: Session | undefined) => {
          if (!old) return old
          return { ...old, sync: { state: syncStatus as Session['sync']['state'] } }
        })
        break
      }
      case 'session.idle': {
        const sessionID = event.properties.sessionID
        queryClient.setQueryData(queryKeys.session(sessionID), (old: Session | undefined) => {
          if (!old) return old
          return { ...old, sync: { state: 'idle' as const } }
        })
        break
      }
    }
  }
}
