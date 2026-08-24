<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { extractIBAN, friendlyFormatIBAN, isQRIBAN, validateIBAN } from 'ibantools';
import { extractBICInfo, getFriendlyErrors } from './iban-validator-and-parser.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';
import { useQueryParam } from '@/composable/queryParams';
import CountriesDB from 'countries-db';

const { t } = useI18n();

const rawIbans = useQueryParam({ tool: 'iban-validator', name: 'iban', defaultValue: '' });

interface IbanInfo {
  iban: string;
  infos: CKeyValueListItems;
}

const ibansInfo = computed<IbanInfo[]>(() => {
  if (!rawIbans.value?.trim()) {
    return [];
  }
  const ibans = rawIbans.value
    .toUpperCase()
    .split(/\n/)
    .map((iban) => iban.replace(/\s/g, '').replace(/-/g, ''))
    .filter(Boolean);

  if (!ibans.length) {
    return [];
  }

  const results: IbanInfo[] = [];

  for (const iban of ibans) {
    const { valid: isIbanValid, errorCodes } = validateIBAN(iban);
    const { countryCode, bban, bankIdentifier, branchIdentifier, accountNumber } = extractIBAN(iban);
    const { bic, bankName } = extractBICInfo(iban);
    const errors = getFriendlyErrors(errorCodes);
    const country = CountriesDB.getCountry(countryCode || '');

    results.push({
      iban,
      infos: [
        {
          label: t('tools.iban-validator-and-parser.texts.label-is-iban-valid'),
          value: isIbanValid,
          showCopyButton: false,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.label-iban-errors'),
          value: errors.length === 0 ? undefined : errors,
          hideOnNil: true,
          showCopyButton: false,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.label-is-iban-a-qr-iban'),
          value: isQRIBAN(iban),
          showCopyButton: false,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.label-country-code'),
          value: countryCode,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.label-bban'),
          value: bban,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.label-iban-friendly-format'),
          value: friendlyFormatIBAN(iban),
        },
        {
          label: t('tools.phone-parser-and-formatter.texts.label-country'),
          value: `${country?.name} / ${country?.officialName}`,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.bank-identifier'),
          value: bankIdentifier,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.branch-identifier'),
          value: branchIdentifier,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.account-number'),
          value: accountNumber,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.bic'),
          value: bic,
        },
        {
          label: t('tools.iban-validator-and-parser.texts.bank-name'),
          value: bankName,
        },
      ],
    });
  }
  return results;
});

const ibanExamples = ['FR7630006000011234567890189', 'DE89370400440532013000', 'GB29NWBK60161331926819'];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawIbans"
      multiline
      rows="4"
      :placeholder="t('tools.iban-validator-and-parser.texts.placeholder-enter-ibans-to-check-for-validity')"
      test-id="iban-input"
    />

    <c-card v-for="ibanInfo in ibansInfo" :key="ibanInfo.iban" :title="ibanInfo.iban" mt-3>
      <c-card mt-5>
        <c-key-value-list :items="ibanInfo.infos" data-test-id="iban-info" />
      </c-card>
    </c-card>

    <c-card :title="t('tools.iban-validator-and-parser.texts.title-valid-iban-examples')" mt-5>
      <div v-for="iban in ibanExamples" :key="iban">
        <c-text-copyable :value="iban" font-mono :displayed-value="friendlyFormatIBAN(iban) ?? undefined" />
      </div>
    </c-card>
  </div>
</template>
