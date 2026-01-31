<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const dbType = useQueryParamOrStorage({ name: 'type', storageName: 'db-create:t', defaultValue: 'mysql' });
const dbName = useQueryParamOrStorage({ name: 'db', storageName: 'db-create:d', defaultValue: 'test' });
const serverAddress = useQueryParamOrStorage({ name: 'server', storageName: 'db-create:s', defaultValue: '' });
const account = useQueryParamOrStorage({ name: 'account', storageName: 'db-create:a', defaultValue: 'admin' });

const password = ref('');
const permissions = ref<string[]>([]);
const sqlOutput = ref('');

function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateSQL() {
  const pwd = password.value || generateRandomPassword();
  const perms = permissions.value.length > 0 ? permissions.value.join(', ') : 'ALL PRIVILEGES';

  let sql = '';

  switch (dbType.value) {
    case 'mysql':
      sql = `
CREATE DATABASE IF NOT EXISTS \`${dbName.value}\`;
CREATE USER IF NOT EXISTS '${account.value}'@'${serverAddress.value || '%'}' IDENTIFIED BY '${pwd}';
GRANT ${perms} ON \`${dbName.value}\`.* TO '${account.value}'@'${serverAddress.value || '%'}';
FLUSH PRIVILEGES;
      `.trim();
      break;

    case 'postgresql':
      sql = `
CREATE DATABASE "${dbName.value}";
CREATE ROLE "${account.value}" LOGIN PASSWORD '${pwd}';
GRANT ${perms} ON DATABASE "${dbName.value}" TO "${account.value}";
      `.trim();
      break;

    case 'sqlserver':
      sql = `
CREATE DATABASE [${dbName.value}];
CREATE LOGIN [${account.value}] WITH PASSWORD = '${pwd}';
USE [${dbName.value}];
CREATE USER [${account.value}] FOR LOGIN [${account.value}];
GRANT ${perms} TO [${account.value}];
      `.trim();
      break;

    case 'oracle':
      sql = `
CREATE USER ${account.value} IDENTIFIED BY "${pwd}";
GRANT ${perms} TO ${account.value};
-- Oracle typically uses schemas; adjust database creation as needed
-- for quota, you may want: ALTER USER ${account.value} QUOTA UNLIMITED ON USERS;
      `.trim();
      break;

    case 'sqlite':
      sql = `
-- SQLite does not support user management or GRANT statements.
-- Database is created as a file: ${dbName.value}.db
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
          v-model:value="dbType" :options="[
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

      <NFormItem :label="t('tools.database-builder.texts.label-account')">
        <NInput v-model:value="account" :placeholder="t('tools.database-builder.texts.placeholder-test')" />
      </NFormItem>

      <NFormItem :label="t('tools.database-builder.texts.label-password-leave-empty-to-generate')" label-width="auto">
        <NInput v-model:value="password" type="password" :placeholder="t('tools.database-builder.texts.placeholder-leave-empty-for-random')" />
      </NFormItem>

      <NFormItem :label="t('tools.database-builder.texts.label-permissions-all-privileges-if-none-selected')" label-width="auto">
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
