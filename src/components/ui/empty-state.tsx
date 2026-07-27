import { View, Text } from "react-native"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <View
      className={cn(
        "flex-1 items-center justify-center p-8",
        className
      )}
    >
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-lg font-semibold text-text-strong text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-text-weak text-center">
          {description}
        </Text>
      )}
    </View>
  )
}
