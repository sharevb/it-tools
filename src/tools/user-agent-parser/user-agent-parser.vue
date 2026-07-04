<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const ua = useQueryParam({ tool: 'user-agent-parser', name: 'ua', defaultValue: navigator.userAgent as string });

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections: UserAgentResultSection[] = [
  {
    heading: 'Browser',
    icon: Browser,
    content: [
      {
        label: t('tools.user-agent-parser.texts.label-name'),
        getValue: block => block?.browser.name,
        undefinedFallback: 'No browser name available',
      },
      {
        label: t('tools.user-agent-parser.texts.label-version'),
        getValue: block => block?.browser.version,
        undefinedFallback: 'No browser version available',
      },
    ],
  },
  {
    heading: 'Engine',
    icon: Engine,
    content: [
      {
        label: t('tools.user-agent-parser.texts.label-name'),
        getValue: block => block?.engine.name,
        undefinedFallback: 'No engine name available',
      },
      {
        label: t('tools.user-agent-parser.texts.label-version'),
        getValue: block => block?.engine.version,
        undefinedFallback: 'No engine version available',
      },
    ],
  },
  {
    heading: 'OS',
    icon: Adjustments,
    content: [
      {
        label: t('tools.user-agent-parser.texts.label-name'),
        getValue: block => block?.os.name,
        undefinedFallback: 'No OS name available',
      },
      {
        label: t('tools.user-agent-parser.texts.label-version'),
        getValue: block => block?.os.version,
        undefinedFallback: 'No OS version available',
      },
    ],
  },
  {
    heading: 'Device',
    icon: Devices,
    content: [
      {
        label: t('tools.user-agent-parser.texts.label-model'),
        getValue: block => block?.device.model,
        undefinedFallback: 'No device model available',
      },
      {
        label: t('tools.user-agent-parser.texts.label-type'),
        getValue: block => block?.device.type,
        undefinedFallback: 'No device type available',
      },
      {
        label: t('tools.user-agent-parser.texts.label-vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: 'No device vendor available',
      },
    ],
  },
  {
    heading: 'CPU',
    icon: Cpu,
    content: [
      {
        label: t('tools.user-agent-parser.texts.label-architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: 'No CPU architecture available',
      },
    ],
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      :label="t('tools.user-agent-parser.texts.label-user-agent-string')"
      multiline
      :placeholder="t('tools.user-agent-parser.texts.placeholder-put-your-user-agent-here')"
      clearable
      raw-text
      rows="2"
      autosize
      monospace
      mb-3
    />

    <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>
