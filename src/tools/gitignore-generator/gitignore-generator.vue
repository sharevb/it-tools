<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  type GitTemplatesSnapshot,
  type GitTemplatesSource,
  loadTemplate,
  loadTemplateNames,
  snapshotDay,
} from './git-templates';
import { isOfflineMode } from '@/tools-settings';

const { t } = useI18n();

const options = useLocalStorage<{ label: string; value: string }[]>('gitignore-gen:opts', []);
const selected = ref<string[]>([]);
const output = ref<string>('');
const error = ref<string>('');
const loading = ref(false);

// Timestamp cache to allow refresh after X hours
const lastFetched = useLocalStorage<number>('gitignore-gen:ts', 0);
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

// Commit date of the bundled snapshot, shown when templates come from it (offline mode or GitHub unreachable)
const snapshotDate = ref('');

const source: GitTemplatesSource = {
  repository: 'github/gitignore',
  ref: 'main',
  extension: '.gitignore',
  loadSnapshot: () => import('./gitignore-templates.json').then((m) => m.default as GitTemplatesSnapshot),
};

async function loadOptions() {
  const now = Date.now();
  const isStale = !options.value.length || now - lastFetched.value > CACHE_TTL;

  if (!isStale && !isOfflineMode) {
    // Use cached options
    return;
  }

  const { names, snapshot } = await loadTemplateNames(source, { offline: isOfflineMode });
  options.value = names.map((name: string) => ({
    label: name,
    value: name,
  }));
  if (snapshot) {
    snapshotDate.value = snapshotDay(snapshot);
  } else {
    lastFetched.value = now;
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
      const { content, url, snapshot } = await loadTemplate(source, lang, { offline: isOfflineMode });
      if (snapshot) {
        snapshotDate.value = snapshotDay(snapshot);
      }
      gitignores += `${gitignores ? '\n\n' : ''}# === .gitignore for ${lang} (${url}) ===\n\n${content}`;
    }
    output.value = gitignores;
  } catch (err: any) {
    error.value = err.toString();
  } finally {
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
      style="width: 100%"
      :disable="!options"
    />
    <n-p v-if="snapshotDate" mt-1 op-70>
      {{ t('tools.gitignore-generator.texts.snapshot-used', [snapshotDate]) }}
    </n-p>

    <n-space justify="center">
      <NButton
        type="primary"
        style="margin-top: 12px"
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
