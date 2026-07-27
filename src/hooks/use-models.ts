import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { Provider, Agent } from "@/types"

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers(),
    queryFn: async () => {
      const response = await api.get<Provider[]>("/config/providers")
      return response
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useAgents() {
  return useQuery({
    queryKey: queryKeys.agents(),
    queryFn: async () => {
      const response = await api.get<Agent[]>("/agent")
      return response
    },
    staleTime: 10 * 60 * 1000,
  })
}
