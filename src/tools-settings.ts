import { appBaseUrl as base } from '@/utils/base-url';
import type { ToolsSettings } from '@/utils/tools-settings';

export { type ToolsSettings, getToolsSettingString } from '@/utils/tools-settings';

// Optional per-deployment settings. Lives in its own top-level-await module so the
// fetch runs concurrently with the config fetches in src/tools/index.ts (sibling async
// module subgraphs evaluate in parallel) instead of serially after them.
export const toolsSettings: ToolsSettings = await fetch(`${base}tools-settings.json`)
  .then((response) => (response.ok ? (response.json() as Promise<ToolsSettings>) : {}))
  .catch(() => ({}));

/**
 * `"offline": true` in tools-settings.json marks a deployment without internet access (an air-gapped intranet).
 * Tools that only work with internet are hidden, and tools with a bundled or mirrored fallback switch to it.
 */
export const isOfflineMode = toolsSettings.offline === true;
