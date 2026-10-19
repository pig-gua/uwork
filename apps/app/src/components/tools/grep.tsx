"use client"

import { Tool } from "@/components/ui/tool"
import type { GrepToolPart } from "@/lib/build-in-tools"
import { parseFilename, toolDisplayTitle, truncateText } from "@/components/tools/path"
import { t } from "@/i18n"

interface GrepToolProps {
  part: GrepToolPart
}

function getGrepToolTitle(part: GrepToolPart): string | null {
  const pattern = part.input?.pattern?.trim() ?? ""

  if (part.state === "output-error") {
    return pattern
      ? t("tool.search_attempted_pattern", { pattern: truncateText(pattern, 44) })
      : t("tool.search_attempted")
  }

  if (part.state !== "output-available") {
    return null
  }

  return pattern ? t("tool.searched_pattern", { pattern: truncateText(pattern, 44) }) : t("tool.searched_code")
}

function getGrepToolDetail(part: GrepToolPart): string | undefined {
  const root = part.input?.path?.trim()
  if (!root) {
    return undefined
  }

  return t("tool.detail_in", { path: parseFilename(root) })
}

export function GrepTool({ part }: GrepToolProps) {
  return (
    <Tool
      toolPart={part}
      title={toolDisplayTitle(getGrepToolTitle(part), getGrepToolDetail(part))}
    />
  )
}
