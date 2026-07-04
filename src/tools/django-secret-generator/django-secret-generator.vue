<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getSecretKey } from './django-secret-generator.service';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';

const { t } = useI18n();

const [tokens, refreshTokens] = computedRefreshable(() =>
  getSecretKey(),
);

const { copy } = useCopy({ source: tokens, text: t('tools.django-secret-generator.texts.text-django-secret-key-copied-to-clipboard') });
</script>

<template>
  <div>
    <c-card>
      <c-input-text
        v-model:value="tokens"
        :label="t('tools.django-secret-generator.texts.label-django-secret-key')"
        label-position="left"
        readonly
        class="token-display"
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          {{ t('tools.django-secret-generator.texts.tag-copy') }}
        </c-button>
        <c-button @click="refreshTokens">
          {{ t('tools.django-secret-generator.texts.tag-regenerate') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
