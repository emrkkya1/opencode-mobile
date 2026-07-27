import { View } from "react-native"
import { Spinner } from "./spinner"

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-base">
      <Spinner />
    </View>
  )
}
