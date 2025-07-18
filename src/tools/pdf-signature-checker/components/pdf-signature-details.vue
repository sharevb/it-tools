<script setup lang="ts">
import type { SignatureInfo } from '../pdf-signature-checker.types';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const props = defineProps<{ signature: SignatureInfo }>();
const { signature } = toRefs(props);

const { t } = useI18n();

const tableHeaders = {
  validityPeriod: t('tools.pdf-signature-details.text.validity-period'),
  issuedBy: t('tools.pdf-signature-details.text.issued-by'),
  issuedTo: t('tools.pdf-signature-details.text.issued-to'),
  pemCertificate: t('tools.pdf-signature-details.text.pem-certificate'),
};

const certs = computed(() => signature.value.meta.certs.map((certificate, index) => ({
  ...certificate,
  validityPeriod: {
    notBefore: new Date(certificate.validityPeriod.notBefore).toLocaleString(),
    notAfter: new Date(certificate.validityPeriod.notAfter).toLocaleString(),
  },
  certificateName: t('tools.pdf-signature-details.text.certificate-index-1', [index + 1]),
})),
);
</script>

<template>
  <div flex flex-col gap-2>
    <c-table :data="certs" :headers="tableHeaders">
      <template #validityPeriod="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-details.text.not-before'),
            value: value.notBefore,
          }, {
            label: t('tools.pdf-signature-details.text.not-after'),
            value: value.notAfter,
          }]"
        />
      </template>

      <template #issuedBy="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-details.text.common-name'),
            value: value.commonName,
          }, {
            label: t('tools.pdf-signature-details.text.organization-name'),
            value: value.organizationName,
          }, {
            label: t('tools.pdf-signature-details.text.country-name'),
            value: value.countryName,
          }, {
            label: t('tools.pdf-signature-details.text.locality-name'),
            value: value.localityName,
          }, {
            label: t('tools.pdf-signature-details.text.organizational-unit-name'),
            value: value.organizationalUnitName,
          }, {
            label: t('tools.pdf-signature-details.text.state-or-province-name'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #issuedTo="{ value }">
        <c-key-value-list
          :items="[{
            label: t('tools.pdf-signature-details.text.common-name'),
            value: value.commonName,
          }, {
            label: t('tools.pdf-signature-details.text.organization-name'),
            value: value.organizationName,
          }, {
            label: t('tools.pdf-signature-details.text.country-name'),
            value: value.countryName,
          }, {
            label: t('tools.pdf-signature-details.text.locality-name'),
            value: value.localityName,
          }, {
            label: t('tools.pdf-signature-details.text.organizational-unit-name'),
            value: value.organizationalUnitName,
          }, {
            label: t('tools.pdf-signature-details.text.state-or-province-name'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #pemCertificate="{ value }">
        <c-modal-value :value="value" :label="t('tools.pdf-signature-details.text.view-pem-cert')">
          <template #value>
            <TextareaCopyable text-xs :value="value" copy-placement="none" />
          </template>
        </c-modal-value>
      </template>
    </c-table>
  </div>
</template>
