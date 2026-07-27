import { ActivityIndicator, View } from "react-native"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "small" | "large"
  className?: string
}

export function Spinner({ size = "large", className }: SpinnerProps) {
  return (
    <View className={cn("items-center justify-center", className)}>
      <ActivityIndicator size={size} color="var(--color-interactive-primary)" />
    </View>
  )
}
