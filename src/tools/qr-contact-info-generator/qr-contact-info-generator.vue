<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useContactQRCode } from './useContactQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

const fullName = ref('');
const jobRole = ref('');
const phoneNumber = ref('');
const email = ref('');
const website = ref('');
const address = ref('');

const foreground = ref('#000000ff');
const background = ref('#ffffffff');

const { qrcode } = useContactQRCode({
  fullName,
  jobRole,
  phoneNumber,
  email,
  website,
  address,
  color: { foreground, background },
  options: { width: 1024 },
});

const { download } = useDownloadFileFromBase64({
  source: qrcode,
  filename: 'contact-info-qr.png',
});
</script>

<template>
  <c-card>
    <div grid grid-cols-1 gap-12>
      <div>
        <c-input-text v-model:value="fullName" :label="t('tools.qr-contact-info-generator.texts.label-full-name')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-john-doe')" mb-4 />
        <c-input-text v-model:value="jobRole" :label="t('tools.qr-contact-info-generator.texts.label-job-role')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-software-engineer')" mb-4 />
        <c-input-text v-model:value="phoneNumber" :label="t('tools.qr-contact-info-generator.texts.label-phone-number')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-1-234-567-8901')" mb-4 />
        <c-input-text v-model:value="email" :label="t('tools.qr-contact-info-generator.texts.label-email-address')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-john-doe-example-com')" mb-4 />
        <c-input-text v-model:value="website" :label="t('tools.qr-contact-info-generator.texts.label-website')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-https-acme-com')" mb-4 />
        <c-input-text v-model:value="address" :label="t('tools.qr-contact-info-generator.texts.label-company-address')" :placeholder="t('tools.qr-contact-info-generator.texts.placeholder-123-main-st-city')" mb-4 />

        <n-form label-width="130" label-placement="left">
          <n-form-item :label="t('tools.qr-contact-info-generator.texts.label-foreground-color')">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item :label="t('tools.qr-contact-info-generator.texts.label-background-color')">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
        </n-form>
      </div>

      <div v-if="qrcode">
        <div flex flex-col items-center gap-3>
          <img alt="contact-info-qrcode" :src="qrcode" width="200">
          <c-button @click="download">
            {{ t('tools.qr-contact-info-generator.texts.tag-download-qr-code') }}
          </c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
