<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const form = reactive({
  pageUrl: 'https://example.com',
  pageTitle: 'Amazing Page Title',
  pageDescription: 'Brief description of the page',
  selectedPlatform: 'Facebook',
});

interface PageBuilder {
  pageUrl: string;
  pageTitle?: string;
  pageDescription?: string;
}

const platforms = {
  Facebook: ({ pageUrl }: PageBuilder) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  Twitter: ({ pageUrl, pageTitle }: PageBuilder) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle || '')}`,
  LinkedIn: ({ pageUrl, pageTitle, pageDescription }: PageBuilder) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle || '')}&summary=${encodeURIComponent(pageDescription || '')}`,
  Reddit: ({ pageUrl, pageTitle }: PageBuilder) =>
    `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle || '')}`,
  WhatsApp: ({ pageUrl, pageTitle }: PageBuilder) =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle || '')}%20${encodeURIComponent(pageUrl)}`,
  Telegram: ({ pageUrl, pageTitle }: PageBuilder) =>
    `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle || '')}`,
  Email: ({ pageUrl, pageTitle, pageDescription }: PageBuilder) =>
    `mailto:?subject=${encodeURIComponent(pageTitle || '')}&body=${encodeURIComponent(pageDescription || '')}%0A${encodeURIComponent(pageUrl)}`,
};

const platformOptions = [
  { label: t('tools.social-link-sharer.texts.label-facebook'), value: 'Facebook', icon: '📘' },
  { label: t('tools.social-link-sharer.texts.label-twitter'), value: 'Twitter', icon: '🐦' },
  { label: t('tools.social-link-sharer.texts.label-linkedin'), value: 'LinkedIn', icon: '💼' },
  { label: t('tools.social-link-sharer.texts.label-reddit'), value: 'Reddit', icon: '👽' },
  { label: t('tools.social-link-sharer.texts.label-whatsapp'), value: 'WhatsApp', icon: '💬' },
  { label: t('tools.social-link-sharer.texts.label-telegram'), value: 'Telegram', icon: '✈️' },
  { label: t('tools.social-link-sharer.texts.label-email'), value: 'Email', icon: '📧' },
];

function generateLink(platform: string) {
  const builder = (platforms as Record<string, CallableFunction>)[platform];
  return builder ? builder(form) : '';
}

const generatedLink = computed(() => generateLink(form.selectedPlatform));

function copyAllLinks() {
  const allLinks = platformOptions.map((opt) => `${opt.icon} ${opt.label}: ${generateLink(opt.value)}`).join('\n\n');
  navigator.clipboard.writeText(allLinks);
}
</script>

<template>
  <n-card :title="t('tools.social-link-sharer.texts.title-share-link-generator')">
    <n-form :model="form" label-placement="top" size="medium">
      <n-form-item :label="t('tools.social-link-sharer.texts.label-page-url')">
        <n-input
          v-model:value="form.pageUrl"
          :placeholder="t('tools.social-link-sharer.texts.placeholder-https-example-com')"
        />
      </n-form-item>
      <n-form-item :label="t('tools.social-link-sharer.texts.label-page-title')">
        <n-input
          v-model:value="form.pageTitle"
          :placeholder="t('tools.social-link-sharer.texts.placeholder-amazing-page-title')"
        />
      </n-form-item>
      <n-form-item :label="t('tools.social-link-sharer.texts.label-page-description')">
        <n-input
          v-model:value="form.pageDescription"
          :placeholder="t('tools.social-link-sharer.texts.placeholder-brief-description-of-the-page')"
        />
      </n-form-item>
      <n-form-item :label="t('tools.social-link-sharer.texts.label-platform')">
        <n-select
          v-model:value="form.selectedPlatform"
          :options="platformOptions"
          :placeholder="t('tools.social-link-sharer.texts.placeholder-choose-a-platform')"
        />
      </n-form-item>
      <input-copy
        :label="t('tools.social-link-sharer.texts.label-generated-share-link')"
        :value="generatedLink"
        readonly
      />
      <n-space justify="center">
        <n-button type="success" @click="copyAllLinks">
          {{ t('tools.social-link-sharer.texts.tag-copy-all-links') }}
        </n-button>
      </n-space>
    </n-form>

    <n-divider>{{ t('tools.social-link-sharer.texts.tag-all-platforms') }}</n-divider>
    <div v-for="platform in platformOptions" :key="platform.value">
      <input-copyable
        label-position="left"
        label-width="110px"
        :label="`${platform.icon} ${platform.label}:`"
        :value="generateLink(platform.value)"
        readonly
        mb-1
      />
    </div>
  </n-card>
</template>
