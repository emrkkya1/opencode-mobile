import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useColorScheme as useRNColorScheme } from "react-native"
import { useSettingsStore } from "@/stores/settings"

type ThemeContextType = {
  resolvedTheme: "light" | "dark"
  colorSchemeClass: string
}

const ThemeContext = createContext<ThemeContextType>({
  resolvedTheme: "dark",
  colorSchemeClass: "",
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)
  const systemColorScheme = useRNColorScheme()
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark")
  const [colorSchemeClass, setColorSchemeClass] = useState("")

  useEffect(() => {
    const resolved =
      theme === "system" ? ((systemColorScheme === "light" ? "light" : "dark")) : theme
    setResolvedTheme(resolved)
    setColorSchemeClass(resolved === "light" ? "light" : "")
  }, [theme, systemColorScheme])

  return (
    <ThemeContext.Provider value={{ resolvedTheme, colorSchemeClass }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
