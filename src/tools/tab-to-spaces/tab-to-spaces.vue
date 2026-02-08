<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';

const input = ref('');

const spacesPerTab = useQueryParamOrStorage({ name: 'spaces', storageName: 'tabs-spc:s', defaultValue: 4 });
const convertLeadingOnly = useQueryParamOrStorage({ name: 'leading', storageName: 'tabs-spc:l', defaultValue: false });
const normalizeInner = useQueryParamOrStorage({ name: 'norm', storageName: 'tabs-spc:n', defaultValue: false });

// add 1 space for half width chars and 2 for others
function getLen(str: string): number {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    if ((chr >= 0x00 && chr <= 0x80)
            || (chr >= 0xA0 && chr <= 0xFF)
            || (chr === 0xF8F0)
            || (chr >= 0xFF61 && chr <= 0xFF9F)
            || (chr >= 0xF8F1 && chr <= 0xF8F3)) {
      length += 1;
    }
    else {
      length += 2;
    }
  }
  return length;
};

function normalizeInnerSpacing(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      // Preserve leading indentation
      const leading = line.match(/^\s*/)?.[0] ?? '';
      const rest = line.slice(leading.length);

      // Collapse internal whitespace
      const normalized = rest.replace(/\s+/g, ' ');
      return leading + normalized;
    })
    .join('\n');
}

function transformTabs(text: string, tabSize: number) {
  let t = text;
  while (t.includes('\t')) {
    const position = t.indexOf('\t');
    const before = t.slice(0, position);
    const beforeLen = getLen(before);
    const spacenum = tabSize - (beforeLen % tabSize);
    const temp = before + ' '.repeat(spacenum) + t.slice(position + 1);
    t = temp;
  }
  return t;
}

const output = computed(() => {
  const tabSize = spacesPerTab.value;

  let out = input.value;

  if (convertLeadingOnly.value) {
    out = out
      .split('\n')
      .map((line) => {
        const match = line.match(/^\s+/);
        if (!match) {
          return line;
        }
        const leadingSpaces = match[0].length;
        return transformTabs(line.slice(0, leadingSpaces), tabSize) + line.slice(leadingSpaces);
      })
      .join('\n');
  }
  else {
    out = out
      .split('\n')
      .map((line) => {
        return transformTabs(line, tabSize);
      })
      .join('\n');
  }

  if (normalizeInner.value) {
    out = normalizeInnerSpacing(out);
  }

  return out;
});
</script>

<template>
  <div>
    <n-form label-placement="left" label-width="auto">
      <n-space justify="center">
        <n-form-item label="Spaces per tab">
          <n-input-number v-model:value="spacesPerTab" :min="1" :max="12" />
        </n-form-item>

        <n-form-item label="Convert only leading tabs">
          <n-switch v-model:value="convertLeadingOnly" />
        </n-form-item>

        <n-form-item label="Normalize inner spacing">
          <n-switch v-model:value="normalizeInner" />
        </n-form-item>
      </n-space>
    </n-form>

    <c-card title="Input (with tabs)" mb-2>
      <c-input-text
        v-model:value="input"
        multiline
        rows="6"
        monospace
        placeholder="Paste text with tabs here..."
      />
    </c-card>
    <c-card title="Output (with spaces)">
      <textarea-copyable
        :value="output"
      />
    </c-card>
  </div>
</template>
