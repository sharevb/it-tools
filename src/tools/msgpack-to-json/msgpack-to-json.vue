<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import { unpack } from 'msgpackr';
import hexArray from 'hex-array';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('file');
const fileInput = ref() as Ref<File | null>;
const hexInput = ref('');

const error = ref('');

const results = computedAsync(async () => {
  error.value = '';
  try {
    if (inputType.value === 'file') {
      const file = fileInput.value;
      if (file == null) {
        return null;
      }
      return unpack(Buffer.from(await file.arrayBuffer()));
    }
    else {
      return unpack(hexArray.fromString(hexInput.value));
    }
  }
  catch (e: any) {
    error.value = e.toString();
    return [];
  }
});
const resultsJson = computed(() => JSON.stringify(results.value || [], (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div>
    <c-card :title="t('tools.msgpack-to-json.texts.title-input-message-pack-file-or-content')" mb-2>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            :label="t('tools.msgpack-to-json.texts.label-file')"
          />
          <n-radio
            value="content"
            :label="t('tools.msgpack-to-json.texts.label-hex-content')"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        :title="t('tools.msgpack-to-json.texts.title-drag-and-drop-msgpack-file-here-or-click-to-select-a-file')"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="hexInput"
        :label="t('tools.msgpack-to-json.texts.label-hex-content')"
        multiline
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card :title="t('tools.msgpack-to-json.texts.title-json-content')">
      <CodeBlockCopyable :value="resultsJson" language="json" :download-file-name="`${fileInput?.name}.json`" />
    </c-card>
  </div>
</template>
