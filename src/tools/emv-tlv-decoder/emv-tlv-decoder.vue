<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseEmvData } from './emv-tlv-decoder.service';
import TLVTagTree from './TLVTagTree.vue';

const { t } = useI18n();

const tlvInput = ref(
  '4F07A00000000430605F2A02097882025C008407A0000000043060950500800080009A031508069C01009F02060000000001019F080200009F090200009F10120114000100000000000000E0DB2E438900FF',
);
const parsedTags = ref<any[]>([]);
const error = ref('');
const kernel = ref('Generic');

function parseTlv() {
  try {
    const hex = tlvInput.value.replace(/\s+/g, '').toUpperCase();
    parsedTags.value = parseEmvData(hex, kernel.value);
  } catch (err: any) {
    error.value = err.toString();
    parsedTags.value = [];
  }
}
</script>

<template>
  <div>
    <NFormItem :label="t('tools.emv-tlv-decoder.texts.label-tlv-hex-input')" mb-2>
      <NInput
        v-model:value="tlvInput"
        type="textarea"
        :placeholder="
          t(
            'tools.emv-tlv-decoder.texts.placeholder-paste-emv-tlv-hex-string-e-g-6f1a8407a0000000031010a50f500b5649534120435245444954',
          )
        "
        rows="4"
      />
    </NFormItem>
    <c-select
      v-model:value="kernel"
      :options="['Generic', 'Visa', 'Mastercard', 'JCB', 'AMEX']"
      :label="t('tools.emv-tlv-decoder.texts.label-kernel-type')"
      label-position="left"
      mb-2
    />
    <div mb-2 flex justify-center>
      <NButton type="primary" @click="parseTlv">
        {{ t('tools.emv-tlv-decoder.texts.tag-parse-tlv') }}
      </NButton>
    </div>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="parsedTags" :title="t('tools.emv-tlv-decoder.texts.title-decoded-emv-tags')">
      <TLVTagTree :tags="parsedTags" />
    </c-card>
  </div>
</template>
