<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ulid } from 'ulid';
import _ from 'lodash';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const amount = useQueryParamOrStorage({ name: 'amount', storageName: 'ulid-generator:amount', defaultValue: 1 });
const formats = [{ label: t('tools.ulid-generator.texts.label-raw'), value: 'raw' }, { label: t('tools.ulid-generator.texts.label-json'), value: 'json' }] as const;
const format = useStorage<typeof formats[number]['value']>('ulid-generator-format', formats[0].value);

const [ulids, refreshUlids] = computedRefreshable(() => {
  const ids = _.times(amount.value, () => ulid());

  if (format.value === 'json') {
    return JSON.stringify(ids, null, 2);
  }

  return ids.join('\n');
});

const { copy } = useCopy({ source: ulids, text: t('tools.ulid-generator.texts.text-ulids-copied-to-the-clipboard') });
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-75px>{{ t('tools.ulid-generator.texts.tag-quantity') }}</label>
      <n-input-number-i18n v-model:value="amount" min="1" max="100" flex-1 />
    </div>

    <c-buttons-select v-model:value="format" :options="formats" :label="t('tools.ulid-generator.texts.label-format')" label-width="75px" />

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ ulids }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshUlids()">
        {{ t('tools.ulid-generator.texts.tag-refresh') }}
      </c-button>
      <c-button @click="copy()">
        {{ t('tools.ulid-generator.texts.tag-copy') }}
      </c-button>
    </div>
  </div>
</template>
