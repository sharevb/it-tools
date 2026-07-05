<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const config = useITStorage('logrotate:config', {
  path: '/var/log/apache2/*.log',
  rotateCount: 1,
  frequency: 'weekly',
  minSize: '10M',
  size: '10M',
  createFile: true,
  copy: false,
  copyTruncate: false,
  startNumber: 1,
  extension: '.log',
  dateExt: false,
  dateFormat: '-%Y%m%d',
  missingOk: true,
  compress: true,
  delayCompress: false,
  compressExt: '.gz',
  compressCmd: 'gzip',
  compressOptions: '-9',
  uncompressCmd: 'gunzip',
  oldDir: '/path/foo/',
  mail: '',
  mailFirst: false,
  mailLast: false,
  shred: false,
  shredCycles: 1,
  firstAction: '',
  preRotate: '',
  postRotate: '',
  lastAction: '',
});

const frequencyOptions = ['daily', 'weekly', 'monthly', 'yearly'];

const tooltips = {
  path: t('tools.logrotate-generator.texts.path'),
  rotateCount: t('tools.logrotate-generator.texts.rotateCount'),
  frequency: t('tools.logrotate-generator.texts.frequency'),
  minSize: t('tools.logrotate-generator.texts.minSize'),
  size: t('tools.logrotate-generator.texts.size'),
  createFile: t('tools.logrotate-generator.texts.createFile'),
  copy: t('tools.logrotate-generator.texts.copy'),
  copyTruncate: t('tools.logrotate-generator.texts.copyTruncate'),
  startNumber: t('tools.logrotate-generator.texts.startNumber'),
  extension: t('tools.logrotate-generator.texts.extension'),
  dateExt: t('tools.logrotate-generator.texts.dateExt'),
  dateFormat: t('tools.logrotate-generator.texts.dateFormat'),
  missingOk: t('tools.logrotate-generator.texts.missingOk'),
  compress: t('tools.logrotate-generator.texts.compress'),
  delayCompress: t('tools.logrotate-generator.texts.delayCompress'),
  compressExt: t('tools.logrotate-generator.texts.compressExt'),
  compressCmd: t('tools.logrotate-generator.texts.compressCmd'),
  compressOptions: t('tools.logrotate-generator.texts.compressOptions'),
  uncompressCmd: t('tools.logrotate-generator.texts.uncompressCmd'),
  oldDir: t('tools.logrotate-generator.texts.oldDir'),
  mail: t('tools.logrotate-generator.texts.mail'),
  mailFirst: t('tools.logrotate-generator.texts.mailFirst'),
  mailLast: t('tools.logrotate-generator.texts.mailLast'),
  shred: t('tools.logrotate-generator.texts.shred'),
  shredCycles: t('tools.logrotate-generator.texts.shredCycles'),
  firstAction: t('tools.logrotate-generator.texts.firstAction'),
  preRotate: t('tools.logrotate-generator.texts.preRotate'),
  postRotate: t('tools.logrotate-generator.texts.postRotate'),
  lastAction: t('tools.logrotate-generator.texts.lastAction'),
};

const generatedConfig = computed(() => {
  return `
${config.value.path} {
  rotate ${config.value.rotateCount}
  ${config.value.frequency}
  ${config.value.minSize ? `minsize ${config.value.minSize}` : ''}
  ${config.value.size ? `size ${config.value.size}` : ''}
  ${config.value.createFile ? 'create' : 'nocreate'}
  ${config.value.copy ? 'copy' : 'nocopy'}
  ${config.value.copyTruncate ? 'copytruncate' : 'nocopytruncate'}
  start ${config.value.startNumber}
  ${config.value.extension ? `extension ${config.value.extension}` : ''}
  ${config.value.dateExt ? 'dateext' : 'nodateext'}
  ${config.value.dateExt ? `dateformat ${config.value.dateFormat}` : ''}
  ${config.value.missingOk ? 'missingok' : 'nomissingok'}
  ${config.value.compress ? 'compress' : 'nocompress'}
  ${config.value.delayCompress ? 'delaycompress' : ''}
  ${config.value.compressExt ? `compressext ${config.value.compressExt}` : ''}
  ${config.value.compressCmd ? `compresscmd ${config.value.compressCmd}` : ''}
  ${config.value.compressOptions ? `compressoptions ${config.value.compressOptions}` : ''}
  ${config.value.uncompressCmd ? `uncompresscmd ${config.value.uncompressCmd}` : ''}
  ${config.value.oldDir ? `olddir ${config.value.oldDir}` : ''}
  ${config.value.mail ? `mail ${config.value.mail}` : ''}
  ${config.value.mailFirst ? 'mailfirst' : ''}
  ${config.value.mailLast ? 'maillast' : ''}
  ${config.value.shred ? 'shred' : 'noshred'}
  ${config.value.shredCycles ? `shredcycles ${config.value.shredCycles}` : ''}
  ${config.value.firstAction ? `firstaction\n${config.value.firstAction}\nendscript` : ''}
  ${config.value.preRotate ? `prerotate\n${config.value.preRotate}\nendscript` : ''}
  ${config.value.postRotate ? `postrotate\n${config.value.postRotate}\nendscript` : ''}
  ${config.value.lastAction ? `lastaction\n${config.value.lastAction}\nendscript` : ''}
}
  `.trim().replace(/^\s*\n/mg, '');
});
</script>

<template>
  <NForm label-placement="left" label-width="180px">
    <n-form-item :label="t('tools.logrotate-generator.texts.label-path')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.path" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-log-path-or-pattern')" />
        </template>
        {{ tooltips.path }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-rotate-count')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input-number-i18n v-model:value="config.rotateCount" />
        </template>
        {{ tooltips.rotateCount }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-frequency')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-select v-model:value="config.frequency" :options="frequencyOptions.map(f => ({ label: f, value: f }))" />
        </template>
        {{ tooltips.frequency }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-min-size')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.minSize" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-min-size-and-unit')" />
        </template>
        {{ tooltips.minSize }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-size')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.size" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-size-and-unit')" />
        </template>
        {{ tooltips.size }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-create-file')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.createFile" />
        </template>
        {{ tooltips.createFile }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-copy')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.copy" />
        </template>
        {{ tooltips.copy }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-copy-truncate')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.copyTruncate" />
        </template>
        {{ tooltips.copyTruncate }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-start-number')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input-number-i18n v-model:value="config.startNumber" />
        </template>
        {{ tooltips.startNumber }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-extension')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.extension" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-extension')" />
        </template>
        {{ tooltips.extension }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-date-ext')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.dateExt" />
        </template>
        {{ tooltips.dateExt }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-date-format')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.dateFormat" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-date-format')" />
        </template>
        {{ tooltips.dateFormat }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-missing-ok')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.missingOk" />
        </template>
        {{ tooltips.missingOk }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-compress')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.compress" />
        </template>
        {{ tooltips.compress }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-delay-compress')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.delayCompress" />
        </template>
        {{ tooltips.delayCompress }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-compress-ext')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.compressExt" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-compression-extension')" />
        </template>
        {{ tooltips.compressExt }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-compress-cmd')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.compressCmd" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.compressCmd }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-compress-options')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.compressOptions" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-compression-options')" />
        </template>
        {{ tooltips.compressOptions }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-uncompress-cmd')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.uncompressCmd" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.uncompressCmd }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-old-dir')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.oldDir" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-old-directory')" />
        </template>
        {{ tooltips.oldDir }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-mail')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.mail" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-email')" />
        </template>
        {{ tooltips.mail }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-mail-first')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.mailFirst" />
        </template>
        {{ tooltips.mailFirst }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-mail-last')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.mailLast" />
        </template>
        {{ tooltips.mailLast }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-shred')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-switch v-model:value="config.shred" />
        </template>
        {{ tooltips.shred }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-shred-cycles')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input-number-i18n v-model:value="config.shredCycles" />
        </template>
        {{ tooltips.shredCycles }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-first-action')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.firstAction" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.firstAction }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-pre-rotate')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.preRotate" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.preRotate }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-post-rotate')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.postRotate" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.postRotate }}
      </n-tooltip>
    </n-form-item>

    <n-form-item :label="t('tools.logrotate-generator.texts.label-last-action')">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input v-model:value="config.lastAction" :placeholder="t('tools.logrotate-generator.texts.placeholder-enter-command')" />
        </template>
        {{ tooltips.lastAction }}
      </n-tooltip>
    </n-form-item>

    <NDivider />

    <NCard :title="t('tools.logrotate-generator.texts.title-generated-config')">
      <textarea-copyable :value="generatedConfig" />
    </NCard>
  </NForm>
</template>
