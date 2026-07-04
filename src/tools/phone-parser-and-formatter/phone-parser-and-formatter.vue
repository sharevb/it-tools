<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';
import {
  formatTypeToHumanReadable,
  getDefaultCountryCode,
  getFullCountryName,
} from './phone-parser-and-formatter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { booleanToHumanReadable } from '@/utils/boolean';
import { useValidation } from '@/composable/validation';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawPhone = useQueryParam({ tool: 'phone-parser', name: 'phone', defaultValue: '' });
const defaultCountryCode = useQueryParamOrStorage({ name: 'country', storageName: 'phone-parser:country', defaultValue: getDefaultCountryCode() });
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: value => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: t('tools.phone-parser-and-formatter.texts.message-invalid-phone-number'),
    },
  ],
});

const parsedRaw = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  return withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), undefined);
});

const parsedDetails = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

  return [
    {
      label: t('tools.phone-parser-and-formatter.texts.label-country'),
      value: parsed.country,
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-country'),
      value: getFullCountryName(parsed.country),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-country-calling-code'),
      value: parsed.countryCallingCode,
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-is-valid'),
      value: booleanToHumanReadable(parsed.isValid()),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-is-possible'),
      value: booleanToHumanReadable(parsed.isPossible()),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-type'),
      value: formatTypeToHumanReadable(parsed.getType()),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-international-format'),
      value: parsed.formatInternational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-national-format'),
      value: parsed.formatNational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-e-164-format'),
      value: parsed.format('E.164'),
    },
    {
      label: t('tools.phone-parser-and-formatter.texts.label-rfc3966-format'),
      value: parsed.format('RFC3966'),
    },
  ];
});

const countriesOptions = getCountries().map(code => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));

const messageToSend = ref('');
const whatsAppLink = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

  const internationalNoPunts = parsed.formatInternational().replace(/^\+0*/g, '').replace(/\D/g, '');

  return `https://wa.me/${internationalNoPunts}?text=${encodeURIComponent(messageToSend.value)}`;
});
const smsLink = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

  const internationalNoSpaces = parsed.formatInternational().replace(/\s/g, '');
  return `sms:${internationalNoSpaces}&body=${encodeURIComponent(messageToSend.value)}`;
});
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" :label="t('tools.phone-parser-and-formatter.texts.label-default-country-code')" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      :placeholder="t('tools.phone-parser-and-formatter.texts.placeholder-enter-a-phone-number')"
      :label="t('tools.phone-parser-and-formatter.texts.label-phone-number')"
      :validation="validation"
      mb-5
    />

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td font-bold>
            {{ label }}
          </td>
          <td>
            <span-copyable v-if="value" :value="value" />
            <span v-else op-70>{{ t('tools.phone-parser-and-formatter.texts.tag-unknown') }}</span>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-divider />

    <c-input-text
      v-model:value="messageToSend"
      multiline
      rows="4"
      :placeholder="t('tools.phone-parser-and-formatter.texts.placeholder-enter-a-message-to-send')"
      :label="t('tools.phone-parser-and-formatter.texts.label-message-to-send')"
      mb-2
    />

    <c-card v-if="whatsAppLink" :title="t('tools.phone-parser-and-formatter.texts.title-whatsapp-send-link')" mb-2>
      <input-copyable :value="whatsAppLink" mb-2 />
      <div flex justify-center>
        <!-- //NOSONAR --><c-button :href="whatsAppLink" target="_blank">
          {{ t('tools.phone-parser-and-formatter.texts.tag-send-via-whatsapp') }}
        </c-button>
      </div>
    </c-card>

    <c-card v-if="smsLink" :title="t('tools.phone-parser-and-formatter.texts.title-sms-send-link')">
      <input-copyable :value="smsLink" mb-2 />
      <div flex justify-center>
        <!-- //NOSONAR --><c-button :href="smsLink" target="_blank">
          {{ t('tools.phone-parser-and-formatter.texts.tag-send-via-sms') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
