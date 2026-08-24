<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { NDatePicker, NInput, NInputNumber, NSwitch } from 'naive-ui';

type BaseType = 'string' | 'number' | 'boolean' | 'date' | 'datetime';
type ParamType = BaseType | 'array';

/**
 * Safe date parsing: never throws, always returns a timestamp.
 */
function safeParseDate(input: any): number {
  const t = Date.parse(input);
  return Number.isFinite(t) ? t : Date.now();
}

/**
 * Safe scalar conversion: total function, never throws.
 */
function convertScalarSafe(value: any, type: BaseType): any {
  try {
    switch (type) {
      case 'boolean': {
        if (value === true || value === 'true') {
          return true;
        }
        if (value === false || value === 'false') {
          return false;
        }
        return Boolean(value);
      }

      case 'number': {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
      }

      case 'date': {
        return safeParseDate(value);
      }

      case 'datetime': {
        return safeParseDate(value);
      }

      case 'string':
      default:
        return String(value ?? '');
    }
  }
  catch {
    // Absolute fallback: never throw
    if (type === 'boolean') {
      return false;
    }
    if (type === 'number') {
      return 0;
    }
    if (type === 'date' || type === 'datetime') {
      return Date.now();
    }
    return '';
  }
}

/**
 * Safe array conversion: total function, never throws.
 */
function convertArraySafe(values: any[], elementType: BaseType): any[] {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.map(v => convertScalarSafe(v, elementType));
}

/**
 * Main safe conversion function when changing types.
 * Always returns a valid value. Never throws.
 */
function convertValueOnTypeChangeSafe(
  oldType: ParamType,
  newType: ParamType,
  value: any,
  elementType?: BaseType,
): any {
  try {
    // Switching to array
    if (newType === 'array') {
      const t = elementType ?? 'string';

      if (oldType === 'array') {
        return convertArraySafe(value ?? [], t);
      }

      // Scalar → array
      return [convertScalarSafe(value, t)];
    }

    // Switching from array → scalar
    if (oldType === 'array') {
      const first = Array.isArray(value) ? value[0] : value;
      return convertScalarSafe(first, newType);
    }

    // Scalar → scalar
    return convertScalarSafe(value, newType);
  }
  catch {
    // Absolute fallback: never throw
    if (newType === 'array') {
      return [];
    }
    return convertScalarSafe(undefined, newType);
  }
}

interface ParamInstance {
  key: string
  type: ParamType
  value: any
  elementType?: BaseType
}

const loadUrl = useQueryParamOrStorage({
  name: 'url',
  storageName: 'url-builder:u',
  defaultValue: '',
});
const baseUrl = ref('');
const params = ref<ParamInstance[]>([]);

function createParam(): ParamInstance {
  return {
    key: '',
    type: 'string',
    value: '',
  };
}

function createArrayItem(elementType: BaseType) {
  switch (elementType) {
    case 'boolean': return false;
    case 'number': return 0;
    case 'date': return Date.now();
    case 'datetime': return Date.now();
    default: return '';
  }
}

function isIsoDate(value: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isIsoDateTime(value: string): boolean {
  const isoRegex
    = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

  if (!isoRegex.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function inferType(value: string): BaseType {
  if (value === 'true' || value === 'false') {
    return 'boolean';
  }
  if (!Number.isNaN(Number(value))) {
    return 'number';
  }
  if (isIsoDate(value)) {
    return 'date';
  }
  if (isIsoDateTime(value)) {
    return 'datetime';
  }
  return 'string';
}

function convertValue(raw: string, type: BaseType) {
  switch (type) {
    case 'boolean': return raw === 'true';
    case 'number': return Number(raw);
    case 'date': return new Date(raw).getTime();
    case 'datetime': return new Date(raw).getTime();
    default: return raw;
  }
}

function parseInitialUrl() {
  const urlString = loadUrl.value;
  try {
    const url = new URL(urlString);

    baseUrl.value = url.origin + url.pathname;

    const parsed: ParamInstance[] = [];

    url.searchParams.forEach((rawValue, rawKey) => {
      const isArray = rawKey.endsWith('[]');
      const key = isArray ? rawKey.slice(0, -2) : rawKey;

      let existing = parsed.find(p => p.key === key);

      if (!existing) {
        if (isArray) {
          const elementType = inferType(rawValue);
          existing = {
            key,
            type: 'array',
            elementType,
            value: [],
          };
        }
        else {
          const type = inferType(rawValue);
          existing = {
            key,
            type,
            value: null,
          };
        }
        parsed.push(existing);
      }

      if (existing.type === 'array') {
        existing.value.push(convertValue(rawValue, existing.elementType!));
      }
      else {
        existing.value = convertValue(rawValue, existing.type);
      }
    });

    params.value = parsed;
  }
  catch (e) {
    console.error('Invalid URL', e);
  }
}

const finalUrl = computed(() => {
  try {
    const url = new URL(baseUrl.value);

    params.value.forEach((p) => {
      if (!p.key) {
        return;
      }

      if (p.type === 'array' && p.elementType) {
        p.value.forEach((item: any) => {
          let encoded = '';

          switch (p.elementType) {
            case 'boolean':
              encoded = item ? 'true' : 'false';
              break;
            case 'date':
              encoded = new Date(item).toISOString().split('T')[0];
              break;
            case 'datetime':
              encoded = new Date(item).toISOString();
              break;
            default:
              encoded = String(item);
          }

          url.searchParams.append(`${p.key}[]`, encoded);
        });
        return;
      }

      switch (p.type) {
        case 'boolean':
          url.searchParams.set(p.key, p.value ? 'true' : 'false');
          break;
        case 'date':
          url.searchParams.set(p.key, new Date(p.value).toISOString().split('T')[0]);
          break;
        case 'datetime':
          url.searchParams.set(p.key, new Date(p.value).toISOString());
          break;
        default:
          url.searchParams.set(p.key, String(p.value));
      }
    });

    return url.toString();
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <NFormItem :label="t('tools.url-builder.texts.label-load-url')" label-placement="left">
      <NInput
        v-model:value="loadUrl"
        :placeholder="t('tools.url-builder.texts.placeholder-paste-url-to-parse')"
        mr-1
      />
      <NButton @click="parseInitialUrl()">{{ t('tools.url-builder.texts.tag-parse') }}</NButton>
    </NFormItem>

    <n-divider style="margin-top: 8px" />

    <NFormItem :label="t('tools.url-builder.texts.label-base-url')" label-placement="left">
      <NInput v-model:value="baseUrl" :placeholder="t('tools.url-builder.texts.placeholder-base-url')" />
    </NFormItem>

    <c-card v-if="baseUrl" :title="t('tools.url-builder.texts.title-url-parameters')" mb-3>
      <NDynamicInput
        v-model:value="params"
        :on-create="createParam"
      >
        <template #default="{ value }">
          <div style="display:flex; gap:12px; width:100%">
            <NInput
              v-model:value="value.key"
              :placeholder="t('tools.url-builder.texts.placeholder-key')"
              style="width: 140px"
            />

            <NSelect
              v-model:value="value.type"
              :options="[
                { label: t('tools.url-builder.texts.label-string'), value: 'string' },
                { label: t('tools.url-builder.texts.label-number'), value: 'number' },
                { label: t('tools.url-builder.texts.label-boolean'), value: 'boolean' },
                { label: t('tools.url-builder.texts.label-date'), value: 'date' },
                { label: t('tools.url-builder.texts.label-datetime'), value: 'datetime' },
                { label: t('tools.url-builder.texts.label-array'), value: 'array' },
              ]"
              style="width: 140px"
              @update:value="(newType: string) => {
                value.value = convertValueOnTypeChangeSafe(
                  value.type,
                  newType as ParamType,
                  value.value,
                  value.elementType,
                )
                value.type = newType
              }"
            />

            <NSelect
              v-if="value.type === 'array'"
              v-model:value="value.elementType"
              :options="[
                { label: t('tools.url-builder.texts.label-string'), value: 'string' },
                { label: t('tools.url-builder.texts.label-number'), value: 'number' },
                { label: t('tools.url-builder.texts.label-boolean'), value: 'boolean' },
                { label: t('tools.url-builder.texts.label-date'), value: 'date' },
                { label: t('tools.url-builder.texts.label-datetime'), value: 'datetime' },
              ]"
              style="width: 140px"
              @update:value="(newElementType: string) => {
                value.value = convertArraySafe(value.value, newElementType as BaseType)
                value.elementType = newElementType
              }"
            />

            <div v-if="value.type === 'array'" style="flex:1">
              <NDynamicInput
                v-model:value="value.value"
                :on-create="() => createArrayItem(value.elementType)"
              >
                <template #default="{ value: item, index }">
                  <component
                    :is="({
                      string: NInput,
                      number: NInputNumber,
                      boolean: NSwitch,
                      date: NDatePicker,
                      datetime: NDatePicker,
                    } as Record<string, any>)[value.elementType]"
                    v-model:value="value.value[index]"
                    :type="value.elementType === 'datetime' ? 'datetime' : undefined"
                    :placeholder="item"
                    style="width:100%"
                  />
                </template>
              </NDynamicInput>
            </div>

            <component
              :is="({
                string: NInput,
                number: NInputNumber,
                boolean: NSwitch,
                date: NDatePicker,
                datetime: NDatePicker,
              } as Record<string, any>)[value.type]"
              v-else
              v-model:value="value.value"
              :type="value.type === 'datetime' ? 'datetime' : undefined"
              :placeholder="t('tools.url-builder.texts.placeholder-value')"
              style="flex:1"
            />
          </div>
        </template>
      </NDynamicInput>
    </c-card>

    <c-card v-if="finalUrl && baseUrl" :title="t('tools.url-builder.texts.title-generated-url')">
      <textarea-copyable :value="finalUrl" />
    </c-card>
  </div>
</template>
