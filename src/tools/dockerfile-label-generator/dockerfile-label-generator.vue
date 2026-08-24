<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
export interface OciGithubLabels {
  title: string;
  description: string;
  url: string;
  source: string;
  documentation: string;
  licenses: string;
  version: string;
  revision: string;
  created: number | null;
  authors: string;
}

const form = ref<OciGithubLabels>({
  title: '',
  description: '',
  url: '',
  source: '',
  documentation: '',
  licenses: '',
  version: '',
  revision: '',
  created: null,
  authors: '',
});

const dockerfileLabels = computed(() => {
  const f = form.value;

  const entries: [string, string][] = [
    ['org.opencontainers.image.title', f.title],
    ['org.opencontainers.image.description', f.description],
    ['org.opencontainers.image.url', f.url],
    ['org.opencontainers.image.source', f.source],
    ['org.opencontainers.image.documentation', f.documentation],
    ['org.opencontainers.image.licenses', f.licenses],
    ['org.opencontainers.image.version', f.version],
    ['org.opencontainers.image.revision', f.revision],
    ['org.opencontainers.image.created', f.created != null ? new Date(f.created).toISOString() : ''],
    ['org.opencontainers.image.authors', f.authors],
  ];

  const lines = entries
    .filter(([_, v]) => v.trim() !== '')
    .map(([k, v]) => `    ${k}="${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);

  if (lines.length === 0) {
    return '';
  }

  return `LABEL \\\n${lines.join(' \\\n')}`;
});
</script>

<template>
  <div>
    <n-form :model="form" label-placement="left" label-width="150px" size="large" mb-2>
      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-title')">
        <n-input v-model:value="form.title" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-my-project')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-description')">
        <n-input v-model:value="form.description" type="textarea" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-short-project-description')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-repository-url')">
        <n-input v-model:value="form.url" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-https-github-com-username-repo')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-source-url')">
        <n-input v-model:value="form.source" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-https-github-com-username-repo')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-documentation-url')">
        <n-input v-model:value="form.documentation" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-https-github-com-username-repo-readme')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-license-spdx')">
        <n-input v-model:value="form.licenses" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-mit')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-version')">
        <n-input v-model:value="form.version" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-1-0-0')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-revision-commit-sha')">
        <n-input v-model:value="form.revision" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-abcdef123456')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-created')">
        <n-date-picker v-model:value="form.created" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-2024-01-01t12-00-00z')" />
      </n-form-item>

      <n-form-item :label="t('tools.dockerfile-label-generator.texts.label-authors')">
        <n-input v-model:value="form.authors" :placeholder="t('tools.dockerfile-label-generator.texts.placeholder-your-name-you-example-com')" />
      </n-form-item>
    </n-form>

    <n-card :title="t('tools.dockerfile-label-generator.texts.title-generated-label-block')">
      <textarea-copyable :value="dockerfileLabels" />
    </n-card>
  </div>
</template>
