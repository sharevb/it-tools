<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { types as extensionToMimeType, extensions as mimeTypeToExtension } from 'mime-types';

const { t } = useI18n();

const mimeInfos = Object.entries(mimeTypeToExtension).map(([mimeType, extensions]) => ({ mimeType, extensions }));

const mimeToExtensionsOptions = Object.keys(mimeTypeToExtension).map(label => ({ label, value: label }));
const selectedMimeType = ref(undefined);

const extensionsFound = computed(() => (selectedMimeType.value ? mimeTypeToExtension[selectedMimeType.value] : []));

const extensionToMimeTypeOptions = Object.keys(extensionToMimeType).map((label) => {
  const extension = `.${label}`;

  return { label: extension, value: label };
});
const selectedExtension = ref(undefined);

const mimeTypeFound = computed(() => (selectedExtension.value ? extensionToMimeType[selectedExtension.value] : []));
</script>

<template>
  <c-card>
    <n-h2 style="margin-bottom: 0">
      {{ t('tools.mime-types.texts.tag-mime-type-to-extension') }}
    </n-h2>
    <div style="opacity: 0.8">
      {{ t('tools.mime-types.texts.tag-know-which-file-extensions-are-associated-to-a-mime-type') }}
    </div>
    <c-select
      v-model:value="selectedMimeType"
      searchable
      my-4
      :options="mimeToExtensionsOptions"
      :placeholder="t('tools.mime-types.texts.placeholder-select-your-mimetype-here-ex-application-pdf')"
    />

    <div v-if="extensionsFound.length > 0">
      {{ t('tools.mime-types.texts.tag-extensions-of-files-with-the') }}<n-tag round :bordered="false">
        {{ selectedMimeType }}
      </n-tag>{{ t('tools.mime-types.texts.tag-mime-type') }}<div style="margin-top: 10px">
        <n-tag
          v-for="extension of extensionsFound"
          :key="extension"
          round
          :bordered="false"
          type="primary"
          style="margin-right: 10px"
        >
          .{{ extension }}
        </n-tag>
      </div>
    </div>
  </c-card>

  <c-card>
    <n-h2 style="margin-bottom: 0">
      {{ t('tools.mime-types.texts.tag-file-extension-to-mime-type') }}
    </n-h2>
    <div style="opacity: 0.8">
      {{ t('tools.mime-types.texts.tag-know-which-mime-type-is-associated-to-a-file-extension') }}
    </div>
    <c-select
      v-model:value="selectedExtension"
      searchable
      my-4
      :options="extensionToMimeTypeOptions"
      :placeholder="t('tools.mime-types.texts.placeholder-select-your-mimetype-here-ex-application-pdf')"
    />

    <div v-if="selectedExtension">
      {{ t('tools.mime-types.texts.tag-mime-type-associated-to-the-extension') }}<n-tag round :bordered="false">
        {{ selectedExtension }}
      </n-tag> file
      extension:
      <div style="margin-top: 10px">
        <n-tag round :bordered="false" type="primary" style="margin-right: 10px">
          {{ mimeTypeFound }}
        </n-tag>
      </div>
    </div>
  </c-card>

  <div>
    <n-table>
      <thead>
        <tr>
          <th>{{ t('tools.mime-types.texts.tag-mime-types') }}</th>
          <th>{{ t('tools.mime-types.texts.tag-extensions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ mimeType, extensions } of mimeInfos" :key="mimeType">
          <td>{{ mimeType }}</td>
          <td>
            <n-tag v-for="extension of extensions" :key="extension" round :bordered="false" style="margin-right: 10px">
              .{{ extension }}
            </n-tag>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
