import { describe, expect, it } from 'vitest';
import {
  type ResticCommandConfig,
  buildEnvironmentLines,
  buildRepositoryUri,
  buildResticCommand,
  buildResticScript,
  buildSnapshotArgument,
  buildTagFilters,
  defaultResticCommandConfig,
  quoteShellArg,
} from './restic-command-generator.service';

function makeConfig(overrides: Partial<ResticCommandConfig> = {}): ResticCommandConfig {
  return { ...defaultResticCommandConfig, ...overrides };
}

const b2Repository = 's3:s3.us-west-004.backblazeb2.com/my-backup-bucket/backrest';

describe('restic-command-generator.service', () => {
  describe('quoteShellArg', () => {
    it('leaves shell-safe values untouched', () => {
      expect(quoteShellArg('/mnt/restore')).toBe('/mnt/restore');
      expect(quoteShellArg('plan:daily-docs')).toBe('plan:daily-docs');
      expect(quoteShellArg('~/restore')).toBe('~/restore');
      expect(quoteShellArg(b2Repository)).toBe(b2Repository);
    });

    it('quotes globs so the shell does not expand them', () => {
      expect(quoteShellArg('/home/me/**/*.pdf')).toBe("'/home/me/**/*.pdf'");
      expect(quoteShellArg('my documents')).toBe("'my documents'");
    });

    it('escapes single quotes', () => {
      expect(quoteShellArg("/data/o'brien/notes")).toBe("'/data/o'\\''brien/notes'");
    });

    it('quotes empty values', () => {
      expect(quoteShellArg('')).toBe("''");
    });
  });

  describe('buildRepositoryUri', () => {
    it('builds a local repository path', () => {
      expect(buildRepositoryUri(makeConfig({ backend: 'local', localPath: '/mnt/backups/repo' }))).toBe(
        '/mnt/backups/repo',
      );
    });

    it('builds an S3 compatible uri and drops the scheme of the endpoint', () => {
      expect(buildRepositoryUri(makeConfig())).toBe(b2Repository);
      expect(
        buildRepositoryUri(
          makeConfig({
            s3Endpoint: 'https://s3.eu-central-003.backblazeb2.com/',
            s3Bucket: '/bucket/',
            s3Prefix: '/nested/path/',
          }),
        ),
      ).toBe('s3:s3.eu-central-003.backblazeb2.com/bucket/nested/path');
    });

    it('builds a Backblaze B2 native uri', () => {
      expect(buildRepositoryUri(makeConfig({ backend: 'b2', b2Bucket: 'bucket', b2Prefix: 'backrest' }))).toBe(
        'b2:bucket:backrest',
      );
      expect(buildRepositoryUri(makeConfig({ backend: 'b2', b2Bucket: 'bucket', b2Prefix: '' }))).toBe('b2:bucket:/');
    });

    it('builds sftp uris, switching to the url form when a port is given', () => {
      expect(
        buildRepositoryUri(
          makeConfig({ backend: 'sftp', sftpUser: 'backup', sftpHost: 'nas.lan', sftpPath: '/srv/repo' }),
        ),
      ).toBe('sftp:backup@nas.lan:/srv/repo');
      expect(
        buildRepositoryUri(
          makeConfig({
            backend: 'sftp',
            sftpUser: 'backup',
            sftpHost: 'nas.lan',
            sftpPort: '2222',
            sftpPath: '/srv/repo',
          }),
        ),
      ).toBe('sftp://backup@nas.lan:2222//srv/repo');
    });

    it('builds the remaining backend uris', () => {
      expect(buildRepositoryUri(makeConfig({ backend: 'rest', restUrl: 'https://restic.lan:8000/' }))).toBe(
        'rest:https://restic.lan:8000/',
      );
      expect(buildRepositoryUri(makeConfig({ backend: 'rclone', rcloneRemote: 'b2:bucket/repo' }))).toBe(
        'rclone:b2:bucket/repo',
      );
      expect(
        buildRepositoryUri(makeConfig({ backend: 'azure', azureContainer: 'container', azurePrefix: 'backrest' })),
      ).toBe('azure:container:/backrest');
      expect(buildRepositoryUri(makeConfig({ backend: 'gs', gsBucket: 'bucket', gsPrefix: '' }))).toBe('gs:bucket:/');
      expect(buildRepositoryUri(makeConfig({ backend: 'raw', rawRepository: 'swift:container:/repo' }))).toBe(
        'swift:container:/repo',
      );
    });
  });

  describe('buildSnapshotArgument', () => {
    it('defaults to latest', () => {
      expect(buildSnapshotArgument(makeConfig({ snapshotId: '' }))).toBe('latest');
    });

    it('appends the subfolder with a leading slash', () => {
      expect(buildSnapshotArgument(makeConfig({ snapshotId: '4bba301e', snapshotSubfolder: 'home/me' }))).toBe(
        '4bba301e:/home/me',
      );
      expect(buildSnapshotArgument(makeConfig({ snapshotId: 'latest', snapshotSubfolder: '/etc' }))).toBe(
        'latest:/etc',
      );
    });
  });

  describe('buildTagFilters', () => {
    it('ands the Backrest plan and instance into a single tag filter', () => {
      expect(buildTagFilters(makeConfig({ backrestPlan: 'daily-docs', backrestInstance: 'homelab' }))).toEqual([
        'plan:daily-docs,created-by:homelab',
      ]);
    });

    it('keeps extra tags as separate (ORed) filters', () => {
      expect(buildTagFilters(makeConfig({ backrestPlan: 'daily-docs', tags: ['manual', ' ', 'pre-upgrade'] }))).toEqual(
        ['plan:daily-docs', 'manual', 'pre-upgrade'],
      );
    });
  });

  describe('buildResticCommand', () => {
    it('generates a full restore of the latest snapshot', () => {
      expect(buildResticCommand(makeConfig())).toBe(`restic -r ${b2Repository} restore --target /mnt/restore latest`);
    });

    it('generates a partial restore filtered on a Backrest plan', () => {
      const command = buildResticCommand(
        makeConfig({
          backrestPlan: 'daily-docs',
          backrestInstance: 'homelab',
          includes: ['/home/me/documents/**/*.pdf'],
          excludes: ['/home/me/documents/tmp'],
          target: '/mnt/restore',
          dryRun: true,
          verify: true,
        }),
      );

      expect(command).toBe(
        `restic -r ${b2Repository} restore --target /mnt/restore ` +
          `--include '/home/me/documents/**/*.pdf' --exclude /home/me/documents/tmp ` +
          '--verify --dry-run --tag plan:daily-docs,created-by:homelab latest',
      );
    });

    it('uses the case insensitive pattern flags when asked', () => {
      const command = buildResticCommand(
        makeConfig({ includes: ['*.PDF'], excludes: ['*.tmp'], caseInsensitivePatterns: true }),
      );

      expect(command).toContain("--iinclude '*.PDF'");
      expect(command).toContain("--iexclude '*.tmp'");
    });

    it('restores a subfolder of a given snapshot with overwrite and delete', () => {
      const command = buildResticCommand(
        makeConfig({
          snapshotId: '4bba301e',
          snapshotSubfolder: '/var/lib/postgresql',
          target: '/srv/restore',
          overwrite: 'if-newer',
          deleteExtraneous: true,
          sparse: true,
        }),
      );

      expect(command).toBe(
        `restic -r ${b2Repository} restore --target /srv/restore --overwrite if-newer --delete --sparse ` +
          '4bba301e:/var/lib/postgresql',
      );
    });

    it('dumps a single file and redirects it to a local file', () => {
      const command = buildResticCommand(
        makeConfig({
          operation: 'dump',
          dumpPath: '/etc/nginx/nginx.conf',
          dumpOutputFile: './nginx.conf',
          backrestPlan: 'daily-docs',
        }),
      );

      expect(command).toBe(
        `restic -r ${b2Repository} dump --tag plan:daily-docs latest /etc/nginx/nginx.conf > ./nginx.conf`,
      );
    });

    it('dumps a folder as a tar archive', () => {
      expect(
        buildResticCommand(makeConfig({ operation: 'dump', dumpArchive: 'tar', dumpPath: '/home/me/documents' })),
      ).toBe(`restic -r ${b2Repository} dump --archive tar latest /home/me/documents`);
    });

    it('generates the snapshots, ls, find, diff, check, stats and unlock commands', () => {
      expect(buildResticCommand(makeConfig({ operation: 'snapshots', backrestPlan: 'daily-docs' }))).toBe(
        `restic -r ${b2Repository} snapshots --tag plan:daily-docs`,
      );
      expect(
        buildResticCommand(makeConfig({ operation: 'ls', lsRecursive: true, lsDirectory: '/home/me/documents' })),
      ).toBe(`restic -r ${b2Repository} ls --long --recursive latest /home/me/documents`);
      expect(
        buildResticCommand(
          makeConfig({ operation: 'find', findPattern: '*.kdbx', caseInsensitivePatterns: true, findLong: true }),
        ),
      ).toBe(`restic -r ${b2Repository} find --long --ignore-case '*.kdbx'`);
      expect(
        buildResticCommand(makeConfig({ operation: 'find', findRestrictToSnapshot: true, snapshotId: '4bba301e' })),
      ).toBe(`restic -r ${b2Repository} find --snapshot 4bba301e '*.conf'`);
      expect(
        buildResticCommand(makeConfig({ operation: 'diff', snapshotId: '4bba301e', diffSnapshotId: 'latest' })),
      ).toBe(`restic -r ${b2Repository} diff 4bba301e latest`);
      expect(buildResticCommand(makeConfig({ operation: 'check', checkReadDataSubset: '5%' }))).toBe(
        `restic -r ${b2Repository} check --read-data-subset=5%`,
      );
      expect(buildResticCommand(makeConfig({ operation: 'stats', statsAllSnapshots: true }))).toBe(
        `restic -r ${b2Repository} stats --mode restore-size`,
      );
      expect(buildResticCommand(makeConfig({ operation: 'unlock', unlockRemoveAll: true }))).toBe(
        `restic -r ${b2Repository} unlock --remove-all`,
      );
    });

    it('mounts the repository on a mount point', () => {
      expect(buildResticCommand(makeConfig({ operation: 'mount', mountPoint: '/mnt/restic', allowOther: true }))).toBe(
        `restic -r ${b2Repository} mount --allow-other /mnt/restic`,
      );
    });

    it('adds global options, host and path filters', () => {
      const command = buildResticCommand(
        makeConfig({
          operation: 'snapshots',
          host: 'homelab',
          paths: ['/home/me/documents'],
          noLock: true,
          noCache: true,
          limitDownload: '2048',
          retryLock: '5m',
          insecureTls: true,
          extraOptions: ['s3.connections=4'],
          json: true,
        }),
      );

      expect(command).toBe(
        `restic -r ${b2Repository} --no-cache --no-lock --limit-download 2048 --retry-lock 5m --insecure-tls ` +
          '-o s3.connections=4 --json snapshots --host homelab --path /home/me/documents',
      );
    });

    it('only adds --no-lock on read-only commands', () => {
      expect(buildResticCommand(makeConfig({ operation: 'ls', noLock: true }))).toContain('--no-lock');
      expect(buildResticCommand(makeConfig({ operation: 'check', noLock: true }))).not.toContain('--no-lock');
    });

    it('uses the password flags instead of environment variables when asked', () => {
      expect(
        buildResticCommand(makeConfig({ passwordMode: 'file', passwordFile: '/root/.restic-password' })),
      ).toContain('--password-file /root/.restic-password');
      expect(
        buildResticCommand(makeConfig({ passwordMode: 'command', passwordCommand: 'pass show restic/repo' })),
      ).toContain("--password-command 'pass show restic/repo'");
    });

    it('omits the repository flag when the repository comes from the environment', () => {
      expect(buildResticCommand(makeConfig({ repositoryMode: 'env', operation: 'snapshots' }))).toBe(
        'restic snapshots',
      );
    });

    it('appends free-form extra arguments verbatim', () => {
      expect(buildResticCommand(makeConfig({ operation: 'snapshots', extraArguments: '--group-by host,tags' }))).toBe(
        `restic -r ${b2Repository} snapshots --group-by host,tags`,
      );
    });

    it('can break the command over several lines', () => {
      expect(buildResticCommand(makeConfig({ operation: 'snapshots' }), { multiline: true })).toBe(
        `restic \\\n  -r ${b2Repository} \\\n  snapshots`,
      );
    });
  });

  describe('buildEnvironmentLines', () => {
    it('prompts for the secrets by default', () => {
      expect(buildEnvironmentLines(makeConfig())).toEqual([
        "read -rsp 'RESTIC_PASSWORD: ' RESTIC_PASSWORD && echo && export RESTIC_PASSWORD",
        "export AWS_ACCESS_KEY_ID='<key ID>'",
        "read -rsp 'AWS_SECRET_ACCESS_KEY: ' AWS_SECRET_ACCESS_KEY && echo && export AWS_SECRET_ACCESS_KEY",
      ]);
    });

    it('exports placeholders when literal exports are chosen', () => {
      expect(
        buildEnvironmentLines(
          makeConfig({
            backend: 'b2',
            repositoryMode: 'env',
            passwordMode: 'placeholder',
            credentialsMode: 'placeholder',
            accountId: '0026b1c',
          }),
        ),
      ).toEqual([
        'export RESTIC_REPOSITORY=b2:my-backup-bucket:backrest',
        "export RESTIC_PASSWORD='<repository password>'",
        'export B2_ACCOUNT_ID=0026b1c',
        "export B2_ACCOUNT_KEY='<application key>'",
      ]);
    });

    it('exports the region when one is set', () => {
      expect(buildEnvironmentLines(makeConfig({ s3Region: 'us-west-004', credentialsMode: 'placeholder' }))).toContain(
        'export AWS_DEFAULT_REGION=us-west-004',
      );
    });

    it('emits nothing when secrets are handled outside of the snippet', () => {
      expect(buildEnvironmentLines(makeConfig({ passwordMode: 'none', credentialsMode: 'none' }))).toEqual([]);
    });

    it('emits no credentials for backends that do not need any', () => {
      expect(buildEnvironmentLines(makeConfig({ backend: 'local', passwordMode: 'none' }))).toEqual([]);
    });
  });

  describe('buildResticScript', () => {
    it('puts the environment setup above the command', () => {
      expect(
        buildResticScript(makeConfig({ backend: 'local', operation: 'snapshots', passwordMode: 'placeholder' })),
      ).toBe("export RESTIC_PASSWORD='<repository password>'\n\nrestic -r /mnt/backups/restic-repo snapshots");
    });

    it('returns the bare command when the environment setup is skipped', () => {
      expect(
        buildResticScript(makeConfig({ backend: 'local', operation: 'snapshots' }), { includeEnvironment: false }),
      ).toBe('restic -r /mnt/backups/restic-repo snapshots');
    });
  });
});
