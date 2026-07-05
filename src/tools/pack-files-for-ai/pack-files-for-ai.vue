<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { UploadFileInfo } from 'naive-ui';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const files = ref<Array<UploadFileInfo>>([]);
const treeData = ref<Array<FileDesc>>([]);
const outputFormat = useQueryParamOrStorage({ name: 'fmt', storageName: 'pack-ai:f', defaultValue: 'markdown' });

const includePattern = useQueryParamOrStorage({ name: 'incl', storageName: 'pack-ai:i', defaultValue: '' });
const excludePattern = useQueryParamOrStorage({ name: 'excl', storageName: 'pack-ai:e', defaultValue: '' });

const fileSummary = useQueryParamOrStorage({ name: 'summary', storageName: 'pack-ai:s', defaultValue: true });
const directoryStructure = useQueryParamOrStorage({ name: 'dirstruct', storageName: 'pack-ai:d', defaultValue: true });

const lineNumbers = useQueryParamOrStorage({ name: 'linenums', storageName: 'pack-ai:l', defaultValue: false });
const removeEmptyLines = useQueryParamOrStorage({ name: 'empty', storageName: 'pack-ai:y', defaultValue: false });
const removeComments = useQueryParamOrStorage({ name: 'comments', storageName: 'pack-ai:c', defaultValue: false });

const showFiles = ref(false);

const output = ref('');

function handleFileUpload({ fileList }: { fileList: Array<UploadFileInfo> }) {
  files.value = fileList;
  treeData.value = buildTree(fileList);
}

interface FileDesc { label: string; key: string; chidren?: Array<FileDesc> | any };

function toTreeData(obj: { [s: string]: any }, path: string = ''): Array<FileDesc> {
  return Object.entries(obj).map(([key, value]) => ({
    label: key,
    key: path + key,
    children: value ? toTreeData(value, `${path + key}/`) : undefined,
  }));
}

function getFileName(file: UploadFileInfo) {
  return (file.fullPath || file.name).replace(/^[/\\]/g, '');
}

function buildTree(fileList: Array<UploadFileInfo>) {
  const tree: { [s: string]: any } = {};
  fileList.forEach((file) => {
    const parts = getFileName(file).split('/');
    let current = tree;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      current = current[part];
    });
  });

  return toTreeData(tree);
}

async function generateOutput() {
  const filteredFiles = files.value.filter((f) => {
    const name = getFileName(f);
    const include = includePattern.value ? new RegExp(includePattern.value).test(name) : true;
    const exclude = excludePattern.value ? new RegExp(excludePattern.value).test(name) : false;
    return include && !exclude;
  });

  if (outputFormat.value === 'xml') {
    output.value = await generateXML(filteredFiles);
  }
  else {
    output.value = await generateMarkdown(filteredFiles);
  }
}

async function prepareFileContent(file: UploadFileInfo) {
  const content = (await file.file?.text?.()) || '';
  return processSourceCode(
    content,
    file.name.split('.').slice(-1)[0] || 'txt',
    {
      numberLines: lineNumbers.value,
      removeEmptyLines: removeEmptyLines.value,
      removeComments: removeComments.value,
    });
}

async function generateXML(fileList: Array<UploadFileInfo>) {
  const summary = `
This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

<file_summary>{{ t('tools.pack-files-for-ai.texts.tag-this-section-contains-a-summary-of-this-file') }}<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>
`;

  const structure = `
<directory_structure>
${fileList.map(f => `  ${getFileName(f)}`).join('\n')}
</directory_structure>
`;

  const contents = `
<files>
This section contains the contents of the repository's files.

${(await Promise.all<string>(fileList.map(async f => `<file path="${getFileName(f)}">\n${(await prepareFileContent(f))}\n</file>`))).join('\n')}
</files>
`;

  return `${(fileSummary.value ? summary : '')}\n${(directoryStructure.value ? structure : '')}\n${contents}`.trim();
}

async function generateMarkdown(fileList: Array<UploadFileInfo>) {
  const summary = `
This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)
`;

  const structure = `
# Directory Structure
\`\`\`
${fileList.map(f => `- ${getFileName(f)}`).join('\n')}
\`\`\`
`;

  const contents = `
# Files

${(await Promise.all<string>(fileList.map(async f => `## File: ${getFileName(f)}\n\`\`\`\n${(await prepareFileContent(f))}\n\`\`\``))).join('\n')}
`;

  return `${(fileSummary.value ? summary : '')}\n${(directoryStructure.value ? structure : '')}\n${contents}`.trim();
}

interface ProcessOptions {
  numberLines?: boolean
  removeEmptyLines?: boolean
  removeComments?: boolean
}

function processSourceCode(
  content: string,
  extension: string,
  options: ProcessOptions = {},
): string {
  let lines = content.split(/\r?\n/);

  if (options.removeComments) {
    const ext = extension.replace(/^\./, '').toLowerCase();

    const commentPatterns: Record<string, RegExp[]> = {
      js: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      ts: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      java: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      cpp: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      c: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      cs: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm], // C#
      vb: [/('.*$)/gm, /(REM\s.*$)/gi], // VB.NET
      py: [/(#.*$)/gm],
      rb: [/(#.*$)/gm],
      php: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm, /(#.*$)/gm],
      swift: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      go: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      rs: [/(\/\/.*$)/gm, /(\/\*[\s\S]*?\*\/)/gm],
      sh: [/(#.*$)/gm],
    };

    const patterns = commentPatterns[ext];
    if (patterns) {
      for (const pattern of patterns) {
        content = content.replace(pattern, '');
      }
      lines = content.split(/\r?\n/);
    }
  }

  if (options.removeEmptyLines) {
    lines = lines.filter(line => line.trim() !== '');
  }

  if (options.numberLines) {
    lines = lines.map((line, idx) => `${idx + 1}: ${line}`);
  }

  return lines.join('\n');
}
</script>

<template>
  <n-card :title="t('tools.pack-files-for-ai.texts.title-repomix-like-ai-pack-generator')">
    <n-upload
      multiple
      directory-dnd
      mb-1
      :show-file-list="showFiles"
      @change="handleFileUpload"
    >
      <n-upload-dragger>
        <n-text style="font-size: 16px">
          {{ t('tools.pack-files-for-ai.texts.tag-click-or-drag-code-source-files-or-folder-to-this-area-to-add-to-package') }}
        </n-text>
      </n-upload-dragger>
    </n-upload>

    <n-space justify="center" mb-2>
      <n-checkbox v-model:checked="showFiles">
        {{ t('tools.pack-files-for-ai.texts.tag-show-uploaded-files') }}
      </n-checkbox>
    </n-space>

    <n-form-item :label="t('tools.pack-files-for-ai.texts.label-directory-structure')">
      <n-tree :data="treeData" block-line />
    </n-form-item>

    <n-form-item :label="t('tools.pack-files-for-ai.texts.label-include-files-regexp')" label-placement="left">
      <n-input v-model:value="includePattern" :placeholder="t('tools.pack-files-for-ai.texts.placeholder-include-pattern-regexp')" />
    </n-form-item>
    <n-form-item :label="t('tools.pack-files-for-ai.texts.label-exclude-files-regexp')" label-placement="left">
      <n-input v-model:value="excludePattern" :placeholder="t('tools.pack-files-for-ai.texts.placeholder-exclude-pattern-regexp')" style="margin-top: 8px;" />
    </n-form-item>

    <n-card :title="t('tools.pack-files-for-ai.texts.title-options')" mb-2>
      <n-space justify="space-evenly">
        <n-checkbox v-model:checked="fileSummary">
          {{ t('tools.pack-files-for-ai.texts.tag-include-file-summary') }}
        </n-checkbox>
        <n-checkbox v-model:checked="directoryStructure">
          {{ t('tools.pack-files-for-ai.texts.tag-include-directory-structure') }}
        </n-checkbox>
        <n-checkbox v-model:checked="lineNumbers">
          {{ t('tools.pack-files-for-ai.texts.tag-show-line-numbers') }}
        </n-checkbox>
        <n-checkbox v-model:checked="removeEmptyLines">
          {{ t('tools.pack-files-for-ai.texts.tag-remove-empty-lines') }}
        </n-checkbox>
        <n-checkbox v-model:checked="removeComments">
          {{ t('tools.pack-files-for-ai.texts.tag-remove-comments') }}
        </n-checkbox>
      </n-space>
    </n-card>

    <n-space justify="center">
      <n-form-item :label="t('tools.pack-files-for-ai.texts.label-output-format')" label-placement="left">
        <n-radio-group v-model:value="outputFormat">
          <n-radio-button :label="t('tools.pack-files-for-ai.texts.label-xml')" value="xml" />
          <n-radio-button :label="t('tools.pack-files-for-ai.texts.label-markdown')" value="markdown" />
        </n-radio-group>
      </n-form-item>
    </n-space>

    <n-space justify="center">
      <n-button mb-1 @click="generateOutput">
        Generate {{ outputFormat.toUpperCase() }}
      </n-button>
    </n-space>

    <textarea-copyable :label="t('tools.pack-files-for-ai.texts.label-output-preview')" download :download-file-name="`output.${(outputFormat === 'xml' ? '.xml' : '.md')}`" :value="output" :language="outputFormat" />
  </n-card>
</template>
