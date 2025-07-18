<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';

const { t } = useI18n();

const event = ref<KeyboardEvent>();

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
