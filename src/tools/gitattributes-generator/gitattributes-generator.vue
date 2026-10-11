<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import {
  type GitTemplatesSnapshot,
  type GitTemplatesSource,
  loadTemplate,
  loadTemplateNames,
  snapshotDay,
} from '../gitignore-generator/git-templates';
import { isOfflineMode } from '@/tools-settings';

const { t } = useI18n();

const options = useLocalStorage<{ label: string; value: string }[]>('gitattr-gen:opts2', []);
const selected = ref<string[]>([]);
const output = ref<string>('');
// Where each template in `output` came from: the live branch, or the snapshot commit when the snapshot was used
const outputUrls = ref<string[]>([]);

// Timestamp cache to allow refresh after X hours
const lastFetched = useLocalStorage<number>('gitattr-gen:ts', 0);
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

// Commit date of the bundled snapshot, shown when templates come from it (offline mode or GitHub unreachable)
const snapshotDate = ref('');

const source: GitTemplatesSource = {
  repository: 'alexkaratarakis/gitattributes',
  ref: 'master',
  extension: '.gitattributes',
  loadSnapshot: () => import('./gitattributes-templates.json').then((m) => m.default as GitTemplatesSnapshot),
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

async function generateOutput() {
  let gitattributes = '';
  const urls: string[] = [];
  for (const lang of selected.value) {
    const { content, url, snapshot } = await loadTemplate(source, lang, { offline: isOfflineMode });
    if (snapshot) {
      snapshotDate.value = snapshotDay(snapshot);
    }
    urls.push(url);
    gitattributes += `${gitattributes ? '\n\n' : ''}# === .gitattributes for ${lang} (${url}) ===\n\n${content}`;
  }
  output.value = gitattributes;
  outputUrls.value = urls;
}

// Multi-command generation, downloading the same files as the generated preview
const commands = computed(() => {
  if (!outputUrls.value.length) {
    return { curl: '', wget: '', powershell: '', cmd: '' };
  }
  const urls = outputUrls.value.join(' ');
  return {
    curl: `curl ${urls} > .gitattributes`,
    wget: `wget ${urls} -O .gitattributes`,
    powershell: `Invoke-WebRequest ${urls} -OutFile .gitattributes`,
    cmd: `powershell -Command "Invoke-WebRequest ${urls} -OutFile .gitattributes"`,
  };
});

onMounted(loadOptions);
</script>

<template>
  <div>
    <n-form-item :label="t('tools.gitattributes-generator.texts.label-gitattributes-templates')" label-placement="left">
      <NSelect
        v-model:value="selected"
        multiple
        filterable
        :placeholder="t('tools.gitattributes-generator.texts.placeholder-select-templates')"
        :options="options"
      />
    </n-form-item>
    <n-p v-if="snapshotDate" op-70>
      {{ t('tools.gitattributes-generator.texts.snapshot-used', [snapshotDate]) }}
    </n-p>
    <n-space justify="center" mb-2>
      <NButton type="primary" :disabled="!selected.length" @click="generateOutput">
        {{ t('tools.gitattributes-generator.texts.tag-fetch-generate') }}
      </NButton>
    </n-space>
    <c-card v-if="output" :title="t('tools.gitattributes-generator.texts.title-preview')" mb-2>
      <textarea-copyable :value="output" language="bash" download-file-name=".gitattributes" />
    </c-card>

    <!-- The download commands fetch from GitHub, which an offline deployment can't reach -->
    <NTabs v-if="output && !isOfflineMode" type="line" animated>
      <NTabPane name="curl" tab="Curl">
        <textarea-copyable :value="commands.curl" word-wrap />
      </NTabPane>
      <NTabPane name="wget" tab="Wget">
        <textarea-copyable :value="commands.wget" word-wrap />
      </NTabPane>
      <NTabPane name="powershell" tab="PowerShell">
        <textarea-copyable :value="commands.powershell" word-wrap />
      </NTabPane>
      <NTabPane name="cmd" tab="Windows CMD">
        <textarea-copyable :value="commands.cmd" word-wrap />
      </NTabPane>
    </NTabs>
  </div>
</template>
