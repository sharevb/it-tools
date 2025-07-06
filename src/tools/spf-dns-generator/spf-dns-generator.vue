<script setup lang="ts">
const allowedDomains = ref<string[]>([]);
const allowedIPv4s = ref<string[]>([]);
const allowedIPv6s = ref<string[]>([]);
const includeDomains = ref<string[]>([]);
const mechanisms = ref<string[]>([]);
const policy = ref<string>('~all');
const spfRecord = computed(() => {
  let record = 'v=spf1';

  allowedDomains.value.forEach(domain => record += ` a:${domain}`);
  allowedIPv4s.value.forEach(ip => record += ` ip4:${ip}`);
  allowedIPv6s.value.forEach(ip => record += ` ip6:${ip}`);
  includeDomains.value.forEach(domain => record += ` include:${domain}`);
  mechanisms.value.forEach(mech => record += ` ${mech}`);

  record += ` ${policy.value}`;
  return record;
});
</script>

<template>
  <n-card :title="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.title-spf-record-generator')">
    <n-form>
      <n-form-item :label="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.label-allowed-domains')" label-placement="left">
        <n-dynamic-tags v-model:value="allowedDomains" />
      </n-form-item>
      <n-form-item :label="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.label-allowed-ipv4s')" label-placement="left">
        <n-dynamic-tags v-model:value="allowedIPv4s" />
      </n-form-item>
      <n-form-item :label="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.label-allowed-ipv6s')" label-placement="left">
        <n-dynamic-tags v-model:value="allowedIPv6s" />
      </n-form-item>
      <n-form-item :label="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.label-include-domains')" label-placement="left">
        <n-dynamic-tags v-model:value="includeDomains" />
      </n-form-item>
      <n-form-item :label="$t('tools.spf-dns-generator.text.mechanisms')" label-placement="left">
        <n-checkbox-group v-model:value="mechanisms">
          <n-space>
            <n-checkbox value="a">
              A
            </n-checkbox>
            <n-checkbox value="mx">
              MX
            </n-checkbox>
            <n-checkbox value="ptr">
              PTR
            </n-checkbox>
            <n-checkbox value="exists">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-exists') }}
            </n-checkbox>
            <n-checkbox value="redirect">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-redirect') }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item :label="$t('tools.spf-dns-generator.text.policy')" label-placement="left">
        <n-radio-group v-model:value="policy">
          <n-space>
            <n-radio value="+all">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-pass-all') }}
            </n-radio>
            <n-radio value="-all">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-fail-all') }}
            </n-radio>
            <n-radio value="~all">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-softfail-all') }}
            </n-radio>
            <n-radio value="?all">
              {{ $t('tools.__i18n_ally_root__.spf-dns-generator.texts.tag-neutral-all') }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>

    <c-card :title="$t('tools.__i18n_ally_root__.spf-dns-generator.texts.title-generated-spf-record')">
      <textarea-copyable :value="spfRecord" />
    </c-card>
  </n-card>
</template>
