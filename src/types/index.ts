export type Session = {
  id: string
  title: string
  agent?: string
  model?: {
    id: string
    providerID: string
    variant?: string
  }
  directory: string
  projectID: string
  parentID?: string
  time: {
    created: number
    updated: number
  }
  sync: {
    state: "idle" | "running" | "error"
    error?: string
  }
  cost?: number
  tokens?: {
    input: number
    output: number
    reasoning: number
  }
  summary?: {
    additions: number
    deletions: number
    files: number
  }
}

export type UserMessage = {
  id: string
  sessionID: string
  role: "user"
  time: { created: number }
  agent: string
  model: { providerID: string; modelID: string }
  parts: MessagePart[]
}

export type AssistantMessage = {
  id: string
  sessionID: string
  role: "assistant"
  time: { created: number; completed?: number }
  modelID: string
  providerID: string
  cost: number
  tokens: {
    input: number
    output: number
    reasoning: number
    cache: { read: number; write: number }
  }
  parts: MessagePart[]
  error?: { name: string; data: { message: string } }
}

export type Message = UserMessage | AssistantMessage

export type TextPart = {
  id: string
  sessionID: string
  messageID: string
  type: "text"
  text: string
  time?: { start: number; end?: number }
}

export type ToolPart = {
  id: string
  sessionID: string
  messageID: string
  type: "tool-invocation"
  toolInvocation: {
    toolCallID: string
    toolName: string
    args: Record<string, unknown>
    state: "partial-call" | "call" | "result"
    result?: unknown
  }
  time: { start: number; end?: number }
}

export type ReasoningPart = {
  id: string
  sessionID: string
  messageID: string
  type: "reasoning"
  text: string
  time: { start: number; end?: number }
}

export type MessagePart = TextPart | ToolPart | ReasoningPart

export type PermissionV2Request = {
  id: string
  sessionID: string
  action: string
  resources: Array<{ type: string; id?: string }>
  metadata?: Record<string, unknown>
}

export type Provider = {
  id: string
  name: string
  models: Array<{
    id: string
    name: string
  }>
}

export type Agent = {
  name: string
  description?: string
  mode?: string
}

export type SSEEvent =
  | { type: "session.created"; properties: { info: Session } }
  | { type: "session.updated"; properties: { info: Session } }
  | { type: "session.deleted"; properties: { id: string } }
  | { type: "message.updated"; properties: { info: Message } }
  | { type: "message.removed"; properties: { sessionID: string; messageID: string } }
  | { type: "message.part.updated"; properties: { part: MessagePart } }
  | { type: "message.part.removed"; properties: { sessionID: string; messageID: string; partID: string } }
  | { type: "permission.v2.asked"; properties: PermissionV2Request }
  | { type: "permission.v2.replied"; properties: { sessionID: string; requestID: string; reply: string } }
  | { type: "session.status"; properties: { sessionID: string; status: string } }
  | { type: "session.idle"; properties: { sessionID: string } }
