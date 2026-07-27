import { Modal, View, Text, Pressable } from 'react-native'
import { AlertTriangle } from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import type { PermissionV2Request } from '@/types'

interface PermissionDialogProps {
  permission: PermissionV2Request
  onAllow: () => void
  onDeny: () => void
  onClose: () => void
}

export function PermissionDialog({ permission, onAllow, onDeny, onClose }: PermissionDialogProps) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full max-w-md rounded-xl border border-border-base bg-bg-base p-6">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-10 h-10 rounded-full bg-warning/20 items-center justify-center">
              <AlertTriangle size={20} color="var(--color-warning)" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-strong">Permission Required</Text>
              <Text className="text-sm text-text-weak" numberOfLines={1}>
                {permission.action}
              </Text>
            </View>
          </View>

          {permission.resources.length > 0 && (
            <View className="mb-6 p-3 rounded-lg bg-surface-base">
              {permission.resources.map((resource, i) => (
                <Text key={i} className="text-sm text-text-base" numberOfLines={3}>
                  {resource.type}
                  {resource.id ? `: ${resource.id}` : ''}
                </Text>
              ))}
            </View>
          )}

          <View className="flex-row gap-3">
            <Button variant="secondary" onPress={onDeny} className="flex-1">
              Deny
            </Button>
            <Button variant="primary" onPress={onAllow} className="flex-1">
              Allow
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
