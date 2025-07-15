<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TidyURL } from 'tidy-url';
import { Check as CheckIcon, LetterX as CrossIcon } from '@vicons/tabler';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const inputUrl = ref('');
const cleanedUrl = computed(() => withDefaultOnError(() => TidyURL.clean(inputUrl.value), undefined));
const isClean = computed(() => withDefaultOnError(() => TidyURL.clean(inputUrl.value)?.url === inputUrl.value, false));
</script>

<template>
  <c-card :title="t('tools.url-cleaner.texts.title-clean-url')">
    <c-input-text
      v-model:value="inputUrl"
      :placeholder="t('tools.url-cleaner.texts.placeholder-put-your-url-here')"
      :label="t('tools.url-cleaner.texts.label-url-to-clean')"
    />

    <n-divider />

    <div v-if="inputUrl">
      <n-p v-if="isClean" text-center>
        <n-icon color="green">
          <CheckIcon />
        </n-icon>{{ t('tools.url-cleaner.texts.tag-is-clean') }}
      </n-p>
      <n-p v-if="!isClean" text-center>
        <n-icon color="red">
          <CrossIcon />
        </n-icon>{{ t('tools.url-cleaner.texts.tag-was-not-clean') }}
      </n-p>
      <TextareaCopyable
        :label="t('tools.url-cleaner.texts.label-cleaned-url')"
        :value="cleanedUrl?.url || ''"
        :placeholder="t('tools.url-cleaner.texts.placeholder-the-cleaned-url-will-be-here')"
        mb-5
        mt-5
      />
    </div>
  </c-card>
</template>
