<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { NCard, NForm, NFormItem, NInput } from 'naive-ui';

const { t } = useI18n();

const bimiData = ref({
  domain: '',
  logoUrl: '',
  vmcUrl: '',
});

const bimiRecord = computed(() => {
  if (!bimiData.value.domain || !bimiData.value.logoUrl) {
    return '';
  }

  let record = `default._bimi.${bimiData.value.domain} IN TXT "v=BIMI1; l=${bimiData.value.logoUrl}`;

  if (bimiData.value.vmcUrl) {
    record += `; a=${bimiData.value.vmcUrl}`;
  }

  record += '"';

  return record;
});
</script>

<template>
  <NCard :title="t('tools.bimi-dns-generator.texts.title-bimi-dns-record-generator')">
    <NForm :model="bimiData" label-placement="left" label-width="150px">
      <NFormItem :label="t('tools.bimi-dns-generator.texts.label-domain')">
        <NInput v-model:value="bimiData.domain" :placeholder="t('tools.bimi-dns-generator.texts.placeholder-example-com')" />
      </NFormItem>
      <NFormItem :label="t('tools.bimi-dns-generator.texts.label-logo-url')">
        <NInput v-model:value="bimiData.logoUrl" :placeholder="t('tools.bimi-dns-generator.texts.placeholder-https-example-com-logo-svg')" />
      </NFormItem>
      <NFormItem :label="t('tools.bimi-dns-generator.texts.label-vmc-certificate-url')">
        <NInput v-model:value="bimiData.vmcUrl" :placeholder="t('tools.bimi-dns-generator.texts.placeholder-https-example-com-vmc-pem')" />
      </NFormItem>
    </NForm>

    <c-card :title="t('tools.bimi-dns-generator.texts.title-generated-bimi-record')">
      <textarea-copyable :value="bimiRecord" />
    </c-card>
  </NCard>
</template>
