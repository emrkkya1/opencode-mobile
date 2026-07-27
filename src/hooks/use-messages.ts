import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { Message } from "@/types"

type MessagesResponse = {
  data: Message[]
  cursor: { next?: string; previous?: string }
}

export function useMessages(sessionID: string) {
  return useQuery({
    queryKey: queryKeys.messages(sessionID),
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("limit", "50")
      const response = await api.get<MessagesResponse>(
        `/session/${sessionID}/message?${params.toString()}`
      )
      return response.data
    },
    enabled: !!sessionID,
    refetchInterval: 5000,
  })
}

export function useSendMessage(sessionID: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (text: string) => {
      await api.post(`/session/${sessionID}/message`, {
        parts: [{ type: "text", text }],
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(sessionID),
      })
    },
  })
}
