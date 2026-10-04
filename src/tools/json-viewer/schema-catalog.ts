import { type ToolsSettings, getToolsSettingString } from '@/utils/tools-settings';

export interface SchemaStore {
  name: string;
  description: string;
  url: string;
  fileMatch: string[];
  versions?: string[];
}

export const DEFAULT_SCHEMA_CATALOG_URL = 'https://www.schemastore.org/api/json/catalog.json';

/**
 * The schema catalog to list in the schema picker: `"json-schemas": { "catalog-url": "..." }` from tools-settings.json
 * (e.g. an intranet mirror of schemastore.org), else schemastore.org itself, except in offline mode where there is
 * no catalog ('') and only custom or user-entered schemas are available.
 */
export function resolveSchemaCatalogUrl(settings: ToolsSettings, offline: boolean): string {
  return getToolsSettingString(settings, 'json-schemas', 'catalog-url') || (offline ? '' : DEFAULT_SCHEMA_CATALOG_URL);
}

export async function fetchSchemaCatalog(catalogUrl: string): Promise<SchemaStore[]> {
  if (!catalogUrl) {
    return [];
  }
  const catalog = await fetch(catalogUrl);
  const catalogJson: { $schemaUrl: string; schemas: SchemaStore[]; version: number } = await catalog.json();
  return catalogJson.schemas;
}
