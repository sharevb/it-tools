<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { translate as t } from '@/plugins/i18n.plugin';

const props = defineProps<{
  value?: string | number | boolean | null;
  multiline?: boolean;
  rows?: number | string;
  autosize?: boolean;
  readonly?: boolean;
}>();
const emit = defineEmits(['update:value']);

const rawValue = useVModel(props, 'value', emit);
const value = computed({
  get: () => String(rawValue.value ?? ''),
  set: (newValue: string) => {
    rawValue.value = newValue;
  },
});
const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => (isJustCopied.value ? t('inputCopyable.copied') : t('inputCopyable.copy')));
</script>

<template>
  <c-input-text v-model:value="value" :multiline="multiline" :rows="rows" :autosize="autosize" :readonly="readonly">
    <template #suffix>
      <c-tooltip :tooltip="tooltipText">
        <c-button circle variant="text" size="small" @click="copy()">
          <icon-mdi-content-copy />
        </c-button>
      </c-tooltip>
    </template>
  </c-input-text>
</template>
