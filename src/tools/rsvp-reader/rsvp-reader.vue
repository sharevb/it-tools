<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval';
import { extractTextFromEPUB, extractTextFromPDF } from './rsvp-reader.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const message = useMessage();

const { data: rawText } = useIDBKeyval('rsvp:txt', '');
const words = computed(() =>
  rawText.value
    .replace(/\r/g, '') // clean \r
    .replace(/\s+([!?:;])/g, '$1') // clean \r
    .replace(/\n\s*\n/g, '¤endpara¤ ') // keep double empty lines for para breaks
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word: string) => word.replace(/¤endpara¤$/g, '\n\n')), // add double \n for para breaks
);

const wpm = useQueryParamOrStorage({ name: 'wpm', storageName: 'rsvp:w', defaultValue: 300 });
const chunkSize = useQueryParamOrStorage({ name: 'size', storageName: 'rsvp:sz', defaultValue: 1 });
const fontSize = useQueryParamOrStorage({ name: 'fs', storageName: 'rsvp:fs', defaultValue: 48 });
const fontColor = useQueryParamOrStorage({ name: 'fg', storageName: 'rsvp:fg', defaultValue: '#000000' });
const bgColor = useQueryParamOrStorage({ name: 'bg', storageName: 'rsvp:bg', defaultValue: '#ffffff' });

// % of base delay
const pauseSentencePct = useQueryParamOrStorage({ name: 'sent', storageName: 'rsvp:st', defaultValue: 50 });
const pauseParagraphPct = useQueryParamOrStorage({ name: 'para', storageName: 'rsvp:pa', defaultValue: 100 });
const punctuationPausePct = useQueryParamOrStorage({ name: 'punct', storageName: 'rsvp:pc', defaultValue: 30 });
// % slowdown for larger chunks
const chunkSlowdownPct = useQueryParamOrStorage({ name: 'slow', storageName: 'rsvp:sl', defaultValue: 20 });

const isPlaying = ref(false);
const currentIndex = useStorage('rsvp:ix', 0);
const timerId = ref<number | null>(null);
const isProcessingFile = ref(false);

const currentChunk = computed(() => {
  const start = currentIndex.value;
  const end = Math.min(start + chunkSize.value, words.value.length);
  return words.value.slice(start, end).join(' ');
});

const baseDelay = computed(() => 60000 / wpm.value);

function computeDelayForWord(word: string): number {
  let delay = baseDelay.value;

  // Chunk slowdown
  if (chunkSize.value > 1) {
    delay += delay * (chunkSlowdownPct.value / 100);
  }

  // Sentence-ending punctuation
  if (/[.!?]$/.test(word)) {
    delay += delay * (pauseSentencePct.value / 100);
  }

  // Paragraph break (double newline)
  if (word.endsWith('\n\n')) {
    // crude detection, can be improved with tokenizer
    delay += delay * (pauseParagraphPct.value / 100);
  }

  // Punctuation pause
  if (/[,:;]$/.test(word)) {
    delay += delay * (punctuationPausePct.value / 100);
  }

  return delay;
}

function start() {
  if (!words.value.length) {
    message.warning(t('tools.rsvp-reader.text.please-provide-some-text-first'));
    return;
  }
  isPlaying.value = true;
  scheduleNext();
}

function pause() {
  isPlaying.value = false;
  clearTimer();
}

function reset() {
  pause();
  currentIndex.value = 0;
}

function scheduleNext() {
  clearTimer();
  if (!isPlaying.value) {
    return;
  }

  const word = words.value[currentIndex.value];
  const delay = computeDelayForWord(word);

  timerId.value = window.setTimeout(() => {
    const next = currentIndex.value + chunkSize.value;
    if (next < words.value.length) {
      currentIndex.value = next;
      scheduleNext();
    }
    else {
      isPlaying.value = false;
      clearTimer();
    }
  }, delay);
}

function clearTimer() {
  if (timerId.value !== null) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }
}

watch(wpm, () => {
  if (isPlaying.value) {
    scheduleNext();
  }
});

function jumpToWord(index: number) {
  currentIndex.value = index;
}

async function onUpload(file: File) {
  if (!file) {
    return;
  }

  isProcessingFile.value = true;

  const ext = file.name.split('.').pop()?.toLowerCase();
  const onEnd = (text: string) => {
    rawText.value = text;
    currentIndex.value = 0;
    isProcessingFile.value = false;
  };

  try {
    if (ext === 'txt') {
      onEnd(await file.text());
      return;
    }

    if (ext === 'pdf') {
      onEnd(await extractTextFromPDF(file));
      return;
    }

    if (ext === 'epub') {
      onEnd(await extractTextFromEPUB(file));
      return;
    }

    message.error(t('tools.rsvp-reader.text.unsupported-file-type'));
  }
  catch (err) {
    message.error(`Failed to parse file: ${err}`);
  }
  isProcessingFile.value = false;
}

function handleKeydown(e: KeyboardEvent) {
  // Space → Play/Pause
  if (e.code === 'Space') {
    e.preventDefault();
    isPlaying.value ? pause() : start();
  }

  // Right arrow → skip forward
  if (e.code === 'ArrowRight') {
    e.preventDefault();
    moveRight();
  }

  // Left arrow → skip backward
  if (e.code === 'ArrowLeft') {
    e.preventDefault();
    moveLeft();
  }

  // Up arrow → increase WPM
  if (e.code === 'ArrowUp') {
    e.preventDefault();
    wpm.value = Math.min(wpm.value + 10, 2000);
  }

  // Down arrow → decrease WPM
  if (e.code === 'ArrowDown') {
    e.preventDefault();
    wpm.value = Math.max(wpm.value - 10, 50);
  }

  // Home → jump to start
  if (e.code === 'Home') {
    e.preventDefault();
    currentIndex.value = 0;
  }

  // End → jump to end
  if (e.code === 'End') {
    e.preventDefault();
    currentIndex.value = words.value.length - 1;
  }
}

function moveRight() {
  currentIndex.value = Math.min(
    currentIndex.value + chunkSize.value,
    words.value.length - 1,
  );
}

function moveLeft() {
  currentIndex.value = Math.max(
    currentIndex.value - chunkSize.value,
    0,
  );
}

function progressJump(e: MouseEvent) {
  let el: HTMLElement | null = (e.target as HTMLElement);
  while (el && !el.className.includes('n-progress-content')) {
    el = el.parentElement;
  }
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  jumpToWord(Math.floor(words.value.length * pct));
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearTimer();
});
</script>

<template>
  <div>
    <n-tabs type="line" animated>
      <n-tab-pane name="display" :tab="t('tools.rsvp-reader.text.display')">
        <NAlert v-if="!words.length" type="warning">
          {{ t('tools.rsvp-reader.texts.tag-no-text-to-read-please-input-some-text-in-text-tab') }}
        </NAlert>
        <div v-else>
          <NSpace justify="center" mb-2>
            <NButton type="primary" :disabled="isPlaying" @click="start">
              {{ t('tools.rsvp-reader.texts.tag-play-space') }}
            </NButton>
            <NButton :disabled="!isPlaying" @click="pause">
              {{ t('tools.rsvp-reader.texts.tag-pause-space') }}
            </NButton>
            <NButton @click="moveLeft">
              {{ t('tools.rsvp-reader.texts.tag-back') }}
            </NButton>
            <NButton @click="moveRight">
              {{ t('tools.rsvp-reader.texts.tag-next') }}
            </NButton>
            <NButton tertiary @click="reset">
              {{ t('tools.rsvp-reader.texts.tag-reset') }}
            </NButton>
          </NSpace>

          <NProgress
            type="line"
            :percentage="((currentIndex / words.length) * 100).toFixed(1)"
            indicator-placement="inside"
            style="cursor: pointer;"
            mb-2
            @click="progressJump"
          />

          <NCard
            embedded
            style="text-align: center; min-height: 150px;"
            :style="{ backgroundColor: bgColor }"
          >
            <div
              :style="{
                fontSize: `${fontSize}px`,
                color: fontColor,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }"
            >
              {{ currentChunk || t('tools.rsvp-reader.text.ready') }}
            </div>
          </NCard>
          <n-space justify="center" mt-1>
            <NText>{{ currentIndex + 1 }} / {{ words.length }} {{ t('tools.rsvp-reader.text.words') }}</NText> - <NText>{{ wpm }} {{ t('tools.rsvp-reader.text.wpm') }}</NText>
          </n-space>
        </div>
      </n-tab-pane>

      <n-tab-pane name="text" :tab="t('tools.rsvp-reader.text.text')">
        <c-input-text
          v-model:value="rawText"
          :label="t('tools.rsvp-reader.texts.label-text-to-read')"
          multiline
          rows="6"
          :placeholder="t('tools.rsvp-reader.texts.placeholder-paste-or-type-your-text-here')"
          :disabled="isProcessingFile"
          mb-2
        />
        <n-space justify="center">
          <n-spin v-if="isProcessingFile" size="small" />
        </n-space>
        <n-divider>{{ t('tools.rsvp-reader.texts.tag-or') }}</n-divider>
        <c-file-upload
          :title="t('tools.rsvp-reader.texts.title-drop-an-pdf-epub-or-txt-file-here-or-click-to-select-a-file')"
          accept=".pdf,.epub,.txt"
          :disabled="isProcessingFile"
          @file-upload="onUpload"
        />
      </n-tab-pane>

      <n-tab-pane name="settings" :tab="t('tools.rsvp-reader.text.settings')">
        <NForm label-placement="left" label-width="150px">
          <NFormItem :label="t('tools.rsvp-reader.texts.label-word-per-minute')">
            <NInputNumber v-model:value="wpm" :min="50" :max="2000" mr-1 />
            <NSlider v-model:value="wpm" :min="50" :max="2000" />
          </NFormItem>

          <NFormItem :label="t('tools.rsvp-reader.texts.label-chunk-size')">
            <NInputNumber v-model:value="chunkSize" :min="1" :max="10" />
          </NFormItem>

          <NFormItem :label="t('tools.rsvp-reader.texts.label-large-chunk-slowdown')">
            <NInputNumber v-model:value="chunkSlowdownPct" :min="0" :max="300" />
          </NFormItem>

          <NCard :title="t('tools.rsvp-reader.texts.title-pauses')" mb-2>
            <NSpace justify="center">
              <NFormItem :label="t('tools.rsvp-reader.texts.label-sentence-end')">
                <NInputNumber v-model:value="pauseSentencePct" :min="0" :max="300" />
              </NFormItem>
              <NFormItem :label="t('tools.rsvp-reader.texts.label-paragraph-end')">
                <NInputNumber v-model:value="pauseParagraphPct" :min="0" :max="300" />
              </NFormItem>
              <NFormItem :label="t('tools.rsvp-reader.texts.label-punctuation')">
                <NInputNumber v-model:value="punctuationPausePct" :min="0" :max="300" />
              </NFormItem>
            </NSpace>
          </NCard>

          <NCard :title="t('tools.rsvp-reader.texts.title-appearance')" mb-2>
            <NFormItem :label="t('tools.rsvp-reader.texts.label-font-size')">
              <NInputNumber v-model:value="fontSize" :min="16" :max="120" />
            </NFormItem>
            <NFormItem :label="t('tools.rsvp-reader.texts.label-font-color')">
              <NColorPicker v-model:value="fontColor" />
            </NFormItem>
            <NFormItem :label="t('tools.rsvp-reader.texts.label-background')">
              <NColorPicker v-model:value="bgColor" />
            </NFormItem>
          </NCard>
        </NForm>
      </n-tab-pane>

      <n-tab-pane name="keyboard" :tab="t('tools.rsvp-reader.text.keyboard-shortcuts')">
        <n-space vertical size="medium">
          <n-text depth="3">
            {{ t('tools.rsvp-reader.texts.tag-control-playback-and-navigation-without-touching-the-mouse') }}
          </n-text>

          <n-table :bordered="false" :single-line="false" size="small">
            <thead>
              <tr>
                <th style="width: 160px;">
                  {{ t('tools.rsvp-reader.texts.tag-shortcut') }}
                </th>
                <th>{{ t('tools.rsvp-reader.texts.tag-action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-space') }}</kbd></td>
                <td>{{ t('tools.rsvp-reader.texts.tag-play-pause') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-') }}</kbd>{{ t('tools.rsvp-reader.texts.tag-right-arrow') }}</td>
                <td>{{ t('tools.rsvp-reader.texts.tag-skip-forward-one-chunk') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-') }}</kbd>{{ t('tools.rsvp-reader.texts.tag-left-arrow') }}</td>
                <td>{{ t('tools.rsvp-reader.texts.tag-skip-backward-one-chunk') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-') }}</kbd>{{ t('tools.rsvp-reader.texts.tag-up-arrow') }}</td>
                <td>{{ t('tools.rsvp-reader.texts.tag-increase-wpm') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-') }}</kbd>{{ t('tools.rsvp-reader.texts.tag-down-arrow') }}</td>
                <td>{{ t('tools.rsvp-reader.texts.tag-decrease-wpm') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-home') }}</kbd></td>
                <td>{{ t('tools.rsvp-reader.texts.tag-jump-to-start') }}</td>
              </tr>

              <tr>
                <td><kbd>{{ t('tools.rsvp-reader.texts.tag-end') }}</kbd></td>
                <td>{{ t('tools.rsvp-reader.texts.tag-jump-to-end') }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
