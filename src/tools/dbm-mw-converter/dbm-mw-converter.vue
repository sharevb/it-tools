<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { dbmToMw, mwToDbm } from './dbm-mw-converter.service';

const { t } = useI18n(); // Adjust path as needed

const dbmInput = ref(1);
const mwOutput = computed(() => dbmToMw(dbmInput.value).toFixed(3));

const mwInput = ref(1);
const dbmOutput = computed(() => mwToDbm(mwInput.value).toFixed(3));
</script>

<template>
  <c-card :title="t('tools.dbm-mw-converter.texts.title-dbm-to-mw')">
    <n-form-item :label="t('tools.dbm-mw-converter.texts.label-dbm-value')" label-placement="left">
      <n-input-number-i18n v-model:value="dbmInput" />
    </n-form-item>

    <input-copyable
      :label="t('tools.dbm-mw-converter.texts.label-corresponding-mw-value')"
      label-position="left"
      :value="mwOutput"
    />
  </c-card>

  <c-card :title="t('tools.dbm-mw-converter.texts.title-mw-to-dbm')">
    <n-form-item :label="t('tools.dbm-mw-converter.texts.label-mw-value')" label-placement="left">
      <n-input-number-i18n v-model:value="mwInput" :min="0" />
    </n-form-item>

    <input-copyable
      :label="t('tools.dbm-mw-converter.texts.label-corresponding-dbm-value')"
      label-position="left"
      :value="dbmOutput"
    />
  </c-card>
</template>
