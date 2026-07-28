import { View } from 'react-native'
import { Stack } from 'expo-router'
import { QueryProvider } from '@/context/query'
import { ThemeProvider, useTheme } from '@/context/theme'
import { SDKProvider } from '@/context/sdk'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import '../../global.css'

function RootStack() {
  const { colorSchemeClass } = useTheme()

  return (
    <View className={colorSchemeClass} style={{ flex: 1 }}>
      <SDKProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SDKProvider>
    </View>
  )
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <RootStack />
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
