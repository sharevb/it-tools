<script setup lang="ts">
import { Countdown } from 'vue3-flip-countdown';
import { parseExpression } from 'cron-parser';
import moment from 'moment';
import { useQueryParam } from '@/composable/queryParams';

const allDays = '0,1,2,3,4,5,6';
const alarmAt = useQueryParam({ name: 'at', defaultValue: '17:30:00' });
const alarmDays = useQueryParam({ name: 'days', defaultValue: allDays });
const history = useStorage<{ days: string; at: string }[]>('cronalarm:hst', []);

function getTimeHref(at: string, days: string) {
  const parsedUrl = new URL(window.location.href);
  parsedUrl.searchParams.set('at', at);
  parsedUrl.searchParams.set('days', days);
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
const daysArray = computed<string[]>({
  get() {
    return (alarmDays.value || allDays).split(',').map(s => s.trim());
  },
  set(newValue) {
    alarmDays.value = newValue.join(',');
  },
});
const cronExpression = computed(() => {
  const [h, m, s] = alarmAt.value.split(':');
  return `${s} ${m} ${h} * * ${alarmDays.value}`;
});
const alarmAtDate = computed(() => {
  const interval = parseExpression(cronExpression.value);
  return interval.next().toDate();
});

const fmt = 'YYYY-MM-DD HH:mm:ss';
const alarmAtFormatted = computed(() => {
  return moment(alarmAtDate.value).format(fmt);
});

function start() {
  now.value = moment();
  status.value = 'running';
  const histoEntry = { at: alarmAt.value, days: alarmDays.value };
  if (!history.value.find(h => h.at === histoEntry.at && h.days === histoEntry.days)) {
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
    <c-card :disabled="status !== 'stopped'" title="Alarm" mb-4>
      <div mb-1 flex justify-center>
        <n-form-item label="Alarm at:" label-placement="left">
          <n-time-picker v-model:formatted-value="alarmAt" />
        </n-form-item>
      </div>
      <div flex justify-center>
        <n-checkbox-group v-model:value="daysArray">
          <n-space item-style="display: flex;">
            <n-checkbox value="1" label="Monday" />
            <n-checkbox value="2" label="Tuesday" />
            <n-checkbox value="3" label="Wednesday" />
            <n-checkbox value="4" label="Thursday" />
            <n-checkbox value="5" label="Friday" />
            <n-checkbox value="6" label="Saturday" />
            <n-checkbox value="0" label="Sunday" />
          </n-space>
        </n-checkbox-group>
      </div>

      <div flex justify-center>
        <c-button
          @click="start"
        >
          Start
        </c-button>
      </div>
    </c-card>

    <div id="fullScreenElement" ref="fullScreenElement" mb-2>
      <div>
        <Countdown :deadline="alarmAtFormatted" :stop="status !== 'running'" mb-2 @time-elapsed="ended()" />
        <div mb-2 flex justify-center>
          <c-button
            :disabled="status === 'stopped'"
            @click="toggleFullScreen"
          >
            Toggle Fullscreen
          </c-button>
        </div>
      </div>
    </div>

    <div mb-2 flex justify-center>
      <c-button
        :disabled="status === 'stopped'"
        @click="stop"
      >
        Stop
      </c-button>
    </div>

    <n-p align="center">
      Next alarm at: {{ alarmAtDate }}
    </n-p>

    <n-modal v-model:show="isEnded" mask-closable="false">
      <n-card
        style="width: 600px"
        title="Timer finished"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <p>Timer elapsed!</p>
        <template #footer>
          <n-button @click="stop()">
            OK
          </n-button>
        </template>
      </n-card>
    </n-modal>

    <c-card v-if="history" title="History">
      <div flex justify-center gap-1>
        <template v-for="(entry, index) in history" :key="index">
          {{ index > 0 ? ' / ' : '' }}
          <n-a :href="getTimeHref(entry.at, entry.days)">
            At: {{ entry.at }} ; Days: {{ entry.days || '*' }}
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
