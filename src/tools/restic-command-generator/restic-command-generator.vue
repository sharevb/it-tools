<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  type ResticCommandConfig,
  buildRepositoryUri,
  buildResticCommand,
  buildResticScript,
  defaultResticCommandConfig,
  getBackendCredentials,
  supportsNoLock,
  supportsSnapshotFilters,
  supportsSnapshotSelection,
} from './restic-command-generator.service';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const config = useITStorage<ResticCommandConfig>(
  'restic-command-generator:config',
  { ...defaultResticCommandConfig },
  undefined,
  { mergeDefaults: true },
);
const multiline = useITStorage('restic-command-generator:multiline', true);
const includeEnvironment = useITStorage('restic-command-generator:include-environment', true);

const operationOptions = [
  { label: t('tools.restic-command-generator.texts.operation-restore'), value: 'restore' },
  { label: t('tools.restic-command-generator.texts.operation-dump'), value: 'dump' },
  { label: t('tools.restic-command-generator.texts.operation-mount'), value: 'mount' },
  { label: t('tools.restic-command-generator.texts.operation-snapshots'), value: 'snapshots' },
  { label: t('tools.restic-command-generator.texts.operation-ls'), value: 'ls' },
  { label: t('tools.restic-command-generator.texts.operation-find'), value: 'find' },
  { label: t('tools.restic-command-generator.texts.operation-diff'), value: 'diff' },
  { label: t('tools.restic-command-generator.texts.operation-check'), value: 'check' },
  { label: t('tools.restic-command-generator.texts.operation-stats'), value: 'stats' },
  { label: t('tools.restic-command-generator.texts.operation-unlock'), value: 'unlock' },
];

const backendOptions = [
  { label: t('tools.restic-command-generator.texts.backend-s3'), value: 's3' },
  { label: t('tools.restic-command-generator.texts.backend-b2'), value: 'b2' },
  { label: t('tools.restic-command-generator.texts.backend-local'), value: 'local' },
  { label: t('tools.restic-command-generator.texts.backend-sftp'), value: 'sftp' },
  { label: t('tools.restic-command-generator.texts.backend-rest'), value: 'rest' },
  { label: t('tools.restic-command-generator.texts.backend-rclone'), value: 'rclone' },
  { label: t('tools.restic-command-generator.texts.backend-azure'), value: 'azure' },
  { label: t('tools.restic-command-generator.texts.backend-gs'), value: 'gs' },
  { label: t('tools.restic-command-generator.texts.backend-raw'), value: 'raw' },
];

const repositoryModeOptions = [
  { label: t('tools.restic-command-generator.texts.repository-flag'), value: 'flag' },
  { label: t('tools.restic-command-generator.texts.repository-env'), value: 'env' },
];

const passwordModeOptions = [
  { label: t('tools.restic-command-generator.texts.password-prompt'), value: 'prompt' },
  { label: t('tools.restic-command-generator.texts.password-file'), value: 'file' },
  { label: t('tools.restic-command-generator.texts.password-command'), value: 'command' },
  { label: t('tools.restic-command-generator.texts.password-placeholder'), value: 'placeholder' },
  { label: t('tools.restic-command-generator.texts.password-none'), value: 'none' },
];

const credentialsModeOptions = [
  { label: t('tools.restic-command-generator.texts.credentials-prompt'), value: 'prompt' },
  { label: t('tools.restic-command-generator.texts.credentials-placeholder'), value: 'placeholder' },
  { label: t('tools.restic-command-generator.texts.credentials-none'), value: 'none' },
];

const overwriteOptions = [
  { label: t('tools.restic-command-generator.texts.overwrite-default'), value: 'default' },
  { label: t('tools.restic-command-generator.texts.overwrite-always'), value: 'always' },
  { label: t('tools.restic-command-generator.texts.overwrite-if-changed'), value: 'if-changed' },
  { label: t('tools.restic-command-generator.texts.overwrite-if-newer'), value: 'if-newer' },
  { label: t('tools.restic-command-generator.texts.overwrite-never'), value: 'never' },
];

const archiveOptions = [
  { label: t('tools.restic-command-generator.texts.archive-none'), value: 'none' },
  { label: t('tools.restic-command-generator.texts.archive-tar'), value: 'tar' },
  { label: t('tools.restic-command-generator.texts.archive-zip'), value: 'zip' },
];

const statsModeOptions = [
  { label: t('tools.restic-command-generator.texts.stats-restore-size'), value: 'restore-size' },
  { label: t('tools.restic-command-generator.texts.stats-files-by-contents'), value: 'files-by-contents' },
  { label: t('tools.restic-command-generator.texts.stats-raw-data'), value: 'raw-data' },
  { label: t('tools.restic-command-generator.texts.stats-blobs-per-file'), value: 'blobs-per-file' },
];

const repositoryUri = computed(() => buildRepositoryUri(config.value));
const credentials = computed(() => getBackendCredentials(config.value));
const showSnapshotSelection = computed(() => supportsSnapshotSelection(config.value.operation));
const showSnapshotFilters = computed(() => supportsSnapshotFilters(config.value.operation));
const showNoLock = computed(() => supportsNoLock(config.value.operation));

const script = computed(() =>
  buildResticScript(config.value, { multiline: multiline.value, includeEnvironment: includeEnvironment.value }),
);

// The walk-through always shows the whole "I lost the web UI" sequence, whatever
// the operation picked above, so the repository settings only have to be typed once.
const walkthrough = computed(() => [
  {
    label: t('tools.restic-command-generator.texts.walkthrough-snapshots'),
    command: buildResticCommand({ ...config.value, operation: 'snapshots', snapshotsCompact: true }),
  },
  {
    label: t('tools.restic-command-generator.texts.walkthrough-find'),
    command: buildResticCommand({ ...config.value, operation: 'find' }),
  },
  {
    label: t('tools.restic-command-generator.texts.walkthrough-ls'),
    command: buildResticCommand({ ...config.value, operation: 'ls', lsRecursive: true }),
  },
  {
    label: t('tools.restic-command-generator.texts.walkthrough-restore'),
    command: buildResticCommand({
      ...config.value,
      operation: 'restore',
      includes: config.value.includes.length > 0 ? config.value.includes : ['/path/to/the/file'],
    }),
  },
  {
    label: t('tools.restic-command-generator.texts.walkthrough-mount'),
    command: buildResticCommand({ ...config.value, operation: 'mount' }),
  },
]);

const warnings = computed(() => {
  const messages: string[] = [];

  if (config.value.passwordMode === 'placeholder' || config.value.credentialsMode === 'placeholder') {
    messages.push(t('tools.restic-command-generator.texts.warning-history'));
  }
  if (config.value.operation === 'restore') {
    messages.push(t('tools.restic-command-generator.texts.warning-target'));
  }
  if (config.value.operation === 'restore' && config.value.deleteExtraneous) {
    messages.push(t('tools.restic-command-generator.texts.warning-delete'));
  }
  if (
    config.value.operation === 'restore' &&
    (config.value.dryRun || config.value.deleteExtraneous || config.value.overwrite !== 'default')
  ) {
    messages.push(t('tools.restic-command-generator.texts.warning-restic-version'));
  }
  if (config.value.operation === 'mount') {
    messages.push(t('tools.restic-command-generator.texts.warning-mount'));
  }

  return messages;
});

function reset() {
  config.value = { ...defaultResticCommandConfig };
}
</script>

<template>
  <div>
    <c-alert mb-3>
      {{ t('tools.restic-command-generator.texts.intro') }}
    </c-alert>

    <c-card :title="t('tools.restic-command-generator.texts.title-repository')" mb-3>
      <c-select
        v-model:value="config.backend"
        :options="backendOptions"
        :label="t('tools.restic-command-generator.texts.label-backend')"
        label-position="left"
        label-width="180px"
        mb-2
      />

      <template v-if="config.backend === 'local'">
        <c-input-text
          v-model:value="config.localPath"
          :label="t('tools.restic-command-generator.texts.label-local-path')"
          placeholder="/mnt/backups/restic-repo"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 's3'">
        <c-input-text
          v-model:value="config.s3Endpoint"
          :label="t('tools.restic-command-generator.texts.label-endpoint')"
          placeholder="s3.us-west-004.backblazeb2.com"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.s3Bucket"
          :label="t('tools.restic-command-generator.texts.label-bucket')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.s3Prefix"
          :label="t('tools.restic-command-generator.texts.label-prefix')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.s3Region"
          :label="t('tools.restic-command-generator.texts.label-region')"
          placeholder="us-west-004"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'b2'">
        <c-input-text
          v-model:value="config.b2Bucket"
          :label="t('tools.restic-command-generator.texts.label-bucket')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.b2Prefix"
          :label="t('tools.restic-command-generator.texts.label-prefix')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'sftp'">
        <c-input-text
          v-model:value="config.sftpUser"
          :label="t('tools.restic-command-generator.texts.label-user')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.sftpHost"
          :label="t('tools.restic-command-generator.texts.label-host')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.sftpPort"
          :label="t('tools.restic-command-generator.texts.label-port')"
          placeholder="22"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.sftpPath"
          :label="t('tools.restic-command-generator.texts.label-path')"
          placeholder="/srv/restic-repo"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'rest'">
        <c-input-text
          v-model:value="config.restUrl"
          :label="t('tools.restic-command-generator.texts.label-url')"
          placeholder="https://restic.lan:8000/"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'rclone'">
        <c-input-text
          v-model:value="config.rcloneRemote"
          :label="t('tools.restic-command-generator.texts.label-remote')"
          placeholder="b2-remote:my-backup-bucket/backrest"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'azure'">
        <c-input-text
          v-model:value="config.azureContainer"
          :label="t('tools.restic-command-generator.texts.label-container')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.azurePrefix"
          :label="t('tools.restic-command-generator.texts.label-prefix')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else-if="config.backend === 'gs'">
        <c-input-text
          v-model:value="config.gsBucket"
          :label="t('tools.restic-command-generator.texts.label-bucket')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.gsPrefix"
          :label="t('tools.restic-command-generator.texts.label-prefix')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <template v-else>
        <c-input-text
          v-model:value="config.rawRepository"
          :label="t('tools.restic-command-generator.texts.label-raw-repository')"
          placeholder="swift:container-name:/path"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <c-select
        v-model:value="config.repositoryMode"
        :options="repositoryModeOptions"
        :label="t('tools.restic-command-generator.texts.label-repository-mode')"
        label-position="left"
        label-width="180px"
        mb-2
      />

      <c-input-text
        :value="repositoryUri"
        :label="t('tools.restic-command-generator.texts.label-repository-uri')"
        label-position="left"
        label-width="180px"
        readonly
        monospace
        raw-text
        mb-2
      />

      <c-select
        v-model:value="config.passwordMode"
        :options="passwordModeOptions"
        :label="t('tools.restic-command-generator.texts.label-password')"
        label-position="left"
        label-width="180px"
        mb-2
      />

      <c-input-text
        v-if="config.passwordMode === 'file'"
        v-model:value="config.passwordFile"
        :label="t('tools.restic-command-generator.texts.label-password-file')"
        placeholder="/root/.restic-password"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />

      <c-input-text
        v-if="config.passwordMode === 'command'"
        v-model:value="config.passwordCommand"
        :label="t('tools.restic-command-generator.texts.label-password-command')"
        placeholder="pass show restic/repo"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />

      <template v-if="credentials.length > 0">
        <c-select
          v-model:value="config.credentialsMode"
          :options="credentialsModeOptions"
          :label="t('tools.restic-command-generator.texts.label-credentials')"
          label-position="left"
          label-width="180px"
          mb-2
        />
        <c-input-text
          v-if="config.credentialsMode !== 'none'"
          v-model:value="config.accountId"
          :label="t('tools.restic-command-generator.texts.label-account-id')"
          :placeholder="credentials[0].name"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
      </template>

      <div op-70 text-sm>
        {{ t('tools.restic-command-generator.texts.hint-secrets') }}
      </div>
    </c-card>

    <c-card :title="t('tools.restic-command-generator.texts.title-operation')" mb-3>
      <c-select v-model:value="config.operation" :options="operationOptions" />
    </c-card>

    <c-card
      v-if="showSnapshotSelection || showSnapshotFilters"
      :title="t('tools.restic-command-generator.texts.title-snapshot')"
      mb-3
    >
      <c-input-text
        v-if="showSnapshotSelection"
        v-model:value="config.snapshotId"
        :label="t('tools.restic-command-generator.texts.label-snapshot-id')"
        placeholder="latest"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />

      <c-input-text
        v-if="showSnapshotSelection && config.operation !== 'find'"
        v-model:value="config.snapshotSubfolder"
        :label="t('tools.restic-command-generator.texts.label-subfolder')"
        placeholder="/home/me/documents"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />

      <template v-if="showSnapshotFilters">
        <c-input-text
          v-model:value="config.backrestPlan"
          :label="t('tools.restic-command-generator.texts.label-plan')"
          placeholder="daily-documents"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.backrestInstance"
          :label="t('tools.restic-command-generator.texts.label-instance')"
          placeholder="homelab"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />
        <c-input-text
          v-model:value="config.host"
          :label="t('tools.restic-command-generator.texts.label-filter-host')"
          label-position="left"
          label-width="180px"
          raw-text
          mb-2
        />

        <c-label :label="t('tools.restic-command-generator.texts.label-tags')" mb-2>
          <div w-full>
            <n-dynamic-input
              v-model:value="config.tags"
              :placeholder="t('tools.restic-command-generator.texts.placeholder-tag')"
            />
          </div>
        </c-label>

        <c-label :label="t('tools.restic-command-generator.texts.label-filter-paths')" mb-2>
          <div w-full>
            <n-dynamic-input
              v-model:value="config.paths"
              :placeholder="t('tools.restic-command-generator.texts.placeholder-path')"
            />
          </div>
        </c-label>

        <div op-70 text-sm>
          {{ t('tools.restic-command-generator.texts.hint-tags') }}
        </div>
      </template>
    </c-card>

    <c-card
      v-if="config.operation === 'restore'"
      :title="t('tools.restic-command-generator.texts.title-restore-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.target"
        :label="t('tools.restic-command-generator.texts.label-target')"
        placeholder="/mnt/restore"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />

      <c-label :label="t('tools.restic-command-generator.texts.label-include')" mb-2>
        <div w-full>
          <n-dynamic-input
            v-model:value="config.includes"
            :placeholder="t('tools.restic-command-generator.texts.placeholder-include')"
          />
        </div>
      </c-label>

      <c-label :label="t('tools.restic-command-generator.texts.label-exclude')" mb-2>
        <div w-full>
          <n-dynamic-input
            v-model:value="config.excludes"
            :placeholder="t('tools.restic-command-generator.texts.placeholder-exclude')"
          />
        </div>
      </c-label>

      <c-select
        v-model:value="config.overwrite"
        :options="overwriteOptions"
        :label="t('tools.restic-command-generator.texts.label-overwrite')"
        label-position="left"
        label-width="180px"
        mb-2
      />

      <div flex flex-wrap gap-4>
        <n-checkbox v-model:checked="config.caseInsensitivePatterns">
          {{ t('tools.restic-command-generator.texts.label-case-insensitive') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.dryRun">
          {{ t('tools.restic-command-generator.texts.label-dry-run') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.verify">
          {{ t('tools.restic-command-generator.texts.label-verify') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.sparse">
          {{ t('tools.restic-command-generator.texts.label-sparse') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.deleteExtraneous">
          {{ t('tools.restic-command-generator.texts.label-delete') }}
        </n-checkbox>
      </div>
    </c-card>

    <c-card
      v-if="config.operation === 'dump'"
      :title="t('tools.restic-command-generator.texts.title-dump-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.dumpPath"
        :label="t('tools.restic-command-generator.texts.label-dump-path')"
        placeholder="/etc/nginx/nginx.conf"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <c-select
        v-model:value="config.dumpArchive"
        :options="archiveOptions"
        :label="t('tools.restic-command-generator.texts.label-archive')"
        label-position="left"
        label-width="180px"
        mb-2
      />
      <c-input-text
        v-model:value="config.dumpOutputFile"
        :label="t('tools.restic-command-generator.texts.label-output-file')"
        placeholder="./nginx.conf"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <div op-70 text-sm>
        {{ t('tools.restic-command-generator.texts.hint-dump') }}
      </div>
    </c-card>

    <c-card
      v-if="config.operation === 'mount'"
      :title="t('tools.restic-command-generator.texts.title-mount-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.mountPoint"
        :label="t('tools.restic-command-generator.texts.label-mount-point')"
        placeholder="/mnt/restic"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <n-checkbox v-model:checked="config.allowOther">
        {{ t('tools.restic-command-generator.texts.label-allow-other') }}
      </n-checkbox>
    </c-card>

    <c-card v-if="config.operation === 'ls'" :title="t('tools.restic-command-generator.texts.title-ls-options')" mb-3>
      <c-input-text
        v-model:value="config.lsDirectory"
        :label="t('tools.restic-command-generator.texts.label-ls-directory')"
        placeholder="/home/me/documents"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <div flex flex-wrap gap-4>
        <n-checkbox v-model:checked="config.lsLong">
          {{ t('tools.restic-command-generator.texts.label-long') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.lsRecursive">
          {{ t('tools.restic-command-generator.texts.label-recursive') }}
        </n-checkbox>
      </div>
    </c-card>

    <c-card
      v-if="config.operation === 'find'"
      :title="t('tools.restic-command-generator.texts.title-find-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.findPattern"
        :label="t('tools.restic-command-generator.texts.label-find-pattern')"
        placeholder="*.kdbx"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <div flex flex-wrap gap-4>
        <n-checkbox v-model:checked="config.findLong">
          {{ t('tools.restic-command-generator.texts.label-long') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.caseInsensitivePatterns">
          {{ t('tools.restic-command-generator.texts.label-case-insensitive') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.findRestrictToSnapshot">
          {{ t('tools.restic-command-generator.texts.label-restrict-snapshot') }}
        </n-checkbox>
      </div>
    </c-card>

    <c-card
      v-if="config.operation === 'diff'"
      :title="t('tools.restic-command-generator.texts.title-diff-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.diffSnapshotId"
        :label="t('tools.restic-command-generator.texts.label-diff-snapshot')"
        placeholder="latest"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <n-checkbox v-model:checked="config.diffMetadata">
        {{ t('tools.restic-command-generator.texts.label-metadata') }}
      </n-checkbox>
    </c-card>

    <c-card
      v-if="config.operation === 'snapshots'"
      :title="t('tools.restic-command-generator.texts.title-snapshots-options')"
      mb-3
    >
      <n-checkbox v-model:checked="config.snapshotsCompact">
        {{ t('tools.restic-command-generator.texts.label-compact') }}
      </n-checkbox>
    </c-card>

    <c-card
      v-if="config.operation === 'check'"
      :title="t('tools.restic-command-generator.texts.title-check-options')"
      mb-3
    >
      <c-input-text
        v-model:value="config.checkReadDataSubset"
        :label="t('tools.restic-command-generator.texts.label-read-data-subset')"
        placeholder="5% | 1/10 | 500M"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <div flex flex-wrap gap-4>
        <n-checkbox v-model:checked="config.checkReadData" :disabled="config.checkReadDataSubset.trim().length > 0">
          {{ t('tools.restic-command-generator.texts.label-read-data') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.checkUnused">
          {{ t('tools.restic-command-generator.texts.label-check-unused') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.checkWithCache">
          {{ t('tools.restic-command-generator.texts.label-with-cache') }}
        </n-checkbox>
      </div>
    </c-card>

    <c-card
      v-if="config.operation === 'stats'"
      :title="t('tools.restic-command-generator.texts.title-stats-options')"
      mb-3
    >
      <c-select
        v-model:value="config.statsMode"
        :options="statsModeOptions"
        :label="t('tools.restic-command-generator.texts.label-stats-mode')"
        label-position="left"
        label-width="180px"
        mb-2
      />
      <n-checkbox v-model:checked="config.statsAllSnapshots">
        {{ t('tools.restic-command-generator.texts.label-stats-all') }}
      </n-checkbox>
    </c-card>

    <c-card
      v-if="config.operation === 'unlock'"
      :title="t('tools.restic-command-generator.texts.title-unlock-options')"
      mb-3
    >
      <n-checkbox v-model:checked="config.unlockRemoveAll">
        {{ t('tools.restic-command-generator.texts.label-remove-all') }}
      </n-checkbox>
    </c-card>

    <c-card :title="t('tools.restic-command-generator.texts.title-global-options')" mb-3>
      <c-input-text
        v-model:value="config.cacheDir"
        :label="t('tools.restic-command-generator.texts.label-cache-dir')"
        placeholder="/var/cache/restic"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="config.limitDownload"
        :label="t('tools.restic-command-generator.texts.label-limit-download')"
        placeholder="2048"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="config.retryLock"
        :label="t('tools.restic-command-generator.texts.label-retry-lock')"
        placeholder="5m"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <c-label :label="t('tools.restic-command-generator.texts.label-extra-options')" mb-2>
        <div w-full>
          <n-dynamic-input
            v-model:value="config.extraOptions"
            :placeholder="t('tools.restic-command-generator.texts.placeholder-extra-option')"
          />
        </div>
      </c-label>
      <c-input-text
        v-model:value="config.extraArguments"
        :label="t('tools.restic-command-generator.texts.label-extra-arguments')"
        placeholder="--group-by host,tags"
        label-position="left"
        label-width="180px"
        raw-text
        mb-2
      />
      <div flex flex-wrap gap-4>
        <n-checkbox v-if="showNoLock" v-model:checked="config.noLock">
          {{ t('tools.restic-command-generator.texts.label-no-lock') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.noCache">
          {{ t('tools.restic-command-generator.texts.label-no-cache') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.insecureTls">
          {{ t('tools.restic-command-generator.texts.label-insecure-tls') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.json">
          {{ t('tools.restic-command-generator.texts.label-json') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.quiet">
          {{ t('tools.restic-command-generator.texts.label-quiet') }}
        </n-checkbox>
        <n-checkbox v-model:checked="config.verbose">
          {{ t('tools.restic-command-generator.texts.label-verbose') }}
        </n-checkbox>
      </div>
    </c-card>

    <c-card :title="t('tools.restic-command-generator.texts.title-output')" mb-3>
      <div flex flex-wrap gap-4 mb-3>
        <n-checkbox v-model:checked="includeEnvironment">
          {{ t('tools.restic-command-generator.texts.label-include-environment') }}
        </n-checkbox>
        <n-checkbox v-model:checked="multiline">
          {{ t('tools.restic-command-generator.texts.label-multiline') }}
        </n-checkbox>
      </div>

      <textarea-copyable :value="script" language="bash" word-wrap />

      <c-alert v-for="warning of warnings" :key="warning" mt-3>
        {{ warning }}
      </c-alert>

      <div mt-3 flex justify-center>
        <c-button @click="reset()">
          {{ t('tools.restic-command-generator.texts.button-reset') }}
        </c-button>
      </div>
    </c-card>

    <c-card :title="t('tools.restic-command-generator.texts.title-walkthrough')" mb-3>
      <div op-70 text-sm mb-3>
        {{ t('tools.restic-command-generator.texts.hint-walkthrough') }}
      </div>
      <div v-for="(step, index) of walkthrough" :key="step.label" mb-3>
        <div fw-600 mb-1>{{ index + 1 }}. {{ step.label }}</div>
        <textarea-copyable :value="step.command" language="bash" word-wrap />
      </div>
    </c-card>

    <c-card :title="t('tools.restic-command-generator.texts.title-backrest')">
      <table border="1" class="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            <th>{{ t('tools.restic-command-generator.texts.table-item') }}</th>
            <th>{{ t('tools.restic-command-generator.texts.table-value') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ t('tools.restic-command-generator.texts.backrest-config') }}</td>
            <td>
              <code>$BACKREST_CONFIG</code> —
              <code>~/.config/backrest/config.json</code> (<code>/config/config.json</code>)
            </td>
          </tr>
          <tr>
            <td>{{ t('tools.restic-command-generator.texts.backrest-data') }}</td>
            <td><code>$BACKREST_DATA</code> — <code>~/.local/share/backrest</code> (<code>/data</code>)</td>
          </tr>
          <tr>
            <td>{{ t('tools.restic-command-generator.texts.backrest-binary') }}</td>
            <td><code>$BACKREST_DATA/restic-&lt;version&gt;</code></td>
          </tr>
          <tr>
            <td>{{ t('tools.restic-command-generator.texts.backrest-plan-tag') }}</td>
            <td><code>plan:&lt;plan id&gt;</code></td>
          </tr>
          <tr>
            <td>{{ t('tools.restic-command-generator.texts.backrest-instance-tag') }}</td>
            <td><code>created-by:&lt;instance id&gt;</code></td>
          </tr>
        </tbody>
      </table>
      <div op-70 text-sm mt-3>
        {{ t('tools.restic-command-generator.texts.hint-backrest') }}
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
table {
  th,
  td {
    padding: 4px 8px;
  }
}
</style>
