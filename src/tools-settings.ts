import { appBaseUrl as base } from '@/utils/base-url';

// Optional per-deployment settings. Lives in its own top-level-await module so the
// fetch runs concurrently with the config fetches in src/tools/index.ts (sibling async
// module subgraphs evaluate in parallel) instead of serially after them.
export const toolsSettings: Record<string, Record<string, any> | any> = await fetch(`${base}tools-settings.json`)
  .then(response => (response.ok ? response.json() as Promise<Record<string, Record<string, any> | any>> : {}))
  .catch(() => ({}));
