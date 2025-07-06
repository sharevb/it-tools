<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

interface KeyValuePair {
  key: string
  value?: string
}
const baseUrl = useQueryParamOrStorage({ name: 'url', storageName: 'api-tester:url', defaultValue: '' });
const method = useQueryParamOrStorage({ name: 'method', storageName: 'api-tester:m', defaultValue: 'POST' });
const queryParams = useQueryParamOrStorage<KeyValuePair[]>({ name: 'params', storageName: 'api-tester:params', defaultValue: [] });
const headers = useQueryParamOrStorage<KeyValuePair[]>({ name: 'headers', storageName: 'api-tester:headers', defaultValue: [] });
const contentType = useQueryParamOrStorage({ name: 'ct', storageName: 'api-tester:ct', defaultValue: 'application/json' });
const body = useQueryParamOrStorage({ name: 'body', storageName: 'api-tester:body', defaultValue: '' });
const noCORS = ref(false);
const apiCallResult = ref();

const inprogress = ref(false);
async function callAPI() {
  const url = new URL(baseUrl.value);
  for (const kv of queryParams.value) {
    if (!kv.key) {
      continue;
    }
    url.searchParams.append(kv.key, kv.value || '');
  }
  const queryHeaders = [] as [string, string][];
  for (const kv of headers.value) {
    if (!kv.key) {
      continue;
    }
    queryHeaders.push([kv.key, kv.value || '']);
  }
  queryHeaders.push(['Content-Type', contentType.value || '']);

  try {
    const response = await fetch(url, {
      method: method.value,
      headers: queryHeaders,
      body: (method.value === 'GET' || method.value === 'HEAD') ? null : body.value,
      mode: noCORS.value ? 'no-cors' : 'cors',
    });

    let responseText = await response.text();
    try {
      responseText = JSON.stringify(JSON.parse(responseText), null, 2);
    }
    catch (_) {
    }
    apiCallResult.value = {
      code: response.status,
      error: '',
      result: responseText,
    };
  }
  catch (err: any) {
    apiCallResult.value = {
      code: -1,
      error: err.toString(),
      result: null,
    };
  }
}

function emptyKeyPair() {
  return {
    key: '',
    value: '',
  };
}
</script>

<template>
  <div>
    <c-card :title="t('tools.api-tester.texts.title-api-calling')">
      <c-input-text
        v-model:value="baseUrl"
        :label="t('tools.api-tester.texts.label-base-api-url')"
        :placeholder="t('tools.api-tester.texts.placeholder-base-api-url')"
        mb-2
      />

      <c-select
        v-model:value="method"
        :label="t('tools.api-tester.texts.label-http-method')"
        :options="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
        mb-2
      />

      <c-card :title="t('tools.api-tester.texts.title-headers')" mb-2>
        <n-dynamic-input v-model:value="headers" :on-create="emptyKeyPair">
          <template #create-button-default>
            {{ t('tools.api-tester.texts.tag-add-a-new-http-header') }}
          </template>
          <template #default="{ value }">
            <div v-if="value" w-100 flex justify-center gap-2>
              <c-input-text v-model:value="value.key" :placeholder="t('tools.api-tester.texts.placeholder-header-name')" type="text" />
              <c-input-text v-model:value="value.value" :placeholder="t('tools.api-tester.texts.placeholder-value')" type="text" />
            </div>
          </template>
        </n-dynamic-input>
        <c-select
          v-model:value="contentType"
          :label="t('tools.api-tester.texts.label-content-type')"
          :options="['application/json', 'text/plain']"
          mt-2
        />
      </c-card>

      <c-card :title="t('tools.api-tester.texts.title-query-parameters')" mb-2>
        <n-dynamic-input v-model:value="queryParams" :on-create="emptyKeyPair">
          <template #create-button-default>
            {{ t('tools.api-tester.texts.tag-add-a-new-query-parameter') }}
          </template>
          <template #default="{ value }">
            <div v-if="value" w-100 flex justify-center gap-2>
              <c-input-text v-model:value="value.key" :placeholder="t('tools.api-tester.texts.placeholder-param-name')" type="text" />
              <c-input-text v-model:value="value.value" :placeholder="t('tools.api-tester.texts.placeholder-value')" type="text" />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>
      <c-input-text
        v-if="method !== 'GET' && method !== 'HEAD'"
        v-model:value="body"
        :label="t('tools.api-tester.texts.label-body')"
        :placeholder="t('tools.api-tester.texts.placeholder-http-query-body')"
        multiline
        monospace
        mb-2
      />

      <n-checkbox v-model:checked="noCORS">
        {{ t('tools.api-tester.texts.tag-no-cors') }}
      </n-checkbox>

      <div mt-5 flex justify-center>
        <c-button secondary @click="callAPI">
          {{ t('tools.api-tester.texts.tag-call-api') }}
        </c-button>
      </div>
    </c-card>
    <n-spin
      v-if="inprogress"
      size="small"
    />
    <c-alert v-if="!inprogress && apiCallResult && apiCallResult.code !== 200" type="error" mt-12 :title="t('tools.api-tester.texts.title-error-while-calling-api')">
      <p><strong>Status code = {{ apiCallResult.code }}</strong></p>
      <TextareaCopyable :value="apiCallResult.error" copy-placement="none" />
    </c-alert>
    <c-card v-if="!inprogress && apiCallResult && apiCallResult.code === 200" mt-12 :title="t('tools.api-tester.texts.title-api-call-result')">
      <TextareaCopyable :value="apiCallResult.result" word-wrap />
    </c-card>
  </div>
</template>
