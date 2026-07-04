<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { combineTXT, query, wellknown } from 'dns-query';
import types from './dns.records.types.json';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const type = useQueryParam({ tool: 'dns-queries', name: 'type', defaultValue: 'A' });
const name = useQueryParam({ tool: 'dns-queries', name: 'domain', defaultValue: 'google.com' });
const answers = ref<string[]>([]);

async function queryDNS() {
  const endpoints = await wellknown.endpoints('doh');
  try {
    const response = await query({
      question: { type: type.value, name: name.value },
    }, {
      endpoints,
    });
    if (type.value === 'TXT') {
      answers.value = (response.answers || []).map(answer => `${answer.name} ${answer.type} ${combineTXT(answer.data as Uint8Array[])} (TTL=${answer.ttl})`);
    }
    else {
      answers.value = (response.answers || []).map(answer => `${answer.name} ${answer.type} ${answer.data} (TTL=${answer.ttl})`);
    }
  }
  catch (error: any) {
    answers.value = [error.toString()];
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="name"
      :label="t('tools.dns-queries.texts.label-name')"
      label-position="left"
      :placeholder="t('tools.dns-queries.texts.placeholder-name-to-query')"
      mb-2
    />
    <c-select
      v-model:value="type"
      searchable
      :label="t('tools.dns-queries.texts.label-dns-record-type')"
      label-position="left"
      :options="Object.values(types).map(kv => ({ value: kv.value, label: `${kv.value}: ${kv.label}` }))"
      mb-2
    />

    <div flex justify-center>
      <c-button
        @click="queryDNS"
      >
        {{ t('tools.dns-queries.texts.tag-send-dns-query') }}
      </c-button>
    </div>

    <n-divider />

    <c-card :title="t('tools.dns-queries.texts.title-query-results')">
      <textarea-copyable
        v-for="(answer, index) in answers"
        :key="index"
        :value="answer"
        word-wrap
        mb-2
      />
    </c-card>
  </div>
</template>
