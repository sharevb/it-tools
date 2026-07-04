<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NButton, NGi, NGrid, NInput, NSelect, NTabPane, NTabs, NUpload, type UploadFileInfo } from 'naive-ui';

import FontControls from './font-controls.vue'; // Separate component for weight/style/fallback
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const defaultText = 'The quick brown fox jumps over the lazy dog.';
const sampleText = useITStorage('font-comparer:txt', defaultText);
const activeTab = useITStorage('font-comparer:tab', 'fontname');

const fontOptions = [
  { label: t('tools.font-compare.texts.label-arial'), value: 'Arial' },
  { label: t('tools.font-compare.texts.label-verdana'), value: 'Verdana' },
  { label: t('tools.font-compare.texts.label-helvetica'), value: 'Helvetica' },
  { label: t('tools.font-compare.texts.label-tahoma'), value: 'Tahoma' },
  { label: t('tools.font-compare.texts.label-trebuchet-ms'), value: 'Trebuchet MS' },
  { label: t('tools.font-compare.texts.label-times-new-roman'), value: 'Times New Roman' },
  { label: t('tools.font-compare.texts.label-georgia'), value: 'Georgia' },
  { label: t('tools.font-compare.texts.label-garamond'), value: 'Garamond' },
  { label: t('tools.font-compare.texts.label-courier-new'), value: 'Courier New' },
  { label: t('tools.font-compare.texts.label-lucida-console'), value: 'Lucida Console' },
  { label: t('tools.font-compare.texts.label-lucida-sans-unicode'), value: 'Lucida Sans Unicode' },
  { label: t('tools.font-compare.texts.label-palatino-linotype'), value: 'Palatino Linotype' },
  { label: t('tools.font-compare.texts.label-segoe-ui'), value: 'Segoe UI' },
  { label: t('tools.font-compare.texts.label-impact'), value: 'Impact' },
  { label: t('tools.font-compare.texts.label-comic-sans-ms'), value: 'Comic Sans MS' },
  { label: t('tools.font-compare.texts.label-century-gothic'), value: 'Century Gothic' },
  { label: t('tools.font-compare.texts.label-franklin-gothic-medium'), value: 'Franklin Gothic Medium' },
  { label: t('tools.font-compare.texts.label-candara'), value: 'Candara' },
  { label: t('tools.font-compare.texts.label-calibri'), value: 'Calibri' },
  { label: t('tools.font-compare.texts.label-cambria'), value: 'Cambria' },
  { label: t('tools.font-compare.texts.label-constantia'), value: 'Constantia' },
  { label: t('tools.font-compare.texts.label-corbel'), value: 'Corbel' },
  { label: t('tools.font-compare.texts.label-book-antiqua'), value: 'Book Antiqua' },
  { label: t('tools.font-compare.texts.label-monaco'), value: 'Monaco' },
  { label: t('tools.font-compare.texts.label-andale-mono'), value: 'Andale Mono' },
  { label: t('tools.font-compare.texts.label-optima'), value: 'Optima' },
  { label: t('tools.font-compare.texts.label-futura'), value: 'Futura' },
  { label: t('tools.font-compare.texts.label-rockwell'), value: 'Rockwell' },
  { label: t('tools.font-compare.texts.label-baskerville'), value: 'Baskerville' },
  { label: t('tools.font-compare.texts.label-didot'), value: 'Didot' },
  { label: t('tools.font-compare.texts.label-geneva'), value: 'Geneva' },
  { label: t('tools.font-compare.texts.label-symbol'), value: 'Symbol' },
  { label: t('tools.font-compare.texts.label-webdings'), value: 'Webdings' },
  { label: t('tools.font-compare.texts.label-wingdings'), value: 'Wingdings' },
  { label: t('tools.font-compare.texts.label-roboto'), value: 'Roboto' },
  { label: t('tools.font-compare.texts.label-open-sans'), value: 'Open Sans' },
  { label: t('tools.font-compare.texts.label-lato'), value: 'Lato' },
  { label: t('tools.font-compare.texts.label-montserrat'), value: 'Montserrat' },
  { label: t('tools.font-compare.texts.label-oswald'), value: 'Oswald' },
  { label: t('tools.font-compare.texts.label-raleway'), value: 'Raleway' },
  { label: t('tools.font-compare.texts.label-poppins'), value: 'Poppins' },
  { label: t('tools.font-compare.texts.label-merriweather'), value: 'Merriweather' },
  { label: t('tools.font-compare.texts.label-inter'), value: 'Inter' },
  { label: t('tools.font-compare.texts.label-noto-sans'), value: 'Noto Sans' },
  { label: t('tools.font-compare.texts.label-playfair-display'), value: 'Playfair Display' },
  { label: t('tools.font-compare.texts.label-source-sans-pro'), value: 'Source Sans Pro' },
  { label: t('tools.font-compare.texts.label-ubuntu'), value: 'Ubuntu' },
  { label: t('tools.font-compare.texts.label-nunito'), value: 'Nunito' },
  { label: t('tools.font-compare.texts.label-pt-sans'), value: 'PT Sans' },
  { label: t('tools.font-compare.texts.label-quicksand'), value: 'Quicksand' },
  { label: t('tools.font-compare.texts.label-work-sans'), value: 'Work Sans' },
  { label: t('tools.font-compare.texts.label-rubik'), value: 'Rubik' },
  { label: t('tools.font-compare.texts.label-dm-sans'), value: 'DM Sans' },
];

interface FontData {
  value: string
  url: string
  css: string
  cssUrl: string
  dynamicName: string
  weight: string
  style: string
  fallback: string
}

const fontA = useITStorage('font-comparer:a', {
  value: 'Arial',
  url: '',
  css: '',
  cssUrl: '',
  dynamicName: '',
  weight: 'normal',
  style: 'normal',
  fallback: 'sans-serif',
});

const fontB = useITStorage('font-comparer:b', {
  value: 'Georgia',
  url: '',
  css: '',
  cssUrl: '',
  dynamicName: '',
  weight: 'normal',
  style: 'normal',
  fallback: 'serif',
});

function fontStyle(font: FontData) {
  return {
    fontFamily: `${font.dynamicName || font.value}, ${font.fallback}`,
    fontWeight: font.weight,
    fontStyle: font.style,
    fontSize: '20px',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginTop: '12px',
    minHeight: '80px',
  };
}

function injectFontCSS(cssText: string) {
  const styleTag = document.createElement('style');
  styleTag.type = 'text/css';
  styleTag.textContent = cssText;
  document.head.appendChild(styleTag);
}

async function loadCSSFromURL(url: string) {
  try {
    const response = await fetch(url);
    const cssText = await response.text();
    const styleTag = document.createElement('style');
    styleTag.textContent = cssText;
    document.head.appendChild(styleTag);
  }
  catch (error) {
    console.error('Failed to load CSS:', error);
  }
}

function loadFontFromURL(url: string, index: number) {
  const fontName = `CustomFont${index}`;
  const font = new FontFace(fontName, `url(${url})`);
  font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    if (index === 0) {
      fontA.value.dynamicName = fontName;
    }
    else { fontB.value.dynamicName = fontName; }
  }).catch(console.error);
}

function handleFontUpload(file: UploadFileInfo, index: number) {
  const reader = new FileReader();
  reader.onload = () => {
    const fontName = `UploadedFont${index}`;
    const font = new FontFace(fontName, reader.result as ArrayBuffer);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      if (index === 0) {
        fontA.value.dynamicName = fontName;
      }
      else { fontB.value.dynamicName = fontName; }
    }).catch(console.error);
  };
  reader.readAsArrayBuffer(file!.file!);
}

interface UploadEvents {
  file: UploadFileInfo
}
</script>

<template>
  <div>
    <details>
      <summary />
      <c-input-text v-model:value="sampleText" multiline rows="3" :placeholder="t('tools.font-compare.texts.placeholder-enter-sample-text')" mb-2 />
    </details>

    <NTabs v-model:value="activeTab" type="segment">
      <NTabPane name="fontname" :tab="t('tools.font-compare.text.by-font-name')">
        <NGrid :cols="2" :x-gap="24">
          <NGi v-for="(font, index) in [fontA, fontB]" :key="index">
            <NSelect
              v-model:value="font.value"
              :options="fontOptions"
              :placeholder="t('tools.font-compare.texts.placeholder-select-font-name')"
              mb-2
            />
            <FontControls :font="font" />
            <div :style="fontStyle(font)" class="font-preview">
              {{ sampleText }}
            </div>
          </NGi>
        </NGrid>
      </NTabPane>

      <NTabPane name="fonturl" :tab="t('tools.font-compare.text.by-font-url')">
        <NGrid :cols="2" :x-gap="24">
          <NGi v-for="(font, index) in [fontA, fontB]" :key="index">
            <NInput
              v-model:value="font.url"
              :placeholder="t('tools.font-compare.texts.placeholder-enter-font-url')"
              mb-2
              @blur="loadFontFromURL(font.url, index)"
            />
            <FontControls :font="font" />
            <div :style="fontStyle(font)" class="font-preview">
              {{ sampleText }}
            </div>
          </NGi>
        </NGrid>
      </NTabPane>

      <NTabPane name="fontfile" :tab="t('tools.font-compare.text.by-font-file')">
        <NGrid :cols="2" :x-gap="24">
          <NGi v-for="(font, index) in [fontA, fontB]" :key="index">
            <NUpload
              :show-file-list="false"
              accept=".ttf,.otf,.woff,.woff2"
              :change="(e: UploadEvents) => handleFontUpload(e.file, index)"
              mb-2
            >
              <NButton>{{ t('tools.font-compare.texts.tag-upload-font-file') }}</NButton>
            </NUpload>
            <FontControls :font="font" />
            <div :style="fontStyle(font)" class="font-preview">
              {{ sampleText }}
            </div>
          </NGi>
        </NGrid>
      </NTabPane>
      <NTabPane name="inlinecss" :tab="t('tools.font-compare.text.by-inline-css')">
        <NGrid :cols="2" :x-gap="24">
          <NGi v-for="(font, index) in [fontA, fontB]" :key="index">
            <NInput
              v-model:value="font.css"
              type="textarea"
              :placeholder="t('tools.font-compare.texts.placeholder-paste-font-face-css-here')"
              :autosize="{ minRows: 4, maxRows: 10 }"
              mb-1
              @blur="injectFontCSS(font.css)"
            />
            <NInput
              v-model:value="font.dynamicName"
              :placeholder="t('tools.font-compare.texts.placeholder-font-family-name-from-css')"
              mb-2
            />
            <FontControls :font="font" />
            <div :style="fontStyle(font)" class="font-preview">
              {{ sampleText }}
            </div>
          </NGi>
        </NGrid>
      </NTabPane>
      <NTabPane name="cssurl" :tab="t('tools.font-compare.text.by-css-url')">
        <NGrid :cols="2" :x-gap="24">
          <NGi v-for="(font, index) in [fontA, fontB]" :key="index">
            <NInput
              v-model:value="font.cssUrl"
              :placeholder="t('tools.font-compare.texts.placeholder-enter-css-url-e-g-https-example-com-fonts-css')"
              mb-1
              @blur="loadCSSFromURL(font.cssUrl)"
            />
            <NInput
              v-model:value="font.dynamicName"
              :placeholder="t('tools.font-compare.texts.placeholder-font-family-name-from-imported-css')"
              mb-2
            />
            <FontControls :font="font" />
            <div :style="fontStyle(font)" class="font-preview">
              {{ sampleText }}
            </div>
          </NGi>
        </NGrid>
      </NTabPane>
    </NTabs>
  </div>
</template>
