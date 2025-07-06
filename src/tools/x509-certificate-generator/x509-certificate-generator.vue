<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateSSLCertificate } from './x509-certificate-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const commonName = ref('test.com');
const commonNameValidation = useValidation({
  source: commonName,
  rules: [
    {
      message: t('tools.x509-certificate-generator.texts.message-common-name-domain-name-must-not-be-empty'),
      validator: value => value?.trim() !== '',
    },
  ],
});

const organizationName = ref('Test');
const organizationalUnit = ref('');
const days = ref(365);
const password = ref('');
const city = ref('Paris');
const state = ref('FR');
const country = ref('France');
const contactEmail = ref('');
const subjectAlternativeNames = ref('');
const emptyCSR = { certificatePem: '', privateKeyPem: '', publicKeyPem: '', fingerprint: '' };

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => {
    if (!commonNameValidation.isValid) {
      return emptyCSR;
    }

    return generateSSLCertificate({
      password: password.value,
      commonName: commonName.value,
      countryName: country.value,
      city: city.value,
      state: state.value,
      organizationName: organizationName.value,
      organizationalUnit: organizationalUnit.value,
      contactEmail: contactEmail.value,
      subjectAlternativeNames: subjectAlternativeNames.value,
      days: days.value,
    });
  },
  emptyCSR,
  ), emptyCSR);
</script>

<template>
  <div>
    <div mb-2>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-common-name-domain-name')"
        label-placement="top"
        :feedback="commonNameValidation.message"
        :validation-status="commonNameValidation.status"
      >
        <n-input
          v-model:value="commonName"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-common-domain-name')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-duration-days')"
        label-placement="left" label-width="100"
      >
        <n-input-number
          v-model:value="days"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-duration-days')"
          :min="1"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-organization-name')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="organizationName"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-organization-name')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-organizational-unit')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="organizationalUnit"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-organization-unit')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-state')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="state"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-state')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-city')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="city"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-city')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-country')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="country"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-country')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-contact-email')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="contactEmail"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-contact-email')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-subject-alternative-names')"
        label-placement="top"
      >
        <n-input
          v-model:value="subjectAlternativeNames"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-dns-names-emails-ip-uri')"
          type="textarea"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.x509-certificate-generator.texts.label-private-key-passphrase')"
        label-placement="top"
      >
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          :placeholder="t('tools.x509-certificate-generator.texts.placeholder-passphrase')"
        />
      </n-form-item>
    </div>

    <div flex justify-center>
      <c-button @click="refreshCerts">
        {{ t('tools.x509-certificate-generator.texts.tag-refresh-certificate') }}
      </c-button>
    </div>

    <n-divider />

    <div v-if="commonNameValidation.isValid">
      <div>
        <h3>{{ t('tools.x509-certificate-generator.texts.tag-certificate-pem') }}</h3>
        <TextareaCopyable :value="certs.certificatePem" :download-file-name="`${organizationName}.crt`" />
      </div>

      <div>
        <h3>{{ t('tools.x509-certificate-generator.texts.tag-fingerprint') }}</h3>
        <TextareaCopyable :value="certs.fingerprint" word-wrap />
      </div>

      <div>
        <h3>{{ t('tools.x509-certificate-generator.texts.tag-public-key') }}</h3>
        <TextareaCopyable :value="certs.publicKeyPem" word-wrap :download-file-name="`${organizationName}.pem`" />
      </div>

      <div>
        <h3>{{ t('tools.x509-certificate-generator.texts.tag-private-key') }}</h3>
        <TextareaCopyable :value="certs.privateKeyPem" :download-file-name="`${organizationName}.key`" />
      </div>
    </div>
  </div>
</template>
