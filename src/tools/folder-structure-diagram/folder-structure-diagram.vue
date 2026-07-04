<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import convertTreeToStructure from './lib/convert-tree-to-structure';
import { generateTree } from './lib/generate-tree';
import { parseInput } from './lib/parse-input';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const inputStructureTemplate = `my-app
  src
    index.html
    main.ts
   main.scss
  build
    main.js
    main.css
  - test
    -   index.html
    -main.js
    - 
    ...
      ...

  
  README.md
empty dir`;
const inputStructure = ref(inputStructureTemplate);

const outputTree = computed(() => withDefaultOnError(() => generateTree(parseInput(inputStructure.value)), ''));

const inputTree = ref(generateTree(parseInput(inputStructureTemplate)));

const outputStructure = computed(() => withDefaultOnError(() => convertTreeToStructure((inputTree.value)), ''));

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div class="min-h-0 flex flex-row gap-8" style="margin: 0 auto; max-width: 2200px; flex: 1 !important;">
    <div class="min-w-0 flex-1">
      <c-card :title="t('tools.folder-structure-diagram.texts.title-indented-structure-folder-tree')">
        <c-monaco-editor
          v-model:value="inputStructure"
          theme="vs-dark"
          height="400px"
          :placeholder="t('tools.folder-structure-diagram.texts.placeholder-paste-your-indented-structure-here')"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </c-card>

      <n-divider />

      <TextareaCopyable :value="outputTree" :scrollable="true" />
    </div>
    <div class="min-w-0 flex-1">
      <c-card :title="t('tools.folder-structure-diagram.texts.title-folder-tree-indented-structure')">
        <c-monaco-editor
          v-model:value="inputTree"
          theme="vs-dark"
          height="400px"
          :placeholder="t('tools.folder-structure-diagram.texts.placeholder-paste-your-folder-tree-here')"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </c-card>

      <n-divider />

      <TextareaCopyable :value="outputStructure" :scrollable="true" />
    </div>
  </div>
</template>
