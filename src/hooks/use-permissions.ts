import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { usePermissionStore } from '@/stores/permission'
import { queryKeys } from '@/lib/query-keys'

export function usePermissions() {
  const { current, dequeue, remove } = usePermissionStore()
  const queryClient = useQueryClient()

  const replyPermission = useMutation({
    mutationFn: async ({
      sessionID,
      requestID,
      reply,
    }: {
      sessionID: string
      requestID: string
      reply: 'once' | 'always' | 'reject'
    }) => {
      await api.post(`/api/session/${sessionID}/permission/${requestID}/reply`, { reply })
    },
    onSuccess: (_, variables) => {
      remove(variables.requestID)
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(variables.sessionID),
      })
    },
  })

  return {
    currentPermission: current,
    replyPermission,
    dismissPermission: dequeue,
  }
}
