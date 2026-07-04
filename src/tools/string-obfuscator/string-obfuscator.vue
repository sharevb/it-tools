<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useObfuscateString } from './string-obfuscator.model';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const str = useQueryParam({ tool: 'string-obfuscator', name: 'text', defaultValue: 'Lorem ipsum dolor sit amet' });
const keepFirst = useQueryParam({ tool: 'string-obfuscator', name: 'first', defaultValue: 4 });
const keepLast = useQueryParam({ tool: 'string-obfuscator', name: 'last', defaultValue: 4 });
const keepSpace = useQueryParam({ tool: 'string-obfuscator', name: 'space', defaultValue: true });

const obfuscatedString = useObfuscateString(str, { keepFirst, keepLast, keepSpace });
const { copy } = useCopy({ source: obfuscatedString });
</script>

<template>
  <div>
    <c-input-text v-model:value="str" raw-text :placeholder="t('tools.string-obfuscator.texts.placeholder-enter-string-to-obfuscate')" :label="t('tools.string-obfuscator.texts.label-string-to-obfuscate')" clearable multiline />

    <div mt-4 flex gap-10px>
      <div>
        <div>{{ t('tools.string-obfuscator.texts.tag-keep-first') }}</div>
        <n-input-number-i18n v-model:value="keepFirst" min="0" />
      </div>

      <div>
        <div>{{ t('tools.string-obfuscator.texts.tag-keep-last') }}</div>
        <n-input-number-i18n v-model:value="keepLast" min="0" />
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
