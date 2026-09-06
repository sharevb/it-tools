<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useCopy } from '@/composable/copy';
import QRCode from 'qrcode';
import { isValidBIC, validateIBAN } from 'ibantools';
import { getFriendlyErrors } from '../iban-validator-and-parser/iban-validator-and-parser.service';
import type { FormInst } from 'naive-ui';

const { t } = useI18n();

const foreground = ref('#000000ff');
const background = ref('#ffffffff');
const size = ref(256);

const formRef = ref<FormInst | null>(null);

const iban = ref('');
const beneficiary = ref('');
const amount = ref<number>(0);
const reference = ref('');
const remittance = ref('');
const bic = ref('');
const version = ref('002');

const qrcode = ref<string>('');
const errorMessage = ref<string>('');

const rules = {
  iban: {
    required: true,
    validator: (_: any, iban: string) => {
      const { valid, errorCodes } = validateIBAN(iban);
      if (valid) {
        return true;
      }

      const errors = getFriendlyErrors(errorCodes);

      return new Error(errors.join(', ') || 'Invalid IBAN');
    },
  },
  beneficiary: {
    required: true,
    validator: (_: any, value: string) => {
      if (value.length > 70) {
        return new Error('Beneficiary name must be ≤ 70 characters');
      }
      return true;
    },
  },
  bic: {
    validator: (_: any, value: string) => {
      if (!value && version.value === '002') {
        return true; // BIC is optional in version 002
      }
      if (isValidBIC(value)) {
        return true;
      }

      return new Error('Invalid or empty BIC');
    },
  },
  amount: {
    required: true,
    validator: (_: any, value: number) => {
      if (value <= 0) {
        return new Error('Amount must be greater than 0');
      }
      return true;
    },
  },
  reference: {
    validator: (_: any, value: string) => {
      if (value.length > 35) {
        return new Error('Reference must be ≤ 35 characters');
      }
      return true;
    },
  },
  remittance: {
    validator: (_: any, value: string) => {
      if (value.length > 140) {
        return new Error('Remittance must be ≤ 140 characters');
      }
      return true;
    },
  },
};

const epcPayload = computed(() => {
  const amt = amount.value != null ? amount.value.toFixed(2) : '';
  return [
    'BCD',
    version.value,
    1,
    'SCT',
    bic.value || '',
    beneficiary.value || '',
    iban.value || '',
    `EUR${amt}`,
    '',
    reference.value || '',
    remittance.value || '',
  ].join('\n');
});

const generateQr = () => {
  errorMessage.value = '';
  qrcode.value = '';

  formRef.value?.validate(async (errors) => {
    if (errors) {
      errorMessage.value = 'Please fix validation errors.';
      return;
    }

    try {
      qrcode.value = await QRCode.toDataURL(epcPayload.value, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: size.value,
        color: {
          dark: foreground.value,
          light: background.value,
        },
      });
    } catch (e) {
      errorMessage.value = 'Failed to generate QR code.';
    }
  });
};

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' });
const { copy } = useCopy({ source: epcPayload, text: 'Copied to clipboard' });
</script>

<template>
  <div>
    <NForm
      ref="formRef"
      :model="{
        iban,
        beneficiary,
        bic,
        amount,
        reference,
        remittance,
        version,
      }"
      :rules="rules"
      label-width="150"
      label-placement="left"
    >
      <NFormItem label="Beneficiary Name:" path="beneficiary">
        <NInput v-model:value="beneficiary" placeholder="Beneficiary name" />
      </NFormItem>

      <NFormItem label="Account (IBAN):" path="iban">
        <NInput v-model:value="iban" placeholder="FR76..." />
      </NFormItem>

      <NFormItem label="BIC:" path="bic">
        <NInput v-model:value="bic" placeholder="Bank BIC (optional)" />
      </NFormItem>

      <NFormItem label="Amount (EUR):" path="amount">
        <NInputNumber v-model:value="amount" :min="0.01" :precision="2" />
      </NFormItem>

      <NFormItem label="Payment Reference:" path="reference">
        <NInput v-model:value="reference" placeholder="Optional" />
      </NFormItem>

      <NFormItem label="Purpose:" path="remittance">
        <NInput v-model:value="remittance" placeholder="Optional" />
      </NFormItem>

      <NFormItem label="Version:" path="version">
        <NSelect
          v-model:value="version"
          :options="[
            { label: 'V1', value: '001' },
            { label: 'V2', value: '002' },
          ]"
        />
      </NFormItem>

      <NFormItem label="Foreground color:">
        <NColorPicker v-model:value="foreground" :modes="['hex']" />
      </NFormItem>
      <NFormItem label="Background color:">
        <NColorPicker v-model:value="background" :modes="['hex']" />
      </NFormItem>

      <NFormItem label="QR Size:" path="size">
        <NInputNumber v-model:value="size" :min="128" :max="2048" />
      </NFormItem>

      <NSpace justify="center">
        <NButton type="primary" @click="generateQr">Generate QR</NButton>
      </NSpace>
    </NForm>

    <NAlert v-if="errorMessage" type="error">{{ errorMessage }}</NAlert>

    <div v-if="qrcode" mb-2>
      <div flex flex-col items-center gap-3>
        <img alt="wifi-qrcode" :src="qrcode" :width="size" />
        <NButton @click="download"> Download QRCode </NButton>
      </div>
    </div>
    <div v-if="qrcode">
      <div flex flex-col items-center gap-3>
        <NButton @click="copy()"> Copy QRCode text </NButton>
      </div>
    </div>
  </div>
</template>
