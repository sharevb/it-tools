<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  EAPMethods,
  EAPPhase2Methods,
  useWifiQRCode,
} from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const foreground = useQueryParam({ tool: 'wifi-qr-gen', name: 'fg', defaultValue: '#000000ff' });
const background = useQueryParam({ tool: 'wifi-qr-gen', name: 'bg', defaultValue: '#ffffffff' });

const ssid = useQueryParam({ tool: 'wifi-qr-gen', name: 'ssid', defaultValue: '' });
const password = ref();
const eapMethod = ref();
const isHiddenSSID = ref(false);
const eapAnonymous = ref(false);
const eapIdentity = ref();
const eapPhase2Method = ref();

const { qrcode, text, encryption } = useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: {
    background,
    foreground,
  },
  options: { width: 1024 },
});

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' });
const { copy } = useCopy({ source: text, text: t('tools.wifi-qr-code-generator.texts.text-copied-to-the-clipboard') });
</script>

<template>
  <c-card>
    <div grid grid-cols-1 gap-12>
      <div>
        <c-select
          v-model:value="encryption" mb-4 :label="t('tools.wifi-qr-code-generator.texts.label-encryption-method')" default-value="WPA" label-position="left"
          label-width="130px" label-align="right" :options="[
            {
              label: t('tools.wifi-qr-code-generator.texts.label-no-password'),
              value: 'nopass',
            },
            {
              label: t('tools.wifi-qr-code-generator.texts.label-wpa-wpa2-wpa3'),
              value: 'WPA',
            },
            {
              label: t('tools.wifi-qr-code-generator.texts.label-wpa3-only-no-wpa2-fallback'),
              value: 'WPA3',
            },
            {
              label: t('tools.wifi-qr-code-generator.texts.label-wpa2-wpa3-mixed-mode'),
              value: 'WPA2/WPA3',
            },
            {
              label: t('tools.wifi-qr-code-generator.texts.label-wep'),
              value: 'WEP',
            },
            {
              label: t('tools.wifi-qr-code-generator.texts.label-wpa2-eap'),
              value: 'WPA2-EAP',
            },
          ]"
        />
        <div class="mb-6 flex flex-row items-center gap-2">
          <c-input-text
            v-model:value="ssid" label-position="left" label-width="130px" label-align="right" :label="t('tools.wifi-qr-code-generator.texts.label-ssid')"
            rows="1" autosize :placeholder="t('tools.wifi-qr-code-generator.texts.placeholder-your-wifi-ssid')" mb-6
          />
          <n-checkbox v-model:checked="isHiddenSSID">
            {{ t('tools.wifi-qr-code-generator.texts.tag-hidden-ssid') }}
          </n-checkbox>
        </div>
        <c-input-text
          v-if="encryption !== 'nopass'" v-model:value="password" label-position="left" label-width="130px"
          label-align="right" :label="t('tools.wifi-qr-code-generator.texts.label-password')" rows="1" autosize type="password" :placeholder="t('tools.wifi-qr-code-generator.texts.placeholder-your-wifi-password')"
          mb-6
        />
        <c-select
          v-if="encryption === 'WPA2-EAP'" v-model:value="eapMethod" :label="t('tools.wifi-qr-code-generator.texts.label-eap-method')" label-position="left"
          label-width="130px" label-align="right"
          :options="EAPMethods.map((method) => ({ label: method, value: method }))" searchable mb-4
        />
        <div v-if="encryption === 'WPA2-EAP'" class="mb-6 flex flex-row items-center gap-2">
          <c-input-text
            v-model:value="eapIdentity" label-position="left" label-width="130px" label-align="right"
            :label="t('tools.wifi-qr-code-generator.texts.label-identity')" rows="1" autosize :placeholder="t('tools.wifi-qr-code-generator.texts.placeholder-your-eap-identity')" mb-6
          />
          <n-checkbox v-model:checked="eapAnonymous">
            {{ t('tools.wifi-qr-code-generator.texts.tag-anonymous') }}
          </n-checkbox>
        </div>
        <c-select
          v-if="encryption === 'WPA2-EAP'" v-model:value="eapPhase2Method" :label="t('tools.wifi-qr-code-generator.texts.label-eap-phase-2-method')"
          label-position="left" label-width="130px" label-align="right"
          :options="EAPPhase2Methods.map((method) => ({ label: method, value: method }))" searchable mb-4
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item :label="t('tools.wifi-qr-code-generator.texts.label-foreground-color')">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item :label="t('tools.wifi-qr-code-generator.texts.label-background-color')">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
        </n-form>
      </div>
      <div v-if="qrcode">
        <div flex flex-col items-center gap-3>
          <img alt="wifi-qrcode" :src="qrcode" width="200">
          <c-button @click="download">
            {{ t('tools.wifi-qr-code-generator.texts.tag-download-qr-code') }}
          </c-button>
        </div>
      </div>
      <div v-if="qrcode">
        <div flex flex-col items-center gap-3>
          <c-button @click="copy()">
            {{ t('tools.wifi-qr-code-generator.texts.tag-copy-connection-string') }}
          </c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
