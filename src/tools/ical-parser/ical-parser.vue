<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import ICAL from 'ical.js';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('file');
const icalContent = ref('');
const fileInput = ref() as Ref<File | null>;
const icalInfosRaw = computedAsync(async () => {
  const file = fileInput.value;
  const content = icalContent.value;
  try {
    if (inputType.value === 'file' && file) {
      const jcal = ICAL.parse(await readFileAsString(file));
      return new ICAL.Component(jcal);
    }
    else {
      const jcal = ICAL.parse(content);
      return new ICAL.Component(jcal);
    }
  }
  catch (e: any) {
    return {
      error: e.toString(),
    };
  }
});

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

watch(icalContent, (_, newValue) => {
  if (newValue !== '') {
    fileInput.value = null;
  }
});

function readFileAsString(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result as string || '');
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}
</script>

<template>
  <div>
    <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="file"
          :label="t('tools.ical-parser.texts.label-file')"
        />
        <n-radio
          value="content"
          :label="t('tools.ical-parser.texts.label-content')"
        />
      </n-space>
    </n-radio-group>

    <c-file-upload
      v-if="inputType === 'file'"
      :title="t('tools.ical-parser.texts.title-drag-and-drop-ical-file-here-or-click-to-select-a-file')"
      @file-upload="onUpload"
    />

    <c-input-text
      v-if="inputType === 'content'"
      v-model:value="icalContent"
      :label="t('tools.ical-parser.texts.label-ical-content')"
      :placeholder="t('tools.ical-parser.texts.placeholder-paste-your-ical-content-here')"
      multiline
      mb-2
    />

    <n-divider />

    <textarea-copyable
      :label="t('tools.ical-parser.texts.label-parsed-ical')"
      mb-2
      :value="JSON.stringify(icalInfosRaw, null, 2)"
    />
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
