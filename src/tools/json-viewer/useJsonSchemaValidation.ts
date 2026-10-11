import { type Schema, Validator } from 'jsonschema';
import { isRef, onBeforeMount, ref, watch } from 'vue';
import { type MaybeRef, get } from '@vueuse/core';
import { type SchemaStore, fetchSchemaCatalog, resolveSchemaCatalogUrl } from './schema-catalog';
import { isOfflineMode, toolsSettings } from '@/tools-settings';

export function useJsonSchemaValidation({
  json,
  schemaUrl,
  schemaData,
}: {
  json: MaybeRef<string>;
  schemaUrl: MaybeRef<string>;
  schemaData: MaybeRef<string>;
}) {
  const schemas = ref<SchemaStore[]>([]);
  const schema = ref<Schema | null>(null);
  const errors = ref<string[]>([]);

  // Offline without a configured catalog mirror there is no catalog to pick from: only custom or user-entered schemas
  const catalogUrl = resolveSchemaCatalogUrl(toolsSettings, isOfflineMode);
  const catalogAvailable = catalogUrl !== '';

  onBeforeMount(async () => {
    schemas.value = await fetchSchemaCatalog(catalogUrl);
  });

  watch(
    [schemaUrl, schemaData].filter(isRef),
    async () => {
      if (get(schemaUrl) === '') {
        schema.value = null;
        errors.value = [];
      }
      if (get(schemaUrl) === 'custom') {
        try {
          schema.value = JSON.parse(get(schemaData)) as Schema;
        } catch (e: any) {
          errors.value = [`Schema parsing error:${e.toString()}`];
        }
        return;
      }
      if (get(schemaUrl)) {
        try {
          const response = await fetch(get(schemaUrl));
          const schemaJson = await response.json();
          schema.value = schemaJson;
        } catch (e: any) {
          errors.value = [`Schema fetching error:${e.toString()}`];
        }
      }
    },
    { immediate: true },
  );

  watch(
    [json, schema].filter(isRef),
    () => {
      const schemaValue = get(schema);
      const jsonValue = get(json);
      if (!schemaValue) {
        errors.value = [];
        return;
      }
      if (!jsonValue) {
        errors.value = [];
        return;
      }
      try {
        const validator = new Validator();
        const validationResult = validator.validate(JSON.parseBigNum(jsonValue), schemaValue);
        errors.value = validationResult.errors.map((error) => error.stack ?? '');
      } catch (e: any) {
        errors.value = [`JSON validation error:${e.toString()}`];
      }
    },
    { immediate: true },
  );

  return { schemas, errors, catalogAvailable };
}
