import { View, Text, Pressable, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { LogOut, Monitor, Sun, Moon } from "lucide-react-native"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores/settings"
import { useSDKContext, useDisconnect } from "@/context/sdk"
import { useConnection } from "@/hooks/use-connection"

export default function SettingsScreen() {
  const router = useRouter()
  const { serverUrl } = useSDKContext()
  const { status, checkHealth } = useConnection()
  const { theme, setTheme } = useSettingsStore()
  const disconnect = useDisconnect()

  const handleDisconnect = async () => {
    await disconnect()
    router.replace("/(auth)/connect")
  }

  const themes = [
    { value: "system" as const, label: "System", icon: Monitor },
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
  ]

  return (
    <ScrollView className="flex-1 bg-bg-base">
      <View className="p-4 gap-6">
        <View>
          <Text className="text-xs font-semibold text-text-weak uppercase mb-3">
            Connection
          </Text>
          <View className="rounded-lg border border-border-base bg-surface-raised p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-text-base">Server URL</Text>
              <Text className="text-sm text-text-strong" numberOfLines={1}>
                {serverUrl ?? "Not connected"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-text-base">Status</Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-2 h-2 rounded-full ${
                    status === "connected" ? "bg-success" : "bg-error"
                  }`}
                />
                <Text className="text-sm text-text-strong capitalize">
                  {status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-xs font-semibold text-text-weak uppercase mb-3">
            Appearance
          </Text>
          <View className="rounded-lg border border-border-base bg-surface-raised p-2 gap-1">
            {themes.map((t) => {
              const Icon = t.icon
              const isSelected = theme === t.value
              return (
                <Pressable
                  key={t.value}
                  onPress={() => setTheme(t.value)}
                  className={`flex-row items-center gap-3 px-3 py-3 rounded-md ${
                    isSelected ? "bg-surface-active" : ""
                  }`}
                >
                  <Icon
                    size={18}
                    color={
                      isSelected
                        ? "var(--color-interactive-primary)"
                        : "var(--color-text-weak)"
                    }
                  />
                  <Text
                    className={`flex-1 text-base ${
                      isSelected
                        ? "text-text-strong font-medium"
                        : "text-text-base"
                    }`}
                  >
                    {t.label}
                  </Text>
                  {isSelected && (
                    <View className="w-2 h-2 rounded-full bg-interactive-primary" />
                  )}
                </Pressable>
              )
            })}
          </View>
        </View>

        <View>
          <Button
            variant="danger"
            onPress={handleDisconnect}
            className="w-full"
          >
            Disconnect
          </Button>
        </View>

        <View className="items-center pt-4">
          <Text className="text-xs text-text-weak">OpenCode Mobile v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  )
}
