<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import {
  type MarkdownTableAlignment,
  createMarkdownTable,
  generateMarkdownTable,
  pasteMarkdownTable,
} from './markdown-table-generator.service';
import { subscribe } from '@github/paste-markdown';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const table = ref(createMarkdownTable());
const alignmentOptions: { label: string; value: MarkdownTableAlignment }[] = [
  { label: t('tools.markdown-table-generator.texts.label-left'), value: 'left' },
  { label: t('tools.markdown-table-generator.texts.label-center'), value: 'center' },
  { label: t('tools.markdown-table-generator.texts.label-right'), value: 'right' },
];
const inputMarkdown = ref('');
const error = ref('');
const inputElement = ref<typeof CInputText>();
// Subscribe the behavior to the textarea.
onMounted(() => {
  subscribe(inputElement.value?.textareaRef as never);
});
const output = computed(() => generateMarkdownTable(table.value));

function addColumn() {
  const columnNumber = table.value.headers.length + 1;
  table.value.headers.push(`Column ${columnNumber}`);
  table.value.alignments.push('left');
  table.value.rows.forEach((row) => row.push(''));
}

function removeColumn(index: number) {
  if (table.value.headers.length <= 1) {
    return;
  }

  table.value.headers.splice(index, 1);
  table.value.alignments.splice(index, 1);
  table.value.rows.forEach((row) => row.splice(index, 1));
}

function addRow() {
  table.value.rows.push(Array.from({ length: table.value.headers.length }, () => ''));
}

function removeRow(index: number) {
  if (table.value.rows.length <= 1) {
    return;
  }

  table.value.rows.splice(index, 1);
}

function onPasteMarkdownTable(markdownContent: string) {
  error.value = '';
  try {
    return pasteMarkdownTable(markdownContent);
  } catch (e: any) {
    error.value = e.toString();
    return createMarkdownTable();
  }
}
</script>

<template>
  <div>
    <c-card>
      <c-input-text
        v-model:value="inputMarkdown"
        :label="t('tools.markdown-table-generator.texts.label-paste-clipboard-table-data-here')"
        :placeholder="t('tools.markdown-table-generator.texts.placeholder-paste-your-table-to-edit')"
        ref="inputElement"
        multiline
        rows="5"
        mb-1
      />
      <n-space justify="center" mb-2>
        <c-button @click="table = onPasteMarkdownTable(inputMarkdown) || createMarkdownTable()"
          >{{ t('tools.markdown-table-generator.texts.tag-import-table-data') }}</c-button>
      </n-space>

      <c-alert v-if="error" type="error" mb-2>
        {{ error }}
      </c-alert>

      <div mb-4 flex flex-wrap items-center gap-2>
        <c-button @click="addRow">{{ t('tools.markdown-table-generator.texts.tag-add-row') }}</c-button>
        <c-button @click="addColumn">{{ t('tools.markdown-table-generator.texts.tag-add-column') }}</c-button>
      </div>

      <n-scrollbar x-scrollable>
        <n-table :bordered="false" :single-line="false" min-w-700px>
          <thead>
            <tr>
              <th v-for="(_, columnIndex) of table.headers" :key="columnIndex" scope="col" min-w-170px>
                <div flex flex-col gap-2>
                  <c-input-text
                    v-model:value="table.headers[columnIndex]"
                    raw-text
                    :placeholder="`Column ${columnIndex + 1}`"
                    :test-id="`header-${columnIndex}`"
                  />
                  <div flex items-center gap-2>
                    <c-select
                      v-model:value="table.alignments[columnIndex]"
                      :options="alignmentOptions"
                      size="small"
                      flex-1
                    />
                    <c-button
                      circle
                      size="small"
                      variant="text"
                      :disabled="table.headers.length <= 1"
                      @click="removeColumn(columnIndex)"
                    >
                      <icon-mdi-delete-outline />
                    </c-button>
                  </div>
                </div>
              </th>
              <th scope="col" w-45px />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) of table.rows" :key="rowIndex">
              <td v-for="(_, columnIndex) of table.headers" :key="columnIndex">
                <c-input-text
                  v-model:value="row[columnIndex]"
                  raw-text
                  multiline
                  rows="2"
                  :placeholder="`Row ${rowIndex + 1}, column ${columnIndex + 1}`"
                  :test-id="`cell-${rowIndex}-${columnIndex}`"
                />
              </td>
              <td text-center>
                <c-button
                  circle
                  size="small"
                  variant="text"
                  :disabled="table.rows.length <= 1"
                  @click="removeRow(rowIndex)"
                >
                  <icon-mdi-delete-outline />
                </c-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-scrollbar>
    </c-card>

    <n-divider />

    <n-form-item :label="t('tools.markdown-table-generator.texts.label-generated-markdown-table')">
      <TextareaCopyable :value="output" language="markdown" copy-placement="outside" />
    </n-form-item>
  </div>
</template>
