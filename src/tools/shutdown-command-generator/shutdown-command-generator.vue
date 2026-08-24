<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
type Platform = 'windows' | 'linux' | 'macos';
type Mode = 'delay' | 'time';

const platform = ref<Platform>('windows');
const mode = ref<Mode>('delay');

// Delay in seconds
const delayHours = ref(0);
const delayMinutes = ref(5);
const delaySeconds = ref(0);
const delay = computed(() => delayHours.value * 3600 + delayMinutes.value * 60 + delaySeconds.value);

// Time (timestamp in ms)
const timeValue = ref<number | null>(null);

// Options
const force = ref(false);
const reboot = ref(false);
const logoff = ref(false);
const cancel = ref(false);
const hibernate = ref(false);

const platformOptions = [
  { label: t('tools.shutdown-command-generator.texts.label-windows'), value: 'windows' },
  { label: t('tools.shutdown-command-generator.texts.label-linux'), value: 'linux' },
  { label: t('tools.shutdown-command-generator.texts.label-macos'), value: 'macos' },
];

const modeOptions = [
  { label: t('tools.shutdown-command-generator.texts.label-delay'), value: 'delay' },
  { label: t('tools.shutdown-command-generator.texts.label-specific-time'), value: 'time' },
];

// --- Command Builders -------------------------------------------------------

function buildWindowsCommand() {
  if (cancel.value) {
    return 'shutdown /a';
  }

  if (hibernate.value) {
    return 'shutdown /h';
  }

  const args: string[] = [];

  if (reboot.value) {
    args.push('/r');
  }
  else if (logoff.value) {
    args.push('/l');
  }
  else { args.push('/s'); }

  if (force.value) {
    args.push('/f');
  }

  if (mode.value === 'delay') {
    args.push(`/t ${delay.value}`);
  }
  else if (timeValue.value) {
    const now = Date.now();
    const diff = Math.max(0, Math.floor((timeValue.value - now) / 1000));
    args.push(`/t ${diff}`);
  }

  return `shutdown ${args.join(' ')}`;
}

function buildLinuxCommand() {
  if (cancel.value) {
    return 'shutdown -c';
  }

  if (hibernate.value) {
    if (mode.value === 'delay') {
      return `sleep ${delay.value} && systemctl hibernate`;
    }
    if (timeValue.value) {
      const diff = Math.max(0, Math.floor((timeValue.value - Date.now()) / 1000));
      return `sleep ${diff} && systemctl hibernate`;
    }
    return 'systemctl hibernate';
  }

  const args: string[] = [];

  if (reboot.value) {
    args.push('-r');
  }
  else if (logoff.value) {
    return 'logout';
  }
  else { args.push('-h'); }

  if (mode.value === 'delay') {
    args.push(`+${Math.ceil(delay.value / 60)}`);
  }
  else if (timeValue.value) {
    const date = new Date(timeValue.value);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    args.push(`${hh}:${mm}`);
  }

  if (force.value) {
    args.push('now');
  }

  return `shutdown ${args.join(' ')}`;
}

function buildMacCommand() {
  if (cancel.value) {
    return 'sudo killall shutdown';
  }

  if (hibernate.value) {
    if (mode.value === 'delay') {
      return `sleep ${delay.value} && sudo pmset hibernatemode 25 && sudo pmset sleepnow`;
    }
    if (timeValue.value) {
      const diff = Math.max(0, Math.floor((timeValue.value - Date.now()) / 1000));
      return `sleep ${diff} && sudo pmset hibernatemode 25 && sudo pmset sleepnow`;
    }
    return 'sudo pmset hibernatemode 25 && sudo pmset sleepnow';
  }

  const args: string[] = [];

  if (reboot.value) {
    args.push('-r');
  }
  else { args.push('-h'); }

  if (mode.value === 'delay') {
    args.push(`+${Math.ceil(delay.value / 60)}`);
  }
  else if (timeValue.value) {
    const date = new Date(timeValue.value);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    args.push(`${hh}:${mm}`);
  }

  return `sudo shutdown ${args.join(' ')}`;
}

// --- Final Command ----------------------------------------------------------

const command = computed(() => {
  switch (platform.value) {
    case 'windows':
      return buildWindowsCommand();
    case 'linux':
      return buildLinuxCommand();
    case 'macos':
      return buildMacCommand();
  }
});
</script>

<template>
  <div>
    <c-select
      v-model:value="platform"
      :options="platformOptions"
      :label="t('tools.shutdown-command-generator.texts.label-platform')"
      label-position="left"
      mb-1
    />

    <NSpace justify="center" mb-1>
      <NRadioGroup v-model:value="mode" name="mode">
        <NRadioButton
          v-for="opt in modeOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </NRadioButton>
      </NRadioGroup>
    </NSpace>

    <NSpace v-if="mode === 'delay'" justify="center" mb-1>
      <NFormItem :label="t('tools.shutdown-command-generator.texts.label-delay')" label-placement="left" mb-1>
        <NInputNumber
          v-model:value="delayHours"
          :min="0"
        />{{ t('tools.shutdown-command-generator.texts.tag-nbsp-h-nbsp') }}<NInputNumber
          v-model:value="delayMinutes"
          :min="0"
        />{{ t('tools.shutdown-command-generator.texts.tag-nbsp-m-nbsp') }}<NInputNumber
          v-model:value="delaySeconds"
          :min="0"
        />{{ t('tools.shutdown-command-generator.texts.tag-nbsp-s') }}
      </NFormItem>
    </NSpace>

    <NSpace v-if="mode === 'time'" justify="center" mb-1>
      <NFormItem :label="t('tools.shutdown-command-generator.texts.label-shutdown-time')" label-placement="left">
        <NDatePicker
          v-model:value="timeValue"
          type="datetime"
        />
      </NFormItem>
    </NSpace>

    <NSpace justify="center" mb-1>
      <NCheckbox v-model:checked="force" :label="t('tools.shutdown-command-generator.texts.label-force')" />
      <NCheckbox v-model:checked="reboot" :label="t('tools.shutdown-command-generator.texts.label-reboot')" />
      <NCheckbox v-model:checked="logoff" :label="t('tools.shutdown-command-generator.texts.label-logoff')" />
      <NCheckbox v-model:checked="cancel" :label="t('tools.shutdown-command-generator.texts.label-cancel')" />
      <NCheckbox v-model:checked="hibernate" :label="t('tools.shutdown-command-generator.texts.label-hibernate')" />
    </NSpace>

    <c-card :title="t('tools.shutdown-command-generator.texts.title-generated-command')">
      <textarea-copyable :value="command" language="bash" />
    </c-card>
  </div>
</template>
