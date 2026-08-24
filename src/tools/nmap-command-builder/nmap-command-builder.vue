<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
interface Preset {
  label: string;
  value: string;
  flags: string[];
}

const presets: Preset[] = [
  {
    label: t('tools.nmap-command-builder.texts.label-default-scan'),
    value: 'default',
    flags: [],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-quick-scan'),
    value: 'quick',
    flags: ['-T4', '-F'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-intense-scan'),
    value: 'intense',
    flags: ['-T4', '-A', '-v'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-full-tcp-scan'),
    value: 'full-tcp',
    flags: ['-sS', '-p-', '-T4'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-udp-scan'),
    value: 'udp',
    flags: ['-sU', '-T4'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-ping-sweep'),
    value: 'ping-sweep',
    flags: ['-sn'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-no-ping-stealth-host-discovery'),
    value: 'no-ping',
    flags: ['-Pn'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-top-ports-100'),
    value: 'top-100',
    flags: ['--top-ports', '100', '-T4'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-top-ports-1000'),
    value: 'top-1000',
    flags: ['--top-ports', '1000', '-T4'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-firewall-evasion'),
    value: 'evasion',
    flags: ['-f', '-D', 'RND:10', '--data-length', '50'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-ipv6-scan'),
    value: 'ipv6',
    flags: ['-6', '-sS'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-service-version-deep-scan'),
    value: 'deep-version',
    flags: ['-sV', '--version-intensity', '9'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-vulnerability-scan-nse-vuln'),
    value: 'vuln',
    flags: ['--script', 'vuln'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-http-enumeration'),
    value: 'http-enum',
    flags: ['-p', '80,443', '--script', 'http-enum'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-smb-enumeration'),
    value: 'smb-enum',
    flags: ['--script', 'smb-enum*'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-dns-brute-force'),
    value: 'dns-brute',
    flags: ['--script', 'dns-brute'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-ftp-audit'),
    value: 'ftp-audit',
    flags: ['--script', 'ftp-*'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-ssh-audit'),
    value: 'ssh-audit',
    flags: ['--script', 'ssh-*'],
  },
  {
    label: t('tools.nmap-command-builder.texts.label-full-recon-os-version-scripts'),
    value: 'full-recon',
    flags: ['-A', '-sC', '-sV', '-O', '-T4'],
  },
];

const target = ref('');
const preset = ref<string | null>();

// Options
const osDetection = ref(false);
const versionDetection = ref(false);
const scriptScan = ref(false);
const traceroute = ref(false);
const verbose = ref(false);
const aggressive = ref(false);

const customPorts = ref('');
const timing = ref<number | null>(4);
const scripts = ref('');
const outputFile = ref('');

const computedCommand = computed(() => {
  const cmd: string[] = ['nmap'];

  // Preset flags
  const selectedPreset = presets.find((p) => p.value === preset.value);
  if (selectedPreset) {
    cmd.push(...selectedPreset.flags);
  }

  // Toggles
  if (osDetection.value) {
    cmd.push('-O');
  }
  if (versionDetection.value) {
    cmd.push('-sV');
  }
  if (scriptScan.value) {
    cmd.push('-sC');
  }
  if (traceroute.value) {
    cmd.push('--traceroute');
  }
  if (verbose.value) {
    cmd.push('-v');
  }
  if (aggressive.value) {
    cmd.push('-A');
  }

  // Custom ports
  if (customPorts.value.trim()) {
    cmd.push(`-p ${customPorts.value.trim()}`);
  }

  // Timing
  if (timing.value !== null) {
    cmd.push(`-T${timing.value}`);
  }

  // NSE scripts
  if (scripts.value.trim()) {
    cmd.push(`--script="${scripts.value.trim()}"`);
  }

  // Output
  if (outputFile.value.trim()) {
    cmd.push(`-oN ${outputFile.value.trim()}`);
  }

  // Target
  if (target.value.trim()) {
    cmd.push(target.value.trim());
  } else {
    return '# ERROR: Target is missing';
  }

  return cmd.join(' ');
});
</script>

<template>
  <div>
    <NForm label-placement="left">
      <NFormItem :label="t('tools.nmap-command-builder.texts.label-target')" mb-1>
        <NInput v-model:value="target" :placeholder="t('tools.nmap-command-builder.texts.placeholder-example-com-or-192-168-1-1')" />
      </NFormItem>

      <n-tabs type="line" size="large" mb-2>
        <n-tab-pane name="presets" :tab="t('tools.nmap-command-builder.texts.tab-presets')">
          <NFormItem :label="t('tools.nmap-command-builder.texts.label-preset')">
            <NSelect
              v-model:value="preset"
              :options="presets.map((p) => ({ label: p.label, value: p.value }))"
              :placeholder="t('tools.nmap-command-builder.texts.placeholder-choose-a-preset')"
            />
          </NFormItem>
        </n-tab-pane>
        <n-tab-pane name="custom" :tab="t('tools.nmap-command-builder.texts.tab-custom')">
          <n-card :title="t('tools.nmap-command-builder.texts.title-scan-options')">
            <n-space justify="center">
              <NFormItem :label="t('tools.nmap-command-builder.texts.label-os-detection-o')">
                <NSwitch v-model:value="osDetection" />
              </NFormItem>

              <NFormItem :label="t('tools.nmap-command-builder.texts.label-version-detection-sv')">
                <NSwitch v-model:value="versionDetection" />
              </NFormItem>

              <NFormItem :label="t('tools.nmap-command-builder.texts.label-default-scripts-sc')">
                <NSwitch v-model:value="scriptScan" />
              </NFormItem>

              <NFormItem :label="t('tools.nmap-command-builder.texts.label-traceroute-traceroute')">
                <NSwitch v-model:value="traceroute" />
              </NFormItem>

              <NFormItem :label="t('tools.nmap-command-builder.texts.label-verbose-v')">
                <NSwitch v-model:value="verbose" />
              </NFormItem>

              <NFormItem :label="t('tools.nmap-command-builder.texts.label-aggressive-a')">
                <NSwitch v-model:value="aggressive" />
              </NFormItem>
            </n-space>
          </n-card>

          <n-card :title="t('tools.nmap-command-builder.texts.title-advanced')">
            <NFormItem :label="t('tools.nmap-command-builder.texts.label-custom-ports-p')">
              <NInput v-model:value="customPorts" :placeholder="t('tools.nmap-command-builder.texts.placeholder-80-443-or-1-65535')" />
            </NFormItem>

            <NFormItem :label="t('tools.nmap-command-builder.texts.label-timing-t')">
              <NInputNumber v-model:value="timing" :min="0" :max="5" />
            </NFormItem>

            <NFormItem :label="t('tools.nmap-command-builder.texts.label-nse-scripts-script')">
              <NInput v-model:value="scripts" :placeholder="t('tools.nmap-command-builder.texts.placeholder-vuln-http-title')" />
            </NFormItem>

            <NFormItem :label="t('tools.nmap-command-builder.texts.label-output-file-on')">
              <NInput v-model:value="outputFile" :placeholder="t('tools.nmap-command-builder.texts.placeholder-scan-txt')" />
            </NFormItem>
          </n-card>
        </n-tab-pane>
      </n-tabs>

      <n-card :title="t('tools.nmap-command-builder.texts.title-generated-command')">
        <textarea-copyable :value="computedCommand" language="bash" />
      </n-card>
    </NForm>
  </div>
</template>
