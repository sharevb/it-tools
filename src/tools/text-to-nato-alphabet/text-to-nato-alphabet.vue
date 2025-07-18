<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import { allLanguagesAndCountries } from './text-to-nato-alphabet.constants';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const lang = useStorage('text-to-nato:lang', '(International)');
const input = ref('');
const useDigitsNames = useStorage('text-to-nato:digits', false);
const usePunctuationsNames = useStorage('text-to-nato:puncts', false);
const natoText = computed(() => textToNatoAlphabet({ text: input.value, langOrCountry: lang.value }));
const { copy } = useCopy({ source: natoText, text: t('tools.text-to-nato-alphabet.texts.text-nato-alphabet-string-copied') });
</script>

<template>
  <div>
    <c-select
      v-model:value="lang"
      :options="allLanguagesAndCountries"
      searchable
    />

    <div flex justify-center>
      <n-form-item :label="t('tools.text-to-nato-alphabet.texts.label-use-digits-pronunciation')">
        <n-checkbox v-model:checked="usePunctuationsNames" />
      </n-form-item>
      <n-form-item :label="t('tools.text-to-nato-alphabet.texts.label-use-punctuations-pronunciation')">
        <n-checkbox v-model:checked="useDigitsNames" />
      </n-form-item>
    </div>

    <c-input-text
      v-model:value="input"
      :label="t('tools.text-to-nato-alphabet.texts.label-your-text-to-convert-to-nato-phonetic-alphabet')"
      :placeholder="t('tools.text-to-nato-alphabet.texts.placeholder-put-your-text-here')"
      clearable
      mb-5
    />

    <div v-if="natoText">
      <div mb-2>
        Your text in NATO phonetic alphabet ({{ lang }})
      </div>
      <c-card>
        {{ natoText }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          {{ t('tools.text-to-nato-alphabet.texts.tag-copy-nato-string') }}
        </c-button>
      </div>
    </div>
  </div>
</template>
