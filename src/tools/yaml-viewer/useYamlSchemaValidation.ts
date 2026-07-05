import { type Schema } from 'jsonschema';
import { isRef, onBeforeMount, ref, watch } from 'vue';
import { type MaybeRef, get } from '@vueuse/core';
import YAML from 'yaml';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import { yamlParse } from 'composeverter';

export interface SchemaStore {
  name: string
  description: string
  url: string
  fileMatch: string[]
  versions?: string[]
}

interface NodeWithRange {
  range?: number[]
}

export function useYamlSchemaValidation({ yaml, schemaUrl, schemaData }: { yaml: MaybeRef<string>; schemaUrl: MaybeRef<string>; schemaData: MaybeRef<string> }) {
  const schemas = ref<SchemaStore[]>([]);
  const schema = ref<Schema | null>(null);
  const errors = ref<string[]>([]);

  onBeforeMount(async () => {
    const catalog = await fetch('https://www.schemastore.org/api/json/catalog.json');
    const catalogJson: { $schemaUrl: string; schemas: SchemaStore[]; version: number } = await catalog.json();
    schemas.value = catalogJson.schemas;
  });

  watch([schemaUrl, schemaData].filter(isRef), async () => {
    if (get(schemaUrl) === 'custom') {
      try {
        schema.value = JSON.parse(get(schemaData)) as Schema;
      }
      catch (e: any) {
        errors.value = [`Schema parsing error:${e.toString()}`];
      }
      return;
    }
    if (get(schemaUrl)) {
      try {
        const response = await fetch(get(schemaUrl));
        const schemaJson = await response.json();
        schema.value = schemaJson;
      }
      catch (e: any) {
        errors.value = [`Schema fetching error:${e.toString()}`];
      }
    }
  }, { immediate: true });

  watch([yaml, schema].filter(isRef), () => {
    const schemaValue = get(schema);
    const yamlValue = get(yaml);
    if (!schemaValue) {
      errors.value = [];
      return;
    }
    if (!yamlValue) {
      errors.value = [];
      return;
    }
    const parsedYaml = yamlParse(yamlValue);
    const ajv = new Ajv({ allErrors: true, strict: false });
    AjvErrors(ajv);
    const validate = ajv.compile(schemaValue);
    const valid = validate(parsedYaml);
    if (valid || validate.errors === null) {
      errors.value = [];
    }
    else {
      const yamlDoc = YAML.parseDocument(yamlValue, { prettyErrors: true });
      errors.value = validate.errors!.map((err) => {
        let { instancePath } = err;
        if (err.keyword === 'additionalProperties') {
          instancePath += `/${err.params.additionalProperty}`;
        }
        const parsedPath = instancePath.split('/').slice(1);
        let node = yamlDoc.getIn(parsedPath, true);
        if (node === null) {
          node = yamlDoc.getIn(parsedPath.slice(0, -1), true);
        }
        const nodeWithRange = node as NodeWithRange;
        const pos = nodeWithRange?.range ? nodeWithRange.range[0] + 1 : 0;
        const line = (yamlValue.substring(0, pos).match(/\n/g) || []).length + 1;
        let message;
        if (err.keyword === 'additionalProperties') {
          message = `Line ${line}(${instancePath}): '${err.params.additionalProperty}' is unknown for '${instancePath}'`;
        }
        else if (err.keyword === 'format') {
          message = `Line ${line}(${instancePath}): must have a valid syntax for '${err.params.format}'`;
        }
        else if (err.keyword === 'oneOf') {
          message = `Line ${line}(${instancePath}): must be either a Short Syntax (string(s)) or a Long Syntax (object(s))`;
        }
        else { message = `Line ${line}(${instancePath}): ${err.message} (${err.keyword}: ${JSON.stringify(err.params)})`; }
        return message;
      });
    }
  }, { immediate: true });

  return { schemas, errors };
}
