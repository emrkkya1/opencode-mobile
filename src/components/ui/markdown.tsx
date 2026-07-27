import { View, Text, ScrollView } from "react-native"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split("\n")

  return (
    <View className={cn("gap-1", className)}>
      {lines.map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <Text key={i} className="text-base font-semibold text-text-strong mt-2">
              {line.slice(4)}
            </Text>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <Text key={i} className="text-lg font-semibold text-text-strong mt-3">
              {line.slice(3)}
            </Text>
          )
        }
        if (line.startsWith("# ")) {
          return (
            <Text key={i} className="text-xl font-bold text-text-strong mt-3">
              {line.slice(2)}
            </Text>
          )
        }
        if (line.startsWith("```")) {
          return null
        }
        if (line.startsWith("> ")) {
          return (
            <View key={i} className="border-l-2 border-border-focus pl-3 ml-2">
              <Text className="text-sm text-text-base italic">{line.slice(2)}</Text>
            </View>
          )
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <View key={i} className="flex-row gap-2 ml-2">
              <Text className="text-text-base">•</Text>
              <Text className="flex-1 text-sm text-text-strong">{line.slice(2)}</Text>
            </View>
          )
        }
        if (line.trim() === "") {
          return <View key={i} className="h-2" />
        }
        return (
          <Text key={i} className="text-sm text-text-strong leading-5">
            {renderInlineMarkdown(line)}
          </Text>
        )
      })}
    </View>
  )
}

function renderInlineMarkdown(text: string): string {
  let result = text
  result = result.replace(/\*\*(.+?)\*\*/g, "$1")
  result = result.replace(/\*(.+?)\*/g, "$1")
  result = result.replace(/`(.+?)`/g, "$1")
  result = result.replace(/\[(.+?)\]\(.+?\)/g, "$1")
  return result
}
