<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { multiRandFromArray } from '@/utils/random';

const { t } = useI18n();

const dbType = useQueryParamOrStorage({ name: 'type', storageName: 'db-create:t', defaultValue: 'mysql' });
const dbName = useQueryParamOrStorage({ name: 'db', storageName: 'db-create:d', defaultValue: 'test' });
const serverAddress = useQueryParamOrStorage({ name: 'server', storageName: 'db-create:s', defaultValue: '' });
const account = useQueryParamOrStorage({ name: 'account', storageName: 'db-create:a', defaultValue: 'admin' });

const password = ref('');
const permissions = ref<string[]>([]);
const sqlOutput = ref('');

// Oracle quoted identifiers and passwords cannot contain `"`, and there is no way to escape it
const accountError = computed(() =>
  dbType.value === 'oracle' && account.value.includes('"')
    ? t('tools.database-builder.texts.error-oracle-account-double-quote')
    : undefined,
);
const passwordError = computed(() =>
  dbType.value === 'oracle' && password.value.includes('"')
    ? t('tools.database-builder.texts.error-oracle-password-double-quote')
    : undefined,
);

function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return multiRandFromArray([...chars], length).join('');
}

// Quote user input so a quote, backtick or bracket cannot end the literal or identifier early
const sqlString = (value: string) => `'${value.replace(/'/g, "''")}'`;
// E'' treats backslashes as escapes whatever standard_conforming_strings is set to
const pgString = (value: string) =>
  value.includes('\\') ? `E'${value.replace(/\\/g, '\\\\').replace(/'/g, "''")}'` : sqlString(value);
const mysqlString = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
const mysqlIdentifier = (value: string) => `\`${value.replace(/`/g, '``')}\``;
const pgIdentifier = (value: string) => `"${value.replace(/"/g, '""')}"`;
const sqlServerIdentifier = (value: string) => `[${value.replace(/]/g, ']]')}]`;
// Quoting makes Oracle names case-sensitive, so plain names stay unquoted (names with `"` are rejected by accountError)
const oracleIdentifier = (value: string) => (/^[A-Za-z][\w$#]*$/.test(value) ? value : `"${value}"`);
const sqlComment = (value: string) => value.replace(/[\r\n]+/g, ' ');

function generateSQL() {
  if (accountError.value || passwordError.value) {
    sqlOutput.value = '';
    return;
  }
  const pwd = password.value || generateRandomPassword();
  const perms = permissions.value.length > 0 ? permissions.value.join(', ') : 'ALL PRIVILEGES';

  let sql = '';

  switch (dbType.value) {
    case 'mysql':
      sql = `
CREATE DATABASE IF NOT EXISTS ${mysqlIdentifier(dbName.value)};
CREATE USER IF NOT EXISTS ${mysqlString(account.value)}@${mysqlString(serverAddress.value || '%')} IDENTIFIED BY ${mysqlString(pwd)};
GRANT ${perms} ON ${mysqlIdentifier(dbName.value)}.* TO ${mysqlString(account.value)}@${mysqlString(serverAddress.value || '%')};
FLUSH PRIVILEGES;
      `.trim();
      break;

    case 'postgresql':
      sql = `
CREATE DATABASE ${pgIdentifier(dbName.value)};
CREATE ROLE ${pgIdentifier(account.value)} LOGIN PASSWORD ${pgString(pwd)};
GRANT ${perms} ON DATABASE ${pgIdentifier(dbName.value)} TO ${pgIdentifier(account.value)};
      `.trim();
      break;

    case 'sqlserver':
      sql = `
CREATE DATABASE ${sqlServerIdentifier(dbName.value)};
CREATE LOGIN ${sqlServerIdentifier(account.value)} WITH PASSWORD = ${sqlString(pwd)};
USE ${sqlServerIdentifier(dbName.value)};
CREATE USER ${sqlServerIdentifier(account.value)} FOR LOGIN ${sqlServerIdentifier(account.value)};
GRANT ${perms} TO ${sqlServerIdentifier(account.value)};
      `.trim();
      break;

    case 'oracle':
      sql = `
CREATE USER ${oracleIdentifier(account.value)} IDENTIFIED BY "${pwd}";
GRANT ${perms} TO ${oracleIdentifier(account.value)};
-- Oracle typically uses schemas; adjust database creation as needed
-- for quota, you may want: ALTER USER ${sqlComment(oracleIdentifier(account.value))} QUOTA UNLIMITED ON USERS;
      `.trim();
      break;

    case 'sqlite':
      sql = `
-- SQLite does not support user management or GRANT statements.
-- Database is created as a file: ${sqlComment(dbName.value)}.db
-- Permissions are handled at the OS/file system level.
      `.trim();
      break;
  }

  sqlOutput.value = sql;
}
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="130px">
      <NFormItem :label="t('tools.database-builder.texts.label-database-type')">
        <NSelect
          v-model:value="dbType"
          :options="[
            { label: t('tools.database-builder.texts.label-mysql'), value: 'mysql' },
            { label: t('tools.database-builder.texts.label-postgresql'), value: 'postgresql' },
            { label: t('tools.database-builder.texts.label-sql-server'), value: 'sqlserver' },
            { label: t('tools.database-builder.texts.label-oracle'), value: 'oracle' },
            { label: t('tools.database-builder.texts.label-sqlite'), value: 'sqlite' },
          ]"
        />
      </NFormItem>

      <NFormItem :label="t('tools.database-builder.texts.label-database-name')">
        <NInput v-model:value="dbName" :placeholder="t('tools.database-builder.texts.placeholder-test')" />
      </NFormItem>

      <NFormItem :label="t('tools.database-builder.texts.label-server-address')">
        <NInput v-model:value="serverAddress" :placeholder="t('tools.database-builder.texts.placeholder-127-0-0-1')" />
      </NFormItem>

      <NFormItem
        :label="t('tools.database-builder.texts.label-account')"
        :feedback="accountError"
        :validation-status="accountError ? 'error' : undefined"
      >
        <NInput v-model:value="account" :placeholder="t('tools.database-builder.texts.placeholder-test')" />
      </NFormItem>

      <NFormItem
        :label="t('tools.database-builder.texts.label-password-leave-empty-to-generate')"
        label-width="auto"
        :feedback="passwordError"
        :validation-status="passwordError ? 'error' : undefined"
      >
        <NInput
          v-model:value="password"
          type="password"
          :placeholder="t('tools.database-builder.texts.placeholder-leave-empty-for-random')"
        />
      </NFormItem>

      <NFormItem
        :label="t('tools.database-builder.texts.label-permissions-all-privileges-if-none-selected')"
        label-width="auto"
      >
        <NCheckboxGroup v-model:value="permissions">
          <NCheckbox value="SELECT">
            {{ t('tools.database-builder.texts.tag-select') }}
          </NCheckbox>
          <NCheckbox value="INSERT">
            {{ t('tools.database-builder.texts.tag-insert') }}
          </NCheckbox>
          <NCheckbox value="UPDATE">
            {{ t('tools.database-builder.texts.tag-update') }}
          </NCheckbox>
          <NCheckbox value="DELETE">
            {{ t('tools.database-builder.texts.tag-delete') }}
          </NCheckbox>
          <NCheckbox value="CREATE">
            {{ t('tools.database-builder.texts.tag-create') }}
          </NCheckbox>
          <NCheckbox value="DROP">
            {{ t('tools.database-builder.texts.tag-drop') }}
          </NCheckbox>
          <NCheckbox value="ALTER">
            {{ t('tools.database-builder.texts.tag-alter') }}
          </NCheckbox>
          <NCheckbox value="INDEX">
            {{ t('tools.database-builder.texts.tag-index') }}
          </NCheckbox>
          <NCheckbox value="EXECUTE">
            {{ t('tools.database-builder.texts.tag-execute') }}
          </NCheckbox>
          <NCheckbox value="REFERENCES">
            {{ t('tools.database-builder.texts.tag-references') }}
          </NCheckbox>
          <NCheckbox value="TRIGGER">
            {{ t('tools.database-builder.texts.tag-trigger') }}
          </NCheckbox>
          <NCheckbox value="USAGE">
            {{ t('tools.database-builder.texts.tag-usage') }}
          </NCheckbox>
          <NCheckbox value="REPLICATION CLIENT">
            {{ t('tools.database-builder.texts.tag-replication-client') }}
          </NCheckbox>
          <NCheckbox value="REPLICATION SLAVE">
            {{ t('tools.database-builder.texts.tag-replication-slave') }}
          </NCheckbox>
        </NCheckboxGroup>
      </NFormItem>

      <n-space justify="center" mt-2>
        <NButton type="primary" @click="generateSQL">
          {{ t('tools.database-builder.texts.tag-generate-sql-instructions') }}
        </NButton>
      </n-space>
    </NForm>

    <c-card v-if="sqlOutput" :title="t('tools.database-builder.texts.title-generated-sql-instructions')" mt-2>
      <textarea-copyable :value="sqlOutput" language="sql" download-file-name="create-db.sql" />
    </c-card>
  </div>
</template>
