import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { Session } from '@/types'

type SessionsResponse = {
  data: Session[]
  cursor: { next?: string; previous?: string }
}

export function useSessions(filters?: { search?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.sessions(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('limit', String(filters?.limit ?? 50))
      if (filters?.search) params.set('search', filters.search)
      const response = await api.get<SessionsResponse>(`/session?${params.toString()}`)
      return response.data
    },
    refetchInterval: 30_000,
  })
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.session(id),
    queryFn: async () => {
      const response = await api.get<{ data: Session }>(`/session/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input?: {
      title?: string
      agent?: string
      model?: { id: string; providerID: string }
    }) => {
      const response = await api.post<{ data: Session }>('/session', input ?? {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/session/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() })
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string
      title?: string
      model?: { id: string; providerID: string }
      agent?: string
    }) => {
      const response = await api.patch<{ data: Session }>(`/session/${id}`, body)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.session(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() })
    },
  })
}
