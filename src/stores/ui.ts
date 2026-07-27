import { create } from 'zustand'

type UIState = {
  sessionSearchQuery: string
  isModelPickerOpen: boolean
  isAgentPickerOpen: boolean
  setSessionSearchQuery: (query: string) => void
  setModelPickerOpen: (open: boolean) => void
  setAgentPickerOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sessionSearchQuery: '',
  isModelPickerOpen: false,
  isAgentPickerOpen: false,
  setSessionSearchQuery: (query) => set({ sessionSearchQuery: query }),
  setModelPickerOpen: (open) => set({ isModelPickerOpen: open }),
  setAgentPickerOpen: (open) => set({ isAgentPickerOpen: open }),
}))
