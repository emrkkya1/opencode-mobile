export const queryKeys = {
  sessions: (filters?: { search?: string; limit?: number }) => ['sessions', filters] as const,
  session: (id: string) => ['session', id] as const,
  messages: (sessionID: string) => ['messages', sessionID] as const,
  models: () => ['models'] as const,
  agents: () => ['agents'] as const,
  providers: () => ['providers'] as const,
  permissions: (sessionID: string) => ['permissions', sessionID] as const,
}
