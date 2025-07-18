<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const { t } = useI18n();

const password = ref('');
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }));

const details = computed(() => [
  {
    label: t('tools.password-strength-analyser.texts.label-password-length'),
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    label: t('tools.password-strength-analyser.texts.label-entropy'),
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    label: t('tools.password-strength-analyser.texts.label-character-set-size'),
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    label: t('tools.password-strength-analyser.texts.label-score'),
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="password"
      type="password"
      :placeholder="t('tools.password-strength-analyser.texts.placeholder-enter-a-password')"
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        {{ t('tools.password-strength-analyser.texts.tag-duration-to-crack-this-password-with-brute-force') }}
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card>
      <div v-for="({ label, value }) of details" :key="label" flex gap-3>
        <div flex-1 text-right op-60>
          {{ label }}
        </div>
        <div flex-1 text-left>
          {{ value }}
        </div>
      </div>
    </c-card>
    <div op-70>
      <span font-bold>{{ t('tools.password-strength-analyser.texts.tag-note') }}</span>{{ t('tools.password-strength-analyser.texts.tag-the-computed-strength-is-based-on-the-time-it-would-take-to-crack-the-password-using-a-brute-force-approach-it-does-not-take-into-account-the-possibility-of-a-dictionary-attack') }}
    </div>
  </div>
</template>
