import { Redirect, Tabs } from 'expo-router'
import { MessageSquare, Settings } from 'lucide-react-native'
import { useSDKContext } from '@/context/sdk'
import { useEvents } from '@/hooks/use-events'
import { useTheme } from '@/context/theme'
import { LoadingScreen } from '@/components/ui/loading'
import { PermissionDialog } from '@/components/permission/permission-dialog'
import { usePermissions } from '@/hooks/use-permissions'

function AppTabs() {
  useEvents()
  const { resolvedTheme } = useTheme()
  const { currentPermission, replyPermission, dismissPermission } = usePermissions()

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'var(--color-interactive-primary)',
          tabBarInactiveTintColor: 'var(--color-text-weak)',
          tabBarStyle: {
            backgroundColor: 'var(--color-bg-base)',
            borderTopColor: 'var(--color-border-base)',
          },
          headerStyle: {
            backgroundColor: 'var(--color-bg-base)',
          },
          headerTintColor: 'var(--color-text-strong)',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Sessions',
            tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
        <Tabs.Screen name="session" options={{ href: null }} />
      </Tabs>

      {currentPermission && (
        <PermissionDialog
          permission={currentPermission}
          onAllow={() =>
            replyPermission.mutate({
              sessionID: currentPermission.sessionID,
              requestID: currentPermission.id,
              reply: 'once',
            })
          }
          onDeny={() =>
            replyPermission.mutate({
              sessionID: currentPermission.sessionID,
              requestID: currentPermission.id,
              reply: 'reject',
            })
          }
          onClose={dismissPermission}
        />
      )}
    </>
  )
}

export default function AppLayout() {
  const { isInitialized, serverUrl } = useSDKContext()

  if (!isInitialized) return <LoadingScreen />
  if (!serverUrl) return <Redirect href="/(auth)/connect" />

  return <AppTabs />
}
