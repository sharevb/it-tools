<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { mergeIcals } from './ical-merger.service';

const { t } = useI18n();

const fileInputs = ref<Array<File>>([]);
const mergedOutput = ref('');
const calendarName = ref('');
const calendarDescription = ref('');
const regenerateUids = ref(false);
const errors = ref('');

function onUploads(files: Array<File>) {
  fileInputs.value = [...fileInputs.value, ...files];
}
function deleteFile(index: number) {
  fileInputs.value.splice(index, 1);
}
async function mergeFiles() {
  const fileBuffers: Array<string> = [];
  for (const file of fileInputs.value) {
    fileBuffers.push(await readFileAsString(file));
  }
  errors.value = '';
  mergedOutput.value = '';
  try {
    mergedOutput.value = mergeIcals(fileBuffers, {
      calname: calendarName.value,
      caldesc: calendarDescription.value,
      regenerate_uids: regenerateUids.value,
    });
  }
  catch (e: any) {
    errors.value = e.toString();
  }
}

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
    <c-file-upload
      :title="t('tools.ical-merger.texts.title-drag-and-drop-ical-file-here-or-click-to-select-a-file')"
      multiple
      mb-2
      @files-upload="onUploads"
    />

    <n-form-item :label="t('tools.ical-merger.texts.label-title')" label-placement="left">
      <n-input v-model:value="calendarName" :placeholder="t('tools.ical-merger.texts.placeholder-please-input-merge-calendar-title')" />
    </n-form-item>

    <n-form-item :label="t('tools.ical-merger.texts.label-description')">
      <n-input v-model:value="calendarDescription" :placeholder="t('tools.ical-merger.texts.placeholder-please-input-merged-calendar-description')" />
    </n-form-item>

    <n-space justify="center">
      <n-checkbox v-model:checked="regenerateUids">
        {{ t('tools.ical-merger.text.regenerate-uids') }}
      </n-checkbox>
    </n-space>

    <ul>
      <li v-for="(file, index) in fileInputs" :key="index" mb-1>
        <n-button mr-2 @click="deleteFile(index)">
          {{ t('tools.ical-merger.texts.tag-delete') }}
        </n-button>
        {{ t('tools.ical-merger.texts.file-to-merge-file-name', [file.name]) }}
      </li>
    </ul>

    <div flex justify-center>
      <n-button @click="mergeFiles">
        {{ t('tools.ical-merger.texts.tag-merge-ical-files') }}
      </n-button>
    </div>

    <n-divider />

    <c-alert v-if="errors" mb-2>
      {{ errors }}
    </c-alert>

    <textarea-copyable
      v-if="mergedOutput"
      v-model:value="mergedOutput"
      download-file-name="merge.ics"
      :download-button-text="t('tools.ical-merger.texts.download-merged-ical')"
      :label="t('tools.ical-merger.texts.label-merged-ical')"
      mb-2
    />
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
