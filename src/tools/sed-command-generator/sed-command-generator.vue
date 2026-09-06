<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const form = ref({
  commandType: 'substitute', // substitute | delete | extract | number
  pattern: '',
  replacement: '',
  delimiter: '/',
  global: true,
  caseInsensitive: false,
  inPlace: false,
  extendedRegex: false,
  suppressPrint: false,
  targetFile: '',
});

const sedCommand = computed(() => {
  const {
    commandType,
    pattern,
    replacement,
    delimiter,
    global,
    caseInsensitive,
    inPlace,
    extendedRegex,
    suppressPrint,
    targetFile,
  } = form.value;

  const options = [inPlace ? '-i' : '', extendedRegex ? '-E' : '', suppressPrint ? '-n' : ''].filter(Boolean).join(' ');

  let expr = '';

  if (commandType === 'substitute') {
    if (!pattern || !replacement) {
      return '';
    }
    const flags = `${global ? 'g' : ''}${caseInsensitive ? 'i' : ''}`;
    expr = `s${delimiter}${pattern}${delimiter}${replacement}${delimiter}${flags}`;
  } else if (commandType === 'delete') {
    if (!pattern) {
      return '';
    }
    expr = `/${pattern}/d`;
  } else if (commandType === 'extract') {
    if (!pattern) {
      return '';
    }
    expr = `/${pattern}/p`;
  } else if (commandType === 'number') {
    expr = '=';
  }

  const file = targetFile || 'yourfile.txt';
  return `sed ${options} '${expr}' ${file}`.trim();
});
</script>

<template>
  <div>
    <n-space justify="center" mb-1 mt-1>
      <n-p>
        {{ t('tools.sed-command-generator.texts.tag-for-more-information-about')
        }}<code>{{ t('tools.sed-command-generator.texts.tag-sed') }}</code
        >{{ t('tools.sed-command-generator.texts.tag-command-see')
        }}<c-link target="_blank" to="/sed-memo">
          {{ t('tools.sed-command-generator.texts.tag-sed-command-cheatsheet') }}
        </c-link>
      </n-p>
    </n-space>

    <n-form :model="form" label-placement="left" label-width="120px" mt-2>
      <n-space justify="center" mb-1 mt-1>
        <n-form-item :label="t('tools.sed-command-generator.texts.label-command-type')">
          <n-radio-group v-model:value="form.commandType" name="commandType">
            <n-radio-button value="substitute">
              {{ t('tools.sed-command-generator.texts.tag-substitute') }}
            </n-radio-button>
            <n-radio-button value="delete">
              {{ t('tools.sed-command-generator.texts.tag-delete') }}
            </n-radio-button>
            <n-radio-button value="extract">
              {{ t('tools.sed-command-generator.texts.tag-extract') }}
            </n-radio-button>
            <n-radio-button value="number">
              {{ t('tools.sed-command-generator.texts.tag-number-lines') }}
            </n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-space>

      <n-card v-if="form.commandType !== 'number'" :title="t('tools.sed-command-generator.texts.title-search-pattern')">
        <n-input
          v-model:value="form.pattern"
          :placeholder="t('tools.sed-command-generator.texts.placeholder-e-g-foo')"
        />
        <c-link target="_blank" to="/regex-memo">
          {{ t('tools.sed-command-generator.texts.tag-see-regex-cheatsheet') }}
        </c-link>
      </n-card>

      <n-form-item
        v-if="form.commandType === 'substitute'"
        :label="t('tools.sed-command-generator.texts.label-replacement')"
        mt-3
      >
        <n-input
          v-model:value="form.replacement"
          :placeholder="t('tools.sed-command-generator.texts.placeholder-e-g-bar')"
        />
      </n-form-item>

      <n-form-item
        v-if="form.commandType === 'substitute'"
        :label="t('tools.sed-command-generator.texts.label-delimiter')"
      >
        <n-input
          v-model:value="form.delimiter"
          :placeholder="t('tools.sed-command-generator.texts.placeholder-e-g-or')"
        />
      </n-form-item>

      <n-form-item v-if="form.commandType === 'substitute'" :label="t('tools.sed-command-generator.texts.label-flags')">
        <n-checkbox v-model:checked="form.global">
          {{ t('tools.sed-command-generator.texts.tag-global-g') }}
        </n-checkbox>
        <n-checkbox v-model:checked="form.caseInsensitive">
          {{ t('tools.sed-command-generator.texts.tag-case-insensitive-i') }}
        </n-checkbox>
      </n-form-item>

      <n-form-item :label="t('tools.sed-command-generator.texts.label-options')">
        <n-checkbox v-model:checked="form.inPlace">
          {{ t('tools.sed-command-generator.texts.tag-in-place-editing-i') }}
        </n-checkbox>
        <n-checkbox v-model:checked="form.extendedRegex">
          {{ t('tools.sed-command-generator.texts.tag-extended-regex-e') }}
        </n-checkbox>
        <n-checkbox v-model:checked="form.suppressPrint">
          {{ t('tools.sed-command-generator.texts.tag-suppress-automatic-printing-n') }}
        </n-checkbox>
      </n-form-item>

      <n-form-item :label="t('tools.sed-command-generator.texts.label-target-file')">
        <n-input
          v-model:value="form.targetFile"
          :placeholder="t('tools.sed-command-generator.texts.placeholder-e-g-file-txt')"
        />
      </n-form-item>

      <c-card :title="t('tools.sed-command-generator.texts.title-generated-sed-command')" mt-3>
        <textarea-copyable :value="sedCommand" />
      </c-card>
    </n-form>
  </div>
</template>
