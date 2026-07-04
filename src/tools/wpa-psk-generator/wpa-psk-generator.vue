<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateWpaPskRawKey } from './wpa-psk-generator.service';
import { useValidation } from '@/composable/validation';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const ssid = useQueryParam({ tool: 'wpa-psk-gen', name: 'ssid', defaultValue: '' });
const passphrase = ref('');

const wpaPSKRawKey = ref('');
function computeRawKey() {
  try {
    wpaPSKRawKey.value = generateWpaPskRawKey(ssid.value, passphrase.value)?.psk;
  }
  catch (e: any) {
    wpaPSKRawKey.value = e.toString();
  }
}

const ssidValidation = useValidation({
  source: ssid,
  rules: [
    {
      validator: v => v !== '',
      message: t('tools.wpa-psk-generator.texts.message-ssid-must-not-be-empty'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.wpa-psk-generator.texts.title-wifi-infos')" mb-2>
      <c-input-text
        v-model:value="ssid"
        :label="t('tools.wpa-psk-generator.texts.label-ssid')"
        label-position="left"
        :placeholder="t('tools.wpa-psk-generator.texts.placeholder-put-your-ssid-here')"
        :validation="ssidValidation"
        mb-2
      />

      <c-input-text
        v-model:value="passphrase"
        :label="t('tools.wpa-psk-generator.texts.label-passphrase')"
        label-position="left"
        :placeholder="t('tools.wpa-psk-generator.texts.placeholder-put-your-passphrase-here')"
        mb-2
      />

      <div flex justify-center>
        <n-button @click="computeRawKey()">
          {{ t('tools.wpa-psk-generator.texts.tag-compute') }}
        </n-button>
      </div>
    </c-card>

    <c-card :title="t('tools.wpa-psk-generator.texts.title-wpa-psk-raw-key-256-bits')">
      <TextareaCopyable :value="wpaPSKRawKey" />
    </c-card>
  </div>
</template>
