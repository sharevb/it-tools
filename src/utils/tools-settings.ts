// Kept apart from src/tools-settings.ts, which fetches tools-settings.json with a top-level await: tool index.ts files
// load eagerly, and importing that module from them would hold up src/tools/index.ts until the fetch completes.

export type ToolsSettings = Record<string, any>;

/** A second-level `tools-settings.json` value (`{ "<tool>": { "<key>": "..." } }`), trimmed, or '' when unset. */
export function getToolsSettingString(settings: ToolsSettings, tool: string, key: string): string {
  return String(settings[tool]?.[key] ?? '').trim();
}
