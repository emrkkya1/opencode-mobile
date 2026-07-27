import { useState } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter, Stack } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable } from 'react-native'
import { Button } from '@/components/ui/button'
import { useCreateSession } from '@/hooks/use-sessions'
import { useSendMessage } from '@/hooks/use-messages'

export default function NewSessionScreen() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const createSession = useCreateSession()

  const handleSubmit = async () => {
    if (!prompt.trim() || createSession.isPending) return

    try {
      const session = await createSession.mutateAsync({})
      router.replace(`/session/${session.id}`)

      const { api } = await import('@/lib/api')
      await api.post(`/session/${session.id}/message`, {
        parts: [{ type: 'text', text: prompt.trim() }],
      })
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Session',
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
      >
        <View className="flex-1 px-4 py-6">
          <View className="flex-1">
            <TextInput
              className="flex-1 rounded-lg border border-border-base bg-surface-base p-4 text-base text-text-strong"
              placeholder="What would you like to work on?"
              placeholderTextColor="var(--color-text-weak)"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              autoFocus
            />
          </View>

          <Button
            onPress={handleSubmit}
            disabled={!prompt.trim() || createSession.isPending}
            loading={createSession.isPending}
            className="mt-4"
          >
            Start Session
          </Button>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}
