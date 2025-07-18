<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type EncodingBase, convertTextToUtf8Binary, convertUtf8BinaryToText } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const base = useQueryParamOrStorage({ name: 'base', storageName: 'txt-bin:base', defaultValue: '2' });
const inputText = ref('');
const binaryFromText = computed(() => convertTextToUtf8Binary(inputText.value, { base: Number(base.value) as EncodingBase }));
const { copy: copyBinary } = useCopy({ source: binaryFromText });

const inputBinary = ref('');
const textFromBinary = computed(() => withDefaultOnError(() => convertUtf8BinaryToText(inputBinary.value, { base: Number(base.value) as EncodingBase }), ''));
const inputBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertUtf8BinaryToText(value)),
    message: t('tools.text-to-binary.texts.message-binary-should-be-a-valid-utf-8-binary-string-with-multiples-of-8-bits'),
  },
];
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <div>
    <c-select
      v-model:value="base"
      :label="t('tools.text-to-binary.texts.label-conversion-base')"
      label-position="left"
      mb-2
      :options="[
        { value: '2', label: t('tools.text-to-binary.texts.label-binary') },
        { value: '8', label: t('tools.text-to-binary.texts.label-octal') },
        { value: '10', label: t('tools.text-to-binary.texts.label-decimal') },
        { value: '16', label: t('tools.text-to-binary.texts.label-hexadecimal') },
      ]"
    />

    <c-card :title="t('tools.text-to-binary.texts.title-text-to-utf-8-binary')">
      <c-input-text
        v-model:value="inputText"
        multiline
        :placeholder="t('tools.text-to-binary.texts.placeholder-e-g-hello-world')"
        :label="t('tools.text-to-binary.texts.label-enter-text-to-convert-to-binary')"
        autosize
        autofocus
        raw-text
        test-id="text-to-binary-input"
      />
      <c-input-text
        v-model:value="binaryFromText"
        :label="t('tools.text-to-binary.texts.label-binary-from-your-text')"
        multiline
        raw-text
        readonly
        mt-2
        :placeholder="t('tools.text-to-binary.texts.placeholder-the-binary-representation-of-your-text-will-be-here')"
        test-id="text-to-binary-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!binaryFromText" @click="copyBinary()">
          {{ t('tools.text-to-binary.texts.tag-copy-binary-to-clipboard') }}
        </c-button>
      </div>
    </c-card>

    <c-card :title="t('tools.text-to-binary.texts.title-utf-8-binary-to-text')">
      <c-input-text
        v-model:value="inputBinary"
        multiline
        :placeholder="t('tools.text-to-binary.texts.placeholder-e-g-01001000-01100101-01101100-01101100-01101111')"
        :label="t('tools.text-to-binary.texts.label-enter-binary-to-convert-to-text')"
        autosize
        raw-text
        :validation-rules="inputBinaryValidationRules"
        test-id="binary-to-text-input"
      />
      <c-input-text
        v-model:value="textFromBinary"
        :label="t('tools.text-to-binary.texts.label-text-from-your-binary')"
        multiline
        raw-text
        readonly
        mt-2
        :placeholder="t('tools.text-to-binary.texts.placeholder-the-text-representation-of-your-binary-will-be-here')"
        test-id="binary-to-text-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromBinary" @click="copyText()">
          {{ t('tools.text-to-binary.texts.tag-copy-text-to-clipboard') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
