<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

const { t } = useI18n();

const sortOrderOptions = [
  {
    label: t('tools.list-converter.texts.label-no-sort'),
    value: null,
    disabled: false,
  },
  {
    label: t('tools.list-converter.texts.label-sort-ascending'),
    value: 'asc',
  },
  {
    label: t('tools.list-converter.texts.label-sort-descending'),
    value: 'desc',
  },
  {
    label: t('tools.list-converter.texts.label-sort-asc-numeric'),
    value: 'asc-num',
  },
  {
    label: t('tools.list-converter.texts.label-sort-desc-numeric'),
    value: 'desc-num',
  },
  {
    label: t('tools.list-converter.texts.label-sort-asc-upper'),
    value: 'asc-upper',
  },
  {
    label: t('tools.list-converter.texts.label-sort-desc-upper'),
    value: 'desc-upper',
  },
  {
    label: t('tools.list-converter.texts.label-sort-asc-binary'),
    value: 'asc-bin',
  },
  {
    label: t('tools.list-converter.texts.label-sort-desc-binary'),
    value: 'desc-bin',
  },
];

const conversionConfig = useStorage<ConvertOptions>('list-converter:conversionConfig', {
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  removeItemPrefix: '',
  removeItemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  itemsSeparator: ', ',
  splitBySeparator: '',
});

function transformer(value: string) {
  return convert(value, conversionConfig.value);
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card>
        <n-space>
          <div>
            <n-form-item :label="t('tools.list-converter.texts.label-trim-list-items')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.trimItems" />
            </n-form-item>
            <n-form-item :label="t('tools.list-converter.texts.label-remove-duplicates')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.removeDuplicates" data-test-id="removeDuplicates" />
            </n-form-item>
            <n-form-item
              :label="t('tools.list-converter.texts.label-convert-to-lowercase')"
              label-placement="left"
              label-width="150"
              :show-feedback="false"
              mb-2
            >
              <n-switch v-model:value="conversionConfig.lowerCase" />
            </n-form-item>
            <n-form-item :label="t('tools.list-converter.texts.label-keep-line-breaks')" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.keepLineBreaks" />
            </n-form-item>
          </div>
          <div>
            <c-select
              v-model:value="conversionConfig.sortList"
              :label="t('tools.list-converter.texts.label-sort-list')"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :options="sortOrderOptions"
              w-full
              :disabled="conversionConfig.reverseList"
              data-test-id="sortList"
              :placeholder="t('tools.list-converter.texts.placeholder-sort-alphabetically')"
            />

            <c-input-text
              v-model:value="conversionConfig.itemsSeparator"
              :label="t('tools.list-converter.texts.label-items-separator')"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :placeholder="t('tools.list-converter.texts.placeholder-items-separator')"
            />

            <c-input-text
              v-model:value="conversionConfig.splitBySeparator"
              :label="t('tools.list-converter.texts.label-split-separator')"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :placeholder="t('tools.list-converter.texts.placeholder-separator-for-splitting')"
            />

            <n-form-item :label="t('tools.list-converter.texts.label-unwrap-item')" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.removeItemPrefix"
                :placeholder="t('tools.list-converter.texts.placeholder-remove-item-prefix-regex')"
                test-id="removeItemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.removeItemSuffix"
                :placeholder="t('tools.list-converter.texts.placeholder-remove-item-suffix-regex')"
                test-id="removeItemSuffix"
              />
            </n-form-item>

            <n-form-item :label="t('tools.list-converter.texts.label-wrap-item')" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.itemPrefix"
                :placeholder="t('tools.list-converter.texts.placeholder-item-prefix')"
                test-id="itemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.itemSuffix"
                :placeholder="t('tools.list-converter.texts.placeholder-item-suffix')"
                test-id="itemSuffix"
              />
            </n-form-item>
            <n-form-item :label="t('tools.list-converter.texts.label-wrap-list')" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.listPrefix"
                :placeholder="t('tools.list-converter.texts.placeholder-list-prefix')"
                test-id="listPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.listSuffix"
                :placeholder="t('tools.list-converter.texts.placeholder-list-suffix')"
                test-id="listSuffix"
              />
            </n-form-item>
          </div>
        </n-space>
      </c-card>
    </div>
  </div>
  <format-transformer
    :input-label="t('tools.list-converter.texts.input-label-your-input-data')"
    :input-placeholder="t('tools.list-converter.texts.input-placeholder-paste-your-input-data-here')"
    :output-label="t('tools.list-converter.texts.output-label-your-transformed-data')"
    :transformer="transformer"
    download-file-name="output.txt"
  />
</template>
