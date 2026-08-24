<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatShellCommand } from '@/utils/shell-formatter';

const { t } = useI18n();

const defaultValue = 'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx';

function transformer(value: string) {
  try {
    return formatShellCommand(value);
  }
  catch (e: any) {
    return `# ERROR: ${e.toString()}`;
  }
}
</script>

<template>
  <format-transformer
    :input-label="t('tools.shell-formatter.texts.input-label-shell-commands-to-format')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.shell-formatter.texts.input-placeholder-put-your-shell-commands-to-format-here')"
    :output-label="t('tools.shell-formatter.texts.output-label-formatted-shell-commands')"
    output-language="bash"
    :transformer="transformer"
  />
</template>
