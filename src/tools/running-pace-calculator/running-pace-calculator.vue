<script setup lang="ts">
import * as runPace from 'run-pace';

// Inputs
const length = ref<string>('');
const time = ref<string>('');
const pace = ref<string>('');

// Options
const unit = ref<'km' | 'mile'>('km');
const speed = ref<boolean>(false);

// Output
const result = ref<string>('');
const resultType = ref<string>('');
const error = ref<string>('');

function calculateStuff() {
  result.value = '';
  error.value = '';

  const options: any = {
    length: length.value,
    time: time.value,
    pace: pace.value,
  };

  // Unit selection
  if (unit.value === 'km') {
    options.metric = true;
  }
  if (unit.value === 'mile') {
    options.imperial = true;
  }

  options.speed = speed.value;

  try {
    if (options.time && options.length && options.pace) {
      throw new Error(
        'Only two of "time", "length" and "pace" may be provided at any time',
      );
    }
    else if (options.time && options.pace) {
      if (options.speed) {
        throw new Error('Speed is only valid when (only) pace is given or calculated');
      }
      resultType.value = 'Length';
      result.value = `${runPace.calculateLength(options)}`;
    }
    else if (options.time && options.length) {
      const label = options.speed ? 'Speed' : 'Pace';
      resultType.value = label;
      result.value = `${runPace.calculatePace(options)}`;
    }
    else if (options.pace && options.length) {
      if (options.speed) {
        throw new Error('Speed is only valid when (only) pace is given or calculated');
      }
      resultType.value = 'Time';
      result.value = `${runPace.calculateTime(options)}`;
    }
    else if (options.pace && options.speed) {
      resultType.value = 'Speed';
      result.value = `${runPace.paceToSpeed(options)}`;
    }
    else {
      throw new Error(
        'Two of "time", "length" and "pace" must be provided.\nSpeed is only valid when pace is given or calculated.',
      );
    }
  }
  catch (e: any) {
    error.value = e.message;
  }
}
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="70px">
      <NFormItem label="Length:">
        <NInput v-model:value="length" placeholder="e.g. 10km or 100m" clearable />
      </NFormItem>

      <NFormItem label="Time:">
        <NInput v-model:value="time" placeholder="e.g. 45:00 or 45min or 1h30m..." clearable />
      </NFormItem>

      <NFormItem label="Pace:">
        <NInput v-model:value="pace" placeholder="e.g. 4:30/km" clearable />
      </NFormItem>

      <n-space justify="center">
        <NFormItem label="Unit:">
          <NRadioGroup v-model:value="unit">
            <NRadio value="km">
              km
            </NRadio>
            <NRadio value="mile">
              mile
            </NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="Output speed in instead of pace:" label-width="auto">
          <NSwitch v-model:value="speed" />
        </NFormItem>
      </n-space>
    </NForm>

    <n-space justify="center" mb-2>
      <NButton type="primary" @click="calculateStuff">
        Calculate
      </NButton>
    </n-space>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="result" title="Result">
      <input-copyable :label="`${resultType}:`" label-position="left" :value="result" />
    </c-card>
  </div>
</template>
