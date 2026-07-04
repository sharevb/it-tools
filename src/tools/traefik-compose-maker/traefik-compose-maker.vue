<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { TraefikComposeOptions } from './traefik-compose-maker.service';
import { generateCompose } from './traefik-compose-maker.service';

const { t } = useI18n();

const formModel = ref<TraefikComposeOptions>({
  logDebug: false,
  certResolverName: '',
  postmasterEmail: '',
  letEncryptTest: false,
  dashboard: false,
  traefikDashboardHostName: '',
  dashboardUserAndPass: '',
  proxiedServiceName: '',
  proxiedServiceImage: '',
  proxiedServiceLoadBalancePort: 80,
  proxiedServiceHostName: '',
  loadBalance: false,
});

const dockerComposeEntry = computed<string>(() => generateCompose(formModel.value));
</script>

<template>
  <n-card :title="t('tools.traefik-compose-maker.texts.title-traefik-docker-compose-generator')">
    <n-form :model="formModel" label-placement="left">
      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-proxied-service-name')">
        <n-input v-model:value="formModel.proxiedServiceName" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-service-name')" />
      </n-form-item>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-proxied-service-image')">
        <n-input v-model:value="formModel.proxiedServiceImage" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-image-name')" />
      </n-form-item>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-proxied-service-host-name')">
        <n-input v-model:value="formModel.proxiedServiceHostName" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-service-hostname')" />
      </n-form-item>

      <n-space>
        <n-form-item :label="t('tools.traefik-compose-maker.texts.label-proxied-service-load-balancer-port')">
          <n-input-number-i18n v-model:value="formModel.proxiedServiceLoadBalancePort" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-port')" />
        </n-form-item>

        <n-form-item :label="t('tools.traefik-compose-maker.texts.label-enable-load-balancer')">
          <n-switch v-model:value="formModel.loadBalance" />
        </n-form-item>
      </n-space>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-cert-resolver-name')">
        <n-input v-model:value="formModel.certResolverName" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-cert-resolver-name')" />
      </n-form-item>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-postmaster-email')">
        <n-input v-model:value="formModel.postmasterEmail" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-email')" />
      </n-form-item>

      <n-space>
        <n-form-item :label="t('tools.traefik-compose-maker.texts.label-let-s-encrypt-test-mode')">
          <n-switch v-model:value="formModel.letEncryptTest" />
        </n-form-item>

        <n-form-item :label="t('tools.traefik-compose-maker.texts.label-enable-dashboard')">
          <n-switch v-model:value="formModel.dashboard" />
        </n-form-item>

        <n-form-item :label="t('tools.traefik-compose-maker.texts.label-log-level-debug')">
          <n-switch v-model:value="formModel.logDebug" />
        </n-form-item>
      </n-space>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-traefik-dashboard-host-name')">
        <n-input v-model:value="formModel.traefikDashboardHostName" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-enter-dashboard-host-name')" />
      </n-form-item>

      <n-form-item :label="t('tools.traefik-compose-maker.texts.label-dashboard-user-and-password')">
        <n-input v-model:value="formModel.dashboardUserAndPass" :placeholder="t('tools.traefik-compose-maker.texts.placeholder-user-password')" />
      </n-form-item>

      <n-card v-if="dockerComposeEntry" :title="t('tools.traefik-compose-maker.texts.title-generated-compose-entry')">
        <textarea-copyable :value="dockerComposeEntry" language="yaml" />
      </n-card>
    </n-form>
  </n-card>
</template>
