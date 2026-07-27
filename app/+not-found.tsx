import { View, Text } from 'react-native'
import { Link, Stack } from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-bg-base p-6">
        <Text className="text-xl font-semibold text-text-strong mb-2">Page not found</Text>
        <Link href="/" className="text-interactive-primary text-base">
          Go to home
        </Link>
      </View>
    </>
  )
}
