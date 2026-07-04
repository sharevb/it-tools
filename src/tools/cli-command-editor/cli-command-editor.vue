<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import * as service from './cli-command-editor.service';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputCommand = useQueryParam({ tool: 'cli-cmd-editor', name: 'cmd', defaultValue: '' });
const options = computed(() => service.extractOptions(inputCommand.value));
const optionsObject = computed(() => service.buildOptionsObject(options.value));
const optionsInput = ref<{ [k: string]: string }>(optionsObject.value);
const command = ref('');
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="inputCommand"
          label-position="left"
          label-width="130px"
          :label="$t('tools.cli-command-editor.command')"
          :aria-label="t('tools.cli-command-editor.command')"
          :placeholder="$t('tools.cli-command-editor.placeholder')"
          :aria-placeholder="t('tools.cli-command-editor.placeholder')"
          raw-text
          @update:value="() => { command = inputCommand }"
        />
        <div v-for="option in options" :key="option" flex justify-center>
          <c-input-text
            v-model:value="optionsInput[option]"
            label-position="left"
            label-width="130px"
            label-align="left"
            :label="service.sanitizeOption(option)"
            :aria-label="service.sanitizeOption(option)"
            :placeholder="service.sanitizeOption(option)"
            :aria-placeholder="service.sanitizeOption(option)"
            mt-6
            @update:value="() => { command = service.buildEditedCommand(optionsInput, optionsObject, inputCommand) }"
          />
        </div>

        <c-text-copyable
          v-if="command"
          :value="command"

          :show-icon="false"
          mt-6 font-mono
        />
      </n-gi>
    </n-grid>
  </c-card>
</template>
