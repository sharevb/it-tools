<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const url = useITStorage('utm-generator:url', '');
const utmSource = useITStorage('utm-generator:source', '');
const utmMedium = useITStorage('utm-generator:medium', '');
const utmCampaign = useITStorage('utm-generator:campaign', '');
const utmContent = useITStorage('utm-generator:content', '');
const utmTerm = useITStorage('utm-generator:term', '');
const utmifiedUrl = computed(() => {
  try {
    const utmUrl = new URL(url.value);
    utmUrl.searchParams.set('utm_source', utmSource.value);
    utmUrl.searchParams.set('utm_medium', utmMedium.value);
    utmUrl.searchParams.set('utm_campaign', utmCampaign.value);
    if (utmContent.value) {
      utmUrl.searchParams.set('utm_content', utmContent.value);
    }
    if (utmContent.value) {
      utmUrl.searchParams.set('utm_term', utmTerm.value);
    }
    return utmUrl.href;
  }
  catch {
    return '# invalid inputs';
  }
});

const urlValidation = useValidation({
  source: url,
  rules: [
    {
      message: t('tools.utm-url-generator.texts.message-invalid-url-string'),
      validator: (value) => {
        try {
          const _ = (new URL(value));
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
const utmMediumValidation = useValidation({
  source: utmMedium,
  rules: [
    {
      message: t('tools.utm-url-generator.texts.message-utm-medium-is-required'),
      validator: value => value !== '',
    },
  ],
});
const utmSourceValidation = useValidation({
  source: utmSource,
  rules: [
    {
      message: t('tools.utm-url-generator.texts.message-utm-source-is-required'),
      validator: value => value !== '',
    },
  ],
});
const utmCampaignValidation = useValidation({
  source: utmCampaign,
  rules: [
    {
      message: t('tools.utm-url-generator.texts.message-utm-campaign-is-required'),
      validator: value => value !== '',
    },
  ],
});
const { copy } = useCopy({ source: utmifiedUrl, text: t('tools.utm-url-generator.texts.text-utmified-url-copied') });
</script>

<template>
  <div>
    <n-p>
      {{ t('tools.utm-url-generator.texts.tag-for-more-info-about-utm-see') }}<n-a href="https://en.wikipedia.org/wiki/UTM_parameters" target="_blank" rel="noopener noreferrer">
        {{ t('tools.utm-url-generator.texts.tag-utm-parameters') }}
      </n-a>
    </n-p>

    <c-input-text
      v-model:value="url"
      :label="t('tools.utm-url-generator.texts.label-website-url')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-website-url-here')"
      clearable
      mb-2
      :validation="urlValidation"
    />
    <c-input-text
      v-model:value="utmSource"
      :label="t('tools.utm-url-generator.texts.label-utm-source-identifies-which-site-sent-the-traffic')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-utm-source-here')"
      clearable
      mb-2
      :validation="utmSourceValidation"
    />
    <c-input-text
      v-model:value="utmMedium"
      :label="t('tools.utm-url-generator.texts.label-utm-medium-identifies-what-type-of-link-was-used')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-utm-medium-here')"
      clearable
      mb-2
      :validation="utmMediumValidation"
    />
    <c-input-text
      v-model:value="utmCampaign"
      :label="t('tools.utm-url-generator.texts.label-utm-campaign-identifies-a-specific-product-promotion-or-strategic-campaign')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-utm-campaign-here')"
      clearable
      mb-2
      :validation="utmCampaignValidation"
    />
    <c-input-text
      v-model:value="utmContent"
      :label="t('tools.utm-url-generator.texts.label-utm-content-identifies-search-terms')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-utm-content-here')"
      clearable
      mb-2
    />
    <c-input-text
      v-model:value="utmTerm"
      :label="t('tools.utm-url-generator.texts.label-utm-term-identifies-what-specifically-was-clicked-to-bring-the-user-to-the-site')"
      :placeholder="t('tools.utm-url-generator.texts.placeholder-put-your-utm-term-here')"
      clearable
      mb-2
    />

    <div v-if="utmifiedUrl">
      <div mb-2>
        {{ t('tools.utm-url-generator.texts.tag-your-url-with-utm-parameters-added') }}
      </div>
      <c-card>
        {{ utmifiedUrl }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          {{ t('tools.utm-url-generator.texts.tag-copy-url') }}
        </c-button>
      </div>
    </div>
  </div>
</template>
