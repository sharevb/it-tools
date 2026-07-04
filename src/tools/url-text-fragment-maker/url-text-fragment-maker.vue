<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getUrlWithTextFragment } from './url-text-fragment-maker.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const url = useQueryParam({ tool: 'url-frag-maker', name: 'd', defaultValue: '' });
const prefixSearch = ref('');
const textStartSearch = ref('');
const textStopSearch = ref('');
const suffixSearch = ref('');

const searchableUrl = computed(() => {
  try {
    return getUrlWithTextFragment({
      url: url.value,
      textStartSearch: textStartSearch.value,
      textStopSearch: textStopSearch.value,
      prefixSearch: prefixSearch.value,
      suffixSearch: suffixSearch.value,
    });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-p>
      {{ t('tools.url-text-fragment-maker.texts.tag-url-with-text-fragments-allows-to-make-link-to-content-that-has-no-anchor-or-id') }}<n-a href="https://developer.mozilla.org/en-US/docs/Web/Text_fragments" target="blank" rel="noopener">
        {{ t('tools.url-text-fragment-maker.texts.tag-see-mdn-for-more-info') }}
      </n-a>
    </n-p>
    <div>
      <c-input-text
        v-model:value="url"
        :label="t('tools.url-text-fragment-maker.texts.label-base-url')"
        :placeholder="t('tools.url-text-fragment-maker.texts.placeholder-base-url')"
        type="url"
        clearable raw-text mb-5
      />
    </div>

    <div flex justify-center gap-2>
      <c-input-text
        v-model:value="textStartSearch"
        :label="t('tools.url-text-fragment-maker.texts.label-start-search-es-comma-separated')"
        :placeholder="t('tools.url-text-fragment-maker.texts.placeholder-start-search-es-comma-separated')"
        clearable
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="textStopSearch"
        :label="t('tools.url-text-fragment-maker.texts.label-stop-search')"
        :placeholder="t('tools.url-text-fragment-maker.texts.placeholder-stop-search-text')"
        clearable
        raw-text
        mb-2
      />
    </div>

    <div flex justify-center gap-2>
      <c-input-text
        v-model:value="prefixSearch"
        :label="t('tools.url-text-fragment-maker.texts.label-prefix')"
        :placeholder="t('tools.url-text-fragment-maker.texts.placeholder-prefix-search')"
        clearable
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="suffixSearch"
        :label="t('tools.url-text-fragment-maker.texts.label-suffix')"
        :placeholder="t('tools.url-text-fragment-maker.texts.placeholder-suffix-search')"
        clearable
        raw-text
        mb-2
      />
    </div>

    <n-divider />

    <n-form-item :label="t('tools.url-text-fragment-maker.texts.label-searchable-url')">
      <TextareaCopyable :value="searchableUrl" />
    </n-form-item>
    <div flex justify-center>
      <n-a :href="searchableUrl" target="blank" rel="noopener">
        {{ t('tools.url-text-fragment-maker.texts.tag-test-searchable-url') }}
      </n-a>
    </div>
  </div>
</template>
