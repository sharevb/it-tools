<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { bech32, bech32m } from 'bech32';

const { t } = useI18n();

// Shared state
const encodingVariant = ref<'bech32' | 'bech32m'>('bech32');
const autoDetect = ref(true);
const checksumOnly = ref(false);

// Decode state
const bechInput = ref('');
const decodedHrp = ref('');
const decodedHex = ref('');
const detectedVariant = ref('');
const checksumValid = ref<boolean | null>(null);
const decodeError = ref('');

// Encode state
const hrp = ref('');
const hexPayload = ref('');
const encodeError = ref('');
const bechOutput = ref('');

interface DecodedRow {
  input: string
  hrp: string
  variant: string
  hex: string
  status: string
}

// Batch state
const batchInput = ref('');
const batchRows = ref<DecodedRow[]>([]);

// Helpers
function wordsToHex(words: number[]): string {
  return bech32.fromWords(words).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToWords(hex: string): number[] {
  const clean = hex.toLowerCase();
  if (!/^[0-9a-f]+$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error(t('tools.bech32.texts.invalid-hex-payload'));
  }

  return bech32.toWords(clean.match(/.{2}/g)!.map(b => Number.parseInt(b, 16)));
}

function detectVariant(input: string) {
  try {
    const r = bech32.decode(input);
    return { variant: 'bech32', ...r };
  }
  catch {}
  const r = bech32m.decode(input);
  return { variant: 'bech32m', ...r };
}

// Actions
function decode() {
  checksumValid.value = null;
  decodedHrp.value = '';
  decodedHex.value = '';
  detectedVariant.value = '';
  decodeError.value = '';

  const input = bechInput.value.trim();
  try {
    const res = autoDetect.value
      ? detectVariant(input)
      : encodingVariant.value === 'bech32'
        ? { variant: 'bech32', ...bech32.decode(input) }
        : { variant: 'bech32m', ...bech32m.decode(input) };

    decodedHrp.value = res.prefix;
    decodedHex.value = wordsToHex(res.words);
    detectedVariant.value = res.variant;
    checksumValid.value = true;
  }
  catch (err: any) {
    checksumValid.value = false;
    decodeError.value = err.toString();
  }
}

function validateChecksum() {
  checksumValid.value = null;
  const input = bechInput.value.trim();

  try {
    autoDetect.value
      ? detectVariant(input)
      : encodingVariant.value === 'bech32'
        ? bech32.decode(input)
        : bech32m.decode(input);

    checksumValid.value = true;
  }
  catch (err: any) {
    checksumValid.value = false;
    decodeError.value = err.toString();
  }
}

function encode() {
  try {
    const words = hexToWords(hexPayload.value);
    const enc
      = encodingVariant.value === 'bech32'
        ? bech32.encode(hrp.value, words)
        : bech32m.encode(hrp.value, words);

    bechOutput.value = enc;
  }
  catch (err: any) {
    encodeError.value = err.toString();
  }
}

function batchConvert() {
  const lines = batchInput.value
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const rows: DecodedRow[] = [];

  for (const line of lines) {
    try {
      const r = detectVariant(line);
      rows.push({
        input: line,
        hrp: r.prefix,
        variant: r.variant,
        hex: wordsToHex(r.words),
        status: 'OK',
      });
    }
    catch (err: any) {
      rows.push({
        input: line,
        hrp: '',
        variant: '',
        hex: '',
        status: `ERROR: ${err.toString()}`,
      });
    }
  }

  batchRows.value = rows;
}

function exportCsv() {
  if (!batchRows.value.length) {
    return;
  }

  const header = [
    t('tools.bech32.texts.input'),
    t('tools.bech32.texts.hrp'),
    t('tools.bech32.texts.variant'),
    t('tools.bech32.texts.hex'),
    t('tools.bech32.texts.status'),
  ];
  const rows = batchRows.value.map(r => [
    r.input,
    r.hrp,
    r.variant,
    r.hex,
    r.status,
  ]);

  const csv
    = `${header.join(',')
     }\n${
     rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')}`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'bech32_batch.csv';
  a.click();

  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <n-tabs type="line" animated>
      <!-- DECODE TAB -->
      <n-tab-pane name="decode" :tab="t('tools.bech32.texts.tab-decode')">
        <c-input-text
          v-model:value="bechInput"
          label-position="left"
          :label="t('tools.bech32.texts.label-bech32-m-string')"
          :placeholder="t('tools.bech32.texts.placeholder-bech32-bech32m-string')"
          mb-1
        />

        <n-space justify="center" align="center" mb-1>
          <n-switch v-model:value="autoDetect">
            <template #checked>
              {{ t('tools.bech32.texts.tag-auto-detect') }}
            </template>
            <template #unchecked>
              {{ t('tools.bech32.texts.tag-manual') }}
            </template>
          </n-switch>
          <c-select
            v-model:value="encodingVariant"
            label-position="left"
            :label="t('tools.bech32.texts.label-variant')"
            :disabled="autoDetect"
            :options="[
              { label: t('tools.bech32.texts.label-bech32'), value: 'bech32' },
              { label: t('tools.bech32.texts.label-bech32m'), value: 'bech32m' },
            ]"
            style="width: 160px"
          />
          <n-switch v-model:value="checksumOnly">
            <template #checked>
              {{ t('tools.bech32.texts.tag-checksum-only') }}
            </template>
            <template #unchecked>
              {{ t('tools.bech32.texts.tag-full-decode') }}
            </template>
          </n-switch>
        </n-space>

        <n-space justify="center" mb-2>
          <n-button
            type="primary"
            @click="checksumOnly ? validateChecksum() : decode()"
          >
            {{ checksumOnly ? 'Validate' : 'Decode' }}
          </n-button>
        </n-space>

        <n-alert v-if="checksumValid === true" type="success" mb-2>
          {{ t('tools.bech32.texts.tag-checksum-valid') }}
        </n-alert>
        <n-alert v-if="checksumValid === false" type="error" mb-2>
          {{ t('tools.bech32.texts.tag-checksum-invalid') }}
        </n-alert>

        <c-alert v-if="decodeError">
          {{ decodeError }}
        </c-alert>

        <div v-if="decodedHex">
          <input-copyable v-model:value="decodedHrp" label-width="110px" label-position="left" :label="t('tools.bech32.texts.label-hrp')" readonly :placeholder="t('tools.bech32.texts.placeholder-hrp')" />
          <input-copyable v-model:value="decodedHex" label-width="110px" label-position="left" :label="t('tools.bech32.texts.label-payload')" readonly :placeholder="t('tools.bech32.texts.placeholder-hex-payload')" />
          <input-copyable v-model:value="detectedVariant" label-width="110px" label-position="left" :label="t('tools.bech32.texts.label-variant')" readonly :placeholder="t('tools.bech32.texts.placeholder-variant')" />
        </div>
      </n-tab-pane>

      <!-- ENCODE TAB -->
      <n-tab-pane name="encode" :tab="t('tools.bech32.texts.tab-encode')">
        <c-input-text v-model:value="hrp" label-position="left" :label="t('tools.bech32.texts.label-hrp')" label-width="110px" :placeholder="t('tools.bech32.texts.placeholder-hrp')" mb-1 />
        <c-input-text
          v-model:value="hexPayload"
          label-position="left" label-width="110px"
          :label="t('tools.bech32.texts.label-payload')"
          :placeholder="t('tools.bech32.texts.placeholder-hex-payload')"
          mb-1
        />

        <c-select
          v-model:value="encodingVariant"
          label-position="left" label-width="110px"
          :label="t('tools.bech32.texts.label-variant')"
          :options="[
            { label: t('tools.bech32.texts.label-bech32'), value: 'bech32' },
            { label: t('tools.bech32.texts.label-bech32m'), value: 'bech32m' },
          ]"
          style="width: 160px"
        />

        <n-space justify="center">
          <n-button type="primary" @click="encode">
            {{ t('tools.bech32.texts.tag-encode') }}
          </n-button>
        </n-space>

        <c-alert v-if="encodeError">
          {{ encodeError }}
        </c-alert>

        <div v-else>
          <input-copyable v-model:value="bechOutput" :label="t('tools.bech32.texts.label-encoded-bech32-string')" readonly :placeholder="t('tools.bech32.texts.placeholder-bech32-string')" />
        </div>
      </n-tab-pane>

      <!-- BATCH TAB -->
      <n-tab-pane name="batch" :tab="t('tools.bech32.texts.tab-batch')">
        <c-input-text
          v-model:value="batchInput"
          :label="t('tools.bech32.texts.label-bech32-strings-one-per-line')"
          multiline
          rows="5"
          :placeholder="t('tools.bech32.texts.placeholder-one-bech32-string-per-line')"
          mb-2
        />
        <n-space justify="center" mb-2>
          <n-button type="primary" @click="batchConvert">
            {{ t('tools.bech32.texts.tag-convert') }}
          </n-button>
        </n-space>
        <n-card v-if="batchRows.length" :title="t('tools.bech32.texts.title-results')">
          <n-data-table
            :columns="[
              { title: 'Input', key: 'input' },
              { title: 'HRP', key: 'hrp' },
              { title: 'Variant', key: 'variant' },
              { title: 'Hex', key: 'hex' },
              { title: 'Status', key: 'status' },
            ]"
            :data="batchRows"
            :bordered="true"
            size="small"
            mb-2
          />
          <n-space justify="center">
            <n-button @click="exportCsv">
              {{ t('tools.bech32.texts.tag-export-csv') }}
            </n-button>
          </n-space>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
