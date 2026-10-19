"use client"

import { Tool } from "@/components/ui/tool"
import type { LspInput, LspToolPart } from "@/lib/build-in-tools"
import { parseFilename, toolDisplayTitle } from "@/components/tools/path"
import { t } from "@/i18n"

interface LspToolProps {
  part: LspToolPart
}

const LSP_OPERATION_LABEL_KEYS: Record<LspInput["operation"], string> = {
  goToDefinition: "tool.lsp_go_to_definition",
  findReferences: "tool.lsp_find_references",
  hover: "tool.lsp_hover",
  documentSymbol: "tool.lsp_document_symbol",
  workspaceSymbol: "tool.lsp_workspace_symbol",
  goToImplementation: "tool.lsp_go_to_implementation",
  prepareCallHierarchy: "tool.lsp_prepare_call_hierarchy",
  incomingCalls: "tool.lsp_incoming_calls",
  outgoingCalls: "tool.lsp_outgoing_calls",
}

function getLspToolTitle(part: LspToolPart): string | null {
  const filename = parseFilename(part.input.filePath)
  const operation = t(LSP_OPERATION_LABEL_KEYS[part.input.operation])

  if (part.state === "output-error") {
    return t("tool.lsp_attempted_in_file", { operation, file: filename })
  }

  if (part.state !== "output-available") {
    return null
  }

  return t("tool.lsp_in_file", { operation, file: filename })
}

function getLspToolDetail(part: LspToolPart): string | undefined {
  const line = part.input.line
  const character = part.input.character
  const query = part.input.query?.trim()

  const location = `L${line}:${character}`
  if (query) {
    return `${location} · ${query}`
  }

  return location
}

export function LspTool({ part }: LspToolProps) {
  return (
    <Tool
      toolPart={part}
      title={toolDisplayTitle(getLspToolTitle(part), getLspToolDetail(part))}
    />
  )
}
