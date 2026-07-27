import { useState, useRef, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import {
  ArrowLeft,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react-native'
import { useSession, useUpdateSession } from '@/hooks/use-sessions'
import { useMessages, useSendMessage } from '@/hooks/use-messages'
import { useProviders, useAgents } from '@/hooks/use-models'
import { formatTime, formatToolName, cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { MarkdownRenderer } from '@/components/ui/markdown'
import type { Message, MessagePart, Session } from '@/types'

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: session, isLoading: sessionLoading } = useSession(id)
  const { data: messages, isLoading: messagesLoading } = useMessages(id)
  const sendMessage = useSendMessage(id)
  const [text, setText] = useState('')
  const flatListRef = useRef<FlatList>(null)

  const handleSend = useCallback(async () => {
    if (!text.trim() || sendMessage.isPending) return
    await sendMessage.mutateAsync(text.trim())
    setText('')
  }, [text, sendMessage])

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages?.length])

  if (sessionLoading) {
    return <Spinner className="flex-1" />
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: session?.title ?? 'Session',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-2">
              <ArrowLeft size={20} color="var(--color-text-strong)" />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-bg-base"
        keyboardVerticalOffset={90}
      >
        {messagesLoading ? (
          <Spinner className="flex-1" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages ?? []}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.id}
            contentContainerClassName="py-4"
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: false })
            }}
          />
        )}

        <View className="border-t border-border-base bg-bg-base px-4 py-3">
          <View className="flex-row items-end gap-3">
            <View className="flex-1 min-h-[40px] max-h-[120px] rounded-lg border border-border-base bg-surface-base">
              <TextInput
                className="px-3 py-2.5 text-base text-text-strong"
                placeholder="Type a message..."
                placeholderTextColor="var(--color-text-weak)"
                value={text}
                onChangeText={setText}
                multiline
                maxLength={10000}
                editable={session?.sync.state !== 'running'}
                blurOnSubmit={false}
              />
            </View>
            <Pressable
              className={cn(
                'w-10 h-10 rounded-lg items-center justify-center',
                text.trim() && !sendMessage.isPending
                  ? 'bg-interactive-primary active:bg-interactive-hover'
                  : 'bg-surface-base'
              )}
              onPress={handleSend}
              disabled={!text.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Send size={18} color={text.trim() ? '#fff' : 'var(--color-text-weak)'} />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <View className={cn('px-4 py-3', isUser ? 'bg-bg-base' : 'bg-surface-base')}>
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-sm font-medium text-text-strong">
          {isUser ? 'You' : (message.modelID ?? 'Assistant')}
        </Text>
        <Text className="text-xs text-text-weak ml-auto">{formatTime(message.time.created)}</Text>
      </View>

      {isUser ? (
        <UserContent message={message} />
      ) : (
        <View className="gap-3">
          {(message.parts ?? []).map((part) => (
            <PartRenderer key={part.id} part={part} />
          ))}
        </View>
      )}

      {!isUser && message.error && (
        <View className="mt-2 p-3 rounded bg-error/10 border border-error/20">
          <Text className="text-sm text-error">
            {message.error.data?.message ?? 'An error occurred'}
          </Text>
        </View>
      )}

      {!isUser && message.tokens && (
        <View className="flex-row items-center gap-3 mt-2 pt-2 border-t border-border-weak">
          <Text className="text-xs text-text-weak">
            {message.tokens.input + message.tokens.output} tokens
          </Text>
          {message.cost > 0 && (
            <Text className="text-xs text-text-weak">${message.cost.toFixed(4)}</Text>
          )}
        </View>
      )}
    </View>
  )
}

function UserContent({ message }: { message: Message }) {
  const textParts = (message.parts ?? []).filter((p) => p.type === 'text')
  const text = textParts.map((p) => (p as any).text).join('\n')

  return <Text className="text-sm text-text-strong">{text}</Text>
}

function PartRenderer({ part }: { part: MessagePart }) {
  switch (part.type) {
    case 'text':
      return <MarkdownRenderer content={part.text} />
    case 'reasoning':
      return <ReasoningPart part={part} />
    case 'tool-invocation':
      return <ToolCallCard part={part} />
    default:
      return null
  }
}

function ReasoningPart({ part }: { part: MessagePart & { type: 'reasoning' } }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View className="p-3 rounded-lg bg-surface-base border border-border-weak">
      <Pressable onPress={() => setExpanded(!expanded)} className="flex-row items-center gap-2">
        <Text className="text-xs font-medium text-text-weak uppercase">Reasoning</Text>
        {expanded ? (
          <ChevronUp size={14} color="var(--color-text-weak)" />
        ) : (
          <ChevronDown size={14} color="var(--color-text-weak)" />
        )}
      </Pressable>
      {expanded && <Text className="text-sm text-text-base italic mt-2">{part.text}</Text>}
    </View>
  )
}

function ToolCallCard({ part }: { part: MessagePart & { type: 'tool-invocation' } }) {
  const [expanded, setExpanded] = useState(false)
  const { toolInvocation } = part
  const isRunning = toolInvocation.state === 'partial-call' || toolInvocation.state === 'call'
  const isResult = toolInvocation.state === 'result'

  return (
    <Pressable
      className={cn(
        'rounded-lg border',
        isRunning && 'border-interactive-primary/30 bg-interactive-primary/5',
        isResult && !toolInvocation.result && 'border-error/30 bg-error/5',
        isResult && !!toolInvocation.result && 'border-success/30 bg-success/5'
      )}
      onPress={() => setExpanded(!expanded)}
    >
      <View className="flex-row items-center gap-2 p-3">
        {isRunning && <ActivityIndicator size="small" />}
        {isResult && !!toolInvocation.result && (
          <CheckCircle size={16} color="var(--color-success)" />
        )}
        {isResult && !toolInvocation.result && <XCircle size={16} color="var(--color-error)" />}
        <Text className="flex-1 text-sm font-medium text-text-strong">
          {formatToolName(toolInvocation.toolName)}
        </Text>
        {expanded ? (
          <ChevronUp size={16} color="var(--color-text-weak)" />
        ) : (
          <ChevronDown size={16} color="var(--color-text-weak)" />
        )}
      </View>
      {expanded && (
        <View className="px-3 pb-3 border-t border-border-weak">
          <Text className="text-xs font-medium text-text-weak uppercase mt-2 mb-1">Arguments</Text>
          <Text className="text-xs text-text-base" numberOfLines={10}>
            {JSON.stringify(toolInvocation.args, null, 2)}
          </Text>
          {!!toolInvocation.result && (
            <>
              <Text className="text-xs font-medium text-text-weak uppercase mt-3 mb-1">Result</Text>
              <Text className="text-xs text-text-base" numberOfLines={20}>
                {typeof toolInvocation.result === 'string'
                  ? toolInvocation.result
                  : JSON.stringify(toolInvocation.result, null, 2)}
              </Text>
            </>
          )}
        </View>
      )}
    </Pressable>
  )
}
