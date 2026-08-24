<script setup lang="ts">
import {
  getKeyboardLayout,
  getGridColumns,
  getGridRows,
  KeyboardLayoutEnum,
  KeyboardSizeEnum,
} from './keyboard-tester.service';
import type { KeyDefinition, KeyboardLayout, KeyboardSize } from './keyboard-tester.service';

const { t } = useI18n();

const pressedKeys = ref<Set<string>>(new Set());
const testedKeys = ref<Set<string>>(new Set());
const selectedLayout = ref<KeyboardLayout>(KeyboardLayoutEnum.QWERTY);
const selectedSize = ref<KeyboardSize>(KeyboardSizeEnum.TKL);
const keyboardContainer = ref<HTMLElement | null>(null);
const keyboardElement = ref<HTMLElement | null>(null);
const scale = ref(1);
const containerHeight = ref('auto');

// Watch container size changes
const { width: containerWidth } = useElementSize(keyboardContainer);

const keyboardLayout = computed(() => getKeyboardLayout(selectedLayout.value, selectedSize.value));

const gridColumns = computed(() => getGridColumns(selectedSize.value));

const gridRows = computed(() => getGridRows(selectedSize.value));

function updateScale() {
  if (!keyboardElement.value || containerWidth.value === 0) {
    return;
  }

  // Get keyboard original width (before scaling)
  const keyboardOriginalWidth = keyboardElement.value.scrollWidth;

  // Calculate scale ratio
  if (containerWidth.value < keyboardOriginalWidth) {
    scale.value = containerWidth.value / keyboardOriginalWidth;
  } else {
    scale.value = 1;
  }

  // Get keyboard original height
  const keyboardOriginalHeight = keyboardElement.value.scrollHeight;

  // Calculate scaled height
  const scaledHeight = keyboardOriginalHeight * scale.value;
  containerHeight.value = `${scaledHeight}px`;
}

function handleKeyDown(event: KeyboardEvent) {
  event.preventDefault();
  const code = event.code;

  if (code) {
    pressedKeys.value.add(code);
    testedKeys.value.add(code);
  }
}

function handleKeyUp(event: KeyboardEvent) {
  event.preventDefault();
  const code = event.code;

  if (code) {
    pressedKeys.value.delete(code);
  }
}

function resetTest() {
  pressedKeys.value.clear();
  testedKeys.value.clear();
}

function getKeyClass(key: KeyDefinition) {
  const isPressed = pressedKeys.value.has(key.code);
  const isTested = testedKeys.value.has(key.code);

  return {
    'bg-primary text-primary-foreground shadow-lg scale-95': isPressed,
    'bg-green-500/20 border-green-500': !isPressed && isTested,
    'bg-muted hover:bg-muted/80': !isPressed && !isTested,
  };
}

function getKeyStyle(key: KeyDefinition) {
  const width = (key.width || 1) * 3.5;
  const height = key.height || 1;
  const minHeight = height * 3.5; // 3.5rem per height unit
  return {
    width: `${width}rem`,
    minHeight: `${minHeight}rem`,
    gridColumn: `${Math.floor(key.col * 4) + 1} / span ${Math.ceil((key.width || 1) * 4)}`,
    gridRow: `${Math.floor(key.row * 4) + 1} / span ${Math.ceil(height * 4)}`,
  };
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  nextTick(() => {
    updateScale();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

// Watch container width changes
watch(containerWidth, () => {
  nextTick(() => {
    updateScale();
  });
});

// Watch layout and size changes
watch([selectedSize, selectedLayout], () => {
  nextTick(() => {
    updateScale();
  });
});

const layoutOptions = [
  { label: 'QWERTY', value: KeyboardLayoutEnum.QWERTY },
  { label: 'AZERTY', value: KeyboardLayoutEnum.AZERTY },
  { label: 'DVORAK', value: KeyboardLayoutEnum.DVORAK },
  { label: 'COLEMAK', value: KeyboardLayoutEnum.COLEMAK },
];
const sizeOptions = [
  { value: KeyboardSizeEnum.FULL, label: t('tools.keyboard-tester.sizes.full') },
  { value: KeyboardSizeEnum.TKL, label: t('tools.keyboard-tester.sizes.tkl') },
  { value: KeyboardSizeEnum.COMPACT_60, label: t('tools.keyboard-tester.sizes.60') },
];
</script>

<template>
  <NCard data-testid="keyboard-display">
    <!-- Settings and Reset -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <c-select
        v-model:value="selectedLayout"
        :label="t('tools.keyboard-tester.layout')"
        label-position="left"
        :options="layoutOptions"
        mb-2
      />

      <c-select
        v-model:value="selectedSize"
        :label="t('tools.keyboard-tester.size')"
        label-position="left"
        :options="sizeOptions"
        mb-2
      />

      <!-- Reset Button -->
      <div class="space-y-2 flex justify-start items-end md:justify-end">
        <NButton variant="outline" data-testid="reset-button" @click="resetTest">
          {{ t('tools.keyboard-tester.reset') }}
        </NButton>
      </div>
    </div>

    <!-- Keyboard -->
    <div
      ref="keyboardContainer"
      class="w-full flex justify-center transition-all duration-300 overflow-hidden"
      :style="{ height: containerHeight }"
    >
      <div
        ref="keyboardElement"
        class="inline-grid gap-1 p-6 bg-gradient-to-br from-muted/50 to-muted rounded-lg transition-transform duration-300 w-fit h-fit"
        :style="`
            grid-template-columns: repeat(${gridColumns}, 1fr); 
            grid-template-rows: repeat(${gridRows}, 1fr);
            transform: scale(${scale});
            transform-origin: top center;
          `"
      >
        <div
          v-for="key in keyboardLayout"
          :key="key.code"
          :data-testid="`key-${key.code}`"
          :class="getKeyClass(key)"
          :style="getKeyStyle(key)"
          flex
          items-center
          justify-center
          text-xs
          font-medium
          border-current
          border-op-10
          border-solid
          rounded
          transition-all
          duration-150
          cursor-default
          select-none
        >
          {{ key.label }}
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-6 pt-4 border-t">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-muted border rounded" />
        <span class="text-sm text-muted-foreground">{{ t('tools.keyboard-tester.legend.untested') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary text-primary-foreground border rounded flex items-center justify-center text-xs">
          A
        </div>
        <span class="text-sm text-muted-foreground">{{ t('tools.keyboard-tester.legend.pressed') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-green-500/20 border-green-500 border rounded" />
        <span class="text-sm text-muted-foreground">{{ t('tools.keyboard-tester.legend.tested') }}</span>
      </div>
    </div>
  </NCard>
</template>
