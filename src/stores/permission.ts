import { create } from "zustand"
import type { PermissionV2Request } from "@/types"

type PermissionState = {
  queue: PermissionV2Request[]
  current: PermissionV2Request | null
  enqueue: (permission: PermissionV2Request) => void
  dequeue: () => void
  remove: (id: string) => void
  clear: () => void
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  queue: [],
  current: null,
  enqueue: (permission) =>
    set((state) => {
      const exists = state.queue.some((p) => p.id === permission.id)
      if (exists) return state
      const queue = [...state.queue, permission]
      const current = state.current ?? queue[0] ?? null
      return { queue, current }
    }),
  dequeue: () =>
    set((state) => {
      const queue = state.queue.slice(1)
      const current = queue[0] ?? null
      return { queue, current }
    }),
  remove: (id) =>
    set((state) => {
      const queue = state.queue.filter((p) => p.id !== id)
      const current =
        state.current?.id === id ? queue[0] ?? null : state.current
      return { queue, current }
    }),
  clear: () => set({ queue: [], current: null }),
}))
