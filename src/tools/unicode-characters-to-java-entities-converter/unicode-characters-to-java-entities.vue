<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseJavaEntitiesToUnicode, parseUnicodeToJavaEntities } from './unicode-characters-to-java-entities.service';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const inputUnicode = ref('');
const entitiesFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : parseUnicodeToJavaEntities(inputUnicode.value));
const { copy: copyJavaEntities } = useCopy({ source: entitiesFromUnicode });

const inputJavaEntities = ref('');
const unicodeFromEntities = computed(() => inputJavaEntities.value.trim() === '' ? '' : parseJavaEntitiesToUnicode(inputJavaEntities.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromEntities });
</script>

<template>
  <c-card :title="t('tools.unicode-characters-to-java-entities-converter.texts.title-unicode-characters-to-java-entities')">
    <c-input-text v-model:value="inputUnicode" :placeholder="t('tools.unicode-characters-to-java-entities-converter.texts.placeholder-e-g-hello-avengers')" :label="t('tools.unicode-characters-to-java-entities-converter.texts.label-enter-unicode-characters-to-convert-to-java-entities')" autosize raw-text multiline autofocus test-id="unicode-to-entities-input" />
    <c-input-text v-model:value="entitiesFromUnicode" :label="t('tools.unicode-characters-to-java-entities-converter.texts.label-java-entities-from-your-text')" :placeholder="t('tools.unicode-characters-to-java-entities-converter.texts.placeholder-the-unicode-representation-of-your-text-will-be-here')" raw-text multiline readonly mt-2 test-id="unicode-to-entities-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!entitiesFromUnicode" @click="copyJavaEntities()">
        {{ t('tools.unicode-characters-to-java-entities-converter.texts.tag-copy-java-entities-to-clipboard') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.unicode-characters-to-java-entities-converter.texts.title-java-entities-to-unicode-characters')">
    <c-input-text v-model:value="inputJavaEntities" :placeholder="t('tools.unicode-characters-to-java-entities-converter.texts.placeholder-input-java-entities')" :label="t('tools.unicode-characters-to-java-entities-converter.texts.label-enter-java-entities-to-convert-to-unicode-characters')" autosize raw-text multiline test-id="entities-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromEntities" :label="t('tools.unicode-characters-to-java-entities-converter.texts.label-text-from-your-java-entities')" :placeholder="t('tools.unicode-characters-to-java-entities-converter.texts.placeholder-the-text-representation-of-your-unicode-will-be-here')" multiline raw-text readonly mt-2 test-id="entities-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromEntities" @click="copyUnicode()">
        {{ t('tools.unicode-characters-to-java-entities-converter.texts.tag-copy-unicode-to-clipboard') }}
      </c-button>
    </div>
  </c-card>
</template>
