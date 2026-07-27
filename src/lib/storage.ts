import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"

const SECURE_KEYS = {
  CREDENTIALS: "opencode_credentials",
} as const

const STORAGE_KEYS = {
  RECENT_SERVERS: "opencode_recent_servers",
} as const

type StoredCredentials = {
  url: string
  password?: string
  savedAt: number
}

export type RecentServer = {
  url: string
  lastConnected: number
}

export async function saveCredentials(credentials: StoredCredentials): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS.CREDENTIALS, JSON.stringify(credentials))
}

export async function loadCredentials(): Promise<StoredCredentials | null> {
  const value = await SecureStore.getItemAsync(SECURE_KEYS.CREDENTIALS)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export async function deleteCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_KEYS.CREDENTIALS)
}

export async function getRecentServers(): Promise<RecentServer[]> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SERVERS)
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export async function addRecentServer(url: string): Promise<void> {
  const servers = await getRecentServers()
  const filtered = servers.filter((s) => s.url !== url)
  const updated = [
    { url, lastConnected: Date.now() },
    ...filtered,
  ].slice(0, 5)
  await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SERVERS, JSON.stringify(updated))
}
