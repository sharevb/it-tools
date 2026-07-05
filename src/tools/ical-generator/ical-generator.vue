<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import slugify from '@sindresorhus/slugify';
import ical, { ICalCalendarMethod } from 'ical-generator';
import { Base64 } from 'js-base64';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

interface Event {
  startend: [number, number]
  summary?: string
  description?: string
  location?: string
  url?: string
}

const events = ref<Array<Event>>([{
  startend: [Date.now(), Date.now()],
  summary: 'An event',
}]);
function deleteEvent(index: number) {
  if (events.value.length === 1) {
    return;
  }
  events.value.splice(index, 1);
}
function addEvent() {
  const now = Date.now();
  events.value.push({
    startend: [now, now + 3600 * 1000],
    summary: 'An event',
  });
}

const output = computed(() => {
  try {
    const calendar = ical({ name: events.value[0]?.summary || 'unamed' });

    // A method is required for outlook to display event as an invitation
    calendar.method(ICalCalendarMethod.REQUEST);

    for (const event of events.value) {
      calendar.createEvent({
        start: new Date(event.startend[0]).toUTCString(),
        end: new Date(event.startend[0]).toUTCString(),
        summary: event.summary,
        description: event.description,
        location: event.location,
        url: event.url,
      });
    }

    return { ical: calendar.toString() };
  }
  catch (e: any) {
    return { error: e.toString() };
  }
});
const outputBase64 = computed(() => Base64.encode(output.value?.ical || ''));
const customOutputFileName = ref('');
const outputFileName = computed(() => {
  if (customOutputFileName.value) {
    return customOutputFileName.value;
  }

  return slugify(events.value[0]?.summary || 'unamed');
});
const { download } = useDownloadFileFromBase64(
  {
    source: outputBase64,
    filename: outputFileName,
    extension: 'ics',
  });
</script>

<template>
  <div>
    <div mb-2 flex items-baseline gap-2>
      <c-input-text
        v-model:value="outputFileName"
        :placeholder="t('tools.ical-generator.texts.placeholder-generated-if-empty')"
        :label="t('tools.ical-generator.texts.label-output-filename')"
        label-position="left"
        mb-2
      />
      <c-button v-if="output.ical" @click="download">
        {{ t('tools.ical-generator.texts.tag-download-ics') }}
      </c-button>
    </div>

    <c-alert v-if="output.error" mb-2>
      {{ output.error }}
    </c-alert>

    <c-card v-for="(event, index) in events" :key="index" mb-2>
      <n-form-item :label="t('tools.ical-generator.texts.label-title')" label-placement="left">
        <n-input v-model:value="event.summary" :allow-input="(value:string) => !!value" />
      </n-form-item>
      <n-form-item :label="t('tools.ical-generator.texts.label-dates-and-hours')" label-placement="left">
        <n-date-picker v-model:value="event.startend" type="datetimerange" />
      </n-form-item>
      <c-input-text
        v-model:value="event.description"
        :label="t('tools.ical-generator.texts.label-description')"
        :placeholder="t('tools.ical-generator.texts.placeholder-put-a-description-here')"
        multiline
        rows="2"
        mb-2
      />
      <c-input-text
        v-model:value="event.url"
        :label="t('tools.ical-generator.texts.label-url')"
        label-position="left"
        :placeholder="t('tools.ical-generator.texts.placeholder-put-an-url-here')"
        mb-2
      />
      <div flex justify-center>
        <c-button @click="deleteEvent(index)">
          {{ t('tools.ical-generator.texts.tag-delete') }}
        </c-button>
      </div>
    </c-card>
    <div mt-2 flex justify-center>
      <c-button @click="addEvent">
        {{ t('tools.ical-generator.texts.tag-add-event') }}
      </c-button>
    </div>
  </div>
</template>
