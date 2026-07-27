type ApiConfig = {
  url: string
  password?: string
}

let currentConfig: ApiConfig | null = null

export function configureAPI(config: ApiConfig) {
  currentConfig = config
}

export function getAPIConfig(): ApiConfig | null {
  return currentConfig
}

export function resetAPI() {
  currentConfig = null
}

function getAuthHeaders(): Record<string, string> {
  if (!currentConfig?.password) return {}
  const auth = btoa(`opencode:${currentConfig.password}`)
  return { Authorization: `Basic ${auth}` }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!currentConfig) throw new Error("API not configured")

  const url = `${currentConfig.url}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new APIError(response.status, body)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export class APIError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API Error ${status}: ${body}`)
    this.name = "APIError"
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
}
