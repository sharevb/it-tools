<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

interface Column {
  name: string
  type: string
  nullable: boolean
  primaryKey: boolean
  unique: boolean
  autoIncrement: boolean
  defaultValue: string
}

interface Table {
  name: string
  columns: Column[]
}

const dbName = useQueryParamOrStorage({ name: 'db', storageName: 'db-tbl-gen:d', defaultValue: '' });
const dbType = useQueryParamOrStorage<'mysql' | 'postgres' | 'sqlite' | 'sqlserver'>({ name: 'type', storageName: 'db-tbl-gen:t', defaultValue: 'mysql' });
const tables = useLocalStorage<Table[]>('db-tbl-gen:tbs', [
  {
    name: '',
    columns: [{
      name: '',
      type: 'VARCHAR(255)',
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      defaultValue: '',
    }],
  },
]);

const sqlOutput = ref('');

// Dialect-specific column types
const dialectTypes: Record<string, string[]> = {
  mysql: ['INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'DATE', 'DATETIME', 'BOOLEAN'],
  postgres: ['SERIAL', 'BIGSERIAL', 'INTEGER', 'TEXT', 'VARCHAR(255)', 'DATE', 'TIMESTAMP', 'BOOLEAN'],
  sqlite: ['INTEGER', 'TEXT', 'REAL', 'BLOB'],
  sqlserver: ['INT', 'BIGINT', 'NVARCHAR(255)', 'TEXT', 'DATE', 'DATETIME', 'BIT'],
};

function addTable() {
  tables.value.push({
    name: '',
    columns: [{
      name: '',
      type: dialectTypes[dbType.value][0],
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      defaultValue: '',
    }],
  });
}

function removeTable(index: number) {
  tables.value.splice(index, 1);
}

function addColumn() {
  return {
    name: '',
    type: dialectTypes[dbType.value][0],
    nullable: true,
    primaryKey: false,
    unique: false,
    autoIncrement: false,
    defaultValue: '',
  };
}

function generateSQL() {
  if (!dbName.value) {
    sqlOutput.value = '-- Please provide a database name';
    return;
  }

  let script = '';
  switch (dbType.value) {
    case 'mysql':
    case 'sqlserver':
      script += `CREATE DATABASE ${dbName.value};\n\nUSE ${dbName.value};\n\n`;
      break;
    case 'postgres':
      script += `CREATE DATABASE ${dbName.value};\n\n\\c ${dbName.value};\n\n`;
      break;
    case 'sqlite':
      script += '-- SQLite creates DB as a file, no CREATE DATABASE needed\n';
      break;
  }

  for (const table of tables.value) {
    if (!table.name.trim()) {
      continue;
    }

    const cols = table.columns
      .filter(c => c.name.trim() !== '')
      .map((c) => {
        let colDef = `${c.name} ${c.type}`;
        if (!c.nullable) {
          colDef += ' NOT NULL';
        }
        if (c.unique) {
          colDef += ' UNIQUE';
        }
        if (c.autoIncrement) {
          if (dbType.value === 'mysql') {
            colDef += ' AUTO_INCREMENT';
          }
          else if (dbType.value === 'postgres') {
            colDef = `${c.name} SERIAL`;
          }
          else if (dbType.value === 'sqlite') {
            colDef += ' AUTOINCREMENT';
          }
          else if (dbType.value === 'sqlserver') {
            colDef += ' IDENTITY(1,1)';
          }
        }
        if (c.defaultValue) {
          colDef += ` DEFAULT ${c.defaultValue}`;
        }
        return colDef;
      })
      .join(',\n  ');

    // Primary key handling
    const pkCols = table.columns.filter(c => c.primaryKey).map(c => c.name);
    const pkClause = pkCols.length ? `,\n  PRIMARY KEY (${pkCols.join(', ')})` : '';

    script += `CREATE TABLE ${table.name} (\n  ${cols}${pkClause}\n);\n\n`;
  }

  sqlOutput.value = script.trim();
}
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="130px">
      <NFormItem :label="t('tools.database-table-generator.texts.label-database-type')">
        <NSelect
          v-model:value="dbType"
          :options="[
            { label: t('tools.database-table-generator.texts.label-mysql'), value: 'mysql' },
            { label: t('tools.database-table-generator.texts.label-postgresql'), value: 'postgres' },
            { label: t('tools.database-table-generator.texts.label-sqlite'), value: 'sqlite' },
            { label: t('tools.database-table-generator.texts.label-sql-server'), value: 'sqlserver' },
          ]"
        />
      </NFormItem>

      <NFormItem :label="t('tools.database-table-generator.texts.label-database-name')">
        <NInput v-model:value="dbName" :placeholder="t('tools.database-table-generator.texts.placeholder-enter-database-name')" />
      </NFormItem>

      <c-card v-for="(table, tIndex) in tables" :key="tIndex" mt-1>
        <NFormItem :label="`Table ${tIndex + 1} Name`">
          <NInput v-model:value="table.name" :placeholder="t('tools.database-table-generator.texts.placeholder-table-name')" mr-1 />
          <NButton type="error" @click="removeTable(tIndex)">
            {{ t('tools.database-table-generator.texts.tag-remove-table') }}
          </NButton>
        </NFormItem>

        <n-dynamic-input v-model:value="table.columns" :on-create="addColumn" show-sort-button>
          <template #create-button-default>
            {{ t('tools.database-table-generator.texts.tag-add-column') }}
          </template>
          <template #default="{ value: col }">
            <div style="display: flex; align-items: center; width: 100%">
              <NInput v-model:value="col.name" :placeholder="t('tools.database-table-generator.texts.placeholder-column-name')" style="width: 20%;" mr-1 />
              <NSelect v-model:value="col.type" :options="dialectTypes[dbType].map(t => ({ label: t, value: t }))" style="width: 20%" mr-1 />
              <NCheckbox v-model:checked="col.nullable">
                {{ t('tools.database-table-generator.texts.tag-nullable') }}
              </NCheckbox>
              <NCheckbox v-model:checked="col.primaryKey">
                {{ t('tools.database-table-generator.texts.tag-pk') }}
              </NCheckbox>
              <NCheckbox v-model:checked="col.unique">
                {{ t('tools.database-table-generator.texts.tag-unique') }}
              </NCheckbox>
              <NCheckbox v-model:checked="col.autoIncrement">
                {{ t('tools.database-table-generator.texts.tag-autoinc') }}
              </NCheckbox>
              <NInput v-model:value="col.defaultValue" :placeholder="t('tools.database-table-generator.texts.placeholder-default-value')" style="width: 20%;" />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>

      <n-space justify="center" mt-1>
        <NButton type="info" @click="addTable">
          {{ t('tools.database-table-generator.texts.tag-add-table') }}
        </NButton>
      </n-space>
    </NForm>

    <n-divider />

    <n-space justify="center" mt-2>
      <NButton type="success" @click="generateSQL">
        {{ t('tools.database-table-generator.texts.tag-generate-sql') }}
      </NButton>
    </n-space>

    <c-card v-if="sqlOutput" :title="t('tools.database-table-generator.texts.title-generated-sql')" mt-1>
      <textarea-copyable :value="sqlOutput" language="sql" download-file-name="create-tables.sql" />
    </c-card>
  </div>
</template>
