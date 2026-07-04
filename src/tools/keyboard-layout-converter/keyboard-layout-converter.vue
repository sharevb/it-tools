<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ArrowRight } from '@vicons/tabler';
import layouts from '@langfreak/convert-layout';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

// Layout options with keyword names
const layoutOptions = [
  { label: t('tools.keyboard-layout-converter.texts.label-arabic-ar-arabic-keyboard'), value: 'ar' },
  { label: t('tools.keyboard-layout-converter.texts.label-belarusian-by-cyrillic-qwerty'), value: 'by' },
  { label: t('tools.keyboard-layout-converter.texts.label-colemak-colemak-colemak-layout'), value: 'colemak' },
  { label: t('tools.keyboard-layout-converter.texts.label-czech-cs-qwertz'), value: 'cs' },
  { label: t('tools.keyboard-layout-converter.texts.label-dvorak-dvorak-dvorak-layout'), value: 'dvorak' },
  { label: t('tools.keyboard-layout-converter.texts.label-english-en-qwerty'), value: 'en' },
  { label: t('tools.keyboard-layout-converter.texts.label-french-fr-azerty'), value: 'fr' },
  { label: t('tools.keyboard-layout-converter.texts.label-german-de-qwertz'), value: 'de' },
  { label: t('tools.keyboard-layout-converter.texts.label-greek-gr-greek-keyboard'), value: 'gr' },
  { label: t('tools.keyboard-layout-converter.texts.label-hebrew-he-hebrew-keyboard'), value: 'he' },
  { label: t('tools.keyboard-layout-converter.texts.label-italian-it-qwerty'), value: 'it' },
  { label: t('tools.keyboard-layout-converter.texts.label-kazakh-kk-cyrillic-qwerty'), value: 'kk' },
  { label: t('tools.keyboard-layout-converter.texts.label-korean-kr-hangul-keyboard'), value: 'kr' },
  { label: t('tools.keyboard-layout-converter.texts.label-persian-fa-persian-keyboard'), value: 'fa' },
  { label: t('tools.keyboard-layout-converter.texts.label-russian-ru-cyrillic-jcuken'), value: 'ru' },
  { label: t('tools.keyboard-layout-converter.texts.label-spanish-es-qwerty-spanish-iso'), value: 'es' },
  { label: t('tools.keyboard-layout-converter.texts.label-swedish-sv-qwerty-nordic'), value: 'sv' },
  { label: t('tools.keyboard-layout-converter.texts.label-turkish-tr-turkish-qwerty-q'), value: 'tr' },
  { label: t('tools.keyboard-layout-converter.texts.label-ukrainian-uk-cyrillic-jcuken'), value: 'uk' },
];

const inputText = useQueryParam({ tool: 'keyboard-layout-conv', name: 'input', defaultValue: '' });
const sourceLayout = useQueryParamOrStorage({ name: 'from', storageName: 'keyboard-layout-conv:f', defaultValue: 'fr' });
const targetLayout = useQueryParamOrStorage({ name: 'to', storageName: 'keyboard-layout-conv:t', defaultValue: 'en' });

const defaultEn = {
  fromEn: (s: string) => s,
  toEn: (s: string) => s,
};

// Full conversion: source → English → target
const outputText = computed(() => {
  const src = layouts[sourceLayout.value] || defaultEn;
  const tgt = layouts[targetLayout.value] || defaultEn;
  const asEnglish = src.toEn(inputText.value || '');
  return tgt.fromEn(asEnglish);
});
</script>

<template>
  <NCard :title="t('tools.keyboard-layout-converter.texts.title-keyboard-layout-converter')">
    <NSpace vertical size="large">
      <NSpace align="center" justify="center">
        <NSelect
          v-model:value="sourceLayout"
          :options="layoutOptions"
          label-field="label"
          value-field="value"
          :placeholder="t('tools.keyboard-layout-converter.texts.placeholder-source-layout')"
          style="min-width: 200px;"
        />
        <NIcon size="20">
          <ArrowRight />
        </NIcon>
        <NSelect
          v-model:value="targetLayout"
          :options="layoutOptions"
          label-field="label"
          value-field="value"
          :placeholder="t('tools.keyboard-layout-converter.texts.placeholder-target-layout')"
          style="min-width: 200px;"
        />
      </NSpace>

      <c-input-text
        v-model:value="inputText"
        :placeholder="t('tools.keyboard-layout-converter.texts.placeholder-type-here')"
        :label="t('tools.keyboard-layout-converter.texts.label-input-value')"
        multiline
      />

      <c-card :title="t('tools.keyboard-layout-converter.texts.title-converted-to-target-keyboard-layout')">
        <textarea-copyable
          :value="outputText"
          :placeholder="t('tools.keyboard-layout-converter.texts.placeholder-converted-output')"
          readonly
        />
      </c-card>
    </NSpace>
  </NCard>
</template>
