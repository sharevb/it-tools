<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import * as fflate from 'fflate';
import { Base64 } from 'js-base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const compressedInput = ref('');
const decompressedOutput = computed(() => withDefaultOnError(() => {
  const compressedBuf = Base64.toUint8Array(compressedInput.value);
  return fflate.strFromU8(fflate.decompressSync(compressedBuf));
}, '# invalid compressed base64 string'));

const rawInput = ref('');
const compressedGzipOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.gzipSync(fflate.strToU8(rawInput.value))), ''));
const compressedDeflateOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.deflateSync(fflate.strToU8(rawInput.value))), ''));
const compressedZlibOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.zlibSync(fflate.strToU8(rawInput.value))), ''));
</script>

<template>
  <div>
    <c-card :title="t('tools.gzip-converter.texts.title-compress-string')" mb-5>
      <c-input-text
        v-model:value="rawInput"
        multiline
        :placeholder="t('tools.gzip-converter.texts.placeholder-put-your-string-here')"
        rows="5"
        :label="t('tools.gzip-converter.texts.label-string-to-compress')"
        raw-text
        mb-5
      />

      <div>
        <h3>{{ t('tools.gzip-converter.texts.tag-gzip-compressed-string') }}</h3>
        <TextareaCopyable
          :value="compressedGzipOutput"
          :word-wrap="true"
          multiline
          :placeholder="t('tools.gzip-converter.texts.placeholder-the-gzip-compressed-version-of-your-string-will-be-here')"
          mb-5
        />
      </div>

      <div>
        <h3>{{ t('tools.gzip-converter.texts.tag-zlib-compressed-string') }}</h3>
        <TextareaCopyable
          :value="compressedZlibOutput"
          :word-wrap="true"
          multiline
          :placeholder="t('tools.gzip-converter.texts.placeholder-the-zlib-compressed-version-of-your-string-will-be-here')"
          mb-5
        />
      </div>

      <div>
        <h3>{{ t('tools.gzip-converter.texts.tag-deflate-compressed-string') }}</h3>
        <TextareaCopyable
          :value="compressedDeflateOutput"
          :word-wrap="true"
          multiline
          :placeholder="t('tools.gzip-converter.texts.placeholder-the-deflate-compressed-version-of-your-string-will-be-here')"
          mb-5
        />
      </div>
    </c-card>

    <c-card :title="t('tools.gzip-converter.texts.title-decompress-string')">
      <c-input-text
        v-model:value="compressedInput"
        multiline
        :placeholder="t('tools.gzip-converter.texts.placeholder-your-compressed-string')"
        rows="5"
        :label="t('tools.gzip-converter.texts.label-compressed-string-to-decompress')"
        mb-5
      />

      <div>
        <h3>{{ t('tools.gzip-converter.texts.tag-decompressed-string') }}</h3>
        <TextareaCopyable
          v-model:value="decompressedOutput"
          :word-wrap="true"
          multiline
          :placeholder="t('tools.gzip-converter.texts.placeholder-the-decompressed-string-will-be-here')"
          mb-5
        />
      </div>
    </c-card>
  </div>
</template>
