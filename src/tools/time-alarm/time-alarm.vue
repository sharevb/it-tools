<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Countdown } from 'vue3-flip-countdown';
import moment from 'moment';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const alarmAt = useQueryParam({ name: 'alarmAt', defaultValue: '17:30:00' });
const history = useStorage<string[]>('timealarm:hst', []);

function getTimeHref(at: string) {
  const parsedUrl = new URL(window.location.href);
  parsedUrl.searchParams.set('at', at);
  return parsedUrl.toString();
}

const status = ref<'stopped' | 'ended' | 'running'>('stopped');

const audio = ref<HTMLAudioElement | null>(null);

watchEffect(() => {
  if (status.value === 'ended') {
    audio.value?.play();
  }
});

const now = ref(moment());
const alarmAtDate = computed(() => {
  const [h, m, s] = alarmAt.value.split(':');
  return now.value
    .set('h', Number(h))
    .set('m', Number(m))
    .set('s', Number(s))
    .toDate();
});

const fmt = 'YYYY-MM-DD HH:mm:ss';

const alarmAtFormatted = computed(() => {
  const [h, m, s] = alarmAt.value.split(':');
  return now.value
    .set('h', Number(h))
    .set('m', Number(m))
    .set('s', Number(s))
    .format(fmt);
});

function start() {
  now.value = moment();
  status.value = 'running';
  const histoEntry = alarmAt.value;
  if (!history.value.find(h => h === histoEntry)) {
    history.value = [histoEntry, ...history.value];
  }
}

function stop() {
  status.value = 'stopped';
  audio.value?.pause();
}

function ended() {
  if (status.value === 'running') {
    status.value = 'ended';
  }
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  }
}

const fullScreenElement = ref<HTMLElement>();
function toggleFullScreen() {
  const element = fullScreenElement.value;
  if (!element) {
    return;
  }
  if (!document.fullscreenElement) {
    element?.requestFullscreen();
  }
  else {
    document.exitFullscreen?.();
  }
}

const isEnded = computed(() => status.value === 'ended');
</script>

<template>
  <div max-w-600px>
    <c-card :disabled="status !== 'stopped'" :title="t('tools.time-alarm.texts.title-alarm')" mb-4>
      <div flex justify-center>
        <n-form-item :label="t('tools.time-alarm.texts.label-alarm-at')" label-placement="left">
          <n-time-picker v-model:formatted-value="alarmAt" />
        </n-form-item>
      </div>

      <div flex justify-center>
        <c-button
          @click="start"
        >
          {{ t('tools.time-alarm.texts.tag-start') }}
        </c-button>
      </div>
    </c-card>

    <div id="fullScreenElement" ref="fullScreenElement" mb-2>
      <div>
        <Countdown :deadline="alarmAtFormatted" :stop="status !== 'running'" mb-2 countdown-size="5rem" @time-elapsed="ended()" />
        <div mb-2 flex justify-center>
          <c-button
            :disabled="status === 'stopped'"
            @click="toggleFullScreen"
          >
            {{ t('tools.time-alarm.texts.tag-toggle-fullscreen') }}
          </c-button>
        </div>
      </div>
    </div>

    <n-modal v-model:show="isEnded" mask-closable="false">
      <n-card
        style="width: 600px"
        :title="t('tools.time-alarm.texts.title-timer-finished')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <p>{{ t('tools.time-alarm.texts.tag-timer-ellapsed') }}</p>
        <template #footer>
          <n-button @click="stop()">
            {{ t('tools.time-alarm.texts.tag-ok') }}
          </n-button>
        </template>
      </n-card>
    </n-modal>

    <div mb-2 flex justify-center>
      <c-button
        :disabled="status === 'stopped'"
        @click="stop"
      >
        {{ t('tools.time-alarm.texts.tag-stop') }}
      </c-button>
    </div>

    <n-p align="center">
      Alarm at: {{ alarmAtDate }}
    </n-p>

    <c-card v-if="history" :title="t('tools.time-alarm.texts.title-history')">
      <div flex justify-center gap-1>
        <template v-for="(entry, index) in history" :key="index">
          {{ index > 0 ? ' / ' : '' }}
          <n-a :href="getTimeHref(entry)">
            {{ entry }}
          </n-a>
        </template>
      </div>
    </c-card>

    <audio ref="audio" loop src="/Beep.mp3" />
  </div>
</template>

<style scoped>
#fullScreenElement:fullscreen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
