<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NForm, NFormItem, NInput, NSelect } from 'naive-ui';

const { t } = useI18n();

const device = ref('');
const mountPoint = ref('');
const fsType = ref('auto');
const options = ref<string[]>([]);
const dump = ref('0');
const pass = ref('0');
const username = ref('');
const password = ref('');

const fileSystems = [
  'auto',
  'ext2',
  'ext3',
  'ext4',
  'xfs',
  'btrfs',
  'jfs',
  'reiserfs',
  'nfs',
  'cifs',
  'smbfs',
  'tmpfs',
  'devtmpfs',
  'overlay',
  'aufs',
  'iso9660',
  'udf',
  'vfat',
  'ntfs',
  'swap',
];

// `key` maps to `tools.fstab-generator.options.<key>` in this tool's locales/*.yml files.
const defaultOptions = [
  { value: 'defaults', key: 'defaults' },
  { value: 'noatime', key: 'noatime' },
  { value: 'nodiratime', key: 'nodiratime' },
  { value: 'relatime', key: 'relatime' },
  { value: 'ro', key: 'ro' },
  { value: 'rw', key: 'rw' },
  { value: 'sync', key: 'sync' },
  { value: 'async', key: 'async' },
  { value: 'user', key: 'user' },
  { value: 'nouser', key: 'nouser' },
  { value: 'exec', key: 'exec' },
  { value: 'noexec', key: 'noexec' },
  { value: 'errors=remount-ro', key: 'errors-remount-ro' },
  { value: 'auto', key: 'auto' },
  { value: 'noauto', key: 'noauto' },
  { value: 'dev', key: 'dev' },
  { value: 'nodev', key: 'nodev' },
  { value: 'suid', key: 'suid' },
  { value: 'nosuid', key: 'nosuid' },
];

const nfsOptions = [
  { value: 'vers=3', key: 'vers3' },
  { value: 'soft', key: 'soft' },
  { value: 'hard', key: 'hard' },
  { value: 'rsize=8192,wsize=8192', key: 'rsize8192-wsize8192' },
];

const cifsOptions = [{ value: 'sec=ntlm', key: 'sec-ntlm' }];

const tmpfsOptions = [
  { value: 'size=512M', key: 'size512m' },
  { value: 'mode=1777', key: 'mode1777' },
];

const filesystemOptions = computed(() => {
  if (fsType.value === 'nfs') {
    return [...defaultOptions, ...nfsOptions];
  }
  if (fsType.value === 'cifs') {
    return [...defaultOptions, ...cifsOptions];
  }
  if (fsType.value === 'tmpfs') {
    return [...defaultOptions, ...tmpfsOptions];
  }
  return defaultOptions;
});

const fstabLine = computed(() => {
  if (!device.value || !mountPoint.value) {
    return '';
  }
  const allOptions = [...options.value];
  if (username.value) {
    allOptions.push(`user=${username.value}`);
  }
  if (password.value) {
    allOptions.push(`pass=${password.value}`);
  }
  if (!allOptions.length) {
    allOptions.push('defaults');
  }
  return `${device.value} ${mountPoint.value} ${fsType.value} ${allOptions.join(',')} ${dump.value} ${pass.value}`;
});
</script>

<template>
  <NForm>
    <NFormItem :label="t('tools.fstab-generator.texts.label-device')" label-placement="left" label-width="140px">
      <NInput
        v-model:value="device"
        :placeholder="t('tools.fstab-generator.texts.placeholder-dev-sda1-or-uuid-or-server-path')"
      />
    </NFormItem>

    <NFormItem :label="t('tools.fstab-generator.texts.label-mount-point')" label-placement="left" label-width="140px">
      <NInput v-model:value="mountPoint" :placeholder="t('tools.fstab-generator.texts.placeholder-mnt-data-or-home')" />
    </NFormItem>

    <NFormItem
      :label="t('tools.fstab-generator.texts.label-filesystem-type')"
      label-placement="left"
      label-width="140px"
    >
      <NSelect v-model:value="fsType" :options="fileSystems.map((fs) => ({ label: fs, value: fs }))" />
    </NFormItem>

    <NFormItem :label="t('tools.fstab-generator.texts.label-filesystem-options')">
      <NSelect
        v-model:value="options"
        :placeholder="
          t(
            'tools.fstab-generator.texts.placeholder-by-default-standard-mount-options-rw-suid-dev-exec-auto-nouser-async',
          )
        "
        multiple
        :options="
          filesystemOptions.map((o) => ({
            value: o.value,
            label: `${t('tools.fstab-generator.options.' + o.key)} (${o.value})`,
          }))
        "
      />
    </NFormItem>

    <NFormItem
      :label="
        t('tools.fstab-generator.texts.label-dump-determines-whether-the-dump-utility-should-back-up-this-filesystem')
      "
    >
      <NSelect
        v-model:value="dump"
        :options="[
          { label: t('tools.fstab-generator.texts.label-do-not-include-in-backups'), value: '0' },
          { label: t('tools.fstab-generator.texts.label-include-in-backups'), value: '1' },
        ]"
      />
    </NFormItem>

    <NFormItem :label="t('tools.fstab-generator.texts.label-pass-controls-the-order-for-filesystem-checks-at-boot')">
      <NSelect
        v-model:value="pass"
        :options="[
          { label: t('tools.fstab-generator.texts.label-no-check'), value: '0' },
          { label: t('tools.fstab-generator.texts.label-root-filesystem-first'), value: '1' },
          { label: t('tools.fstab-generator.texts.label-other-filesystems-after-root'), value: '2' },
        ]"
      />
    </NFormItem>

    <c-input-text
      v-model:value="username"
      :placeholder="t('tools.fstab-generator.texts.placeholder-username')"
      :label="t('tools.fstab-generator.texts.label-username')"
      label-position="left"
      label-width="140px"
      label-align="right"
      raw-text
      mb-1
      flex-1
    />

    <c-input-text
      v-model:value="password"
      :placeholder="t('tools.fstab-generator.texts.placeholder-password')"
      :label="t('tools.fstab-generator.texts.label-password')"
      label-position="left"
      label-width="140px"
      label-align="right"
      raw-text
      flex-1
    />

    <c-card :title="t('tools.fstab-generator.texts.title-generated-etc-fstab-line')" mt-5>
      <textarea-copyable :value="fstabLine" />
    </c-card>
  </NForm>
</template>
