<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const { t } = useI18n();

const options = useLocalStorage<{ label: string; value: string }[]>('gitattr-gen:opts2', []);
const selected = ref<string[]>([]);
const output = ref<string>('');

// Timestamp cache to allow refresh after X hours
const lastFetched = useLocalStorage<number>('gitattr-gen:ts', 0);
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

async function loadOptions() {
  const now = Date.now();
  const isStale = !options.value.length || (now - lastFetched.value > CACHE_TTL);

  if (!isStale) {
    // Use cached options
    return;
  }

  try {
    const res = await fetch('https://api.github.com/repos/alexkaratarakis/gitattributes/git/trees/master?recursive=true');
    const files = await res.json();
    options.value = files.tree
      .filter((f: any) => f.path.endsWith('.gitattributes'))
      .map((f: any) => f.path.replace('.gitattributes', ''))
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
        'ActionScript',
        'Ada',
        'Ballerina',
        'C++',
        'CSharp',
        'Common',
        'Delphi',
        'Drupal',
        'Fortran',
        'Fountain',
        'Go',
        'Java',
        'Lua',
        'Matlab',
        'ObjectiveC',
        'Pascal',
        'Perl',
        'Python',
        'R',
        'Rails',
        'Servoy',
        'VisualStudio',
        'Web',
      ].map(name => ({
        label: name,
        value: name,
      }));
    }
  }
}

async function generateOutput() {
  let gitattributes = '';
  for (const lang of selected.value) {
    const url = `https://raw.githubusercontent.com/alexkaratarakis/gitattributes/master/${lang}.gitattributes`;
    const res = await fetch(url);
    const text = await res.text();
    gitattributes += `${gitattributes ? '\n\n' : ''}# === .gitattributes for ${lang} (${url}) ===\n\n${text}`;
  }
  output.value = gitattributes;
}

// Multi-command generation
const commands = computed(() => {
  if (!selected.value.length) {
    return {};
  }
  const urls = selected.value
    .map(lang => `https://raw.githubusercontent.com/alexkaratarakis/gitattributes/master/${lang}.gitattributes`)
    .join(' ');
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
    <n-space justify="center" mb-2>
      <NButton type="primary" :disabled="!selected.length" @click="generateOutput">
        {{ t('tools.gitattributes-generator.texts.tag-fetch-generate') }}
      </NButton>
    </n-space>
    <c-card v-if="output" :title="t('tools.gitattributes-generator.texts.title-preview')" mb-2>
      <textarea-copyable
        :value="output"
        language="bash"
        download-file-name=".gitattributes"
      />
    </c-card>

    <NTabs v-if="output" type="line" animated>
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
