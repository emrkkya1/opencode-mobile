import { Component, type ReactNode } from 'react'
import { View, Text, Pressable } from 'react-native'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <View className="flex-1 items-center justify-center p-6 bg-bg-base">
          <Text className="text-xl font-semibold text-text-strong mb-2">Something went wrong</Text>
          <Text className="text-sm text-text-weak text-center mb-6">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </Text>
          <Pressable
            className="px-4 py-2 rounded-lg bg-interactive-primary"
            onPress={() => this.setState({ hasError: false })}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      )
    }

    return this.props.children
  }
}
