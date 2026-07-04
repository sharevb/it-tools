<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { evaluate } from 'mathjs';

import { withDefaultOnError } from '@/utils/defaults';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const expression = useQueryParam({ tool: 'math-eval', name: 'expr', defaultValue: '' });

const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? '', ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="expression"
      rows="1"
      multiline
      :placeholder="t('tools.math-evaluator.texts.placeholder-your-math-expression-ex-2-sqrt-6')"
      raw-text
      monospace
      autofocus
      autosize
    />

    <c-card v-if="result !== ''" :title="t('tools.math-evaluator.texts.title-result')" mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
