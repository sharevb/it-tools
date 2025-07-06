<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ISBN3 from 'isbn3';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const { t } = useI18n();

const rawIsbn = ref('9782021304534');

const isbnInfos = computed<CKeyValueListItems>(() => {
  const isbn = ISBN3.parse(rawIsbn.value);

  if (isbn == null) {
    return [];
  }

  return [
    {
      label: t('tools.isbn-validator-and-parser.texts.label-is-isbn-valid'),
      value: isbn.isValid,
    },
    {
      label: t('tools.isbn-validator-and-parser.texts.label-country'),
      value: isbn.groupname,
    },
    {
      label: t('tools.isbn-validator-and-parser.texts.label-isbn-13'),
      value: isbn.isbn13,
    },
    {
      label: t('tools.isbn-validator-and-parser.texts.label-isbn-13-formatted'),
      value: isbn.isbn13h,
    },
    {
      label: t('tools.isbn-validator-and-parser.texts.label-isbn-10'),
      value: isbn.isbn10,
    },
    {
      label: t('tools.isbn-validator-and-parser.texts.label-isbn-10-formatted'),
      value: isbn.isbn10h,
    },
  ];
});

function isbnChecksum(isbn: string) {
  let check = 0;

  if (isbn.length === 9) {
    for (let n = 0; n < 9; n += 1) {
      check += (10 - n) * Number(isbn.charAt(n));
    }
    check = (11 - check % 11) % 11;
    return check === 10 ? 'X' : String(check);
  }
  else if (isbn.length === 12) {
    for (let n = 0; n < 12; n += 2) {
      check += Number(isbn.charAt(n)) + 3 * Number(isbn.charAt(n + 1));
    }
    return String((10 - check % 10) % 10);
  }

  return null;
}

const normalizedISBN = computed(() => {
  let normalized = rawIsbn.value.replace(/[^\dX]/g, '');
  if (normalized.length >= 13) {
    normalized = normalized.substring(0, 12);
  }
  else if (normalized.length >= 10) {
    normalized = normalized.substring(0, 9);
  }
  const checksum = isbnChecksum(normalized);
  return ISBN3.parse(`${normalized}${checksum}`)?.isbn13h;
});

const isbnAuditInfos = computed<{ isValid: boolean; clues: CKeyValueListItems }>(() => {
  const isbn = ISBN3.audit(rawIsbn.value);

  const isValid = (isbn?.validIsbn ?? false);
  return {
    isValid,
    clues: Array.from((isbn?.clues ?? []),
      clue => ({ label: `${clue.message} (${clue.groupname})`, value: clue.candidate })),
  };
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIsbn" :placeholder="t('tools.isbn-validator-and-parser.texts.placeholder-enter-an-isbn-to-check-for-validity')" test-id="isbn-input" />
    <n-alert v-if="!isbnAuditInfos.isValid" type="error">
      {{ t('tools.isbn-validator-and-parser.texts.tag-invalid-isbn') }}<input-copyable v-if="normalizedISBN" :label="t('tools.isbn-validator-and-parser.texts.label-probably-correct')" label-position="left" :value="normalizedISBN" disabled="true" />
    </n-alert>

    <c-card v-if="isbnInfos.length > 0" mt-5 :title="t('tools.isbn-validator-and-parser.texts.title-isbn-infos')">
      <c-key-value-list :items="isbnInfos" data-test-id="isbn-info" />
    </c-card>
    <c-card v-if="isbnAuditInfos.clues.length > 0" mt-5 :title="t('tools.isbn-validator-and-parser.texts.title-isbn-audit-infos')">
      <c-key-value-list :items="isbnAuditInfos" data-test-id="isbn-info" />
    </c-card>
  </div>
</template>
