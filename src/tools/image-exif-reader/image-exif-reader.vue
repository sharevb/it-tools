<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExifReader from 'exifreader';
import getJpegQuality from 'jpeg-quality-estimator';
import { formatBytes } from '@/utils/convert';

const { t } = useI18n();

interface Tag {
  id: number
  name: string
  value: any
  description: string
}

interface TagsSection {
  [name: string]: Tag
}

const tagsSections = ref<{ name: string; title: string }[]>([
  { name: 'file', title: 'File Tags' },
  { name: 'jfif', title: 'JFIF Tags' },
  { name: 'pngFile', title: 'PNG File Tags' },
  { name: 'pngText', title: 'PNG Text Tags' },
  { name: 'png', title: 'PNG Tags' },
  { name: 'exif', title: 'EXIF Tags' },
  { name: 'iptc', title: 'IPTC Tags' },
  { name: 'xmp', title: 'XMP Tags' },
  { name: 'icc', title: 'ICC Tags' },
  { name: 'riff', title: 'RIFF Tags' },
  { name: 'gif', title: 'GIF Tags' },
  { name: 'Thumbnail', title: 'Thumbnail Tags' },
  { name: 'photoshop', title: 'Photoshop Tags' },
]);

const errorMessage = ref<string>('');
const tags = ref<ExifReader.ExpandedTags>({});
const status = ref<'idle' | 'parsed' | 'error' | 'loading'>('idle');
const file = ref<File | null>(null);
const quality = ref<number>(-1);

const openStreetMapUrl = computed(
  () => {
    const gpsLatitude = tags.value.gps?.Latitude;
    const gpsLongitude = tags.value.gps?.Longitude;
    return gpsLatitude && gpsLongitude ? `https://www.openstreetmap.org/?mlat=${gpsLatitude}&mlon=${gpsLongitude}#map=18/${gpsLatitude}/${gpsLongitude}` : undefined;
  },
);

async function onImageUploaded(uploadedFile: File) {
  file.value = uploadedFile;

  const fileBuffer = await uploadedFile.arrayBuffer();
  status.value = 'loading';
  try {
    quality.value = getJpegQuality(new Uint8Array(fileBuffer));
  }
  catch (e) {
    quality.value = -1;
  }
  try {
    tags.value = await ExifReader.load(fileBuffer, { expanded: true });
    status.value = 'parsed';
  }
  catch (e: any) {
    errorMessage.value = e.toString();
    status.value = 'error';
  }
}
function getSection(sectionName: string): TagsSection | null {
  const sections = tags.value as { [name: string]: TagsSection };
  return sections[sectionName] ? sections[sectionName] : null;
}
const addSpacesToTagNames = (label: string) => label.replace(/([A-Z][a-z])/g, ' $1').trim();
</script>

<template>
  <div style="flex: 0 0 100%">
    <div mx-auto max-w-600px>
      <c-file-upload :title="t('tools.image-exif-reader.texts.title-drag-and-drop-a-image-file-here-or-click-to-select-a-file')" @file-upload="onImageUploaded" />

      <c-card v-if="file" mt-4 flex gap-2>
        <div font-bold>
          {{ file.name }}
        </div>

        <div>
          {{ formatBytes(file.size) }}
        </div>

        <div v-if="tags.Thumbnail">
          <img :src="`data:image/jpeg;base64,${tags.Thumbnail.base64}`" max-w-200px>
        </div>
      </c-card>

      <div v-if="status === 'error'">
        <c-alert mt-4>
          Error parsing image file: {{ errorMessage }}
        </c-alert>
      </div>

      <c-card v-if="quality >= 0" :title="t('tools.image-exif-reader.texts.title-jpeg-quality')" mt-4>
        <input-copyable
          :label="t('tools.image-exif-reader.texts.label-jpeg-quality')"
          label-position="left"
          label-width="150px"
          label-align="right"
          mb-2
          :value="quality"
        />
      </c-card>

      <c-card v-if="status === 'parsed' && openStreetMapUrl" :title="t('tools.image-exif-reader.texts.title-gps-infos')" mt-4>
        <div flex gap-2>
          <c-label :label="t('tools.image-exif-reader.texts.label-latitude')">
            {{ tags.gps?.Latitude?.toFixed(4) }}
          </c-label>
          <c-label :label="t('tools.image-exif-reader.texts.label-longitude')">
            {{ tags.gps?.Longitude?.toFixed(4) }}
          </c-label>
          <c-label :label="t('tools.image-exif-reader.texts.label-altitude')">
            {{ tags.gps?.Altitude?.toFixed(4) }}
          </c-label>
        </div>
        <c-button :href="openStreetMapUrl" target="_blank" mt-4>
          {{ t('tools.image-exif-reader.texts.tag-localize-on-open-street-map') }}
        </c-button>
      </c-card>
      <c-card v-if="status === 'parsed' && !openStreetMapUrl" mt-4>
        {{ t('tools.image-exif-reader.texts.tag-no-gps-information') }}
      </c-card>

      <div v-if="status === 'parsed'">
        <div v-for="section in tagsSections" :key="section.name">
          <c-card v-if="getSection(section.name)" :title="section.title" mt-4>
            <input-copyable
              v-for="({ description }, tagName) in getSection(section.name)"
              :key="tagName"
              :label="addSpacesToTagNames(String(tagName))"
              label-position="left"
              label-width="150px"
              label-align="right"
              mb-2
              disabled="disabled"
              :value="description ?? '<binary>'"
            />
          </c-card>
        </div>
      </div>

      <div v-if="status === 'parsed'" style="flex: 0 0 100%" mt-5 flex flex-col gap-4 />

      <div font-size-3>
        {{ t('tools.image-exif-reader.texts.tag-made-with') }}<a href="https://github.com/mattiasw/ExifReader" target="_blank">{{ t('tools.image-exif-reader.texts.tag-exifreader') }}</a>
      </div>
    </div>
  </div>
</template>
