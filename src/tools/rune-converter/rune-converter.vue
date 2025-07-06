<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { elderFuthark, futhorc, medievalFuthork, youngerFuthark } from 'riimut';
import { lettersToRunes as stavelessFutharkLettersToRunes, runesToLetters as stavelessFutharkRunesToLetters } from 'staveless-futhark';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

type RuneType = 'YoungerFutharkLong' | 'YoungerFutharkShort' | 'ElderFuthark' | 'MedievalFuthork' | 'Futhorc' | 'StavelessFuthark';

function convertTextToRunes(text: string, type: RuneType) {
  if (type === 'YoungerFutharkLong') {
    return youngerFuthark.lettersToLongBranchRunes(text);
  }
  if (type === 'YoungerFutharkShort') {
    return youngerFuthark.lettersToShortTwigRunes(text);
  }
  if (type === 'ElderFuthark') {
    return elderFuthark.lettersToRunes(text);
  }
  if (type === 'MedievalFuthork') {
    return medievalFuthork.lettersToRunes(text);
  }
  if (type === 'Futhorc') {
    return futhorc.lettersToRunes(text);
  }
  if (type === 'StavelessFuthark') {
    return stavelessFutharkLettersToRunes(text);
  }
  return text;
}

function convertRunesToText(runes: string, type: RuneType) {
  if (type === 'YoungerFutharkLong') {
    return youngerFuthark.runesToLetters(runes);
  }
  if (type === 'YoungerFutharkShort') {
    return youngerFuthark.runesToLetters(runes);
  }
  if (type === 'ElderFuthark') {
    return elderFuthark.runesToLetters(runes);
  }
  if (type === 'MedievalFuthork') {
    return medievalFuthork.runesToLetters(runes);
  }
  if (type === 'Futhorc') {
    return futhorc.runesToLetters(runes);
  }
  if (type === 'StavelessFuthark') {
    return stavelessFutharkRunesToLetters(runes);
  }
  return runes;
}

const runeType = ref('YoungerFutharkLong');

const inputText = ref('');
const runesFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToRunes(inputText.value, runeType.value as RuneType));
const { copy: copyRunes } = useCopy({ source: runesFromText });

const inputRunes = ref('');
const textFromRunes = computed(() => inputRunes.value.trim() === '' ? '' : convertRunesToText(inputRunes.value, runeType.value as RuneType));
const { copy: copyText } = useCopy({ source: textFromRunes });
</script>

<template>
  <div max-w-600px>
    <c-select
      v-model:value="runeType"
      :label="t('tools.rune-converter.texts.label-rune-type')"
      label-position="left"
      :options="['YoungerFutharkLong', 'YoungerFutharkShort', 'ElderFuthark', 'MedievalFuthork', 'Futhorc', 'StavelessFuthark']"
      :placeholder="t('tools.rune-converter.texts.placeholder-rune-type')"
      mb-2
    />

    <c-card :title="t('tools.rune-converter.texts.title-text-to-runes')" mb-2>
      <c-input-text v-model:value="inputText" multiline :placeholder="t('tools.rune-converter.texts.placeholder-e-g-hello-avengers')" :label="t('tools.rune-converter.texts.label-enter-text-to-convert-to-runes')" autosize autofocus raw-text test-id="text-to-runes-input" />
      <c-input-text v-model:value="runesFromText" :label="t('tools.rune-converter.texts.label-runes-from-your-text')" multiline raw-text readonly mt-2 :placeholder="t('tools.rune-converter.texts.placeholder-the-runes-representation-of-your-text-will-be-here')" test-id="text-to-runes-output" />
      <div mt-2 flex justify-center>
        <c-button :disabled="!runesFromText" @click="copyRunes()">
          {{ t('tools.rune-converter.texts.tag-copy-runes-to-clipboard') }}
        </c-button>
      </div>
    </c-card>

    <c-card :title="t('tools.rune-converter.texts.title-runes-to-text')">
      <c-input-text v-model:value="inputRunes" multiline :placeholder="t('tools.rune-converter.texts.placeholder-input-runes')" :label="t('tools.rune-converter.texts.label-enter-runes-to-convert-to-text')" autosize raw-text test-id="runes-to-text-input" />
      <c-input-text v-model:value="textFromRunes" :label="t('tools.rune-converter.texts.label-text-from-your-runes')" multiline raw-text readonly mt-2 :placeholder="t('tools.rune-converter.texts.placeholder-the-text-representation-of-your-runes-will-be-here')" test-id="runes-to-text-output" />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromRunes" @click="copyText()">
          {{ t('tools.rune-converter.texts.tag-copy-text-to-clipboard') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
