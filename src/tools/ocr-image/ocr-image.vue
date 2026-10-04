<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import { OEM, createWorker } from 'tesseract.js';
import workerUrl from 'tesseract.js/dist/worker.min.js?url';
import coreLstmUrl from 'tesseract.js-core/tesseract-core-lstm.wasm.js?url';
import coreSimdLstmUrl from 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js?url';
import coreRelaxedSimdLstmUrl from 'tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js?url';
import engDataUrl from '@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz?url';
import chiSimDataUrl from '@tesseract.js-data/chi_sim/4.0.0_best_int/chi_sim.traineddata.gz?url';
import { getDocument } from 'pdfjs-dist';
import * as pdfJS from 'pdfjs-dist';
import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';
import { textStatistics } from '../text-statistics/text-statistics.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { getToolsSettingString, isOfflineMode, toolsSettings } from '@/tools-settings';

const { t } = useI18n();

const languages = [
  { name: 'English', code: 'eng' },
  { name: 'Portuguese', code: 'por' },
  { name: 'Afrikaans', code: 'afr' },
  { name: 'Albanian', code: 'sqi' },
  { name: 'Amharic', code: 'amh' },
  { name: 'Arabic', code: 'ara' },
  { name: 'Assamese', code: 'asm' },
  { name: 'Azerbaijani', code: 'aze' },
  { name: 'Azerbaijani - Cyrillic', code: 'aze_cyrl' },
  { name: 'Basque', code: 'eus' },
  { name: 'Belarusian', code: 'bel' },
  { name: 'Bengali', code: 'ben' },
  { name: 'Bosnian', code: 'bos' },
  { name: 'Bulgarian', code: 'bul' },
  { name: 'Burmese', code: 'mya' },
  { name: 'Catalan; Valencian', code: 'cat' },
  { name: 'Cebuano', code: 'ceb' },
  { name: 'Central Khmer', code: 'khm' },
  { name: 'Cherokee', code: 'chr' },
  { name: 'Chinese - Simplified', code: 'chi_sim' },
  { name: 'Chinese - Traditional', code: 'chi_tra' },
  { name: 'Croatian', code: 'hrv' },
  { name: 'Czech', code: 'ces' },
  { name: 'Danish', code: 'dan' },
  { name: 'Dutch; Flemish', code: 'nld' },
  { name: 'Dzongkha', code: 'dzo' },
  { name: 'English, Middle (1100-1500)', code: 'enm' },
  { name: 'Esperanto', code: 'epo' },
  { name: 'Estonian', code: 'est' },
  { name: 'Finnish', code: 'fin' },
  { name: 'French', code: 'fra' },
  { name: 'French, Middle (ca. 1400-1600)', code: 'frm' },
  { name: 'Galician', code: 'glg' },
  { name: 'Georgian', code: 'kat' },
  { name: 'German', code: 'deu' },
  { name: 'German Fraktur', code: 'frk' },
  { name: 'Greek, Modern (1453-)', code: 'ell' },
  { name: 'Greek, Ancient (-1453)', code: 'grc' },
  { name: 'Gujarati', code: 'guj' },
  { name: 'Haitian; Haitian Creole', code: 'hat' },
  { name: 'Hebrew', code: 'heb' },
  { name: 'Hindi', code: 'hin' },
  { name: 'Hungarian', code: 'hun' },
  { name: 'Icelandic', code: 'isl' },
  { name: 'Indonesian', code: 'ind' },
  { name: 'Inuktitut', code: 'iku' },
  { name: 'Irish', code: 'gle' },
  { name: 'Italian', code: 'ita' },
  { name: 'Japanese', code: 'jpn' },
  { name: 'Javanese', code: 'jav' },
  { name: 'Kannada', code: 'kan' },
  { name: 'Kazakh', code: 'kaz' },
  { name: 'Kirghiz; Kyrgyz', code: 'kir' },
  { name: 'Korean', code: 'kor' },
  { name: 'Kurdish', code: 'kur' },
  { name: 'Lao', code: 'lao' },
  { name: 'Latin', code: 'lat' },
  { name: 'Latvian', code: 'lav' },
  { name: 'Lithuanian', code: 'lit' },
  { name: 'Macedonian', code: 'mkd' },
  { name: 'Malay', code: 'msa' },
  { name: 'Malayalam', code: 'mal' },
  { name: 'Maltese', code: 'mlt' },
  { name: 'Marathi', code: 'mar' },
  { name: 'Nepali', code: 'nep' },
  { name: 'Norwegian', code: 'nor' },
  { name: 'Oriya', code: 'ori' },
  { name: 'Panjabi; Punjabi', code: 'pan' },
  { name: 'Persian', code: 'fas' },
  { name: 'Polish', code: 'pol' },
  { name: 'Pushto; Pashto', code: 'pus' },
  { name: 'Romanian; Moldavian; Moldovan', code: 'ron' },
  { name: 'Russian', code: 'rus' },
  { name: 'Sanskrit', code: 'san' },
  { name: 'Serbian', code: 'srp' },
  { name: 'Serbian - Latin', code: 'srp_latn' },
  { name: 'Sinhala; Sinhalese', code: 'sin' },
  { name: 'Slovak', code: 'slk' },
  { name: 'Slovenian', code: 'slv' },
  { name: 'Spanish; Castilian', code: 'spa' },
  { name: 'Swahili', code: 'swa' },
  { name: 'Swedish', code: 'swe' },
  { name: 'Syriac', code: 'syr' },
  { name: 'Tagalog', code: 'tgl' },
  { name: 'Tajik', code: 'tgk' },
  { name: 'Tamil', code: 'tam' },
  { name: 'Telugu', code: 'tel' },
  { name: 'Thai', code: 'tha' },
  { name: 'Tibetan', code: 'bod' },
  { name: 'Tigrinya', code: 'tir' },
  { name: 'Turkish', code: 'tur' },
  { name: 'Uighur; Uyghur', code: 'uig' },
  { name: 'Ukrainian', code: 'ukr' },
  { name: 'Urdu', code: 'urd' },
  { name: 'Uzbek', code: 'uzb' },
  { name: 'Uzbek - Cyrillic', code: 'uzb_cyrl' },
  { name: 'Vietnamese', code: 'vie' },
  { name: 'Welsh', code: 'cym' },
  { name: 'Yiddish', code: 'yid' },
];

// Language data shipped with the app: the LSTM-only `4.0.0_best_int` variant tesseract.js downloads by default.
// tesseract.js fetches `<langPath>/<lang>.traineddata.gz`, and the build keeps these file names (the content hash
// is a directory instead, see vite.config.ts), so the containing directory is the langPath.
const bundledLanguageData: Record<string, string> = { eng: engDataUrl, chi_sim: chiSimDataUrl };

// Other languages come from `{ "ocr-image": { "lang-url": "..." } }` in tools-settings.json when set (a directory
// of `<lang>.traineddata.gz` files, or a URL with a `{lang}` placeholder), otherwise from tesseract.js' default CDN.
const languageDataUrl = getToolsSettingString(toolsSettings, 'ocr-image', 'lang-url');

function getLangPath(lang: string) {
  const bundled = bundledLanguageData[lang];
  if (bundled) {
    return new URL('.', new URL(bundled, document.baseURI)).href;
  }
  if (languageDataUrl) {
    return new URL(languageDataUrl.replaceAll('{lang}', lang), document.baseURI).href;
  }
  return undefined;
}

// Offline without a mirror, only the bundled languages can be loaded.
const availableLanguages =
  isOfflineMode && !languageDataUrl ? languages.filter(({ code }) => code in bundledLanguageData) : languages;
const languagesOptions = availableLanguages.map((l) => ({
  label: l.name,
  value: l.code,
}));

const language = useQueryParamOrStorage({ name: 'lang', storageName: 'ocr-image:lang', defaultValue: 'eng' });
if (!availableLanguages.some(({ code }) => code === language.value)) {
  language.value = 'eng';
}

// Pick the tesseract core build the way tesseract.js does when given a directory (it can't be, as the build hashes
// the file names). Same feature probes as wasm-feature-detect, which tesseract.js uses for this.
function getCorePath() {
  const supports = (bytes: number[]) => WebAssembly.validate(new Uint8Array(bytes));
  const relaxedSimd = [
    0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 15, 1, 13, 0, 65, 1, 253, 15, 65, 2, 253, 15,
    253, 128, 2, 11,
  ];
  const simd = [
    0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
  ];
  if (supports(relaxedSimd)) {
    return coreRelaxedSimdLstmUrl;
  }
  return supports(simd) ? coreSimdLstmUrl : coreLstmUrl;
}

const pageSeparator = '\n=============\n';
const ocrInProgress = ref(false);
const fileInput = ref() as Ref<File>;
const ocrText = computedAsync(async () => {
  try {
    return await ocr(fileInput.value, language.value);
  } catch (e: any) {
    return e.toString();
  }
});
const stats = computed(() => textStatistics(ocrText.value?.replace(new RegExp(pageSeparator, 'g'), ' ') || ''));
const pageCount = computed(() => ocrText.value?.split(new RegExp(pageSeparator, 'g')).length || 0);

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

async function loadPdfFile(file: File) {
  const arrBuffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(arrBuffer);
  return getDocument({ data: byteArray }).promise;
}

async function convertPdfToImage(file: File) {
  const pdf = await loadPdfFile(file);
  const container = document.getElementById('container');
  const images = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container?.appendChild(canvas);
    await page.render({
      canvasContext: canvas.getContext('2d') as CanvasRenderingContext2D,
      viewport,
    }).promise;
    images.push(canvas.toDataURL('image/png'));
  }
  return images;
}

async function ocr(file: File, language: string) {
  if (!file) {
    return '';
  }
  ocrInProgress.value = true;
  const worker = await createWorker(language, OEM.LSTM_ONLY, {
    workerPath: workerUrl,
    corePath: getCorePath(),
    langPath: getLangPath(language),
  });
  const allTexts = [];
  if (file.type.match('^image/')) {
    const ret = await worker.recognize(file);
    allTexts.push(ret.data.text);
  } else {
    pdfJS.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

    for (const image of await convertPdfToImage(file)) {
      const ret = await worker.recognize(image);
      allTexts.push(ret.data.text);
    }
  }
  await worker.terminate();
  ocrInProgress.value = false;
  return allTexts.join(pageSeparator);
}
</script>

<template>
  <div>
    <c-select
      v-model:value="language"
      :label="t('tools.ocr-image.texts.label-language')"
      :options="languagesOptions"
      searchable
      mb-2
    />

    <c-file-upload
      :title="t('tools.ocr-image.texts.title-drag-and-drop-a-image-or-pdf-here-or-click-to-select-a-file')"
      :paste-image="true"
      @file-upload="onUpload"
    />

    <n-divider />

    <div id="container" style="display: none" />

    <div>
      <h3>{{ t('tools.ocr-image.texts.tag-ocr') }}</h3>
      <TextareaCopyable
        v-if="!ocrInProgress"
        v-model:value="ocrText"
        :word-wrap="true"
        download-file-name="output.txt"
      />
      <n-spin v-if="ocrInProgress" size="small" />
    </div>

    <c-card v-if="!ocrInProgress && stats" :title="t('tools.ocr-image.texts.title-statistics')">
      <n-space mt-3>
        <n-statistic :label="t('tools.ocr-image.texts.label-character-count')" :value="stats.chars" />
        <n-statistic :label="t('tools.ocr-image.texts.label-word-count')" :value="stats.words" />
        <n-statistic :label="t('tools.ocr-image.texts.label-line-count')" :value="stats.lines" />
        <n-statistic :label="t('tools.ocr-image.texts.label-pages-count')" :value="pageCount" />
        <n-statistic :label="t('tools.ocr-image.texts.label-sentences-count')" :value="stats.sentences" />
      </n-space>

      <n-divider />

      <n-space>
        <n-statistic :label="t('tools.ocr-image.texts.label-chars-no-spaces')" :value="stats.chars_no_spaces" />
        <n-statistic :label="t('tools.ocr-image.texts.label-uppercase-chars')" :value="stats.chars_upper" />
        <n-statistic :label="t('tools.ocr-image.texts.label-lowercase-chars')" :value="stats.chars_lower" />
        <n-statistic :label="t('tools.ocr-image.texts.label-digit-chars')" :value="stats.chars_digits" />
        <n-statistic :label="t('tools.ocr-image.texts.label-punctuations')" :value="stats.chars_puncts" />
        <n-statistic :label="t('tools.ocr-image.texts.label-spaces-chars')" :value="stats.chars_spaces" />
        <n-statistic :label="t('tools.ocr-image.texts.label-word-count-no-punct')" :value="stats.words_no_puncs" />
      </n-space>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
