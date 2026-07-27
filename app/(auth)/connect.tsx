import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Link2, Eye, EyeOff, Server } from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useConnection } from '@/hooks/use-connection'
import { useSDKContext } from '@/context/sdk'
import { validateServerUrl, formatRelativeTime } from '@/lib/utils'
import { getRecentServers, type RecentServer } from '@/lib/storage'

export default function ConnectScreen() {
  const router = useRouter()
  const { connect, status } = useConnection()
  const { isInitialized, serverUrl } = useSDKContext()

  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [urlError, setUrlError] = useState<string>()
  const [connectError, setConnectError] = useState<string>()
  const [recentServers, setRecentServers] = useState<RecentServer[]>([])

  useEffect(() => {
    getRecentServers().then(setRecentServers)
  }, [])

  useEffect(() => {
    if (isInitialized && serverUrl) {
      router.replace('/(app)')
    }
  }, [isInitialized, serverUrl])

  const handleConnect = async () => {
    const trimmedUrl = url.trim()
    const validation = validateServerUrl(trimmedUrl)
    if (!validation.valid) {
      setUrlError(validation.error)
      return
    }
    setUrlError(undefined)
    setConnectError(undefined)

    const success = await connect(trimmedUrl, password || undefined)
    if (success) {
      router.replace('/(app)')
    } else {
      setConnectError('Cannot connect to server. Check the URL and try again.')
    }
  }

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-base">
        <Spinner />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg-base"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-interactive-primary/20 items-center justify-center mb-4">
            <Link2 size={32} color="var(--color-interactive-primary)" />
          </View>
          <Text className="text-2xl font-bold text-text-strong">Connect to OpenCode</Text>
          <Text className="text-sm text-text-weak mt-2 text-center">
            Enter your OpenCode server URL to get started
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="Server URL"
            placeholder="https://my-desktop.example.com"
            value={url}
            onChangeText={(text) => {
              setUrl(text)
              setUrlError(undefined)
              setConnectError(undefined)
            }}
            error={urlError}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="next"
          />

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-strong">Password (optional)</Text>
            <View className="flex-row items-center border border-border-base rounded-md bg-surface-base">
              <TextInput
                className="flex-1 h-10 px-3 text-base text-text-strong"
                placeholder="Enter password"
                placeholderTextColor="var(--color-text-weak)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="px-3">
                {showPassword ? (
                  <EyeOff size={18} color="var(--color-text-weak)" />
                ) : (
                  <Eye size={18} color="var(--color-text-weak)" />
                )}
              </Pressable>
            </View>
          </View>

          {connectError && <Text className="text-sm text-error">{connectError}</Text>}

          <Button
            onPress={handleConnect}
            loading={status === 'connecting'}
            disabled={!url.trim()}
            className="mt-2"
          >
            Connect
          </Button>
        </View>

        {recentServers.length > 0 && (
          <View className="mt-8">
            <Text className="text-sm font-medium text-text-weak mb-3">Recent connections</Text>
            <View className="gap-2">
              {recentServers.map((server) => (
                <Pressable
                  key={server.url}
                  onPress={() => setUrl(server.url)}
                  className="flex-row items-center gap-3 p-3 rounded-lg bg-surface-base active:bg-surface-hover"
                >
                  <Server size={16} color="var(--color-text-weak)" />
                  <View className="flex-1">
                    <Text className="text-sm text-text-strong" numberOfLines={1}>
                      {server.url}
                    </Text>
                    <Text className="text-xs text-text-weak">
                      {formatRelativeTime(server.lastConnected)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
