<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import db from 'oui-data';
import { macAddressValidationRules } from '@/utils/macAddress';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const getVendorValue = (address: string) => address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);

const macAddress = useQueryParam({ tool: 'mac-lookup', name: 'addr', defaultValue: '20:37:06:12:34:56' });
const details = computed<string | undefined>(() => (db as Record<string, string>)[getVendorValue(macAddress.value)]);

const { copy } = useCopy({ source: () => details.value ?? '', text: t('tools.mac-address-lookup.texts.text-vendor-info-copied-to-the-clipboard') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      :label="t('tools.mac-address-lookup.texts.label-mac-address')"
      size="large"
      :placeholder="t('tools.mac-address-lookup.texts.placeholder-type-a-mac-address')"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      {{ t('tools.mac-address-lookup.texts.tag-vendor-info') }}
    </div>
    <c-card mb-5>
      <div v-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        {{ t('tools.mac-address-lookup.texts.tag-unknown-vendor-for-this-address') }}
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        {{ t('tools.mac-address-lookup.texts.tag-copy-vendor-info') }}
      </c-button>
    </div>
  </div>
</template>
