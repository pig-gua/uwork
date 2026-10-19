"use client"

import { Tool } from "@/components/ui/tool"
import type { GlobToolPart } from "@/lib/build-in-tools"
import { parseFilename, toolDisplayTitle, truncateText } from "@/components/tools/path"
import { t } from "@/i18n"

interface GlobToolProps {
  part: GlobToolPart
}

function getGlobToolTitle(part: GlobToolPart): string | null {
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

function getGlobToolDetail(part: GlobToolPart): string | undefined {
  const root = part.input?.path?.trim()
  if (!root) {
    return undefined
  }

  return t("tool.detail_in", { path: parseFilename(root) })
}

export function GlobTool({ part }: GlobToolProps) {
  return (
    <Tool
      toolPart={part}
      title={toolDisplayTitle(getGlobToolTitle(part), getGlobToolDetail(part))}
    />
  )
}
