<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const options = useLocalStorage<{ label: string; value: string }[]>('gitignore-gen:opts', []);
const selected = ref<string[]>([]);
const output = ref<string>('');
const error = ref<string>('');
const loading = ref(false);

// Timestamp cache to allow refresh after X hours
const lastFetched = useLocalStorage<number>('gitignore-gen:ts', 0);
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

async function loadOptions() {
  const now = Date.now();
  const isStale = !options.value.length || (now - lastFetched.value > CACHE_TTL);

  if (!isStale) {
    // Use cached options
    return;
  }

  try {
    const res = await fetch('https://api.github.com/repos/github/gitignore/git/trees/main?recursive=true');
    const files = await res.json();
    options.value = files.tree
      .filter((f: any) => f.path.endsWith('.gitignore'))
      .map((f: any) => f.path.replace('.gitignore', ''))
      .filter(Boolean)
      .map((name: string) => ({
        label: name,
        value: name,
      }));
    lastFetched.value = now;
  }
  catch {
    if (!options.value?.length) {
      options.value = [
        'C++',
        'CMake',
        'Dotnet',
        'Node',
        'Java',
        'Swift',
        'Symfony',
        'Python',
        'VisualStudio',
        'WordPress',
      ].map(name => ({
        label: name,
        value: name,
      }));
    }
  }
}

async function generateGitignore() {
  if (!selected.value.length) {
    return;
  }

  error.value = '';
  loading.value = true;
  try {
    let gitignores = '';
    for (const lang of selected.value) {
      const url = `https://raw.githubusercontent.com/github/gitignore/main/${lang}.gitignore`;
      const res = await fetch(url);
      const text = await res.text();
      gitignores += `${gitignores ? '\n\n' : ''}# === .gitignore for ${lang} (${url}) ===\n\n${text}`;
    }
    output.value = gitignores;
  }
  catch (err: any) {
    error.value = err.toString();
  }
  finally {
    loading.value = false;
  }
}

onMounted(loadOptions);
</script>

<template>
  <div>
    <NSelect
      v-model:value="selected"
      :options="options"
      multiple
      filterable
      :placeholder="t('tools.gitignore-generator.texts.placeholder-select-templates-e-g-node-python-vue')"
      style="width: 100%;"
      :disable="!options"
    />

    <n-space justify="center">
      <NButton
        type="primary"
        style="margin-top: 12px;"
        :loading="loading"
        :disable="!options"
        @click="generateGitignore"
      >
        {{ t('tools.gitignore-generator.texts.tag-generate') }}
      </NButton>
    </n-space>

    <c-card v-if="output" :title="t('tools.gitignore-generator.texts.title-gitignore')" mt-2>
      <textarea-copyable :value="output" language="bash" download-file-name=".gitignore" />
    </c-card>
  </div>
</template>
