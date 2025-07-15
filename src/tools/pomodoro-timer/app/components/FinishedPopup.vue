<script setup>
import { useStore } from 'vuex';

const store = useStore('pomodoro-store');
</script>

<template>
  <n-modal v-model:show="store.state.isShowFinishedPopup" :mask-closable="false">
    <n-card
      style="width: 600px"
      :title="$t('tools.pomodoro-timer.FinishedPopup.text.timer-finished')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <p>{{ store.state.finishedMessage }}</p>
      <template #footer>
        <n-button @click="store.commit('prepareNextTimerMode')">
          {{ $t('tools.pomodoro-timer.FinishedPopup.text.ok') }}
        </n-button>
      </template>
    </n-card>
  </n-modal>
</template>
