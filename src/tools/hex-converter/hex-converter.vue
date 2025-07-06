<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import hexArray from 'hex-array';
import { packArray, packString, unpackArray, unpackString } from 'byte-data';
import JSON5 from 'json5';
import { type Conversion, cleanHex, decodeNumber, decodeStruct, encodeStruct } from './hex-converter.service';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const mode = ref<'simple' | 'struct'>('simple');

const bits = ref(32);
const floatingPoint = ref(false);
const signed = ref(false);
const bigEndian = ref(false);
const decodeAs = ref<'dec' | 'bin' | 'hexa' | 'char' | 'utf8'>('dec');

const uppercase = ref(false);
const grouping = ref(1);
const rowlength = ref(0);

const hexInput = ref('');
const decodedOutput = computed(() => {
  try {
    const buffer = hexArray.fromString(cleanHex(hexInput.value));
    if (decodeAs.value === 'utf8') {
      return unpackString(buffer);
    }
    else {
      return unpackArray(buffer, {
        bits: bits.value,
        fp: floatingPoint.value,
        signed: signed.value,
        be: bigEndian.value,
      }, 0, buffer.length, true).map(n => decodeNumber(n, bits.value, decodeAs.value as Conversion)).join(' ');
    }
  }
  catch (e: any) {
    return e.toString();
  }
});
const numberInput = ref('');
const encodedOutput = computed(() => {
  try {
    const values = numberInput.value.split(/\s+/).map(Number);
    return hexArray.toString(
      new Uint8Array(
        packArray(values, {
          bits: bits.value,
          fp: floatingPoint.value,
          signed: signed.value,
          be: bigEndian.value,
        })),
      {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      },
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const stringInput = ref('');
const utf8Output = computed(() => {
  try {
    return hexArray.toString(
      new Uint8Array(packString(stringInput.value)),
      {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      },
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const structDefinition = ref(`{
  x: "int32",
  y: "int32",
}`);
const structDefinitionValidation = useValidation({
  source: structDefinition,
  rules: [
    {
      message: t('tools.hex-converter.texts.message-struct-definition-is-not-a-valid-json'),
      validator: value => JSON5.parse(value.trim()),
    },
  ],
});
const hexStructInput = ref('');
const decodedStructOutput = computed(() => {
  try {
    return JSON.stringify(
      decodeStruct({
        struct: JSON5.parse(structDefinition.value),
        hexArray: hexArray.fromString(cleanHex(hexStructInput.value)),
      }),
      null, 2);
  }
  catch (e: any) {
    return e.toString();
  }
});

const jsonStructInput = ref('');
const encodedStructOutput = computed(() => {
  try {
    return hexArray.toString(
      encodeStruct({
        struct: JSON5.parse(structDefinition.value),
        jsonObject: JSON5.parse(jsonStructInput.value),
      }), {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-radio-group v-model:value="mode" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="simple"
          :label="t('tools.hex-converter.texts.label-simple-encoder-decoder')"
        />
        <n-radio
          value="struct"
          :label="t('tools.hex-converter.texts.label-c-c-typed-struct')"
        />
      </n-space>
    </n-radio-group>

    <div v-if="mode === 'simple'">
      <c-card :title="t('tools.hex-converter.texts.title-hex-options')" mb-1>
        <c-select
          v-model:value="decodeAs"
          :label="t('tools.hex-converter.texts.label-decode-encode-as')"
          label-position="left" mb-1
          :options="[{ value: 'dec', label: t('tools.hex-converter.texts.label-decimal') }, { value: 'bin', label: t('tools.hex-converter.texts.label-binary') }, { value: 'hex', label: t('tools.hex-converter.texts.label-hexadecimal') }, { value: 'char', label: t('tools.hex-converter.texts.label-char-ascii') }, { value: 'utf8', label: t('tools.hex-converter.texts.label-utf8-string') }]"
        />
        <n-space v-if="decodeAs !== 'utf8'" align="baseline" justify="center">
          <n-form-item :label="t('tools.hex-converter.texts.label-bits')" label-placement="left">
            <n-input-number v-model:value="bits" :min="1" style="width: 6em" />
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="floatingPoint">
              {{ t('tools.hex-converter.texts.tag-floating-point') }}
            </n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="signed">
              {{ t('tools.hex-converter.texts.tag-signed') }}
            </n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="bigEndian">
              {{ t('tools.hex-converter.texts.tag-big-endian') }}
            </n-checkbox>
          </n-form-item>
        </n-space>
      </c-card>
      <c-card :title="t('tools.hex-converter.texts.title-hex-data-decoder')" mb-3>
        <c-input-text
          v-model:value="hexInput"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-hex-data-here')"
          rows="2"
          :label="t('tools.hex-converter.texts.label-hex-data-to-decode')"
          raw-text
          mb-5
        />

        <n-form-item :label="t('tools.hex-converter.texts.label-your-decoded-values')">
          <textarea-copyable :value="decodedOutput" />
        </n-form-item>
      </c-card>
      <c-card v-if="decodeAs !== 'utf8'" :title="t('tools.hex-converter.texts.title-hex-data-encoder')" mt-3>
        <c-input-text
          v-model:value="numberInput"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-numbers-array-here')"
          rows="2"
          :label="t('tools.hex-converter.texts.label-numbers-array-to-encode')"
          raw-text
          mb-5
        />

        <n-form-item :label="t('tools.hex-converter.texts.label-your-encoded-numbers-array-as-hex')">
          <textarea-copyable :value="encodedOutput" />
        </n-form-item>
      </c-card>
      <c-card v-if="decodeAs === 'utf8'" :title="t('tools.hex-converter.texts.title-hex-utf8-string-encoder')" mt-3>
        <c-input-text
          v-model:value="stringInput"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-text-here')"
          rows="5"
          :label="t('tools.hex-converter.texts.label-string-to-encode')"
          raw-text
          mb-5
        />

        <n-form-item :label="t('tools.hex-converter.texts.label-your-encoded-string-as-utf8-hex')">
          <textarea-copyable :value="utf8Output" />
        </n-form-item>
      </c-card>
      <c-card :title="t('tools.hex-converter.texts.title-hex-encoding-output')" mt-1>
        <n-space align="baseline" justify="center">
          <n-form-item :label="t('tools.hex-converter.texts.label-uppercase')" label-placement="left">
            <n-switch v-model:value="uppercase" />
          </n-form-item>
          <n-form-item :label="t('tools.hex-converter.texts.label-group-by')" label-placement="left">
            <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 />{{ t('tools.hex-converter.texts.tag-digits-0-no-grouping') }}
          </n-form-item>
          <n-form-item :label="t('tools.hex-converter.texts.label-split-as-rows-by')" label-placement="left">
            <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 />{{ t('tools.hex-converter.texts.tag-group-of-digits-0-no-rows') }}
          </n-form-item>
        </n-space>
      </c-card>
    </div>

    <div v-if="mode === 'struct'">
      <c-card :title="t('tools.hex-converter.texts.title-struct-definition')">
        <c-input-text
          v-model:value="structDefinition"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-struct-defintion-here')"
          rows="5"
          :label="t('tools.hex-converter.texts.label-c-c-like-struct-definition')"
          raw-text
          mb-5
          :validation="structDefinitionValidation"
        />

        <details>
          <summary>{{ t('tools.hex-converter.texts.tag-instructions') }}</summary>
          <n-p>
            {{ t('tools.hex-converter.texts.tag-define-you-struct-definition-in-json-format-keys-struct-member-names-value-type') }}<br>
            Types syntax: u?int{size}(be)? | float(be)? | double(be)? | char | wchar(be)? | &lt;type&gt;[{array size}]
            <br>
            where "u" means "unsigned" ; "be" means "Big Endian" ; {size} is number of bits ; {array size} fixed size for arrays
            <br>{{ t('tools.hex-converter.texts.tag-can-prefix-integer-with-0x-or-0b-to-display-as-hex-and-binary') }}
          </n-p>
        </details>
      </c-card>
      <c-card :title="t('tools.hex-converter.texts.title-hex-struct-decoder')" m-t-1>
        <c-input-text
          v-model:value="hexStructInput"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-hex-data-here')"
          rows="5"
          :label="t('tools.hex-converter.texts.label-hex-data-to-decode')"
          raw-text
          mb-5
        />

        <n-form-item :label="t('tools.hex-converter.texts.label-your-decoded-values')">
          <textarea-copyable :value="decodedStructOutput" />
        </n-form-item>
      </c-card>
      <c-card :title="t('tools.hex-converter.texts.title-hex-struct-encoder')" m-t-1>
        <c-input-text
          v-model:value="jsonStructInput"
          multiline
          :placeholder="t('tools.hex-converter.texts.placeholder-put-your-struct-to-encode-here')"
          rows="5"
          :label="t('tools.hex-converter.texts.label-struct-json-to-encode')"
          raw-text
          mb-5
        />

        <n-form-item :label="t('tools.hex-converter.texts.label-your-encoded-struct-as-hex')">
          <textarea-copyable :value="encodedStructOutput" />
        </n-form-item>
      </c-card>
      <c-card :title="t('tools.hex-converter.texts.title-hex-encoding-output')" mt-1>
        <n-space align="baseline" justify="center">
          <n-form-item :label="t('tools.hex-converter.texts.label-uppercase')" label-placement="left">
            <n-switch v-model:value="uppercase" />
          </n-form-item>
          <n-form-item :label="t('tools.hex-converter.texts.label-group-by')" label-placement="left">
            <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 />{{ t('tools.hex-converter.texts.tag-digits-0-no-grouping') }}
          </n-form-item>
          <n-form-item :label="t('tools.hex-converter.texts.label-split-as-rows-by')" label-placement="left">
            <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 />{{ t('tools.hex-converter.texts.tag-group-of-digits-0-no-rows') }}
          </n-form-item>
        </n-space>
      </c-card>
    </div>
  </div>
</template>
