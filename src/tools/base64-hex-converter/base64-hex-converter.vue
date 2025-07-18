<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import hexArray from 'hex-array';
import { useCopy } from '@/composable/copy';
import { isValidBase64 } from '@/utils/base64';

const { t } = useI18n();

const textInput = ref('');
const base64Output = computed(() => {
  try {
    return Base64.fromUint8Array(hexArray.fromString(textInput.value));
  }
  catch (e: any) {
    return e.toString();
  }
});
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: t('tools.base64-hex-converter.texts.text-base64-hex-array-copied-to-the-clipboard') });

const uppercase = ref(false);
const grouping = ref(0);
const rowlength = ref(0);

const base64Input = ref('');
const textOutput = computed(() => {
  try {
    return hexArray.toString(Base64.toUint8Array(base64Input.value), {
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
const { copy: copyText } = useCopy({ source: textOutput, text: t('tools.base64-hex-converter.texts.text-hex-array-copied-to-the-clipboard') });
const b64ValidationRules = [
  {
    message: t('tools.base64-hex-converter.texts.message-invalid-base64-string'),
    validator: (value: string) => isValidBase64(value.trim()),
  },
];
</script>

<template>
  <c-card :title="t('tools.base64-hex-converter.texts.title-hex-array-to-base64')">
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.base64-hex-converter.texts.placeholder-put-your-hex-array-here')"
      rows="5"
      :label="t('tools.base64-hex-converter.texts.label-hex-array-to-encode')"
      raw-text
      mb-5
    />

    <c-input-text
      :label="t('tools.base64-hex-converter.texts.label-base64-of-hex-array')"
      :value="base64Output"
      multiline
      readonly
      :placeholder="t('tools.base64-hex-converter.texts.placeholder-the-base64-encoding-of-your-hex-array-will-be-here')"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        {{ t('tools.base64-hex-converter.texts.tag-copy-base64') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.base64-hex-converter.texts.title-base64-to-hex-array')">
    <n-space align="baseline" justify="center" mb-1>
      <n-form-item :label="t('tools.base64-hex-converter.texts.label-uppercase')" label-placement="left">
        <n-switch v-model:value="uppercase" />
      </n-form-item>
      <n-form-item :label="t('tools.base64-hex-converter.texts.label-group-by')" label-placement="left">
        <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 />{{ t('tools.base64-hex-converter.texts.tag-digits-0-no-grouping') }}
      </n-form-item>
      <n-form-item :label="t('tools.base64-hex-converter.texts.label-split-as-rows-by')" label-placement="left">
        <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 />{{ t('tools.base64-hex-converter.texts.tag-group-of-digits-0-no-rows') }}
      </n-form-item>
    </n-space>
    <c-input-text
      v-model:value="base64Input"
      multiline
      :placeholder="t('tools.base64-hex-converter.texts.placeholder-your-base64-hex-array')"
      rows="5"
      :validation-rules="b64ValidationRules"
      :label="t('tools.base64-hex-converter.texts.label-base64-hex-array-to-decode')"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      :label="t('tools.base64-hex-converter.texts.label-decoded-hex-array')"
      :placeholder="t('tools.base64-hex-converter.texts.placeholder-the-decoded-hex-array-will-be-here')"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        {{ t('tools.base64-hex-converter.texts.tag-copy-decoded-hex-array') }}
      </c-button>
    </div>
  </c-card>
</template>
