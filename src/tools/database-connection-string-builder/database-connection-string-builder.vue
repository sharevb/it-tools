<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const dbType = useQueryParamOrStorage({ name: 'type', storageName: 'conn-string-builder:t', defaultValue: 'postgres' });
const dbOptions = [
  { label: t('tools.database-connection-string-builder.texts.label-mysql'), value: 'mysql' },
  { label: t('tools.database-connection-string-builder.texts.label-postgresql'), value: 'postgres' },
  { label: t('tools.database-connection-string-builder.texts.label-sql-server'), value: 'sqlserver' },
  { label: t('tools.database-connection-string-builder.texts.label-sqlite'), value: 'sqlite' },
  { label: t('tools.database-connection-string-builder.texts.label-mongodb'), value: 'mongodb' },
];

const formatOptions = [
  { label: t('tools.database-connection-string-builder.texts.label-uri-scheme'), value: 'uri' },
  { label: t('tools.database-connection-string-builder.texts.label-keyword-value-pairs'), value: 'kvp' },
];

const authOptions: Record<string, { label: string; value: string }[]> = {
  mysql: [{ label: t('tools.database-connection-string-builder.texts.label-username-password'), value: 'basic' }],
  postgres: [
    { label: t('tools.database-connection-string-builder.texts.label-username-password'), value: 'basic' },
    { label: t('tools.database-connection-string-builder.texts.label-peer'), value: 'peer' },
    { label: t('tools.database-connection-string-builder.texts.label-gssapi-sspi'), value: 'gssapi' },
  ],
  sqlserver: [
    { label: t('tools.database-connection-string-builder.texts.label-username-password'), value: 'basic' },
    { label: t('tools.database-connection-string-builder.texts.label-windows-integrated'), value: 'windows' },
  ],
  sqlite: [],
  mongodb: [
    { label: t('tools.database-connection-string-builder.texts.label-username-password-scram'), value: 'basic' },
    { label: t('tools.database-connection-string-builder.texts.label-x-509-certificate'), value: 'x509' },
  ],
};

const form = ref({
  host: '',
  port: undefined,
  username: '',
  password: '',
  database: '',
  filePath: '',
  ssl: false,
  timeout: undefined,
  extra: '',
  authType: 'basic',
  format: 'uri',
});

const defaultPorts: Record<string, number> = {
  mysql: 3306,
  postgres: 5432,
  sqlserver: 1433,
  mongodb: 27017,
  // sqlite has no port
};

function getPort(db: string, port?: number) {
  if (port && port > 0) {
    return port;
  }
  return defaultPorts[db] || undefined;
}

const connectionString = computed(() => {
  const { host, port, username, password, database, filePath, ssl, timeout, extra, authType, format } = form.value;

  const effectivePort = getPort(dbType.value, port);

  const sslParam = ssl ? (format === 'uri' ? 'ssl=true' : 'Encrypt=true;') : (format === 'uri' ? 'ssl=false' : 'Encrypt=false;');
  const timeoutParam = timeout ? (format === 'uri' ? `connectTimeout=${timeout}` : `Connection Timeout=${timeout};`) : '';
  const extras = format === 'uri'
    ? [sslParam, timeoutParam, extra].filter(Boolean).join('&')
    : [sslParam, timeoutParam, extra].filter(Boolean).join('');

  const suffix = format === 'uri' && extras ? `?${extras}` : '';

  switch (dbType.value) {
    case 'mysql':
      return format === 'uri'
        ? `mysql://${username}:${password}@${host}:${effectivePort}/${database}${suffix}`
        : `Server=${host};Port=${effectivePort};Database=${database};User Id=${username};Password=${password};${extras}`;
    case 'postgres':
      if (authType === 'peer') {
        return format === 'uri'
          ? `postgresql://${host}/${database}${suffix}`
          : `Host=${host};Database=${database};Integrated Security=true;${extras}`;
      }
      if (authType === 'gssapi') {
        return format === 'uri'
          ? `postgresql://${host}:${effectivePort}/${database}?auth=gssapi${suffix}`
          : `Host=${host};Port=${effectivePort};Database=${database};Integrated Security=SSPI;${extras}`;
      }
      return format === 'uri'
        ? `postgresql://${username}:${password}@${host}:${effectivePort}/${database}${suffix}`
        : `Host=${host};Port=${effectivePort};Database=${database};User Id=${username};Password=${password};${extras}`;
    case 'sqlserver':
      if (authType === 'windows') {
        return format === 'uri'
          ? `mssql://${host}:${effectivePort};database=${database};trusted_connection=true${suffix}`
          : `Server=${host},${effectivePort};Database=${database};Trusted_Connection=True;${extras}`;
      }
      return format === 'uri'
        ? `mssql://${username}:${password}@${host}:${effectivePort}/${database}${suffix}`
        : `Server=${host},${effectivePort};Database=${database};User Id=${username};Password=${password};${extras}`;
    case 'sqlite':
      return format === 'uri'
        ? `sqlite://${filePath}${suffix}`
        : `Data Source=${filePath};${extras}`;
    case 'mongodb':
      if (authType === 'x509') {
        return format === 'uri'
          ? `mongodb://@${host}:${effectivePort}/${database}?authMechanism=MONGODB-X509${suffix}`
          : `Server=${host}:${effectivePort};Database=${database};AuthMechanism=MONGODB-X509;${extras}`;
      }
      return format === 'uri'
        ? `mongodb://${username}:${password}@${host}:${effectivePort}/${database}${suffix}`
        : `Server=${host}:${effectivePort};Database=${database};User Id=${username};Password=${password};${extras}`;
    default:
      return '';
  }
});
</script>

<template>
  <n-card :title="t('tools.database-connection-string-builder.texts.title-database-connection-string-generator')" style="max-width: 750px; margin: auto;">
    <c-select
      v-model:value="dbType"
      :options="dbOptions"
      :placeholder="t('tools.database-connection-string-builder.texts.placeholder-select-a-database')"
      :label="t('tools.database-connection-string-builder.texts.label-database-type')"
      label-position="left"
      mb-2
    />

    <c-select
      v-model:value="form.format"
      :options="formatOptions"
      :placeholder="t('tools.database-connection-string-builder.texts.placeholder-select-format')"
      :label="t('tools.database-connection-string-builder.texts.label-connection-string-format')"
      label-position="left"
      mb-2
    />

    <n-divider>{{ t('tools.database-connection-string-builder.texts.tag-options') }}</n-divider>

    <n-form :model="form" label-placement="left" label-width="140">
      <n-form-item v-if="authOptions[dbType]?.length" :label="t('tools.database-connection-string-builder.texts.label-authentication-type')">
        <n-select
          v-model:value="form.authType"
          :options="authOptions[dbType]"
          :placeholder="t('tools.database-connection-string-builder.texts.placeholder-select-authentication')"
        />
      </n-form-item>

      <template v-if="dbType !== 'sqlite'">
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-host')">
          <n-input v-model:value="form.host" :placeholder="t('tools.database-connection-string-builder.texts.placeholder-e-g-localhost')" />
        </n-form-item>
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-port')">
          <n-input-number v-model:value="form.port" :min="1" :max="65535" />
        </n-form-item>
      </template>

      <template v-if="dbType !== 'sqlite' && form.authType !== 'peer' && form.authType !== 'windows' && form.authType !== 'x509'">
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-username')">
          <n-input v-model:value="form.username" />
        </n-form-item>
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-password')">
          <n-input v-model:value="form.password" type="password" />
        </n-form-item>
      </template>

      <n-form-item :label="t('tools.database-connection-string-builder.texts.label-database')">
        <n-input v-model:value="form.database" :placeholder="t('tools.database-connection-string-builder.texts.placeholder-e-g-mydb')" />
      </n-form-item>

      <n-form-item v-if="dbType === 'sqlite'" :label="t('tools.database-connection-string-builder.texts.label-file-path')">
        <n-input v-model:value="form.filePath" :placeholder="t('tools.database-connection-string-builder.texts.placeholder-path-to-sqlite-db')" />
      </n-form-item>

      <details mb-3>
        <summary>{{ t('tools.database-connection-string-builder.texts.tag-advanced-options') }}</summary>
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-ssl-enabled')">
          <n-switch v-model:value="form.ssl" />
        </n-form-item>
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-timeout-s')">
          <n-input-number v-model:value="form.timeout" :min="0" />
        </n-form-item>
        <n-form-item :label="t('tools.database-connection-string-builder.texts.label-extra-params')">
          <n-input v-model:value="form.extra" :placeholder="t('tools.database-connection-string-builder.texts.placeholder-e-g-charset-utf8-applicationname-myapp')" />
        </n-form-item>
      </details>
    </n-form>

    <c-card :title="t('tools.database-connection-string-builder.texts.title-generate-connection-string')">
      <textarea-copyable :value="connectionString" />
    </c-card>
  </n-card>
</template>
