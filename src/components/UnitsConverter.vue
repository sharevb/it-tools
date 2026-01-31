<script setup lang="ts">
import _ from 'lodash';
import convert, { type Unit } from 'convert';

const props = withDefaults(defineProps<{
  supportedUnits: { [key: string]: string }
  defaultUnit: string
  labelWidth?: string
  unitMinWidth?: string
}>(), {
  labelWidth: '150px',
  unitMinWidth: '50px',
});
const { supportedUnits, defaultUnit, labelWidth, unitMinWidth } = toRefs(props);

const SI_PREFIX_NAMES = [
  'quetta',
  'ronna',
  'yotta',
  'zetta',
  'exa',
  'peta',
  'tera',
  'giga',
  'mega',
  'kilo',
  'hecto',
  'deca',
  'deci',
  'centi',
  'milli',
  'micro',
  'nano',
  'pico',
  'femto',
  'atto',
  'zepto',
  'yocto',
  'ronto',
  'quecto',
] as const;

const SI_PREFIX_NAMES_REGEX = new RegExp(`^(${SI_PREFIX_NAMES.join('|')})`);

const units = reactive<
  Record<
    string,
    { title: string; unit: string; ref: number }
  >
      >(Object.entries(supportedUnits.value).map(([key, label]) => ({
        title: label,
        unit: key,
        ref: 1,
      })).reduce((prev, current) => ({
        ...prev,
        [current.unit]: current,
      }), {}));

const excludeSIPrefixes = ref(true);
const filteredUnits = computed(() => {
  if (!excludeSIPrefixes.value) {
    return Object.entries(units);
  }

  return Object.entries(units).filter(
    ([_, { title }]) => !SI_PREFIX_NAMES_REGEX.test(title),
  );
});

function update(key: string) {
  if (!units[key]) {
    return;
  }
  const { ref: value } = units[key];

  const converter = convert(value, key as Unit);

  _.chain(units)
    .omit(key)
    .forEach(({ unit }) => {
      try {
        units[unit].ref = converter.to(unit as Unit);
      }
      catch (e: any) {
        units[unit].ref = 0;
      }
    })
    .value();
}

update(defaultUnit.value);
</script>

<template>
  <div>
    <n-space justify="center" mb-3>
      <n-checkbox v-model:checked="excludeSIPrefixes">
        {{ $t('tools.UnitsConverter.texts.exclude-si-prefixes') }}
      </n-checkbox>
      <c-link target="_blank" to="/si-prefixes-converter">
        {{ $t('tools.UnitsConverter.text.si-converter') }}
      </c-link>
    </n-space>
    <n-input-group v-for="[key, { title, unit }] in filteredUnits" :key="key" mb-3 w-full>
      <n-input-group-label :style="{ width: labelWidth }">
        {{ title }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        @update:value="() => update(key)"
      />

      <n-input-group-label :style="{ minWidth: unitMinWidth }">
        {{ unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
