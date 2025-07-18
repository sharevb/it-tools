<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toASCII, toUnicode } from 'punycode/';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const punycodeInput = ref('');
const intlOutput = computed(
  () => {
    try {
      return toUnicode(punycodeInput.value?.trim());
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const intlInput = ref('');
const punycodeOutput = computed(
  () => {
    try {
      return toASCII(intlInput.value?.trim());
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card :title="t('tools.punycode-converter.texts.title-punycode-to-international')">
      <c-input-text
        v-model:value="punycodeInput"
        :placeholder="t('tools.punycode-converter.texts.placeholder-put-your-punycode-domain-name-or-email-to-decode')"
        :label="t('tools.punycode-converter.texts.label-punycode-domain-name-email')"
        raw-text
      />

      <n-divider />

      <TextareaCopyable
        :label="t('tools.punycode-converter.texts.label-decoded-domain-name-email')"
        :value="intlOutput"
        readonly
      />
    </c-card>

    <c-card :title="t('tools.punycode-converter.texts.title-international-to-punycode')" mt-5>
      <c-input-text
        v-model:value="intlInput"
        :placeholder="t('tools.punycode-converter.texts.placeholder-put-your-international-domain-or-email-name-here')"
        :label="t('tools.punycode-converter.texts.label-domain-name-or-email-to-encode')"
        raw-text
      />

      <n-divider />

      <TextareaCopyable
        :label="t('tools.punycode-converter.texts.label-punycode-domain-name-email')"
        :value="punycodeOutput"
        readonly
      />
    </c-card>
  </div>
</template>
