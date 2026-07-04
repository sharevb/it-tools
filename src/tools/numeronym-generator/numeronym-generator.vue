<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateNumeronym } from './numeronym-generator.service';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const word = useQueryParam({ tool: 'numeronym-gen', name: 'word', defaultValue: '' });

const numeronym = computed(() => generateNumeronym(word.value));
</script>

<template>
  <div flex flex-col items-center gap-4>
    <c-input-text v-model:value="word" :placeholder="t('tools.numeronym-generator.texts.placeholder-enter-a-word-e-g-internationalization')" size="large" clearable test-id="word-input" />

    <icon-mdi-arrow-down text-30px />

    <input-copyable :value="numeronym" size="large" readonly :placeholder="t('tools.numeronym-generator.texts.placeholder-your-numeronym-will-be-here-e-g-i18n')" test-id="numeronym" />
  </div>
</template>
