import type { DynamicToolUIPart, ToolUIPart } from "ai"
import { t } from "@/i18n"
import {
  isApplyPatchToolPart,
  isBashToolPart,
  isEditToolPart,
  isGlobToolPart,
  isGrepToolPart,
  isLspToolPart,
  isQuestionToolPart,
  isReadToolPart,
  isSkillToolPart,
  isTaskToolPart,
  isTodoWriteToolPart,
  isWebFetchToolPart,
  isWebSearchToolPart,
  isWriteToolPart,
} from "./build-in-tools"
import { parseFilename, truncateText } from "../components/tools/path"

type AnyToolPart = ToolUIPart | DynamicToolUIPart

export function isToolPartInFlight(part: AnyToolPart): boolean {
  return part.state === "input-streaming" || part.state === "input-available"
}

function hostnameOf(url: string | undefined): string | undefined {
  if (!url) {
    return undefined
  }
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

/**
 * Human-readable "what is this tool doing" label. Safe against partial
 * streamed input (fields may be missing despite the type contract).
 */
export function getToolActivityLabel(part: AnyToolPart): string {
  if (isBashToolPart(part)) {
    const description = part.input?.description?.trim()
    return description ? truncateText(description, 64) : t("tool.running_command")
  }
  if (isReadToolPart(part)) {
    return t("tool.reading_file", { file: parseFilename(part.input?.filePath) })
  }
  if (isEditToolPart(part)) {
    return t("tool.editing_file", { file: parseFilename(part.input?.filePath) })
  }
  if (isWriteToolPart(part)) {
    return t("tool.writing_file", { file: parseFilename(part.input?.filePath) })
  }
  if (isApplyPatchToolPart(part)) {
    return t("tool.applying_changes")
  }
  if (isGrepToolPart(part) || isGlobToolPart(part)) {
    const pattern = part.input?.pattern?.trim()
    return pattern
      ? t("tool.searching_for", { pattern: truncateText(pattern, 44) })
      : t("tool.searching_files")
  }
  if (isLspToolPart(part)) {
    return t("tool.inspecting_file", { file: parseFilename(part.input?.filePath) })
  }
  if (isSkillToolPart(part)) {
    const name = part.input?.name?.trim()
    return name ? t("tool.loading_skill", { name }) : t("tool.loading_a_skill")
  }
  if (isTodoWriteToolPart(part)) {
    return t("tool.updating_plan")
  }
  if (isWebFetchToolPart(part)) {
    const host = hostnameOf(part.input?.url)
    return host ? t("tool.reading_host", { host }) : t("tool.fetching_page")
  }
  if (isWebSearchToolPart(part)) {
    const query = part.input?.query?.trim()
    return query
      ? t("tool.searching_web_for", { query: truncateText(query, 44) })
      : t("tool.searching_web")
  }
  if (isQuestionToolPart(part)) {
    return t("tool.asking_question")
  }
  if (isTaskToolPart(part)) {
    const description = part.input?.description?.trim()
    return description
      ? t("tool.agent_running", { description: truncateText(description, 56) })
      : t("tool.running_agent")
  }
  if (part.type === "dynamic-tool") {
    return t("tool.running_dynamic", { name: part.toolName.replace(/[_-]+/g, " ") })
  }
  return t("tool.working")
}
