import { TextInput, View, Text } from "react-native"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  className,
  ...props
}: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-text-strong">{label}</Text>
      )}
      <TextInput
        className={cn(
          "h-10 rounded-md border bg-surface-base px-3 text-base text-text-strong",
          "border-border-base placeholder:text-text-weak",
          error && "border-error",
          className
        )}
        placeholderTextColor="var(--color-text-weak)"
        {...props}
      />
      {error && <Text className="text-xs text-error">{error}</Text>}
      {hint && !error && (
        <Text className="text-xs text-text-weak">{hint}</Text>
      )}
    </View>
  )
}
