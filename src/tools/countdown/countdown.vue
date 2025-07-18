<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Countdown } from 'vue3-flip-countdown';
import moment from 'moment';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

interface CountDown {
  d: number
  h: number
  m: number
  s: number
}

function getCountDownHref(c: CountDown) {
  const parsedUrl = new URL(window.location.href);
  parsedUrl.searchParams.set('d', c.d.toString());
  parsedUrl.searchParams.set('h', c.h.toString());
  parsedUrl.searchParams.set('m', c.m.toString());
  parsedUrl.searchParams.set('s', c.s.toString());
  return parsedUrl.toString();
}

const days = useQueryParam({ name: 'd', defaultValue: 0 });
const hours = useQueryParam({ name: 'h', defaultValue: 0 });
const minutes = useQueryParam({ name: 'm', defaultValue: 0 });
const seconds = useQueryParam({ name: 's', defaultValue: 0 });
const history = useStorage<CountDown[]>('countdown:hst', []);

const status = ref<'stopped' | 'ended' | 'running'>('stopped');

const audio = ref<HTMLAudioElement | null>(null);

watchEffect(() => {
  if (status.value === 'ended') {
    audio.value?.play();
  }
});

const now = ref(moment());
const deadlineDate = computed(() => {
  return now.value
    .add(days.value, 'd')
    .add(hours.value, 'h')
    .add(minutes.value, 'm')
    .add(seconds.value, 's')
    .toDate();
});
const fmt = 'YYYY-MM-DD HH:mm:ss';
const deadlineFormatted = computed(() => {
  return now.value
    .add(days.value, 'd')
    .add(hours.value, 'h')
    .add(minutes.value, 'm')
    .add(seconds.value, 's')
    .format(fmt);
});

function start() {
  now.value = moment();
  status.value = 'running';
  const histoEntry = { d: days.value, h: hours.value, m: minutes.value, s: seconds.value };
  if (!history.value.find(h => h.d === histoEntry.d && h.h === histoEntry.h && h.m === histoEntry.m && h.s === histoEntry.s)) {
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
    <c-card :disabled="status !== 'stopped'" :title="t('tools.countdown.texts.title-countdown-time')" mb-4>
      <div mb-4 flex justify-center gap-2>
        <n-input-number v-model:value="days" :min="0">
          <template #suffix>
            {{ t('tools.countdown.texts.tag-days') }}
          </template>
        </n-input-number>
        <n-input-number v-model:value="hours" :min="0">
          <template #suffix>
            {{ t('tools.countdown.texts.tag-hours') }}
          </template>
        </n-input-number>
        <n-input-number v-model:value="minutes" :min="0">
          <template #suffix>
            {{ t('tools.countdown.texts.tag-minutes') }}
          </template>
        </n-input-number>
        <n-input-number v-model:value="seconds" :min="0">
          <template #suffix>
            {{ t('tools.countdown.texts.tag-seconds') }}
          </template>
        </n-input-number>
      </div>

      <div flex justify-center>
        <c-button
          @click="start"
        >
          {{ t('tools.countdown.texts.tag-start') }}
        </c-button>
      </div>
    </c-card>

    <div id="fullScreenElement" ref="fullScreenElement" mb-2>
      <div>
        <Countdown :deadline="deadlineFormatted" :stop="status !== 'running'" mb-2 countdown-size="4rem" @time-elapsed="ended()" />

        <div mb-2 flex justify-center>
          <c-button
            :disabled="status === 'stopped'"
            @click="toggleFullScreen"
          >
            {{ t('tools.countdown.texts.tag-toggle-fullscreen') }}
          </c-button>
        </div>
      </div>
    </div>

    <n-modal v-model:show="isEnded" mask-closable="false">
      <n-card
        style="width: 600px"
        :title="t('tools.countdown.texts.title-timer-finished')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <p>{{ t('tools.countdown.texts.tag-timer-ellapsed') }}</p>
        <template #footer>
          <n-button @click="stop()">
            {{ t('tools.countdown.texts.tag-ok') }}
          </n-button>
        </template>
      </n-card>
    </n-modal>

    <div mb-2 flex justify-center>
      <c-button
        :disabled="status === 'stopped'"
        @click="stop"
      >
        {{ t('tools.countdown.texts.tag-stop') }}
      </c-button>
    </div>

    <n-p align="center">
      Alarm at: {{ deadlineDate }}
    </n-p>

    <c-card v-if="history" :title="t('tools.countdown.texts.title-history')">
      <div flex justify-center gap-1>
        <template v-for="(entry, index) in history" :key="index">
          {{ index > 0 ? ' / ' : '' }}
          <n-a :href="getCountDownHref(entry)">
            {{ entry.d > 0 ? `${entry.d} days` : '' }}
            {{ entry.h > 0 ? `${entry.h}h` : '' }}
            {{ entry.m > 0 ? `${entry.m}m` : '' }}
            {{ entry.s > 0 ? `${entry.s}s` : '' }}
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
