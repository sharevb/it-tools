<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { GPTTokens } from 'gpt-tokens';
import JSON5 from 'json5';
import type { supportModelType } from 'gpt-tokens';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const models = GPTTokens.supportModels;

const model = useQueryParamOrStorage({ name: 'model', storageName: 'gpt-counter:model', defaultValue: 'gpt-3.5-turbo-1106' });
const systemPrompt = ref('');
const userPrompt = ref('');

const isAdvancedMode = ref(false);
const messagesJsonArray = ref('');
const toolsJsonArray = ref('');

const messagesValidation = useValidation({
  source: messagesJsonArray,
  rules: [
    {
      message: t('tools.gpt-token-estimator.texts.message-invalid-messages-array'),
      validator: value => value && JSON5.parse(value.trim()),
    },
  ],
});
const toolsValidation = useValidation({
  source: toolsJsonArray,
  rules: [
    {
      message: t('tools.gpt-token-estimator.texts.message-invalid-tools-array'),
      validator: value => value && JSON5.parse(value.trim()),
    },
  ],
});

const outputTokenCosts = computed(() => {
  try {
    let messagesArray = [];
    let toolsArray = [];

    if (isAdvancedMode.value) {
      messagesArray = messagesJsonArray.value ? JSON5.parse(messagesJsonArray.value.trim()) : [];
      toolsArray = toolsJsonArray.value ? JSON5.parse(toolsJsonArray.value.trim()) : [];
    }
    else {
      if (systemPrompt.value) {
        messagesArray.push({ role: 'system', content: systemPrompt.value });
      }
      if (userPrompt.value) {
        messagesArray.push({ role: 'user', content: userPrompt.value });
      }
    }

    if (!messagesArray.length) {
      return {
        error: '',
        usedTokens: '0',
        usedUSD: '0',
        promptUsedTokens: '0',
        completionUsedTokens: '0',
      };
    }

    const tokens = new GPTTokens({
      model: model.value as supportModelType,
      messages: messagesArray,
      tools: toolsArray,
    });
    return {
      error: '',
      usedTokens: tokens.usedTokens.toString(),
      usedUSD: tokens.usedUSD.toString(),
      promptUsedTokens: tokens.promptUsedTokens.toString(),
      completionUsedTokens: tokens.completionUsedTokens.toString(),
    };
  }
  catch (e: any) {
    return {
      error: e.toString(),
      usedTokens: '',
      usedUSD: '',
      promptUsedTokens: '',
      completionUsedTokens: '',
    };
  }
});
</script>

<template>
  <div>
    <c-select
      v-model:value="model"
      label-position="left"
      :label="t('tools.gpt-token-estimator.texts.label-model')"
      :options="models"
      :placeholder="t('tools.gpt-token-estimator.texts.placeholder-select-gpt-model')"
      mb-2
    />

    <div flex justify-center>
      <n-form-item :label="t('tools.gpt-token-estimator.texts.label-advanded-json-mode')" label-placement="left">
        <n-checkbox v-model:checked="isAdvancedMode" mr-2 />
      </n-form-item>
    </div>

    <c-card v-if="isAdvancedMode" :title="t('tools.gpt-token-estimator.texts.title-prompts')">
      <c-input-text
        v-model:value="messagesJsonArray"
        multiline raw-text
        :placeholder="t('tools.gpt-token-estimator.texts.placeholder-your-messages-json-array')"
        rows="5"
        autofocus
        :label="t('tools.gpt-token-estimator.texts.label-your-messages-json-array')"
        :validation="messagesValidation"
      />

      <c-input-text
        v-model:value="toolsJsonArray"
        multiline raw-text
        :placeholder="t('tools.gpt-token-estimator.texts.placeholder-your-tools-json-array')"
        rows="5"
        autofocus
        :label="t('tools.gpt-token-estimator.texts.label-your-tools-json-array')"
        :validation="toolsValidation"
      />
    </c-card>
    <c-card v-else :title="t('tools.gpt-token-estimator.texts.title-input-json-s')">
      <c-input-text
        v-model:value="systemPrompt"
        multiline raw-text
        :placeholder="t('tools.gpt-token-estimator.texts.placeholder-your-system-prompt-content')"
        rows="2"
        autofocus
        :label="t('tools.gpt-token-estimator.texts.label-your-system-prompt-content')"
      />

      <c-input-text
        v-model:value="userPrompt"
        multiline raw-text
        :placeholder="t('tools.gpt-token-estimator.texts.placeholder-your-user-prompt-content')"
        rows="6"
        autofocus
        :label="t('tools.gpt-token-estimator.texts.label-your-user-prompt-content')"
      />
    </c-card>

    <n-divider />

    <c-alert v-if="outputTokenCosts.error">
      {{ outputTokenCosts.error }}
    </c-alert>

    <div v-if="!outputTokenCosts.error">
      <n-form-item :label="t('tools.gpt-token-estimator.texts.label-used-tokens')">
        <TextareaCopyable :value="outputTokenCosts.usedTokens" />
      </n-form-item>
      <n-form-item :label="t('tools.gpt-token-estimator.texts.label-prompt-tokens')">
        <TextareaCopyable :value="outputTokenCosts.promptUsedTokens" />
      </n-form-item>
      <n-form-item :label="t('tools.gpt-token-estimator.texts.label-completion-tokens')">
        <TextareaCopyable :value="outputTokenCosts.completionUsedTokens" />
      </n-form-item>
      <n-form-item :label="t('tools.gpt-token-estimator.texts.label-used-usd')">
        <TextareaCopyable :value="outputTokenCosts.usedUSD" />
      </n-form-item>
    </div>
  </div>
</template>
