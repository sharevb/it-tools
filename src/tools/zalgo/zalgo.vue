<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { lunicode } from '@/utils/lunicode';

const { t } = useI18n();

const textInput = ref('');
const intensity = useQueryParamOrStorage({ name: 'intensity', storageName: 'zalgo:i', defaultValue: 8 });
watch(intensity, () => {
  if (textInput.value) {
    doZalgo();
  }
});
const zalgoOutput = ref('');
function doZalgo() {
  lunicode.tools.creepify.options.maxHeight = intensity.value;
  zalgoOutput.value = lunicode.tools.creepify.encode(textInput.value);
}
const { copy: copyZalgoOutput } = useCopy({ source: zalgoOutput, text: t('tools.zalgo.texts.text-zalgo-text-copied') });

const zalgoInput = ref('');
const textOutput = ref('');
function unZalgo() {
  textOutput.value = lunicode.tools.creepify.decode(zalgoInput.value);
}
</script>

<template>
  <c-card :title="t('tools.zalgo.texts.title-zalgo-text-generation')">
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.zalgo.texts.placeholder-put-your-string-here')"
      rows="5"
      :label="t('tools.zalgo.texts.label-text-to-decorate-with-zalgo')"
      raw-text
      mb-2
    />

    <n-form-item :label="t('tools.zalgo.texts.label-intensity')" label-placement="left" mb-3>
      <NSlider v-model:value="intensity" :min="1" :max="300" :step="1" />
    </n-form-item>

    <n-space justify="center" mb-2>
      <n-button
        type="primary"
        @click="doZalgo"
      >
        {{ t('tools.zalgo.texts.tag-generate') }}
      </n-button>
    </n-space>

    <div v-if="zalgoOutput">
      <n-card :title="t('tools.zalgo.texts.title-zalgo-text')" mb-2>
        <div :style="{ lineHeight: intensity / 3, textAlign: 'center' }">
          {{ zalgoOutput }}
        </div>
      </n-card>

      <div flex justify-center>
        <c-button @click="copyZalgoOutput()">
          {{ t('tools.zalgo.texts.tag-copy') }}
        </c-button>
      </div>
    </div>
  </c-card>

  <c-card :title="t('tools.zalgo.texts.title-zalgo-cleaner')">
    <c-input-text
      v-model:value="zalgoInput"
      multiline
      :placeholder="t('tools.zalgo.texts.placeholder-put-zalgo-text-to-clean-here')"
      rows="5"
      :label="t('tools.zalgo.texts.label-zalgo-text-to-clean')"
      mb-5
    />

    <n-space justify="center" mb-2>
      <n-button
        type="primary"
        @click="unZalgo"
      >
        {{ t('tools.zalgo.texts.tag-clean') }}
      </n-button>
    </n-space>

    <TextareaCopyable
      v-if="textOutput"
      v-model:value="textOutput"
      :label="t('tools.zalgo.texts.label-cleaned-text')"
      :placeholder="t('tools.zalgo.texts.placeholder-clean-zalgo-text-will-appear-here')"
      mb-5
    />
  </c-card>
</template>
