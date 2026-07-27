import { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList } from 'react-native'
import { ChevronDown, Check } from 'lucide-react-native'
import { useAgents } from '@/hooks/use-models'

interface AgentPickerProps {
  value?: string
  onSelect?: (agent: string) => void
}

export function AgentPicker({ value, onSelect }: AgentPickerProps) {
  const [open, setOpen] = useState(false)
  const { data: agents } = useAgents()

  const handleSelect = (agentName: string) => {
    onSelect?.(agentName)
    setOpen(false)
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-1 px-2 py-1 rounded bg-surface-base active:bg-surface-hover"
      >
        <Text className="text-sm text-text-base" numberOfLines={1}>
          {value ?? 'Select agent'}
        </Text>
        <ChevronDown size={14} color="var(--color-text-weak)" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-bg-base rounded-t-2xl max-h-[70%]">
            <View className="p-4 border-b border-border-base">
              <Text className="text-lg font-semibold text-text-strong">Select Agent</Text>
            </View>
            <FlatList
              data={agents ?? []}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => {
                const isSelected = item.name === value
                return (
                  <Pressable
                    onPress={() => handleSelect(item.name)}
                    className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-hover"
                  >
                    <View className="flex-1">
                      <Text className="text-base text-text-strong">{item.name}</Text>
                      {item.description && (
                        <Text className="text-sm text-text-weak" numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {isSelected && <Check size={18} color="var(--color-interactive-primary)" />}
                  </Pressable>
                )
              }}
              ListEmptyComponent={
                <View className="p-8 items-center">
                  <Text className="text-sm text-text-weak">No agents available</Text>
                </View>
              }
            />
            <View className="p-4 border-t border-border-base">
              <Pressable onPress={() => setOpen(false)} className="py-3 items-center">
                <Text className="text-base text-interactive-primary font-medium">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
