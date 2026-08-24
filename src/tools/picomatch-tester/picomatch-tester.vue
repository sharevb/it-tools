<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';
import picomatch from 'picomatch';

const pattern = useQueryParamOrStorage({ name: 'pattern', storageName: 'pico:p', defaultValue: '*.js' });
const batchInput = useITStorage('pico:sample', `index.js
foo.txt
src/app.js
README.md`);

const options = useITStorage('pico:opts', {
  nocase: false,
  dot: false,
  noext: false,
  noglobstar: false,
  contains: false,
  strictSlashes: false,
});

const regex = computed(() => {
  try {
    return picomatch.makeRe(pattern.value, options.value);
  }
  catch (e: any) {
    return e.toString();
  }
});

const matcher = computed(() => {
  try {
    return picomatch(pattern.value, options.value);
  }
  catch {
    return null;
  }
});

const batchLines = computed(() =>
  batchInput.value.split(/\r?\n/).filter(l => l.trim().length > 0),
);

function highlightDiff(line: string) {
  if (!matcher.value) {
    return line;
  }
  const re = regex.value;
  if (!re) {
    return line;
  }

  const m = line.match(re);
  if (!m) {
    return `<span class="no-match">${line}</span>`;
  }

  const match = m[0];
  const idx = line.indexOf(match);
  if (idx === -1) {
    return line;
  }

  return (
    `<span class="pre">${line.slice(0, idx)}</span>`
    + `<span class="hit">${match}</span>`
    + `<span class="post">${line.slice(idx + match.length)}</span>`
  );
}

const batchResults = computed(() =>
  batchLines.value.map(line => ({
    line,
    isMatch: matcher.value ? matcher.value(line) : false,
    html: highlightDiff(line),
  })),
);
</script>

<template>
  <div>
    <NForm label-placement="left">
      <NFormItem :label="t('tools.picomatch-tester.texts.label-pattern')">
        <NInput v-model:value="pattern" :placeholder="t('tools.picomatch-tester.texts.placeholder-enter-a-glob-pattern-like-js')" />
      </NFormItem>

      <NFormItem :label="t('tools.picomatch-tester.texts.label-options')">
        <n-space justify="center">
          <NCheckbox v-model:checked="options.nocase">{{ t('tools.picomatch-tester.texts.tag-case-insensitive') }}</NCheckbox>
          <NCheckbox v-model:checked="options.dot">{{ t('tools.picomatch-tester.texts.tag-match-dotfiles') }}</NCheckbox>
          <NCheckbox v-model:checked="options.noext">
            No Extglob (like +(a|b))
          </NCheckbox>
          <NCheckbox v-model:checked="options.noglobstar">{{ t('tools.picomatch-tester.texts.tag-no-nested-directories-with-globstars') }}</NCheckbox>
          <NCheckbox v-model:checked="options.contains">{{ t('tools.picomatch-tester.texts.tag-allows-glob-to-match-any-part-of-the-given-string-s') }}</NCheckbox>
          <NCheckbox v-model:checked="options.strictSlashes">{{ t('tools.picomatch-tester.texts.tag-don-t-match-trailing-slashes-with-single-stars') }}</NCheckbox>
        </n-space>
      </NFormItem>

      <NFormItem :label="t('tools.picomatch-tester.texts.label-generated-regex')">
        <input-copyable
          :value="regex ? regex.toString() : 'Invalid pattern'"
        />
      </NFormItem>

      <NFormItem :label="t('tools.picomatch-tester.texts.label-test-lines-one-per-line')" label-placement="top">
        <NInput
          v-model:value="batchInput"
          type="textarea"
          :placeholder="t('tools.picomatch-tester.texts.placeholder-enter-one-string-per-line')"
          :autosize="{ minRows: 6 }"
        />
      </NFormItem>

      <div class="pico-batch-results">
        <div
          v-for="(r, i) in batchResults"
          :key="i"
          class="batch-line"
        >
          <NAlert :type="r.isMatch ? 'success' : 'error'" :bordered="false">
            <div class="diff-line" v-html="r.html" />
          </NAlert>
        </div>
      </div>
    </NForm>
  </div>
</template>

<style lang="less">
.pico-batch-results {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .diff-line {
    font-family: monospace;
    white-space: pre-wrap;

    .pre {
        opacity: 0.6;
    }

    .post {
        opacity: 0.6;
    }

    .hit {
      background: #7d7b72;
      padding: 0 2px;
      border-radius: 2px;
      color:white;
    }

    .no-match {
      opacity: 0.5;
    }
  }
}
</style>
