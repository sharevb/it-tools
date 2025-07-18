<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

const domain = ref('');
const policy = ref('none');
const subPolicy = ref('none');
const percentage = ref(100);
const rua = ref('');
const ruf = ref('');
const aspf = ref('r');
const adkim = ref('r');
const ri = ref(86400);
const dmarcRecord = computed(() => {
  const recordParts = ['v=DMARC1', `p=${policy.value}`, `sp=${subPolicy.value}`];

  if (percentage.value !== 100) {
    recordParts.push(`pct=${percentage.value}`);
  }
  if (rua.value) {
    recordParts.push(`rua=mailto:${rua.value}`);
  }
  if (ruf.value) {
    recordParts.push(`ruf=mailto:${ruf.value}`);
  }
  if (aspf.value) {
    recordParts.push(`aspf=${aspf.value}`);
  }
  if (adkim.value) {
    recordParts.push(`adkim=${adkim.value}`);
  }
  if (ri.value) {
    recordParts.push(`ri=${ri.value}`);
  }

  return recordParts.join('; ');
});

const policies = [
  { label: t('tools.dmarc-dns-generator.texts.label-none'), value: 'none' },
  { label: t('tools.dmarc-dns-generator.texts.label-quarantine'), value: 'quarantine' },
  { label: t('tools.dmarc-dns-generator.texts.label-reject'), value: 'reject' },
];

const alignments = [
  { label: t('tools.dmarc-dns-generator.texts.label-relaxed-r'), value: 'r' },
  { label: t('tools.dmarc-dns-generator.texts.label-strict-s'), value: 's' },
];
</script>

<template>
  <n-card :title="t('tools.dmarc-dns-generator.texts.title-dmarc-record-generator')" max-w-600px>
    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-domain')" label-placement="left">
      <n-input v-model:value="domain" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-example-com')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-policy')" label-placement="left">
      <n-select v-model:value="policy" :options="policies" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-select-policy')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-subdomain-policy')" label-placement="left">
      <n-select v-model:value="subPolicy" :options="policies" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-select-policy')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-percentage-of-emails-subject-to-dmarc-policy-enforcement-0-100')" label-placement="top">
      <n-input-number v-model:value="percentage" :min="0" :max="100" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-enter-percentage')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-aggregate-email-where-aggregate-dmarc-reports-should-be-sent')" label-placement="top">
      <n-input v-model:value="rua" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-admin-example-com')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-forensic-email-where-forensic-dmarc-failure-reports-should-be-sent')" label-placement="top">
      <n-input v-model:value="ruf" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-admin-example-com')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-alignment-spf')" label-placement="left">
      <n-select v-model:value="aspf" :options="alignments" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-select-alignment')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-alignment-dkim')" label-placement="left">
      <n-select v-model:value="adkim" :options="alignments" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-select-alignment')" />
    </n-form-item>

    <n-form-item :label="t('tools.dmarc-dns-generator.texts.label-reporting-interval-for-sending-dmarc-aggregate-reports')" label-placement="top">
      <n-input-number v-model:value="ri" :min="3600" :placeholder="t('tools.dmarc-dns-generator.texts.placeholder-enter-interval')">
        <template #suffix>
          {{ t('tools.dmarc-dns-generator.texts.tag-seconds') }}
        </template>
      </n-input-number>
    </n-form-item>

    <n-card v-if="dmarcRecord" :title="t('tools.dmarc-dns-generator.texts.title-generated-dmarc-record')">
      <textarea-copyable :value="dmarcRecord" />
    </n-card>
  </n-card>
</template>
