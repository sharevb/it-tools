<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput } from 'naive-ui';

const { t } = useI18n();

const form = ref({
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
});

const mailtoLink = computed(() => {
  const to = form.value.to;
  if (!to) {
    return '';
  }
  const params = new URLSearchParams();
  if (form.value.subject) {
    params.append('subject', form.value.subject);
  }
  if (form.value.body) {
    params.append('body', form.value.body);
  }
  if (form.value.cc) {
    params.append('cc', form.value.cc);
  }
  if (form.value.bcc) {
    params.append('bcc', form.value.bcc);
  }

  return `mailto:${to}?${params.toString()}`;
});

function openMailto() {
  window.location.href = mailtoLink.value;
}
</script>

<template>
  <NCard :title="t('tools.mailto-generator.texts.title-mailto-link-generator')">
    <NForm :model="form" label-placement="left">
      <NFormItem :label="t('tools.mailto-generator.texts.label-to')">
        <NInput v-model:value="form.to" :placeholder="t('tools.mailto-generator.texts.placeholder-recipient-example-com')" />
      </NFormItem>
      <NFormItem :label="t('tools.mailto-generator.texts.label-cc')">
        <NInput v-model:value="form.cc" :placeholder="t('tools.mailto-generator.texts.placeholder-cc-example-com')" />
      </NFormItem>
      <NFormItem :label="t('tools.mailto-generator.texts.label-bcc')">
        <NInput v-model:value="form.bcc" :placeholder="t('tools.mailto-generator.texts.placeholder-bcc-example-com')" />
      </NFormItem>
      <NFormItem :label="t('tools.mailto-generator.texts.label-subject')">
        <NInput v-model:value="form.subject" :placeholder="t('tools.mailto-generator.texts.placeholder-email-subject')" />
      </NFormItem>
      <NFormItem :label="t('tools.mailto-generator.texts.label-body')" label-placement="top">
        <NInput
          v-model:value="form.body"
          type="textarea"
          :placeholder="t('tools.mailto-generator.texts.placeholder-email-body')"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </NFormItem>
      <c-card v-if="mailtoLink" :title="t('tools.mailto-generator.texts.title-generated-link')">
        <textarea-copyable :value="mailtoLink" />
        <n-space justify="center">
          <NButton type="primary" @click="openMailto">
            {{ t('tools.mailto-generator.texts.tag-open-mail-client') }}
          </NButton>
        </n-space>
      </c-card>
    </NForm>
  </NCard>
</template>
