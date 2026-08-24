<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { CalendarConverter } from './calendar-converter.service';

const { t } = useI18n();

const converter = ref(new CalendarConverter());

const monthOptions = [
  { label: t('tools.calendar-converter.texts.label-january'), value: 1 }, { label: t('tools.calendar-converter.texts.label-february'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-march'), value: 3 }, { label: t('tools.calendar-converter.texts.label-april'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-may'), value: 5 }, { label: t('tools.calendar-converter.texts.label-june'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-july'), value: 7 }, { label: t('tools.calendar-converter.texts.label-august'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-september'), value: 9 }, { label: t('tools.calendar-converter.texts.label-october'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-november'), value: 11 }, { label: t('tools.calendar-converter.texts.label-december'), value: 12 },
];

const hebrewMonths = [
  { label: t('tools.calendar-converter.texts.label-nisan-נִיסָן'), value: 1 },
  { label: t('tools.calendar-converter.texts.label-iyyar-אִיָּר'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-sivan-סִיוָן'), value: 3 },
  { label: t('tools.calendar-converter.texts.label-tammuz-תַּמּוּז'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-av-אָב'), value: 5 },
  { label: t('tools.calendar-converter.texts.label-elul-אֱלוּל'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-tishri-תִּשְׁרֵי'), value: 7 },
  { label: t('tools.calendar-converter.texts.label-heshvan-חֶשְׁוָן'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-kislev-כִּסְלֵו'), value: 9 },
  { label: t('tools.calendar-converter.texts.label-teveth-טֵבֵת'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-shevat-שְׁבָט'), value: 11 },
  { label: t('tools.calendar-converter.texts.label-adar-adar-i-אֲדָר'), value: 12 },
  { label: t('tools.calendar-converter.texts.label-veadar-adar-ii-אֲדָר-שֵׁנִי'), value: 13 },
];

const islamicMonths = [
  { label: t('tools.calendar-converter.texts.label-muharram-مُحَرَّم'), value: 1 },
  { label: t('tools.calendar-converter.texts.label-safar-صَفَر'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-rabiʿ-al-awwal-رَبيع-الأوّل'), value: 3 },
  { label: t('tools.calendar-converter.texts.label-rabiʿ-ath-thani-رَبيع-الثاني'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-jumada-al-ula-جُمادى-الأولى'), value: 5 },
  { label: t('tools.calendar-converter.texts.label-jumada-ath-thania-جُمادى-الآخرة'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-rajab-رَجَب'), value: 7 },
  { label: t('tools.calendar-converter.texts.label-shaʿban-شَعْبان'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-ramadan-رَمَضان'), value: 9 },
  { label: t('tools.calendar-converter.texts.label-shawwal-شَوّال'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-dhu-al-qaʿda-ذو-القَعْدة'), value: 11 },
  { label: t('tools.calendar-converter.texts.label-dhu-al-hijja-ذو-الحِجّة'), value: 12 },
];

const persianMonths = [
  { label: t('tools.calendar-converter.texts.label-farvardin-فروردین'), value: 1 },
  { label: t('tools.calendar-converter.texts.label-ordibehesht-اردیبهشت'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-khordad-خرداد'), value: 3 },
  { label: t('tools.calendar-converter.texts.label-tir-تیر'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-mordad-مرداد'), value: 5 },
  { label: t('tools.calendar-converter.texts.label-shahrivar-شهریور'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-mehr-مهر'), value: 7 },
  { label: t('tools.calendar-converter.texts.label-aban-آبان'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-azar-آذر'), value: 9 },
  { label: t('tools.calendar-converter.texts.label-dey-دی'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-bahman-بهمن'), value: 11 },
  { label: t('tools.calendar-converter.texts.label-esfand-اسفند'), value: 12 },
];

const indianMonths = [
  { label: t('tools.calendar-converter.texts.label-caitra-चैत्र'), value: 1 },
  { label: t('tools.calendar-converter.texts.label-vaisakha-वैशाख'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-jyaistha-ज्येष्ठ'), value: 3 },
  { label: t('tools.calendar-converter.texts.label-asadha-आषाढ़'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-sravana-श्रावण'), value: 5 },
  { label: t('tools.calendar-converter.texts.label-bhadra-भाद्रपद'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-asvina-आश्विन'), value: 7 },
  { label: t('tools.calendar-converter.texts.label-kartika-कार्तिक'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-agrahayana-अग्रहायण'), value: 9 },
  { label: t('tools.calendar-converter.texts.label-pausa-पौष'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-magha-माघ'), value: 11 },
  { label: t('tools.calendar-converter.texts.label-phalguna-फाल्गुन'), value: 12 },
];

const frenchMonths = [
  { label: t('tools.calendar-converter.texts.label-vendémiaire'), value: 1 }, { label: t('tools.calendar-converter.texts.label-brumaire'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-frimaire'), value: 3 }, { label: t('tools.calendar-converter.texts.label-nivôse'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-pluviôse'), value: 5 }, { label: t('tools.calendar-converter.texts.label-ventôse'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-germinal'), value: 7 }, { label: t('tools.calendar-converter.texts.label-floréal'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-prairial'), value: 9 }, { label: t('tools.calendar-converter.texts.label-messidor'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-thermidor'), value: 11 }, { label: t('tools.calendar-converter.texts.label-fructidor'), value: 12 },
  { label: t('tools.calendar-converter.texts.label-sans-culottides'), value: 13 },
];

const frenchDecades = [
  { label: t('tools.calendar-converter.texts.label-i'), value: 1 },
  { label: t('tools.calendar-converter.texts.label-ii'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-iii'), value: 3 },
];

const frenchDays = [
  { label: t('tools.calendar-converter.texts.label-primidi-1'), value: 1 }, { label: t('tools.calendar-converter.texts.label-duodi-2'), value: 2 },
  { label: t('tools.calendar-converter.texts.label-tridi-3'), value: 3 }, { label: t('tools.calendar-converter.texts.label-quartidi-4'), value: 4 },
  { label: t('tools.calendar-converter.texts.label-quintidi-5'), value: 5 }, { label: t('tools.calendar-converter.texts.label-sextidi-6'), value: 6 },
  { label: t('tools.calendar-converter.texts.label-septidi-7'), value: 7 }, { label: t('tools.calendar-converter.texts.label-octidi-8'), value: 8 },
  { label: t('tools.calendar-converter.texts.label-nonidi-9'), value: 9 }, { label: t('tools.calendar-converter.texts.label-décadi-10'), value: 10 },
  { label: t('tools.calendar-converter.texts.label-vertu-1'), value: 12 }, { label: t('tools.calendar-converter.texts.label-génie-2'), value: 13 },
  { label: t('tools.calendar-converter.texts.label-travail-3'), value: 14 }, { label: t('tools.calendar-converter.texts.label-opinion-4'), value: 15 },
  { label: t('tools.calendar-converter.texts.label-récompenses-5'), value: 16 }, { label: t('tools.calendar-converter.texts.label-révolution-6'), value: 17 },
];
</script>

<template>
  <div>
    <n-p>
      {{ t('tools.calendar-converter.texts.tag-this-is-a-port-of-wonderful') }}<c-link target="_blank" href="https://www.fourmilab.ch/documents/calendar">
        {{ t('tools.calendar-converter.texts.tag-fourmilab-ch-calendar-converter') }}
      </c-link>{{ t('tools.calendar-converter.texts.tag-by-john-walker') }}
    </n-p>
    <n-tabs type="line" animated>
      <!-- Gregorian -->
      <n-tab-pane name="gregorian" :tab="t('tools.calendar-converter.texts.tab-gregorian')">
        <n-form :model="converter.document.gregorian" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.gregorian.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.gregorian.month" :options="monthOptions" style="width: 160px; " mr-1 />
            <n-input-number v-model:value="converter.document.gregorian.year" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <input-copyable v-model:value="converter.document.gregorian.leap" readonly />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-time')">
            <n-input-number v-model:value="converter.document.gregorian.hour" style="width: 90px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.gregorian.min" style="width: 90px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.gregorian.sec" style="width: 90px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <input-copyable v-model:value="converter.document.gregorian.wday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" mr-1 @click="() => converter.calcGregorian()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
            <n-button @click="() => { converter.setDateToToday(); converter.updateFromGregorian(); }">
              {{ t('tools.calendar-converter.texts.tag-today') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Julian Day -->
      <n-tab-pane name="julian-day" :tab="t('tools.calendar-converter.texts.tab-julian-day')">
        <n-form :model="converter.document.julianday" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-julian-day')">
            <n-input-number-i18n v-model:value="converter.document.julianday.day" />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcJulian()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Modified Julian Day -->
      <n-tab-pane name="modified-julian" :tab="t('tools.calendar-converter.texts.tab-modified-julian')">
        <n-form :model="converter.document.modifiedjulianday" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-modified-julian-day')">
            <n-input-number-i18n v-model:value="converter.document.modifiedjulianday.day" />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcModifiedJulian()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Julian Calendar -->
      <n-tab-pane name="julian-calendar" :tab="t('tools.calendar-converter.texts.tab-julian-calendar')">
        <n-form :model="converter.document.juliancalendar" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.juliancalendar.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.juliancalendar.month" :options="monthOptions" style="width: 160px; " mr-1 />
            <n-input-number v-model:value="converter.document.juliancalendar.year" style="width: 100px" />
          </n-form-item>
          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <input-copyable v-model:value="converter.document.juliancalendar.leap" readonly />
          </n-form-item>
          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <input-copyable v-model:value="converter.document.juliancalendar.wday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcJulianCalendar()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Gregorian Serial -->
      <n-tab-pane name="greg-serial" :tab="t('tools.calendar-converter.texts.tab-gregorian-serial')">
        <n-form :model="converter.document.gregserial" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-gregorian-serial-day')">
            <n-input-number-i18n v-model:value="converter.document.gregserial.day" />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcGregSerial()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Hebrew -->
      <n-tab-pane name="hebrew" :tab="t('tools.calendar-converter.texts.tab-hebrew')">
        <n-form :model="converter.document.hebrew" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.hebrew.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.hebrew.month" :options="hebrewMonths" style="width: 220px; " mr-1 />
            <n-input-number v-model:value="converter.document.hebrew.year" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <n-input v-model:value="converter.document.hebrew.leap" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcHebrew()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Islamic -->
      <n-tab-pane name="islamic" :tab="t('tools.calendar-converter.texts.tab-islamic')">
        <n-form :model="converter.document.islamic" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.islamic.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.islamic.month" :options="islamicMonths" style="width: 250px; " mr-1 />
            <n-input-number v-model:value="converter.document.islamic.year" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <n-input v-model:value="converter.document.islamic.leap" readonly />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <n-input v-model:value="converter.document.islamic.wday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcIslamic()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Persian -->
      <n-tab-pane name="persian" :tab="t('tools.calendar-converter.texts.tab-persian')">
        <n-form :model="converter.document.persian" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.persian.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.persian.month" :options="persianMonths" style="width: 220px; " mr-1 />
            <n-input-number v-model:value="converter.document.persian.year" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <n-input v-model:value="converter.document.persian.leap" readonly />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <n-input v-model:value="converter.document.persian.wday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcPersian()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Persian Algorithmic -->
      <n-tab-pane name="persian-algo" :tab="t('tools.calendar-converter.texts.tab-persian-algorithmic')">
        <n-form :model="converter.document.persiana" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.persiana.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.persiana.month" :options="persianMonths" style="width: 220px; " mr-1 />
            <n-input-number v-model:value="converter.document.persiana.year" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <input-copyable v-model:value="converter.document.persiana.leap" readonly />
          </n-form-item>
          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <input-copyable v-model:value="converter.document.persiana.wday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcPersiana()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Mayan -->
      <n-tab-pane name="mayan" :tab="t('tools.calendar-converter.texts.tab-mayan')">
        <n-form :model="converter.document.mayancount" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-long-count')">
            <n-input-number v-model:value="converter.document.mayancount.baktun" style="width: 100px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.mayancount.katun" style="width: 100px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.mayancount.tun" style="width: 100px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.mayancount.uinal" style="width: 100px" />
            <span>{{ t('tools.calendar-converter.texts.tag-xa0-xa0') }}</span>
            <n-input-number v-model:value="converter.document.mayancount.kin" style="width: 100px" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-haab')">
            <input-copyable v-model:value="converter.document.mayancount.haab" readonly />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-tzolkin')">
            <input-copyable v-model:value="converter.document.mayancount.tzolkin" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcMayanCount()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Indian Civil -->
      <n-tab-pane name="indian" :tab="t('tools.calendar-converter.texts.tab-indian-civil')">
        <n-form :model="converter.document.indiancivilcalendar" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-date')">
            <n-input-number v-model:value="converter.document.indiancivilcalendar.day" style="width: 90px" mr-1 />
            <n-select v-model:value="converter.document.indiancivilcalendar.month" :options="indianMonths" style="width: 220px;" mr-1 />
            <n-input-number v-model:value="converter.document.indiancivilcalendar.year" style="width: 100px" />
          </n-form-item>
          <n-form-item :label="t('tools.calendar-converter.texts.label-leap')">
            <input-copyable v-model:value="converter.document.indiancivilcalendar.leap" readonly />
          </n-form-item>
          <n-form-item :label="t('tools.calendar-converter.texts.label-weekday')">
            <input-copyable v-model:value="converter.document.indiancivilcalendar.weekday" readonly />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcIndianCivilCalendar()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- French Republican -->
      <n-tab-pane name="french" :tab="t('tools.calendar-converter.texts.tab-french-republican')">
        <n-form :model="converter.document.french" label-placement="left" label-width="100px">
          <n-form-item :label="t('tools.calendar-converter.texts.label-day')">
            <n-select v-model:value="converter.document.french.jour" :options="frenchDays" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-month')">
            <n-select v-model:value="converter.document.french.mois" :options="frenchMonths" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-décade')">
            <n-select v-model:value="converter.document.french.decade" :options="frenchDecades" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-year')">
            <n-input-number v-model:value="converter.document.french.an" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcFrench()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- ISO -->
      <n-tab-pane name="iso" :tab="t('tools.calendar-converter.texts.tab-iso-8601')">
        <n-form :model="converter.document.isoweek" label-placement="left" label-width="100px">
          <n-form-item :label="t('tools.calendar-converter.texts.label-day-of-week')">
            <n-input-number v-model:value="converter.document.isoweek.day" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-week')">
            <n-input-number v-model:value="converter.document.isoweek.week" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-year')">
            <n-input-number v-model:value="converter.document.isoweek.year" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcIsoWeek()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>

        <n-divider />

        <n-form :model="converter.document.isoday" label-placement="left" label-width="100px">
          <n-form-item :label="t('tools.calendar-converter.texts.label-day-of-year')">
            <n-input-number v-model:value="converter.document.isoday.day" />
          </n-form-item>

          <n-form-item :label="t('tools.calendar-converter.texts.label-year')">
            <n-input-number v-model:value="converter.document.isoday.year" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcIsoDay()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Unix -->
      <n-tab-pane name="unix" :tab="t('tools.calendar-converter.texts.tab-unix-time')">
        <n-form :model="converter.document.unixtime" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-unix-time')">
            <n-input-number v-model:value="converter.document.unixtime.time" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcUnixTime()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Excel 1900 -->
      <n-tab-pane name="excel1900" :tab="t('tools.calendar-converter.texts.tab-excel-1900-windows')">
        <n-form :model="converter.document.excelserial1900" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-excel-serial-day-1900')">
            <n-input-number v-model:value="converter.document.excelserial1900.day" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcExcelSerial1900()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <!-- Excel 1904 -->
      <n-tab-pane name="excel1904" :tab="t('tools.calendar-converter.texts.tab-excel-1904-macintosh')">
        <n-form :model="converter.document.excelserial1904" label-placement="left">
          <n-form-item :label="t('tools.calendar-converter.texts.label-excel-serial-day-1904')">
            <n-input-number v-model:value="converter.document.excelserial1904.day" />
          </n-form-item>

          <n-space justify="center">
            <n-button type="primary" @click="() => converter.calcExcelSerial1904()">
              {{ t('tools.calendar-converter.texts.tag-update-other-calendars') }}
            </n-button>
          </n-space>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
