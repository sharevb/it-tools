<script setup lang="ts">
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
      <n-form-item label="Title:">
        <n-input v-model:value="form.title" placeholder="My Project" />
      </n-form-item>

      <n-form-item label="Description:">
        <n-input v-model:value="form.description" type="textarea" placeholder="Short project description" />
      </n-form-item>

      <n-form-item label="Repository URL:">
        <n-input v-model:value="form.url" placeholder="https://github.com/username/repo" />
      </n-form-item>

      <n-form-item label="Source URL:">
        <n-input v-model:value="form.source" placeholder="https://github.com/username/repo" />
      </n-form-item>

      <n-form-item label="Documentation URL:">
        <n-input v-model:value="form.documentation" placeholder="https://github.com/username/repo#readme" />
      </n-form-item>

      <n-form-item label="License (SPDX):">
        <n-input v-model:value="form.licenses" placeholder="MIT" />
      </n-form-item>

      <n-form-item label="Version:">
        <n-input v-model:value="form.version" placeholder="1.0.0" />
      </n-form-item>

      <n-form-item label="Revision (Commit SHA):">
        <n-input v-model:value="form.revision" placeholder="abcdef123456" />
      </n-form-item>

      <n-form-item label="Created:">
        <n-date-picker v-model:value="form.created" placeholder="2024-01-01T12:00:00Z" />
      </n-form-item>

      <n-form-item label="Authors:">
        <n-input v-model:value="form.authors" placeholder="Your Name <you@example.com>" />
      </n-form-item>
    </n-form>

    <n-card title="Generated LABEL block">
      <textarea-copyable :value="dockerfileLabels" />
    </n-card>
  </div>
</template>
