import { useState } from "react"
import { View, Text, Pressable, Modal, FlatList } from "react-native"
import { ChevronDown, Check } from "lucide-react-native"
import { useProviders } from "@/hooks/use-models"

interface ModelPickerProps {
  value?: { id: string; providerID: string }
  onSelect?: (model: { id: string; providerID: string }) => void
}

export function ModelPicker({ value, onSelect }: ModelPickerProps) {
  const [open, setOpen] = useState(false)
  const { data: providers } = useProviders()

  const models = (providers ?? []).flatMap((p) =>
    p.models.map((m) => ({
      id: m.id,
      name: m.name,
      providerID: p.id,
      providerName: p.name,
    }))
  )

  const selectedModel = models.find(
    (m) => m.id === value?.id && m.providerID === value?.providerID
  )

  const handleSelect = (model: (typeof models)[0]) => {
    onSelect?.({ id: model.id, providerID: model.providerID })
    setOpen(false)
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-1 px-2 py-1 rounded bg-surface-base active:bg-surface-hover"
      >
        <Text className="text-sm text-text-base" numberOfLines={1}>
          {selectedModel?.name ?? "Select model"}
        </Text>
        <ChevronDown size={14} color="var(--color-text-weak)" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-bg-base rounded-t-2xl max-h-[70%]">
            <View className="p-4 border-b border-border-base">
              <Text className="text-lg font-semibold text-text-strong">
                Select Model
              </Text>
            </View>
            <FlatList
              data={models}
              keyExtractor={(item) => `${item.providerID}-${item.id}`}
              renderItem={({ item }) => {
                const isSelected =
                  item.id === value?.id && item.providerID === value?.providerID
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-hover"
                  >
                    <View className="flex-1">
                      <Text className="text-base text-text-strong">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-text-weak">
                        {item.providerName}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={18} color="var(--color-interactive-primary)" />
                    )}
                  </Pressable>
                )
              }}
            />
            <View className="p-4 border-t border-border-base">
              <Pressable
                onPress={() => setOpen(false)}
                className="py-3 items-center"
              >
                <Text className="text-base text-interactive-primary font-medium">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
