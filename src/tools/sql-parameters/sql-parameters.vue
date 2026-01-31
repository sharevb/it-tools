<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateSQLFromTemplate } from './sql-parameters.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const sqlTemplate = useQueryParamOrStorage({ name: 'sql', storageName: 'sql-params:sql', defaultValue: '' });
const parameters = ref([{ key: '', value: '' }]);

const generatedSQL = ref('');
const errorMessage = ref('');

function generateSQL() {
  const { sql, error } = generateSQLFromTemplate(
    sqlTemplate.value,
    parameters.value,
  );

  generatedSQL.value = sql;
  errorMessage.value = error || '';
}
</script>

<template>
  <NCard :title="t('tools.sql-parameters.texts.title-sql-generator')">
    <NForm label-placement="top">
      <NFormItem :label="t('tools.sql-parameters.texts.label-parameterized-sql-statement')">
        <NInput
          v-model:value="sqlTemplate"
          type="textarea"
          :placeholder="t('tools.sql-parameters.texts.placeholder-e-g-select-from-users-where-name-name-and-age-and-type-type')"
          :autosize="{ minRows: 3 }"
        />
      </NFormItem>

      <n-card :title="t('tools.sql-parameters.texts.title-parameters')">
        <n-p>{{ t('tools.sql-parameters.texts.tag-for-positional-parameters-leave-name-empty-for-named-parameters-enter-name-without-or-prefix') }}</n-p>
        <NDynamicInput
          v-model:value="parameters"
          :min="1"
          preset="pair"
          show-sort-button
          :key-placeholder="t('tools.sql-parameters.texts.placeholder-name-e-g-name-or-type')"
          :value-placeholder="t('tools.sql-parameters.texts.placeholder-value-e-g-alice-or-42-or-1-3')"
        />
      </n-card>

      <n-space justify="center">
        <NButton type="primary" @click="generateSQL">
          {{ t('tools.sql-parameters.texts.tag-generate-sql') }}
        </NButton>
      </n-space>

      <NFormItem v-if="generatedSQL" :label="t('tools.sql-parameters.texts.label-generated-sql')" mt-2>
        <textarea-copyable :value="generatedSQL" download-file-name="output.sql" />
      </NFormItem>

      <NAlert v-if="errorMessage" type="error" mt-2 @close="errorMessage = ''">
        {{ errorMessage }}
      </NAlert>
    </NForm>
  </NCard>
</template>
