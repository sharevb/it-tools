<script setup lang="ts">
import _ from 'lodash';

type FoodEnergyScale = 'kcal' | 'cal' | 'kJ' | 'J';

const units = reactive<
  Record<
    string | FoodEnergyScale,
    { title: string; unit: string; ref: number; toBase: (v: number) => number; fromBase: (v: number) => number }
  >
      >({
        kcal: {
          title: 'Calories (Nutritional, kcal)',
          unit: 'kcal',
          ref: 0,
          toBase: (v: number) => v,
          fromBase: (v: number) => v,
        },
        cal: {
          title: 'Calories (cal)',
          unit: 'cal',
          ref: 0,
          toBase: (v: number) => v / 1000,
          fromBase: (v: number) => v * 1000,
        },
        kJ: {
          title: 'Kilojoules (kJ)',
          unit: 'kJ',
          ref: 0,
          toBase: (v: number) => v / 4.184,
          fromBase: (v: number) => v * 4.184,
        },
        J: {
          title: 'Joules (J)',
          ref: 0,
          unit: 'J',
          toBase: (v: number) => v / 4184,
          fromBase: (v: number) => v * 4184,
        },
      });

function update(key: FoodEnergyScale) {
  const { ref: value, toBase } = units[key];

  let bases = toBase(value) ?? 0;

  bases = bases < 0 ? 0 : bases;

  _.chain(units)
    .omit(key)
    .forEach(({ fromBase }, index) => {
      units[index].ref = fromBase(bases) ?? 0;
    })
    .value();
}

update('kcal');
</script>

<template>
  <div>
    <n-input-group v-for="[key, { title, unit }] in Object.entries(units)" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 180px">
        {{ title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        :min="0"
        @update:value="() => update(key as FoodEnergyScale)"
      />

      <n-input-group-label style="width: 50px">
        {{ unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
