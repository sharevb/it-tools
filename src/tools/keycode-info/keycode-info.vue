<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';
import { getScancode } from './scancode';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const event = ref<KeyboardEvent>();

const layout = useITStorage('keycode-info:l', 'AZERTY');
const layoutOptions = ['AZERTY', 'QWERTY', 'QWERTZ', 'DVORAK', 'JIS', 'RUSSIAN', 'NORDIC'];

useEventListener(document, 'keydown', (e) => {
  event.value = e;
});

const fields = computed(() => {
  if (!event.value) {
    return [];
  }

  return [
    {
      label: t('tools.keycode-info.texts.label-key'),
      value: event.value.key,
      placeholder: 'Key name...',
    },
    {
      label: t('tools.keycode-info.texts.label-keycode'),
      value: String(event.value.keyCode),
      placeholder: 'Keycode...',
    },
    {
      label: t('tools.keycode-info.texts.label-code'),
      value: event.value.code,
      placeholder: 'Code...',
    },
    {
      label: t('tools.keycode-info.texts.label-scancode'),
      value: getScancode(event.value.code, layout.value)?.scancode?.toString(16) || '',
      placeholder: 'Scancode...',
    },
    {
      label: t('tools.keycode-info.texts.label-scancode-dec'),
      value: getScancode(event.value.code, layout.value)?.scancode?.toString(10) || '',
      placeholder: 'Scancode...',
    },
    {
      label: t('tools.keycode-info.texts.label-location'),
      value: String(event.value.location),
      placeholder: 'Code...',
    },

    {
      label: t('tools.keycode-info.texts.label-modifiers'),
      value: [
        event.value.metaKey && 'Meta',
        event.value.shiftKey && 'Shift',
        event.value.ctrlKey && 'Ctrl',
        event.value.altKey && 'Alt',
      ]
        .filter(Boolean)
        .join(' + '),
      placeholder: 'None',
    },
  ];
});
</script>

<template>
  <div>
    <c-select
      v-model:value="layout"
      label="Keyboard Layout:"
      label-position="left"
      :options="layoutOptions"
      placeholder="Select keyboard layout"
      mb-2
    />
    <c-card mb-5 text-center important:py-12>
      <div v-if="event" mb-2 text-3xl>
        {{ event.key }}
      </div>
      <span lh-1 op-70>{{ t('tools.keycode-info.texts.tag-press-the-key-on-your-keyboard-you-want-to-get-info-about-this-key') }}</span>
    </c-card>

    <n-input-group v-for="({ label, value, placeholder }, i) of fields" :key="i" style="margin-bottom: 5px">
      <n-input-group-label style="flex: 0 0 150px">
        {{ label }}
      </n-input-group-label>
      <InputCopyable :value="value" readonly :placeholder="placeholder" />
    </n-input-group>
  </div>
</template>
