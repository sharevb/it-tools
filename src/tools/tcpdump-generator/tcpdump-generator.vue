<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { ref } from 'vue';
import { NCheckbox, NForm, NFormItem, NInput, NSelect, NTooltip } from 'naive-ui';

const { t } = useI18n();

const specificInterface = ref('');
const srcHost = ref('');
const dstHost = ref('');
const srcPort = ref('');
const dstPort = ref('');
const limit = ref('');
const disableDNS = ref(false);
const printLinkLevelHeader = ref(false);
const quickPrint = ref(false);
const verbosity = ref('');
const timeFormat = ref('');
const writeFile = ref('');
const expression = ref('');

const verbosityLevels = [
  { label: t('tools.tcpdump-generator.texts.label-normal'), value: '', description: 'Basic packet information.' },
  { label: t('tools.tcpdump-generator.texts.label-minimal-verbosity-v'), value: '-v', description: 'Basic packet information.' },
  { label: t('tools.tcpdump-generator.texts.label-increased-verbosity-vv'), value: '-vv', description: 'More packet details.' },
  { label: t('tools.tcpdump-generator.texts.label-maximum-verbosity-vvv'), value: '-vvv', description: 'Full packet decoding.' },
];

const timeFormats = [
  { label: t('tools.tcpdump-generator.texts.label-current-time-hh-mm-ss-microsecond'), value: '' },
  { label: t('tools.tcpdump-generator.texts.label-no-timestamp-t'), value: '-tt' },
  { label: t('tools.tcpdump-generator.texts.label-timestamp-as-seconds-since-jan-1-1970-tt'), value: '-tt' },
  { label: t('tools.tcpdump-generator.texts.label-delta-micro-second-resolution-between-current-and-previous-line-ttt'), value: '-ttt' },
  { label: t('tools.tcpdump-generator.texts.label-current-time-with-date-yyyy-mm-dd-hh-mm-ss-microsecond-tttt'), value: '-tttt' },
  { label: t('tools.tcpdump-generator.texts.label-delta-micro-second-resolution-between-current-and-first-line-ttttt'), value: '-ttttt' },
];

const tcpDumpCommand = computed(() => {
  let command = 'tcpdump';
  if (specificInterface.value) {
    command += ` -i ${specificInterface.value}`;
  }
  if (srcHost.value) {
    command += ` src host ${srcHost.value}`;
  }
  if (dstHost.value) {
    command += ` dst host ${dstHost.value}`;
  }
  if (srcPort.value) {
    command += ` src port ${srcPort.value}`;
  }
  if (dstPort.value) {
    command += ` dst port ${dstPort.value}`;
  }
  if (limit.value) {
    command += ` -c ${limit.value}`;
  }
  if (disableDNS.value) {
    command += ' -n';
  }
  if (printLinkLevelHeader.value) {
    command += ' -e';
  }
  if (quickPrint.value) {
    command += ' -q';
  }
  if (verbosity.value) {
    command += ` ${verbosity.value}`;
  }
  if (timeFormat.value) {
    command += ` ${timeFormat.value}`;
  }
  if (writeFile.value) {
    command += ` -w ${writeFile.value}`;
  }
  if (expression.value) {
    command += ` ${expression.value}`;
  }

  return command;
});
</script>

<template>
  <div>
    <n-p>{{ t('tools.tcpdump-generator.texts.tag-tcpdump-is-a-utility-commonly-installed-available-to-many-linux-distributions-to-quickly-gather-a-network-trace-packet-capture-in-short-it-s-the-wireshark-of-linux-to-gathering-packet-captures-tcpdump-is-very-versatile-with-many-switches-to-granularly-capture-what-you-need-to-dubug-network-traffic-with-options-to-output-results-via-console-file-or-wireshark-pcap') }}</n-p>
    <n-p>
      {{ t('tools.tcpdump-generator.texts.tag-this-utility-is-to-help-generate-a-tcpdump-command-using-some-of-the-more-common-switches-filters-offered-by-the-tcpdump-this-utility-is-not-encompassing-of-all-options-tcpdump-offers-a-complete-list-of-options-can-be-found-via-its-manual-nbsp') }}<n-a href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank">
        {{ t('tools.tcpdump-generator.texts.tag-https-www-tcpdump-org-manpages-tcpdump-1-html') }}
      </n-a>
    </n-p>
    <n-p>
      <strong>{{ t('tools.tcpdump-generator.texts.tag-note') }}</strong>{{ t('tools.tcpdump-generator.texts.tag-nbsp-host-source-host-and-destination-host-can-take-multiple-entries-separate-your-entries-with-a-comma-space-or-semicolon') }}
    </n-p>
    <n-p>
      <strong>{{ t('tools.tcpdump-generator.texts.tag-note-2') }}</strong>{{ t('tools.tcpdump-generator.texts.tag-nbsp-when-you-specify-a-source-src-or-destination-dst-flags-tcpdump-will-only-filter-in-that-direction-if-you-are-looking-to-capture-full-tcp-handshake-make-sure-you-use-host-vs-src-host-or-dst-host-to-see-both-request-and-response-flow') }}
    </n-p>
    <NForm label-placement="left">
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-interface')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="specificInterface" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-eth0')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-the-network-interface-to-capture-packets-from') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-source-host')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="srcHost" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-192-168-1-1')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-capture-packets-originating-from-this-host') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-destination-host')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="dstHost" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-192-168-1-2')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-capture-packets-destined-for-this-host') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-source-port')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="srcPort" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-443')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-filter-packets-from-this-source-port') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-destination-port')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="dstPort" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-80')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-filter-packets-going-to-this-destination-port') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-packet-limit')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="limit" type="number" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-100')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-stop-capturing-after-this-number-of-packets') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-disable-dns-resolution')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NCheckbox v-model:checked="disableDNS">
              {{ t('tools.tcpdump-generator.texts.tag-n') }}
            </NCheckbox>
          </template>{{ t('tools.tcpdump-generator.texts.tag-prevent-resolving-ips-to-hostnames') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-print-link-level-header')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NCheckbox v-model:checked="printLinkLevelHeader">
              {{ t('tools.tcpdump-generator.texts.tag-e') }}
            </NCheckbox>
          </template>{{ t('tools.tcpdump-generator.texts.tag-display-link-layer-headers-in-output') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-quick-print')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NCheckbox v-model:checked="quickPrint">
              {{ t('tools.tcpdump-generator.texts.tag-q') }}
            </NCheckbox>
          </template>{{ t('tools.tcpdump-generator.texts.tag-show-less-verbose-packet-information') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-verbosity-level')">
        <NSelect v-model:value="verbosity" :options="verbosityLevels.map(v => ({ label: v.label, value: v.value }))" />
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-time-format')">
        <NSelect v-model:value="timeFormat" :options="timeFormats.map(t => ({ label: t.label, value: t.value }))" />
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-write-to-file')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="writeFile" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-capture-pcap')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-save-captured-packets-to-a-file') }}
        </NTooltip>
      </NFormItem>
      <NFormItem :label="t('tools.tcpdump-generator.texts.label-custom-expression')">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput v-model:value="expression" :placeholder="t('tools.tcpdump-generator.texts.placeholder-e-g-src-port-443-and-dst-10-0-0-1')" />
          </template>{{ t('tools.tcpdump-generator.texts.tag-advanced-filters-for-packet-selection') }}
        </NTooltip>
      </NFormItem>
    </NForm>
    <c-card :title="t('tools.tcpdump-generator.texts.title-generated-tcpdump-command')" mt-3>
      <textarea-copyable :value="tcpDumpCommand" />
    </c-card>
  </div>
</template>
