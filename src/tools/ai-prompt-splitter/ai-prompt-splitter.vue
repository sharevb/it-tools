<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import promptSplitter from 'chatgpt-prompt-splitter';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const prompt = ref('');
const splitLength = ref(1024);

const splittedPrompts = computed(() => {
  try {
    return promptSplitter({
      prompt: prompt.value,
      splitLength: splitLength.value,
      newLine: true,
    });
  }
  catch (e: any) {
    return [e.toString()];
  }
});

const promptValidation = useValidation({
  source: prompt,
  rules: [
    {
      validator: v => v !== '',
      message: t('tools.ai-prompt-splitter.texts.message-prompt-must-not-be-empty'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.ai-prompt-splitter.texts.title-prompt-and-options')" mb-2>
      <c-input-text
        v-model:value="prompt"
        :label="t('tools.ai-prompt-splitter.texts.label-full-prompt')"
        multiline
        :placeholder="t('tools.ai-prompt-splitter.texts.placeholder-put-your-full-prompt-here')"
        rows="10"
        :validation="promptValidation"
        mb-2
      />
      <n-form-item :label="t('tools.ai-prompt-splitter.texts.label-character-length-for-each-chunk')">
        <n-input-number v-model:value="splitLength" :min="1" />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.ai-prompt-splitter.texts.title-divided-prompts')">
      <div v-for="(splittedPrompt, index) in splittedPrompts" :key="index">
        <TextareaCopyable :value="splittedPrompt" />
      </div>
    </c-card>
  </div>
</template>
