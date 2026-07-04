<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { computed, reactive } from 'vue';
import { NCard, NCheckbox, NCheckboxGroup, NForm, NFormItem, NInput, NRadio, NRadioGroup } from 'naive-ui';

const { t } = useI18n();

const availableOptions = [
  { label: t('tools.rsync-generator.texts.label-dry-run'), value: '--dry-run', description: 'Simulates the sync without making changes' },
  { label: t('tools.rsync-generator.texts.label-archive-mode'), value: '-a', description: 'Preserves permissions, timestamps, symbolic links, and metadata' },
  { label: t('tools.rsync-generator.texts.label-compress'), value: '-z', description: 'Compresses files during transfer to save bandwidth' },
  { label: t('tools.rsync-generator.texts.label-show-progress'), value: '--progress', description: 'Displays detailed progress information' },
  { label: t('tools.rsync-generator.texts.label-partial'), value: '--partial', description: 'Keeps partially transferred files in case of interruption' },
  { label: t('tools.rsync-generator.texts.label-verbose'), value: '-v', description: 'Outputs more information about the transfer process' },
  { label: t('tools.rsync-generator.texts.label-human-readable'), value: '-h', description: 'Formats output in a more readable way' },
  { label: t('tools.rsync-generator.texts.label-recursive'), value: '-r', description: 'Copies directories recursively' },
  { label: t('tools.rsync-generator.texts.label-copy-symlinks'), value: '-L', description: 'Follows symbolic links and copies the target files' },
  { label: t('tools.rsync-generator.texts.label-remove-source'), value: '--remove-source-files', description: 'Deletes source files after transfer' },
  { label: t('tools.rsync-generator.texts.label-delete'), value: '--delete', description: 'Removes files in destination that no longer exist in the source' },
  { label: t('tools.rsync-generator.texts.label-update'), value: '-u', description: 'Copies files only if the source is newer than the destination' },
];

const form = reactive({
  sourceType: 'local',
  source: '',
  sourceHost: '',
  sourceUser: '',
  destinationType: 'local',
  destination: '',
  destinationHost: '',
  destinationUser: '',
  options: [] as string[],
});

function formatRemotePath(user: string, host: string, path: string) {
  return host ? `${user ? `${user}@` : ''}${host}:${path}` : path;
}

const generatedCommand = computed(() => {
  const sourcePath = formatRemotePath(form.sourceUser, form.sourceHost, form.source);
  const destinationPath = formatRemotePath(form.destinationUser, form.destinationHost, form.destination);

  if (!sourcePath || !destinationPath) {
    return '';
  }

  return `rsync ${form.options.join(' ')} ${sourcePath} ${destinationPath}`;
});
</script>

<template>
  <NCard :title="t('tools.rsync-generator.texts.title-rsync-command-generator')">
    <NForm :model="form" label-placement="left">
      <NFormItem :label="t('tools.rsync-generator.texts.label-source-type')">
        <NRadioGroup v-model:value="form.sourceType">
          <NRadio value="local">
            {{ t('tools.rsync-generator.texts.tag-local') }}
          </NRadio>
          <NRadio value="remote">
            {{ t('tools.rsync-generator.texts.tag-remote') }}
          </NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem :label="t('tools.rsync-generator.texts.label-source')">
        <NInput v-model:value="form.source" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-source-directory')" />
      </NFormItem>
      <NFormItem v-if="form.sourceType === 'remote'" :label="t('tools.rsync-generator.texts.label-source-ssh-host')">
        <NInput v-model:value="form.sourceHost" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-ssh-host')" />
      </NFormItem>
      <NFormItem v-if="form.sourceType === 'remote'" :label="t('tools.rsync-generator.texts.label-source-ssh-username')">
        <NInput v-model:value="form.sourceUser" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-ssh-username-optional')" />
      </NFormItem>

      <NFormItem :label="t('tools.rsync-generator.texts.label-destination-type')">
        <NRadioGroup v-model:value="form.destinationType">
          <NRadio value="local">
            {{ t('tools.rsync-generator.texts.tag-local') }}
          </NRadio>
          <NRadio value="remote">
            {{ t('tools.rsync-generator.texts.tag-remote') }}
          </NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem :label="t('tools.rsync-generator.texts.label-destination')">
        <NInput v-model:value="form.destination" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-destination-directory')" />
      </NFormItem>
      <NFormItem v-if="form.destinationType === 'remote'" :label="t('tools.rsync-generator.texts.label-destination-ssh-host')">
        <NInput v-model:value="form.destinationHost" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-ssh-host')" />
      </NFormItem>
      <NFormItem v-if="form.destinationType === 'remote'" :label="t('tools.rsync-generator.texts.label-destination-ssh-username')">
        <NInput v-model:value="form.destinationUser" :placeholder="t('tools.rsync-generator.texts.placeholder-enter-ssh-username-optional')" />
      </NFormItem>

      <NFormItem :label="t('tools.rsync-generator.texts.label-options')">
        <NCheckboxGroup v-model:value="form.options">
          <NCheckbox v-for="option in availableOptions" :key="option.value" :value="option.value">
            {{ option.label }} <em>({{ option.description }})</em>
          </NCheckbox>
        </NCheckboxGroup>
      </NFormItem>
    </NForm>
    <c-card :title="t('tools.rsync-generator.texts.title-generated-rsync-command')" mt-5>
      <textarea-copyable :value="generatedCommand" />
    </c-card>
  </NCard>
</template>
