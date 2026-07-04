<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import hexArray from 'hex-array';
import { bytesToPassphrase, passphraseToBytes } from 'niceware';

const { t } = useI18n();

const textInput = ref('');
const nicewareOutput = computed(() => {
  try {
    return bytesToPassphrase(hexArray.fromString(textInput.value)).join(' ');
  }
  catch (e: any) {
    return e.toString();
  }
});

const uppercase = ref(false);
const grouping = ref(0);
const rowlength = ref(0);

const nicewareInput = ref('');
const textOutput = computed(() => {
  try {
    return hexArray.toString(passphraseToBytes(nicewareInput.value.split(/\s+/)), {
      uppercase: uppercase.value,
      grouping: grouping.value,
      rowlength: rowlength.value,
    });
  }
  catch (e: any) {
    return e.toString();
  }
},
);
</script>

<template>
  <c-card :title="t('tools.niceware-bytes-to-passphrase.texts.title-hex-array-to-niceware-passphrase')">
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.niceware-bytes-to-passphrase.texts.placeholder-put-your-hex-array-here')"
      rows="5"
      :label="t('tools.niceware-bytes-to-passphrase.texts.label-hex-array-to-encode')"
      raw-text
      mb-5
    />

    <n-form-item :label="t('tools.niceware-bytes-to-passphrase.texts.label-converted-niceware-passphrase')">
      <textarea-copyable :value="nicewareOutput" />
    </n-form-item>
  </c-card>

  <c-card :title="t('tools.niceware-bytes-to-passphrase.texts.title-niceware-passphrase-to-hex-array')">
    <n-space align="baseline" justify="center" mb-1>
      <n-form-item :label="t('tools.niceware-bytes-to-passphrase.texts.label-uppercase')" label-placement="left">
        <n-switch v-model:value="uppercase" />
      </n-form-item>
      <n-form-item :label="t('tools.niceware-bytes-to-passphrase.texts.label-group-by')" label-placement="left">
        <n-input-number-i18n v-model:value="grouping" :min="0" style="width: 6em" mr-1 />
        <span>{{ t('tools.niceware-bytes-to-passphrase.texts.tag-digit-0-no-grouping') }}</span>
      </n-form-item>
      <n-form-item :label="t('tools.niceware-bytes-to-passphrase.texts.label-split-as-row-by')" label-placement="left">
        <n-input-number-i18n v-model:value="rowlength" :min="0" style="width: 6em" mr-1 />
        <span>{{ t('tools.niceware-bytes-to-passphrase.texts.tag-digit-0-no-row') }}</span>
      </n-form-item>
    </n-space>
    <c-input-text
      v-model:value="nicewareInput"
      multiline
      :placeholder="t('tools.niceware-bytes-to-passphrase.texts.placeholder-put-your-niceware-passphrase-here')"
      rows="5"
      :label="t('tools.niceware-bytes-to-passphrase.texts.label-niceware-passphrase-to-decode')"
      mb-5
    />

    <n-form-item :label="t('tools.niceware-bytes-to-passphrase.texts.label-converted-to-hex-array')">
      <textarea-copyable :value="textOutput" />
    </n-form-item>
  </c-card>
</template>
