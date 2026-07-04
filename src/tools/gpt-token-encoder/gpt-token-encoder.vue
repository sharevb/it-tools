<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { TiktokenModel } from 'js-tiktoken';
import { GPTTokens } from '../gpt-token-estimator/gpt-tokens.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const models = GPTTokens.supportModels;
const model = useQueryParamOrStorage({ name: 'model', storageName: 'gpt-token-encoder:model', defaultValue: 'gpt-3.5-turbo-1106' });

const decodedInput = ref('');
const encodedOutput = computed(
  () => {
    try {
      return GPTTokens.encode(model.value as TiktokenModel, decodedInput.value).join(' ');
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const encodedInput = ref('');
const decodedOutput = computed(
  () => {
    try {
      return GPTTokens.decode(model.value as TiktokenModel, encodedInput.value.split(/\s+/).map(Number));
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-select
      v-model:value="model"
      :label="t('tools.gpt-token-encoder.texts.label-gpt-ia-model')"
      :options="models"
      mb-2
    />

    <c-card :title="t('tools.gpt-token-encoder.texts.title-encode-text-to-gpt-tokens')">
      <c-input-text
        v-model:value="decodedInput"
        :placeholder="t('tools.gpt-token-encoder.texts.placeholder-put-your-text-to-encode-here')"
        :label="t('tools.gpt-token-encoder.texts.label-text-to-encode')"
        raw-text
        multiline
        rows="5"
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        :label="t('tools.gpt-token-encoder.texts.label-encoded-tokens')"
        :value="encodedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>

    <c-card :title="t('tools.gpt-token-encoder.texts.title-decode-gpt-tokens-to-text')" mt-5>
      <c-input-text
        v-model:value="encodedInput"
        :placeholder="t('tools.gpt-token-encoder.texts.placeholder-put-your-encoded-tokens-here')"
        :label="t('tools.gpt-token-encoder.texts.label-tokens-to-decode')"
        raw-text
        multiline
        rows="5"
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        :label="t('tools.gpt-token-encoder.texts.label-decoded-text')"
        :value="decodedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>
  </div>
</template>
