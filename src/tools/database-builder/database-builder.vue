<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';

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
      <NFormItem label="Database Type:">
        <NSelect
          v-model:value="dbType" :options="[
            { label: 'MySQL', value: 'mysql' },
            { label: 'PostgreSQL', value: 'postgresql' },
            { label: 'SQL Server', value: 'sqlserver' },
            { label: 'Oracle', value: 'oracle' },
            { label: 'SQLite', value: 'sqlite' },
          ]"
        />
      </NFormItem>

      <NFormItem label="Database Name:">
        <NInput v-model:value="dbName" placeholder="test" />
      </NFormItem>

      <NFormItem label="Server Address:">
        <NInput v-model:value="serverAddress" placeholder="127.0.0.1" />
      </NFormItem>

      <NFormItem label="Account:">
        <NInput v-model:value="account" placeholder="test" />
      </NFormItem>

      <NFormItem label="Password (leave empty to generate):" label-width="auto">
        <NInput v-model:value="password" type="password" placeholder="leave empty for random" />
      </NFormItem>

      <NFormItem label="Permissions (ALL PRIVILEGES if none selected):" label-width="auto">
        <NCheckboxGroup v-model:value="permissions">
          <NCheckbox value="SELECT">
            SELECT
          </NCheckbox>
          <NCheckbox value="INSERT">
            INSERT
          </NCheckbox>
          <NCheckbox value="UPDATE">
            UPDATE
          </NCheckbox>
          <NCheckbox value="DELETE">
            DELETE
          </NCheckbox>
          <NCheckbox value="CREATE">
            CREATE
          </NCheckbox>
          <NCheckbox value="DROP">
            DROP
          </NCheckbox>
          <NCheckbox value="ALTER">
            ALTER
          </NCheckbox>
          <NCheckbox value="INDEX">
            INDEX
          </NCheckbox>
          <NCheckbox value="EXECUTE">
            EXECUTE
          </NCheckbox>
          <NCheckbox value="REFERENCES">
            REFERENCES
          </NCheckbox>
          <NCheckbox value="TRIGGER">
            TRIGGER
          </NCheckbox>
          <NCheckbox value="USAGE">
            USAGE
          </NCheckbox>
          <NCheckbox value="REPLICATION CLIENT">
            REPLICATION CLIENT
          </NCheckbox>
          <NCheckbox value="REPLICATION SLAVE">
            REPLICATION SLAVE
          </NCheckbox>
        </NCheckboxGroup>
      </NFormItem>

      <n-space justify="center" mt-2>
        <NButton type="primary" @click="generateSQL">
          Generate SQL Instructions
        </NButton>
      </n-space>
    </NForm>

    <c-card v-if="sqlOutput" title="Generated SQL Instructions:" mt-2>
      <textarea-copyable :value="sqlOutput" language="sql" download-file-name="create-db.sql" />
    </c-card>
  </div>
</template>
