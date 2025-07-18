<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { withDefaultOnError } from '../../utils/defaults';
import {
  getTocMarkdown,
} from './markdown-toc-generator.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const markdown = ref(`# Some main title

[TOC]

## First Title

Some text 

## Second  Spaced  Title

Some text

### Title with Link [TOC](http://sharevb-it-tools.vercel.app)

\`\`\`
## some bash code
echo 'test';
\`\`\`

### Title with code \`var\`

Some text

## Last Title`);
const generateAnchors = useQueryParamOrStorage({ name: 'anchors', storageName: 'md-toc-gen:anchors', defaultValue: true });
const indentChars = useQueryParamOrStorage({ name: 'bullets', storageName: 'md-toc-gen:bullets', defaultValue: '-*+' });
const indentSpaces = ref(3);
const maxLevel = useQueryParamOrStorage({ name: 'max', storageName: 'md-toc-gen:max', defaultValue: -1 });
const anchorPrefix = useQueryParamOrStorage({ name: 'prefix', storageName: 'md-toc-gen:prefix', defaultValue: '' });
const concatSpaces = useQueryParamOrStorage({ name: 'concat', storageName: 'md-toc-gen:concat', defaultValue: false });
const commentStyle = useQueryParamOrStorage({ name: 'comment', storageName: 'md-toc-gen:comment', defaultValue: 'html' });

const markdownWithTOC = computed(() => withDefaultOnError(() => {
  return getTocMarkdown({
    markdown: markdown.value,
    anchorPrefix: anchorPrefix.value,
    commentStyle: commentStyle.value as ('html' | 'liquid'),
    concatSpaces: concatSpaces.value,
    generateAnchors: generateAnchors.value,
    indentChars: indentChars.value,
    indentSpaces: indentSpaces.value,
    maxLevel: maxLevel.value,
  });
}, ''));
</script>

<template>
  <div>
    <c-card :title="t('tools.markdown-toc-generator.texts.title-options')" mb-2>
      <n-space>
        <n-form-item label-placement="left">
          <n-checkbox v-model:checked="generateAnchors">
            {{ t('tools.markdown-toc-generator.texts.tag-generate-anchors') }}
          </n-checkbox>
        </n-form-item>
        <n-form-item :label="t('tools.markdown-toc-generator.texts.label-max-heading-level')" label-placement="left">
          <n-input-number
            v-model:value="maxLevel"
            :placeholder="t('tools.markdown-toc-generator.texts.placeholder-max-heading-level')"
            :max="6" :min="-1"
          />
        </n-form-item>
      </n-space>

      <details>
        <summary>{{ t('tools.markdown-toc-generator.texts.tag-advanced') }}</summary>
        <n-space>
          <n-form-item label-placement="left">
            <n-checkbox v-model:checked="concatSpaces">
              {{ t('tools.markdown-toc-generator.texts.tag-concat-spaces') }}
            </n-checkbox>
          </n-form-item>
          <c-input-text
            v-model:value="indentChars"
            :label="t('tools.markdown-toc-generator.texts.label-bullet-chars')"
            label-position="left"
            :placeholder="t('tools.markdown-toc-generator.texts.placeholder-bullet-chars')"
          />
          <c-input-text
            v-model:value="anchorPrefix"
            :label="t('tools.markdown-toc-generator.texts.label-anchors-prefix')"
            label-position="left"
            :placeholder="t('tools.markdown-toc-generator.texts.placeholder-anchors-prefix')"
          />
          <n-form-item :label="t('tools.markdown-toc-generator.texts.label-indents')" label-placement="left">
            <n-input-number
              v-model:value="indentSpaces"
              :placeholder="t('tools.markdown-toc-generator.texts.placeholder-indents')"
              :max="10" :min="1"
            />
          </n-form-item>
          <c-select
            v-model:value="commentStyle"
            :label="t('tools.markdown-toc-generator.texts.label-comment-styles')"
            label-position="left"
            :options="['html', 'liquid']"
            :placeholder="t('tools.markdown-toc-generator.texts.placeholder-comment-styles')"
          />
        </n-space>
      </details>
    </c-card>

    <c-card :title="t('tools.markdown-toc-generator.texts.title-input-markdown')" mb-2>
      <n-p>{{ t('tools.markdown-toc-generator.texts.tag-you-can-paste-a-document-with-existing-toc-generated-by-this-tool-or-add-a') }}<code>[TOC]</code>{{ t('tools.markdown-toc-generator.texts.tag-marker-in-your-document-on-a-single-line') }}</n-p>
      <c-input-text
        v-model:value="markdown"
        :placeholder="t('tools.markdown-toc-generator.texts.placeholder-put-your-markdown-here')"
        multiline
        rows="8"
      />
    </c-card>

    <c-card :title="t('tools.markdown-toc-generator.texts.title-output-markdown-with-toc')" mb-2>
      <textarea-copyable
        language="markdown"
        :value="markdownWithTOC"
      />
    </c-card>
  </div>
</template>
