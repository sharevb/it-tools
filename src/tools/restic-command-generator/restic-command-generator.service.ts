export type ResticBackend = 'local' | 's3' | 'b2' | 'sftp' | 'rest' | 'rclone' | 'azure' | 'gs' | 'raw';

export type ResticOperation =
  | 'restore'
  | 'dump'
  | 'mount'
  | 'snapshots'
  | 'ls'
  | 'find'
  | 'diff'
  | 'check'
  | 'stats'
  | 'unlock';

export type PasswordMode = 'prompt' | 'placeholder' | 'file' | 'command' | 'none';
export type CredentialsMode = 'prompt' | 'placeholder' | 'none';
export type RepositoryMode = 'flag' | 'env';
export type OverwriteMode = 'default' | 'always' | 'if-changed' | 'if-newer' | 'never';
export type StatsMode = 'restore-size' | 'files-by-contents' | 'raw-data' | 'blobs-per-file';
export type DumpArchive = 'none' | 'tar' | 'zip';

export interface ResticCommandConfig {
  operation: ResticOperation;

  // Repository
  backend: ResticBackend;
  repositoryMode: RepositoryMode;
  localPath: string;
  s3Endpoint: string;
  s3Bucket: string;
  s3Prefix: string;
  s3Region: string;
  b2Bucket: string;
  b2Prefix: string;
  sftpUser: string;
  sftpHost: string;
  sftpPort: string;
  sftpPath: string;
  restUrl: string;
  rcloneRemote: string;
  azureContainer: string;
  azurePrefix: string;
  gsBucket: string;
  gsPrefix: string;
  rawRepository: string;

  // Secrets
  passwordMode: PasswordMode;
  passwordFile: string;
  passwordCommand: string;
  credentialsMode: CredentialsMode;
  accountId: string;

  // Snapshot selection
  snapshotId: string;
  snapshotSubfolder: string;
  backrestPlan: string;
  backrestInstance: string;
  tags: string[];
  host: string;
  paths: string[];

  // restore
  target: string;
  includes: string[];
  excludes: string[];
  caseInsensitivePatterns: boolean;
  dryRun: boolean;
  verify: boolean;
  sparse: boolean;
  deleteExtraneous: boolean;
  overwrite: OverwriteMode;

  // dump
  dumpPath: string;
  dumpArchive: DumpArchive;
  dumpOutputFile: string;

  // mount
  mountPoint: string;
  allowOther: boolean;

  // ls
  lsDirectory: string;
  lsLong: boolean;
  lsRecursive: boolean;

  // find
  findPattern: string;
  findLong: boolean;
  findRestrictToSnapshot: boolean;

  // diff
  diffSnapshotId: string;
  diffMetadata: boolean;

  // snapshots
  snapshotsCompact: boolean;

  // check
  checkReadData: boolean;
  checkReadDataSubset: string;
  checkUnused: boolean;
  checkWithCache: boolean;

  // stats
  statsMode: StatsMode;
  statsAllSnapshots: boolean;

  // unlock
  unlockRemoveAll: boolean;

  // Global options
  json: boolean;
  quiet: boolean;
  verbose: boolean;
  noCache: boolean;
  noLock: boolean;
  cacheDir: string;
  limitDownload: string;
  insecureTls: boolean;
  retryLock: string;
  extraOptions: string[];
  extraArguments: string;
}

export const defaultResticCommandConfig: ResticCommandConfig = {
  operation: 'restore',

  backend: 's3',
  repositoryMode: 'flag',
  localPath: '/mnt/backups/restic-repo',
  s3Endpoint: 's3.us-west-004.backblazeb2.com',
  s3Bucket: 'my-backup-bucket',
  s3Prefix: 'backrest',
  s3Region: '',
  b2Bucket: 'my-backup-bucket',
  b2Prefix: 'backrest',
  sftpUser: 'backup',
  sftpHost: 'nas.lan',
  sftpPort: '',
  sftpPath: '/srv/restic-repo',
  restUrl: 'https://restic.lan:8000/',
  rcloneRemote: 'b2-remote:my-backup-bucket/backrest',
  azureContainer: 'my-container',
  azurePrefix: 'backrest',
  gsBucket: 'my-backup-bucket',
  gsPrefix: 'backrest',
  rawRepository: '',

  passwordMode: 'prompt',
  passwordFile: '/root/.restic-password',
  passwordCommand: 'pass show restic/repo',
  credentialsMode: 'prompt',
  accountId: '',

  snapshotId: 'latest',
  snapshotSubfolder: '',
  backrestPlan: '',
  backrestInstance: '',
  tags: [],
  host: '',
  paths: [],

  target: '/mnt/restore',
  includes: [],
  excludes: [],
  caseInsensitivePatterns: false,
  dryRun: false,
  verify: false,
  sparse: false,
  deleteExtraneous: false,
  overwrite: 'default',

  dumpPath: '/etc/hosts',
  dumpArchive: 'none',
  dumpOutputFile: '',

  mountPoint: '/mnt/restic',
  allowOther: false,

  lsDirectory: '',
  lsLong: true,
  lsRecursive: false,

  findPattern: '*.conf',
  findLong: false,
  findRestrictToSnapshot: false,

  diffSnapshotId: '',
  diffMetadata: false,

  snapshotsCompact: false,

  checkReadData: false,
  checkReadDataSubset: '',
  checkUnused: false,
  checkWithCache: false,

  statsMode: 'restore-size',
  statsAllSnapshots: false,

  unlockRemoveAll: false,

  json: false,
  quiet: false,
  verbose: false,
  noCache: false,
  noLock: false,
  cacheDir: '',
  limitDownload: '',
  insecureTls: false,
  retryLock: '',
  extraOptions: [],
  extraArguments: '',
};

// Commands that only read from the repository, and so may run with --no-lock.
const READ_ONLY_OPERATIONS: ResticOperation[] = [
  'restore',
  'dump',
  'mount',
  'snapshots',
  'ls',
  'find',
  'diff',
  'stats',
];

// Commands that accept the --host/--tag/--path snapshot filters, mostly used to
// pick which snapshot `latest` resolves to.
const FILTERABLE_OPERATIONS: ResticOperation[] = ['restore', 'dump', 'mount', 'snapshots', 'ls', 'find', 'stats'];

// Commands that take a snapshot ID as positional argument.
const SNAPSHOT_OPERATIONS: ResticOperation[] = ['restore', 'dump', 'mount', 'ls', 'find', 'diff', 'stats'];

// Characters a POSIX shell passes through untouched, so simple values stay readable.
const SAFE_ARGUMENT_RE = /^[\w~@%+=:,./-]+$/;

export function supportsSnapshotFilters(operation: ResticOperation): boolean {
  return FILTERABLE_OPERATIONS.includes(operation);
}

export function supportsSnapshotSelection(operation: ResticOperation): boolean {
  return SNAPSHOT_OPERATIONS.includes(operation);
}

export function supportsNoLock(operation: ResticOperation): boolean {
  return READ_ONLY_OPERATIONS.includes(operation);
}

export function quoteShellArg(value: string): string {
  if (value === '') {
    return "''";
  }

  if (SAFE_ARGUMENT_RE.test(value)) {
    return value;
  }

  return `'${value.replace(/'/g, "'\\''")}'`;
}

function cleanList(values: string[] | undefined): string[] {
  return (values ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
}

function trimSlashes(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, '');
}

function joinRepositoryPath(...parts: string[]): string {
  return parts
    .map(trimSlashes)
    .filter((part) => part.length > 0)
    .join('/');
}

export function buildRepositoryUri(config: ResticCommandConfig): string {
  switch (config.backend) {
    case 'local':
      return config.localPath.trim() || '/path/to/restic-repo';
    case 's3': {
      const endpoint =
        config.s3Endpoint
          .trim()
          .replace(/^https?:\/\//, '')
          .replace(/\/+$/, '') || 's3.amazonaws.com';
      const path = joinRepositoryPath(config.s3Bucket, config.s3Prefix) || 'my-backup-bucket';
      return `s3:${endpoint}/${path}`;
    }
    case 'b2':
      return `b2:${trimSlashes(config.b2Bucket) || 'my-backup-bucket'}:${trimSlashes(config.b2Prefix) || '/'}`;
    case 'sftp': {
      const user = config.sftpUser.trim();
      const host = config.sftpHost.trim() || 'backup-host';
      const port = config.sftpPort.trim();
      const path = config.sftpPath.trim() || '/srv/restic-repo';
      const userPrefix = user ? `${user}@` : '';

      if (port) {
        // The URL form is the only one that takes a port; an absolute path needs
        // the extra slash (sftp://host:22//srv/repo).
        return `sftp://${userPrefix}${host}:${port}/${path.startsWith('/') ? `/${trimSlashes(path)}` : path}`;
      }

      return `sftp:${userPrefix}${host}:${path}`;
    }
    case 'rest':
      return `rest:${config.restUrl.trim() || 'https://restic-server:8000/'}`;
    case 'rclone':
      return `rclone:${config.rcloneRemote.trim() || 'remote:path/to/repo'}`;
    case 'azure':
      return `azure:${trimSlashes(config.azureContainer) || 'my-container'}:/${trimSlashes(config.azurePrefix)}`;
    case 'gs':
      return `gs:${trimSlashes(config.gsBucket) || 'my-backup-bucket'}:/${trimSlashes(config.gsPrefix)}`;
    case 'raw':
    default:
      return config.rawRepository.trim() || '<repository URI>';
  }
}

export interface BackendCredential {
  name: string;
  value: string;
  secret: boolean;
}

export function getBackendCredentials(config: ResticCommandConfig): BackendCredential[] {
  const accountId = config.accountId.trim();

  switch (config.backend) {
    case 's3': {
      const credentials: BackendCredential[] = [
        { name: 'AWS_ACCESS_KEY_ID', value: accountId || '<key ID>', secret: false },
        { name: 'AWS_SECRET_ACCESS_KEY', value: '<application key>', secret: true },
      ];

      if (config.s3Region.trim()) {
        credentials.push({ name: 'AWS_DEFAULT_REGION', value: config.s3Region.trim(), secret: false });
      }

      return credentials;
    }
    case 'b2':
      return [
        { name: 'B2_ACCOUNT_ID', value: accountId || '<key ID>', secret: false },
        { name: 'B2_ACCOUNT_KEY', value: '<application key>', secret: true },
      ];
    case 'azure':
      return [
        { name: 'AZURE_ACCOUNT_NAME', value: accountId || '<storage account>', secret: false },
        { name: 'AZURE_ACCOUNT_KEY', value: '<account key>', secret: true },
      ];
    case 'gs':
      return [
        { name: 'GOOGLE_PROJECT_ID', value: accountId || '<project ID>', secret: false },
        { name: 'GOOGLE_APPLICATION_CREDENTIALS', value: '/path/to/service-account.json', secret: false },
      ];
    default:
      return [];
  }
}

function buildReadSecretLine(name: string): string {
  return `read -rsp '${name}: ' ${name} && echo && export ${name}`;
}

export function buildEnvironmentLines(config: ResticCommandConfig): string[] {
  const lines: string[] = [];

  if (config.repositoryMode === 'env') {
    lines.push(`export RESTIC_REPOSITORY=${quoteShellArg(buildRepositoryUri(config))}`);
  }

  if (config.passwordMode === 'prompt') {
    lines.push(buildReadSecretLine('RESTIC_PASSWORD'));
  } else if (config.passwordMode === 'placeholder') {
    lines.push(`export RESTIC_PASSWORD=${quoteShellArg('<repository password>')}`);
  }

  if (config.credentialsMode !== 'none') {
    for (const credential of getBackendCredentials(config)) {
      if (credential.secret && config.credentialsMode === 'prompt') {
        lines.push(buildReadSecretLine(credential.name));
      } else {
        lines.push(`export ${credential.name}=${quoteShellArg(credential.value)}`);
      }
    }
  }

  return lines;
}

export function buildSnapshotArgument(config: ResticCommandConfig): string {
  const snapshotId = config.snapshotId.trim() || 'latest';
  const subfolder = config.snapshotSubfolder.trim();

  if (!subfolder) {
    return snapshotId;
  }

  return `${snapshotId}:${subfolder.startsWith('/') ? subfolder : `/${subfolder}`}`;
}

export function buildTagFilters(config: ResticCommandConfig): string[] {
  const backrestTags: string[] = [];

  if (config.backrestPlan.trim()) {
    backrestTags.push(`plan:${config.backrestPlan.trim()}`);
  }
  if (config.backrestInstance.trim()) {
    backrestTags.push(`created-by:${config.backrestInstance.trim()}`);
  }

  // Tags inside a single --tag are ANDed, repeated --tag flags are ORed, so the
  // plan and the instance of the same snapshot must stay in one flag.
  const tagFilters = backrestTags.length > 0 ? [backrestTags.join(',')] : [];

  return [...tagFilters, ...cleanList(config.tags)];
}

export function buildResticArgumentGroups(config: ResticCommandConfig): string[] {
  const groups: string[] = [];
  const push = (flag: string, value?: string) => {
    groups.push(value === undefined ? flag : `${flag} ${quoteShellArg(value)}`);
  };
  const pushPositional = (value: string) => {
    groups.push(quoteShellArg(value));
  };
  const pushSnapshotFilters = () => {
    if (config.host.trim()) {
      push('--host', config.host.trim());
    }
    for (const tag of buildTagFilters(config)) {
      push('--tag', tag);
    }
    for (const path of cleanList(config.paths)) {
      push('--path', path);
    }
  };

  if (config.repositoryMode === 'flag') {
    push('-r', buildRepositoryUri(config));
  }
  if (config.passwordMode === 'file' && config.passwordFile.trim()) {
    push('--password-file', config.passwordFile.trim());
  }
  if (config.passwordMode === 'command' && config.passwordCommand.trim()) {
    push('--password-command', config.passwordCommand.trim());
  }
  if (config.cacheDir.trim()) {
    push('--cache-dir', config.cacheDir.trim());
  }
  if (config.noCache) {
    push('--no-cache');
  }
  if (config.noLock && supportsNoLock(config.operation)) {
    push('--no-lock');
  }
  if (config.limitDownload.trim()) {
    push('--limit-download', config.limitDownload.trim());
  }
  if (config.retryLock.trim()) {
    push('--retry-lock', config.retryLock.trim());
  }
  if (config.insecureTls) {
    push('--insecure-tls');
  }
  for (const option of cleanList(config.extraOptions)) {
    push('-o', option);
  }
  if (config.json) {
    push('--json');
  }
  if (config.quiet) {
    push('--quiet');
  }
  if (config.verbose) {
    push('--verbose');
  }

  groups.push(config.operation);

  const snapshotArgument = buildSnapshotArgument(config);
  const includeFlag = config.caseInsensitivePatterns ? '--iinclude' : '--include';
  const excludeFlag = config.caseInsensitivePatterns ? '--iexclude' : '--exclude';

  switch (config.operation) {
    case 'restore': {
      push('--target', config.target.trim() || '/mnt/restore');
      for (const include of cleanList(config.includes)) {
        push(includeFlag, include);
      }
      for (const exclude of cleanList(config.excludes)) {
        push(excludeFlag, exclude);
      }
      if (config.overwrite !== 'default') {
        push('--overwrite', config.overwrite);
      }
      if (config.deleteExtraneous) {
        push('--delete');
      }
      if (config.sparse) {
        push('--sparse');
      }
      if (config.verify) {
        push('--verify');
      }
      if (config.dryRun) {
        push('--dry-run');
      }
      pushSnapshotFilters();
      pushPositional(snapshotArgument);
      break;
    }
    case 'dump': {
      if (config.dumpArchive !== 'none') {
        push('--archive', config.dumpArchive);
      }
      pushSnapshotFilters();
      pushPositional(snapshotArgument);
      pushPositional(config.dumpPath.trim() || '/');
      break;
    }
    case 'mount': {
      if (config.allowOther) {
        push('--allow-other');
      }
      pushSnapshotFilters();
      pushPositional(config.mountPoint.trim() || '/mnt/restic');
      break;
    }
    case 'snapshots': {
      if (config.snapshotsCompact) {
        push('--compact');
      }
      pushSnapshotFilters();
      break;
    }
    case 'ls': {
      if (config.lsLong) {
        push('--long');
      }
      if (config.lsRecursive) {
        push('--recursive');
      }
      pushSnapshotFilters();
      pushPositional(snapshotArgument);
      if (config.lsDirectory.trim()) {
        pushPositional(config.lsDirectory.trim());
      }
      break;
    }
    case 'find': {
      if (config.findLong) {
        push('--long');
      }
      if (config.caseInsensitivePatterns) {
        push('--ignore-case');
      }
      if (config.findRestrictToSnapshot) {
        push('--snapshot', config.snapshotId.trim() || 'latest');
      }
      pushSnapshotFilters();
      pushPositional(config.findPattern.trim() || '*');
      break;
    }
    case 'diff': {
      if (config.diffMetadata) {
        push('--metadata');
      }
      pushPositional(snapshotArgument);
      pushPositional(config.diffSnapshotId.trim() || 'latest');
      break;
    }
    case 'check': {
      if (config.checkReadDataSubset.trim()) {
        groups.push(`--read-data-subset=${quoteShellArg(config.checkReadDataSubset.trim())}`);
      } else if (config.checkReadData) {
        push('--read-data');
      }
      if (config.checkUnused) {
        push('--check-unused');
      }
      if (config.checkWithCache) {
        push('--with-cache');
      }
      break;
    }
    case 'stats': {
      push('--mode', config.statsMode);
      pushSnapshotFilters();
      if (!config.statsAllSnapshots) {
        pushPositional(snapshotArgument);
      }
      break;
    }
    case 'unlock': {
      if (config.unlockRemoveAll) {
        push('--remove-all');
      }
      break;
    }
  }

  return groups;
}

export function buildResticCommand(config: ResticCommandConfig, { multiline = false } = {}): string {
  const groups = buildResticArgumentGroups(config);

  if (config.extraArguments.trim()) {
    groups.push(config.extraArguments.trim());
  }

  const separator = multiline ? ' \\\n  ' : ' ';
  let command = `restic${separator}${groups.join(separator)}`;

  if (config.operation === 'dump' && config.dumpOutputFile.trim()) {
    command += ` > ${quoteShellArg(config.dumpOutputFile.trim())}`;
  }

  return command;
}

export function buildResticScript(
  config: ResticCommandConfig,
  { multiline = false, includeEnvironment = true } = {},
): string {
  const environmentLines = includeEnvironment ? buildEnvironmentLines(config) : [];
  const command = buildResticCommand(config, { multiline });

  if (environmentLines.length === 0) {
    return command;
  }

  return `${environmentLines.join('\n')}\n\n${command}`;
}
