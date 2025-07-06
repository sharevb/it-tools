<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { compareSync, hashSync } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value || 10));
const { copy } = useCopy({ source: hashed, text: t('tools.bcrypt.texts.text-hashed-string-copied-to-the-clipboard') });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<template>
  <c-card :title="t('tools.bcrypt.texts.title-hash')">
    <c-input-text
      v-model:value="input"
      :placeholder="t('tools.bcrypt.texts.placeholder-your-string-to-bcrypt')"
      raw-text
      :label="t('tools.bcrypt.texts.label-your-string')"
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item :label="t('tools.bcrypt.texts.label-salt-count')" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" :placeholder="t('tools.bcrypt.texts.placeholder-salt-rounds')" :max="100" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        {{ t('tools.bcrypt.texts.tag-copy-hash') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.bcrypt.texts.title-compare-string-with-hash')">
    <n-form label-width="120">
      <n-form-item :label="t('tools.bcrypt.texts.label-your-string')" label-placement="left">
        <c-input-text v-model:value="compareString" :placeholder="t('tools.bcrypt.texts.placeholder-your-string-to-compare')" raw-text />
      </n-form-item>
      <n-form-item :label="t('tools.bcrypt.texts.label-your-hash')" label-placement="left">
        <c-input-text v-model:value="compareHash" :placeholder="t('tools.bcrypt.texts.placeholder-your-hash-to-compare')" raw-text />
      </n-form-item>
      <n-form-item :label="t('tools.bcrypt.texts.label-do-they-match')" label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? 'Yes' : 'No' }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
