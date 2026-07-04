<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { extractId, extractMachineId, extractTimestamp } from './snowflake-id-extractor.service';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputId = useQueryParam({ tool: 'snowflake-id-ext', name: 'id', defaultValue: '1263785187301658678' });
const inputEpoch = useQueryParam({ tool: 'snowflake-id-ext', name: 'epoch', defaultValue: '' });

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="inputId" :label="t('tools.snowflake-id-extractor.texts.label-snowflake-id')" :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-put-snowflake-id-here-eg-1263785187301658678')" label-position="left" label-width="110px" mb-2 label-align="right" />
      <c-input-text v-model:value="inputEpoch" :label="t('tools.snowflake-id-extractor.texts.label-epoch')" :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-put-epoch-timestamp-here-optional-eg-1420070400000')" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-divider />

      <InputCopyable
        :label="t('tools.snowflake-id-extractor.texts.label-local-date')"
        v-bind="inputProps"
        :value="inputEpoch ? new Date(extractTimestamp(BigInt(inputId.valueOf()), BigInt(inputEpoch.valueOf()))).toLocaleString() : ''"
        :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-epoch-timestamp-will-be-here')"
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        :label="t('tools.snowflake-id-extractor.texts.label-timestamp')"
        v-bind="inputProps"
        :value="inputEpoch ? new Date(extractTimestamp(BigInt(inputId.valueOf()), BigInt(inputEpoch.valueOf()))).getTime() : ''"
        :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-epoch-timestamp-will-be-here')"
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        :label="t('tools.snowflake-id-extractor.texts.label-machine-id')"
        v-bind="inputProps"
        :value="extractMachineId(BigInt(inputId.valueOf()))"
        :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-machine-id-will-be-here')"
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        :label="t('tools.snowflake-id-extractor.texts.label-sequence')"
        v-bind="inputProps"
        :value="extractId(BigInt(inputId.valueOf()))"
        :placeholder="t('tools.snowflake-id-extractor.texts.placeholder-sequence-number-will-be-here')"
        label-position="left" label-width="110px" mb-2 label-align="right"
      />
    </c-card>
  </div>
</template>
