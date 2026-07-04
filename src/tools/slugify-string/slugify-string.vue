<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const input = useQueryParam({ tool: 'slugify', name: 'text', defaultValue: '' });
const separator = useQueryParamOrStorage({ name: 'sep', storageName: 'slugify:sep', defaultValue: '-' });
const slug = computed(() => withDefaultOnError(() => slugify(input.value, {
  separator: separator.value,
}), ''));
const { copy } = useCopy({ source: slug, text: t('tools.slugify-string.texts.text-slug-copied-to-clipboard') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input" multiline
      :placeholder="t('tools.slugify-string.texts.placeholder-put-your-string-here-ex-my-file-path')"
      :label="t('tools.slugify-string.texts.label-your-string-to-slugify')" autofocus raw-text mb-2
    />

    <c-input-text
      v-model:value="separator"
      :placeholder="t('tools.slugify-string.texts.placeholder-put-separator-char-here')"
      :label="t('tools.slugify-string.texts.label-separator-character')" raw-text mb-5
    />

    <c-input-text
      :value="slug" multiline readonly
      :placeholder="t('tools.slugify-string.texts.placeholder-you-slug-will-be-generated-here-ex-my-file-path')"
      :label="t('tools.slugify-string.texts.label-your-slug')" mb-5
    />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        {{ t('tools.slugify-string.texts.tag-copy-slug') }}
      </c-button>
    </div>
  </div>
</template>
