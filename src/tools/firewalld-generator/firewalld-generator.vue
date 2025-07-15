<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const zone = ref<string>('public');
const action = ref<string>('add');
const ruleType = ref<string>('service');
const value = ref<string>('http');
const permanent = ref<boolean>(true);

const ruleTypes = [
  { label: t('tools.firewalld-generator.texts.label-service'), value: 'service' },
  { label: t('tools.firewalld-generator.texts.label-port'), value: 'port' },
  { label: t('tools.firewalld-generator.texts.label-protocol'), value: 'protocol' },
  { label: t('tools.firewalld-generator.texts.label-rich-rule'), value: 'rich-rule' },
];

const actions = [
  { label: t('tools.firewalld-generator.texts.label-add'), value: 'add' },
  { label: t('tools.firewalld-generator.texts.label-remove'), value: 'remove' },
];

const command = computed(() => {
  let result = `firewall-cmd --zone=${zone.value} --${action.value}-${ruleType.value}=${value.value}`;
  if (permanent.value) {
    result += ' --permanent';
  }
  result += ' && firewall-cmd --reload';
  return result;
});
</script>

<template>
  <div>
    <NForm label-width="120px" label-placement="left">
      <NFormItem :label="t('tools.firewalld-generator.texts.label-zone')">
        <NSelect v-model:value="zone" :options="[{ label: t('tools.firewalld-generator.texts.label-public'), value: 'public' }, { label: t('tools.firewalld-generator.texts.label-home'), value: 'home' }, { label: t('tools.firewalld-generator.texts.label-work'), value: 'work' }]" />
      </NFormItem>

      <NFormItem :label="t('tools.firewalld-generator.texts.label-action')">
        <NSelect v-model:value="action" :options="actions" />
      </NFormItem>

      <NFormItem :label="t('tools.firewalld-generator.texts.label-rule-type')">
        <NSelect v-model:value="ruleType" :options="ruleTypes" />
      </NFormItem>

      <NFormItem :label="t('tools.firewalld-generator.texts.label-value')">
        <NInput v-model:value="value" :placeholder="t('tools.firewalld-generator.texts.placeholder-enter-the-service-port-protocol')" />
      </NFormItem>

      <NFormItem :label="t('tools.firewalld-generator.texts.label-permanent')">
        <NSelect v-model:value="permanent" :options="[{ label: t('tools.firewalld-generator.texts.label-yes'), value: true }, { label: t('tools.firewalld-generator.texts.label-no'), value: false }]" />
      </NFormItem>
    </NForm>

    <c-card :title="t('tools.firewalld-generator.texts.title-generated-fw-command')" mt-2>
      <textarea-copyable :value="command" />
    </c-card>
  </div>
</template>
