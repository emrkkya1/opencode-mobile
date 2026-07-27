import { View, Text, Pressable } from "react-native"
import { AlertTriangle } from "lucide-react-native"

interface DisconnectedBannerProps {
  onRetry?: () => void
}

export function DisconnectedBanner({ onRetry }: DisconnectedBannerProps) {
  return (
    <View className="flex-row items-center gap-2 bg-error/20 px-4 py-2 border-b border-error/30">
      <AlertTriangle size={16} color="var(--color-error)" />
      <Text className="flex-1 text-sm text-error">Connection lost</Text>
      {onRetry && (
        <Pressable onPress={onRetry}>
          <Text className="text-sm font-medium text-error">Retry</Text>
        </Pressable>
      )}
    </View>
  )
}
