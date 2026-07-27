import { useState, useCallback } from 'react'
import { View, Text, Pressable, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { Plus, Search, X, ChevronRight } from 'lucide-react-native'
import { useSessions } from '@/hooks/use-sessions'
import { useUIStore } from '@/stores/ui'
import { groupSessionsByTime, formatRelativeTime, cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { DisconnectedBanner } from '@/components/ui/disconnected-banner'
import { useConnection } from '@/hooks/use-connection'
import type { Session } from '@/types'
import { TextInput } from 'react-native'

type ListItem =
  { type: 'header'; id: string; title: string } | { type: 'session'; session: Session }

export default function SessionListScreen() {
  const router = useRouter()
  const { data: sessions, isLoading, refetch, isRefetching } = useSessions()
  const { status, checkHealth } = useConnection()
  const searchQuery = useUIStore((s) => s.sessionSearchQuery)
  const setSearchQuery = useUIStore((s) => s.setSessionSearchQuery)
  const [refreshing, setRefreshing] = useState(false)

  const filteredSessions = sessions?.filter((s) =>
    searchQuery ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const groups = groupSessionsByTime(filteredSessions ?? [])
  const items: ListItem[] = groups.flatMap((group) => [
    { type: 'header', id: group.id, title: group.title },
    ...group.sessions.map((s) => ({ type: 'session' as const, session: s })),
  ])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'header') {
        return (
          <View className="px-4 pt-4 pb-2">
            <Text className="text-xs font-semibold text-text-weak uppercase">{item.title}</Text>
          </View>
        )
      }

      const session = item.session
      return (
        <Pressable
          onPress={() => router.push(`/session/${session.id}`)}
          className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-hover"
        >
          <View className="w-2 h-2 rounded-full">
            {session.sync.state === 'running' && (
              <View className="w-2 h-2 rounded-full bg-success" />
            )}
            {session.sync.state === 'error' && <View className="w-2 h-2 rounded-full bg-error" />}
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-base font-medium text-text-strong" numberOfLines={1}>
              {session.title || 'Untitled session'}
            </Text>
            <View className="flex-row items-center gap-2 mt-0.5">
              <Text className="text-sm text-text-weak">
                {formatRelativeTime(session.time.updated)}
              </Text>
            </View>
          </View>
          {session.model && (
            <View className="px-2 py-1 rounded bg-surface-base">
              <Text className="text-xs text-text-weak">{session.model.id.split('/').pop()}</Text>
            </View>
          )}
          <ChevronRight size={16} color="var(--color-text-weak)" />
        </Pressable>
      )
    },
    [router]
  )

  if (isLoading) {
    return <Spinner className="flex-1" />
  }

  return (
    <View className="flex-1 bg-bg-base">
      {status !== 'connected' && <DisconnectedBanner onRetry={checkHealth} />}

      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text-strong">Sessions</Text>
        <Pressable
          onPress={() => router.push('/session/new')}
          className="w-8 h-8 items-center justify-center rounded-lg bg-interactive-primary"
        >
          <Plus size={18} color="#fff" />
        </Pressable>
      </View>

      <View className="mx-4 my-2">
        <View
          className={cn(
            'flex-row items-center gap-2 rounded-lg border px-3 h-10 bg-surface-base',
            'border-border-base'
          )}
        >
          <Search size={16} color="var(--color-text-weak)" />
          <TextInput
            className="flex-1 text-base text-text-strong"
            placeholder="Search sessions..."
            placeholderTextColor="var(--color-text-weak)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color="var(--color-text-weak)" />
            </Pressable>
          )}
        </View>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No sessions found' : 'No sessions yet'}
          description={
            searchQuery ? 'Try a different search term' : 'Create a new session to get started'
          }
        />
      ) : (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'header' ? item.id : `session-${item.session.id}-${index}`
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="var(--color-interactive-primary)"
            />
          }
          ItemSeparatorComponent={() => <View className="h-px bg-border-weak ml-12" />}
        />
      )}
    </View>
  )
}
