<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import libmime from 'libmime';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const encodedInput = useQueryParam({ tool: 'mime-conv', name: 'decode', defaultValue: '' });
const decodedOutput = computed(() => withDefaultOnError(() => libmime.decodeWords(encodedInput.value), '# invalid encoded value'));

const rawInput = useQueryParam({ tool: 'mime-conv', name: 'encode', defaultValue: '' });
const encodedQOutput = computed(() => withDefaultOnError(() => libmime.encodeWord(rawInput.value, 'Q'), ''));
const encodedBOutput = computed(() => withDefaultOnError(() => libmime.encodeWord(rawInput.value, 'B'), ''));
</script>

<template>
  <div>
    <c-card :title="t('tools.mime-converter.texts.title-encode-string-in-encoded-word-format')">
      <c-input-text
        v-model:value="rawInput"
        multiline
        :placeholder="t('tools.mime-converter.texts.placeholder-put-your-string-here')"
        rows="5"
        :label="t('tools.mime-converter.texts.label-string-to-encode')"
        raw-text
        mb-5
      />

      <div>
        <h3>{{ t('tools.mime-converter.texts.tag-quotted-printable-encoded-string') }}</h3>
        <TextareaCopyable
          :value="encodedQOutput"
          :placeholder="t('tools.mime-converter.texts.placeholder-the-quotted-printable-encoded-version-of-your-string-will-be-here')"
          mb-5
        />
      </div>

      <div>
        <h3>{{ t('tools.mime-converter.texts.tag-base64-encoded-string') }}</h3>
        <TextareaCopyable
          :value="encodedBOutput"
          :placeholder="t('tools.mime-converter.texts.placeholder-the-base64-encoded-version-of-your-string-will-be-here')"
          mb-5
        />
      </div>
    </c-card>

    <c-card :title="t('tools.mime-converter.texts.title-decode-string-in-encoded-word-format')">
      <c-input-text
        v-model:value="encodedInput"
        multiline
        :placeholder="t('tools.mime-converter.texts.placeholder-your-encoded-string')"
        rows="5"
        :label="t('tools.mime-converter.texts.label-encoded-string-to-decode')"
        mb-5
      />

      <div>
        <h3>{{ t('tools.mime-converter.texts.tag-decoded-string') }}</h3>
        <TextareaCopyable
          v-model:value="decodedOutput"
          :placeholder="t('tools.mime-converter.texts.placeholder-the-decoded-string-will-be-here')"
          mb-5
        />
      </div>
    </c-card>
  </div>
</template>
