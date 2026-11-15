<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';

const borderChar = useQueryParamOrStorage({ name: 'borderChar', storageName: 'cli-ban-gen:b', defaultValue: '#' });
const width = useQueryParamOrStorage({ name: 'width', storageName: 'cli-ban-gen:w', defaultValue: 72 });

const bannerText = ref(`Authorized Access Only

This system is for authorized users.
All activity may be monitored.`);

const wrapText = (text: string, maxWidth: number): string[] => {
  if (!text.trim()) {
    return [''];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    if ((currentLine + ' ' + word).length <= maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const generatedBanner = computed(() => {
  const border = borderChar.value || '#';
  const totalWidth = Math.max(20, Math.min(200, width.value || 72));
  const innerWidth = totalWidth - 4;

  const output: string[] = [];

  output.push(border.repeat(totalWidth));

  const paragraphs = bannerText.value.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      output.push(`${border} ${' '.repeat(innerWidth)} ${border}`);
      continue;
    }

    const wrappedLines = wrapText(paragraph, innerWidth);

    wrappedLines.forEach((line) => {
      const padding = innerWidth - line.length;
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;

      output.push(`${border} ${' '.repeat(leftPad)}${line}${' '.repeat(rightPad)} ${border}`);
    });
  }

  output.push(border.repeat(totalWidth));

  return output.join('\n');
});
</script>

<template>
  <div>
    <n-form label-placement="left">
      <n-space justify="center" mb-2>
        <n-form-item label="Border Char:">
          <n-input v-model:value="borderChar" maxlength="1" placeholder="#" />
        </n-form-item>

        <n-form-item label="Width (Min 20 – Max 200):">
          <n-input-number v-model:value="width" :min="20" :max="200" style="width: 100%" />
        </n-form-item>
      </n-space>

      <n-form-item label="Banner Text:" label-placement="top">
        <n-input v-model:value="bannerText" type="textarea" :rows="8" placeholder="Enter MOTD banner text here..." />
      </n-form-item>
    </n-form>

    <n-card title="Generated Banner">
      <textarea-copyable :value="generatedBanner" download-file-name="banner.txt" />
    </n-card>
  </div>
</template>
