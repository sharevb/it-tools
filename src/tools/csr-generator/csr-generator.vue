<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateCSR } from './csr-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { useValidation } from '@/composable/validation';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const commonName = useQueryParam({ tool: 'csr-gen', name: 'cn', defaultValue: 'test.com' });
const commonNameValidation = useValidation({
  source: commonName,
  rules: [
    {
      message: t('tools.csr-generator.texts.message-common-name-domain-name-must-not-be-empty'),
      validator: value => value?.trim() !== '',
    },
  ],
});

const organizationName = useQueryParam({ tool: 'csr-gen', name: 'org', defaultValue: 'Test' });
const organizationalUnit = useQueryParam({ tool: 'csr-gen', name: 'ou', defaultValue: '' });
const password = ref('');
const bits = useQueryParamOrStorage({ name: 'bits', storageName: 'csr-gen:b', defaultValue: 2048 });
const city = useQueryParam({ tool: 'csr-gen', name: 'city', defaultValue: 'Paris' });
const state = useQueryParam({ tool: 'csr-gen', name: 'state', defaultValue: 'FR' });
const country = useQueryParam({ tool: 'csr-gen', name: 'country', defaultValue: 'France' });
const contactEmail = useQueryParam({ tool: 'csr-gen', name: 'email', defaultValue: '' });
const subjectAlternativeNames = ref('');
const emptyCSR = { csrPem: '', privateKeyPem: '', publicKeyPem: '' };

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: t('tools.csr-generator.texts.bits-should-be-256-less-than-bits-less-than-16384-and-be-a-multiple-of-8'),
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => {
    if (!commonNameValidation.isValid) {
      return emptyCSR;
    }

    return generateCSR({
      password: password.value,
      bits: bits.value,
      commonName: commonName.value,
      countryName: country.value,
      city: city.value,
      state: state.value,
      organizationName: organizationName.value,
      organizationalUnit: organizationalUnit.value,
      subjectAlternativeNames: subjectAlternativeNames.value,
      contactEmail: contactEmail.value,
    });
  },
  emptyCSR,
  ), emptyCSR);
</script>

<template>
  <div>
    <div mb-2>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-common-name-domain-name')"
        label-placement="top"
        :feedback="commonNameValidation.message"
        :validation-status="commonNameValidation.status"
      >
        <n-input
          v-model:value="commonName"
          :placeholder="t('tools.csr-generator.texts.placeholder-common-domain-name')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-organization-name')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="organizationName"
          :placeholder="t('tools.csr-generator.texts.placeholder-organization-name')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-organization-unit')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="organizationalUnit"
          :placeholder="t('tools.csr-generator.texts.placeholder-organization-unit')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-state')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="state"
          :placeholder="t('tools.csr-generator.texts.placeholder-state')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-city')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="city"
          :placeholder="t('tools.csr-generator.texts.placeholder-city')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-country')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="country"
          :placeholder="t('tools.csr-generator.texts.placeholder-country')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-contact-email')"
        label-placement="left" label-width="100"
      >
        <n-input
          v-model:value="contactEmail"
          :placeholder="t('tools.csr-generator.texts.placeholder-contact-email')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-subject-alternative-names')"
        label-placement="top"
      >
        <n-input
          v-model:value="subjectAlternativeNames"
          :placeholder="t('tools.csr-generator.texts.placeholder-dns-names-emails-ip-uri')"
          type="textarea"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item
        :label="t('tools.csr-generator.texts.label-private-key-passphrase')"
        label-placement="top"
      >
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          :placeholder="t('tools.csr-generator.texts.placeholder-passphrase')"
        />
      </n-form-item>
    </div>

    <div>
      <n-form-item :label="t('tools.csr-generator.texts.label-rsa-bits')" v-bind="bitsValidationAttrs as any" label-placement="left">
        <n-input-number-i18n v-model:value="bits" min="256" max="16384" step="8" />
      </n-form-item>
    </div>

    <div flex justify-center>
      <c-button @click="refreshCerts">
        {{ t('tools.csr-generator.texts.tag-refresh-csr') }}
      </c-button>
    </div>

    <n-divider />

    <div v-if="commonNameValidation.isValid">
      <div>
        <h3>{{ t('tools.csr-generator.texts.tag-certificate-signing-request') }}</h3>
        <TextareaCopyable :value="certs.csrPem" :download-file-name="`${organizationName}.csr`" />
      </div>

      <div>
        <h3>{{ t('tools.csr-generator.texts.tag-public-key') }}</h3>
        <TextareaCopyable :value="certs.publicKeyPem" word-wrap :download-file-name="`${organizationName}.pem`" />
      </div>

      <div>
        <h3>{{ t('tools.csr-generator.texts.tag-private-key') }}</h3>
        <TextareaCopyable :value="certs.privateKeyPem" :download-file-name="`${organizationName}.key`" />
      </div>
    </div>
  </div>
</template>
