<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useStorage } from '@vueuse/core';
import { getLines, pickLines } from './random-line-picker.models';

const { t } = useI18n();

const config = useStorage('random-line-picker:config', {
  input: '',
  count: 1,
  repeat: false,
  prefix: false,
});

const [pickedLines, refreshPickedLines] = computedRefreshable(() => pickLines(config.value));

const { copy } = useCopy({ source: pickedLines, text: t('tools.random-line-picker.texts.text-picked-lines-copied-to-clipboard') });

const maxCount = ref<number | undefined>(undefined);

watch([() => config.value.repeat, () => config.value.input], () => {
  maxCount.value = config.value.repeat ? undefined : getLines(config.value).length;

  if (!config.value.repeat && maxCount.value && config.value.count > maxCount.value) {
    config.value.count = maxCount.value;
  }
}, { immediate: true });
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="config.input" test-id="input" multiline :placeholder="t('tools.random-line-picker.texts.placeholder-put-your-text-here')" rows="10" />

      <n-space mt-5>
        <n-form-item :label="t('tools.random-line-picker.texts.label-number-of-lines-to-pick')" label-placement="left">
          <n-input-number-i18n v-model:value="config.count" data-test-id="count" min="1" :max="maxCount" size="small" />
        </n-form-item>

        <n-form-item :label="t('tools.random-line-picker.texts.label-allow-repeated-lines')" label-placement="left">
          <n-switch v-model:value="config.repeat" />
        </n-form-item>

        <n-form-item :label="t('tools.random-line-picker.texts.label-prefix-lines-with-line-number')" label-placement="left">
          <n-switch v-model:value="config.prefix" />
        </n-form-item>
      </n-space>
    </c-card>

    <c-card mt-5>
      <c-input-text
        v-model:value="pickedLines"
        test-id="output"
        multiline
        :placeholder="t('tools.random-line-picker.texts.placeholder-picked-lines')"
        readonly
        rows="3"
        autosize
        class="passphrase-display"
        word-wrap
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          {{ t('tools.random-line-picker.texts.tag-copy') }}
        </c-button>
        <c-button @click="refreshPickedLines">
          {{ t('tools.random-line-picker.texts.tag-refresh') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
