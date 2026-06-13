<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  type ActivityLevel,
  type Gender,
  calculateBMI,
  calculateBMR,
  calculateBodyFat,
  calculateHeartRateZones,
  calculateIdealWeight,
  calculateTDEE,
  cmToInches, inchesToCm, kgToLbs, lbsToKg,
} from '@finegym/fitness-calc';

const { t } = useI18n();

const unitSystem = ref<'metric' | 'us'>('metric');

const gender = ref<Gender>('male');
const age = ref(30);

const heightInput = ref(180);
const weightInput = ref(75);
const neckInput = ref(40);
const waistInput = ref(80);
const hipInput = ref(95);

watch(unitSystem, (newValue) => {
  if (newValue === 'us') {
    heightInput.value = cmToInches(heightInput.value);
    waistInput.value = cmToInches(waistInput.value);
    hipInput.value = cmToInches(hipInput.value);
    neckInput.value = cmToInches(neckInput.value);
    weightInput.value = kgToLbs(weightInput.value);
  }
  else {
    heightInput.value = inchesToCm(heightInput.value);
    waistInput.value = inchesToCm(waistInput.value);
    hipInput.value = inchesToCm(hipInput.value);
    neckInput.value = inchesToCm(neckInput.value);
    weightInput.value = lbsToKg(weightInput.value);
  }
});

const formula = ref<'bmr' | 'tdee' | 'bmi' | 'idealWeight' | 'bodyFatUS' | 'bodyFatBMI' | 'maxHR'>('bmr');

const formulaOptions = [
  { label: t('tools.fitness-computer.texts.label-bmr'), value: 'bmr' },
  { label: t('tools.fitness-computer.texts.label-tdee-calories'), value: 'tdee' },
  { label: t('tools.fitness-computer.texts.label-bmi'), value: 'bmi' },
  { label: t('tools.fitness-computer.texts.label-ideal-weight'), value: 'idealWeight' },
  { label: t('tools.fitness-computer.texts.label-body-fat-us-navy'), value: 'bodyFatUS' },
  { label: t('tools.fitness-computer.texts.label-body-fat-bmi'), value: 'bodyFatBMI' },
  { label: t('tools.fitness-computer.texts.label-max-heart-rate'), value: 'maxHR' },
];

const height = computed(() =>
  unitSystem.value === 'metric' ? heightInput.value : inchesToCm(heightInput.value),
);

const weight = computed(() =>
  unitSystem.value === 'metric' ? weightInput.value : lbsToKg(weightInput.value),
);

const neck = computed(() =>
  unitSystem.value === 'metric' ? neckInput.value : inchesToCm(neckInput.value),
);

const waist = computed(() =>
  unitSystem.value === 'metric' ? waistInput.value : inchesToCm(waistInput.value),
);

const hip = computed(() =>
  unitSystem.value === 'metric' ? hipInput.value : inchesToCm(hipInput.value),
);

const activity = ref<ActivityLevel>('moderate');

const bmr = computed(() =>
  calculateBMR(weight.value, height.value, age.value, gender.value),
);

const tdee = computed(() =>
  calculateTDEE(weight.value, height.value, age.value, gender.value, activity.value),
);

const bmi = computed(() =>
  calculateBMI(weight.value, height.value),
);

const idealWeight = computed(() => {
  const metric = calculateIdealWeight(height.value, gender.value);
  if (unitSystem.value === 'metric') {
    return metric;
  }

  return {
    robinson: cmToInches(metric.robinson),
    miller: cmToInches(metric.miller),
    devine: cmToInches(metric.devine),
    hamwi: cmToInches(metric.hamwi),
    average: cmToInches(metric.average),
  };
},
);

const bodyFatUSNavy = computed(() => {
  const metric = calculateBodyFat(gender.value,
    weight.value,
    {
      waistCm: waist.value,
      neckCm: neck.value,
      heightCm: height.value,
      hipCm: hip.value,
    }, 'us_navy');

  if (unitSystem.value === 'metric') {
    return metric;
  }

  return {
    bodyFatPercentage: metric.bodyFatPercentage,
    fatMass: kgToLbs(metric.fatMass),
    leanMass: kgToLbs(metric.leanMass),
    method: metric.method,
  };
},
);

const bodyFatBMI = computed(() => {
  const metric = calculateBodyFat(gender.value,
    weight.value,
    {
      waistCm: waist.value,
      neckCm: neck.value,
      heightCm: height.value,
      hipCm: hip.value,
    }, 'bmi_derived');

  if (unitSystem.value === 'metric') {
    return metric;
  }

  return {
    bodyFatPercentage: metric.bodyFatPercentage,
    fatMass: kgToLbs(metric.fatMass),
    leanMass: kgToLbs(metric.leanMass),
    method: metric.method,
  };
},
);

const maxHR = computed(() => calculateHeartRateZones(age.value));
</script>

<template>
  <div>
    <n-form label-width="140px" label-placement="left">
      <n-form-item :label="t('tools.fitness-computer.texts.label-units')">
        <n-radio-group v-model:value="unitSystem">
          <n-radio value="metric">
            {{ t('tools.fitness-computer.texts.tag-metric-kg-cm') }}
          </n-radio>
          <n-radio value="us">
            {{ t('tools.fitness-computer.texts.tag-us-lbs-inches') }}
          </n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="t('tools.fitness-computer.texts.label-formula')">
        <n-select v-model:value="formula" :options="formulaOptions" />
      </n-form-item>

      <n-form-item :label="t('tools.fitness-computer.texts.label-gender')">
        <n-radio-group v-model:value="gender">
          <n-radio value="male">
            {{ t('tools.fitness-computer.texts.tag-male') }}
          </n-radio>
          <n-radio value="female">
            {{ t('tools.fitness-computer.texts.tag-female') }}
          </n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="t('tools.fitness-computer.texts.label-age')">
        <n-input-number v-model:value="age" :min="1" />
      </n-form-item>

      <n-form-item :label="unitSystem === 'metric' ? 'Height (cm):' : 'Height (in):'">
        <n-input-number
          v-model:value="heightInput"
          min="0"
        />
      </n-form-item>

      <n-form-item :label="unitSystem === 'metric' ? 'Weight (kg):' : 'Weight (lbs):'">
        <n-input-number
          v-model:value="weightInput"
          min="0"
        />
      </n-form-item>

      <n-card v-if="formula === 'bodyFatUS' || formula === 'bodyFatBMI'" :title="t('tools.fitness-computer.texts.title-body-measurements')" mb-2>
        <n-form-item :label="unitSystem === 'metric' ? 'Neck (cm):' : 'Neck (in):'" label-width="110px">
          <n-input-number
            v-model:value="neckInput"
            min="0"
          />
        </n-form-item>

        <n-form-item :label="unitSystem === 'metric' ? 'Waist (cm):' : 'Waist (in):'" label-width="110px">
          <n-input-number
            v-model:value="waistInput"
            min="0"
          />
        </n-form-item>

        <n-form-item
          v-if="gender === 'female'"
          :label="unitSystem === 'metric' ? 'Hip (cm):' : 'Hip (in):'"
        >
          <n-input-number
            v-model:value="hipInput"
            min="0"
          />
        </n-form-item>
      </n-card>

      <template v-if="formula === 'tdee'">
        <n-form-item :label="t('tools.fitness-computer.texts.label-activity-level')">
          <n-select
            v-model:value="activity"
            :options="[
              { label: t('tools.fitness-computer.texts.label-sedentary-little-or-no-exercise'), value: 'sedentary' },
              { label: t('tools.fitness-computer.texts.label-light-exercise-1-3-times-week'), value: 'light' },
              { label: t('tools.fitness-computer.texts.label-moderate-exercise-4-5-times-week'), value: 'moderate' },
              { label: t('tools.fitness-computer.texts.label-active-daily-exercise-or-intense-exercise-3-4-times-week'), value: 'active' },
              { label: t('tools.fitness-computer.texts.label-very-active-intense-exercise-6-7-times-week'), value: 'very_active' },
              { label: t('tools.fitness-computer.texts.label-extra-active-very-intense-exercise-daily-or-physical-job'), value: 'extra_active' },
            ]"
          />
        </n-form-item>
      </template>
    </n-form>

    <n-card :title="t('tools.fitness-computer.texts.title-results')">
      <template v-if="formula === 'bmr'">
        <input-copyable :value="bmr.bmr" :label="t('tools.fitness-computer.texts.label-bmr-kcal-day')" label-position="left" mb-1 />
      </template>

      <template v-if="formula === 'tdee'">
        <input-copyable :value="tdee.tdee" :label="t('tools.fitness-computer.texts.label-tdee-calories-kcal-day')" label-position="left" mb-1 />
      </template>

      <template v-if="formula === 'bmi'">
        <input-copyable :value="bmi.bmi.toFixed(2)" :label="t('tools.fitness-computer.texts.label-bmi')" label-position="left" label-width="150px" mb-1 />
        <input-copyable :value="bmi.category" :label="t('tools.fitness-computer.texts.label-bmi-category')" label-position="left" label-width="150px" mb-1 />
        <input-copyable :value="bmi.healthyWeightRange.min" :label="t('tools.fitness-computer.texts.label-healthy-range-min')" label-position="left" label-width="150px" mb-1 />
        <input-copyable :value="bmi.healthyWeightRange.max" :label="t('tools.fitness-computer.texts.label-healthy-range-max')" label-position="left" label-width="150px" mb-1 />
      </template>

      <template v-if="formula === 'idealWeight'">
        <input-copyable :value="idealWeight.average.toFixed(1)" :label="t('tools.fitness-computer.texts.label-ideal-weight')" label-position="left" label-width="140px" mb-1 />
        <input-copyable :value="idealWeight.devine.toFixed(1)" :label="t('tools.fitness-computer.texts.label-devine-1974')" label-position="left" label-width="140px" mb-1 />
        <input-copyable :value="idealWeight.hamwi.toFixed(1)" :label="t('tools.fitness-computer.texts.label-hamwi-1964')" label-position="left" label-width="140px" mb-1 />
        <input-copyable :value="idealWeight.miller.toFixed(1)" :label="t('tools.fitness-computer.texts.label-miller-1983')" label-position="left" label-width="140px" mb-1 />
        <input-copyable :value="idealWeight.robinson.toFixed(1)" :label="t('tools.fitness-computer.texts.label-robinson-1983')" label-position="left" label-width="140px" mb-1 />
      </template>

      <template v-if="formula === 'bodyFatUS'">
        <input-copyable :value="bodyFatUSNavy.bodyFatPercentage.toFixed(1)" :label="t('tools.fitness-computer.texts.label-body-fat')" label-position="left" label-width="120px" mb-1 />
        <input-copyable :value="bodyFatUSNavy.fatMass.toFixed(1)" :label="t('tools.fitness-computer.texts.label-fat-mass')" label-position="left" label-width="120px" mb-1 />
        <input-copyable :value="bodyFatUSNavy.leanMass.toFixed(1)" :label="t('tools.fitness-computer.texts.label-lean-mass')" label-position="left" label-width="120px" mb-1 />
      </template>

      <template v-if="formula === 'bodyFatBMI'">
        <input-copyable :value="bodyFatBMI.bodyFatPercentage.toFixed(1)" :label="t('tools.fitness-computer.texts.label-body-fat')" label-position="left" label-width="120px" mb-1 />
        <input-copyable :value="bodyFatBMI.fatMass.toFixed(1)" :label="t('tools.fitness-computer.texts.label-fat-mass')" label-position="left" label-width="120px" mb-1 />
        <input-copyable :value="bodyFatBMI.leanMass.toFixed(1)" :label="t('tools.fitness-computer.texts.label-lean-mass')" label-position="left" label-width="120px" mb-1 />
      </template>

      <template v-if="formula === 'maxHR'">
        <input-copyable :value="maxHR.maxHeartRate" :label="t('tools.fitness-computer.texts.label-max-heart-rate-bpm')" label-position="left" label-width="160px" mb-1 />
        <input-copyable v-for="(zone, index) in maxHR.zones" :key="index" :value="`${zone.min} - ${zone.max}: ${zone.description}`" :label="zone.name" label-position="left" label-width="160px" mb-1 />
      </template>
    </n-card>
  </div>
</template>
