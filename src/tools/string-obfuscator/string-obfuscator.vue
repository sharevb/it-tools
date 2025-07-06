<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useObfuscateString } from './string-obfuscator.model';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const str = ref('Lorem ipsum dolor sit amet');
const keepFirst = ref(4);
const keepLast = ref(4);
const keepSpace = ref(true);

const obfuscatedString = useObfuscateString(str, { keepFirst, keepLast, keepSpace });
const { copy } = useCopy({ source: obfuscatedString });
</script>

<template>
  <div>
    <c-input-text v-model:value="str" raw-text :placeholder="t('tools.string-obfuscator.texts.placeholder-enter-string-to-obfuscate')" :label="t('tools.string-obfuscator.texts.label-string-to-obfuscate')" clearable multiline />

    <div mt-4 flex gap-10px>
      <div>
        <div>{{ t('tools.string-obfuscator.texts.tag-keep-first') }}</div>
        <n-input-number v-model:value="keepFirst" min="0" />
      </div>

      <div>
        <div>{{ t('tools.string-obfuscator.texts.tag-keep-last') }}</div>
        <n-input-number v-model:value="keepLast" min="0" />
      </div>

      <div>
        <div mb-5px>
          {{ t('tools.string-obfuscator.texts.tag-keep-nbsp-spaces') }}
        </div>
        <n-switch v-model:value="keepSpace" />
      </div>
    </div>

    <c-card v-if="obfuscatedString" mt-60px flex items-center gap-5px font-mono>
      <div break-anywhere text-wrap>
        {{ obfuscatedString }}
      </div>

      <c-button @click="copy()">
        <icon-mdi:content-copy />
      </c-button>
    </c-card>
  </div>
</template>
