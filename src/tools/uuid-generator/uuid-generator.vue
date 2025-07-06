<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, v6 as generateUuidV6, v7 as generateUuidV7, NIL as nilUuid } from 'uuid';

import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const versions = ['NIL', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7'] as const;

const version = useStorage<typeof versions[number]>('uuid-generator:version', 'v4');
const count = useStorage('uuid-generator:quantity', 1);
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' });

const validUuidRules = [
  {
    message: t('tools.uuid-generator.texts.message-invalid-uuid'),
    validator: (value: string) => {
      if (value === nilUuid) {
        return true;
      }

      return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
    },
  },
];

const generators = {
  NIL: () => nilUuid,
  v1: (index: number) => generateUuidV1({
    clockseq: index,
    msecs: Date.now(),
    nsecs: Math.floor(Math.random() * 10000),
    node: Uint8Array.from(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))),
  }),
  v3: () => generateUuidV3(v35Args.value.name, v35Args.value.namespace),
  v4: () => generateUuidV4(),
  v5: () => generateUuidV5(v35Args.value.name, v35Args.value.namespace),
  v6: () => generateUuidV6(),
  v7: () => generateUuidV7(),
};

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() =>
  Array.from({ length: count.value }, (_ignored, index) => {
    const generator = generators[version.value] ?? generators.NIL;
    return generator(index);
  }).join('\n'), ''));

const { copy } = useCopy({ source: uuids, text: t('tools.uuid-generator.texts.text-uuids-copied-to-the-clipboard') });
</script>

<template>
  <div>
    <c-buttons-select v-model:value="version" :options="versions" :label="t('tools.uuid-generator.texts.label-uuid-version')" label-width="100px" mb-2 />

    <div mb-2 flex items-center>
      <span w-100px>{{ t('tools.uuid-generator.texts.tag-quantity') }}</span>
      <n-input-number v-model:value="count" flex-1 :min="1" :max="50" :placeholder="t('tools.uuid-generator.texts.placeholder-uuid-quantity')" />
    </div>

    <div v-if="version === 'v3' || version === 'v5'">
      <div>
        <c-buttons-select
          v-model:value="v35Args.namespace"
          :options="{
            DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
          }"
          :label="t('tools.uuid-generator.texts.label-namespace')"
          label-width="100px"
          mb-2
        />
      </div>
      <div flex-1>
        <c-input-text
          v-model:value="v35Args.namespace"
          :placeholder="t('tools.uuid-generator.texts.placeholder-namespace')"
          label-width="100px"
          label-position="left"
          label=" "
          :validation-rules="validUuidRules"
          mb-2
        />
      </div>

      <c-input-text
        v-model:value="v35Args.name"
        :placeholder="t('tools.uuid-generator.texts.placeholder-name')"
        :label="t('tools.uuid-generator.texts.label-name')"
        label-width="100px"
        label-position="left"
        mb-2
      />
    </div>

    <c-input-text
      style="text-align: center; font-family: monospace"
      :value="uuids"
      multiline
      :placeholder="t('tools.uuid-generator.texts.placeholder-your-uuids')"
      autosize
      rows="1"
      readonly
      raw-text
      monospace
      my-3
      class="uuid-display"
    />

    <div flex justify-center gap-3>
      <c-button autofocus @click="copy()">
        {{ t('tools.uuid-generator.texts.tag-copy') }}
      </c-button>
      <c-button @click="refreshUUIDs">
        {{ t('tools.uuid-generator.texts.tag-refresh') }}
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
::v-deep(.uuid-display) {
  textarea {
    text-align: center;
  }
}
</style>
