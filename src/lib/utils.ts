import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatToolName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

export function validateServerUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL must start with http:// or https://" }
    }
    if (!parsed.hostname) {
      return { valid: false, error: "URL must have a hostname" }
    }
    if (url.endsWith("/")) {
      return { valid: false, error: "URL should not end with /" }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }
}

export type SessionGroup = {
  id: "today" | "yesterday" | "thisWeek" | "older"
  title: string
  sessions: import("@/types").Session[]
}

export function groupSessionsByTime(sessions: import("@/types").Session[]): SessionGroup[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86400000
  const thisWeek = today - 7 * 86400000

  const groups: Record<string, import("@/types").Session[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  }

  for (const session of sessions) {
    const updated = session.time.updated
    if (updated >= today) groups.today.push(session)
    else if (updated >= yesterday) groups.yesterday.push(session)
    else if (updated >= thisWeek) groups.thisWeek.push(session)
    else groups.older.push(session)
  }

  return ([
    { id: "today" as const, title: "Today", sessions: groups.today },
    { id: "yesterday" as const, title: "Yesterday", sessions: groups.yesterday },
    { id: "thisWeek" as const, title: "This Week", sessions: groups.thisWeek },
    { id: "older" as const, title: "Older", sessions: groups.older },
  ] as SessionGroup[]).filter((group) => group.sessions.length > 0)
}
