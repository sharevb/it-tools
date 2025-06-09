<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';

// Centralized wheel configuration - edit these values to change wheel size
const WHEEL_CONFIG = {
  size: 550, // Overall wheel size
  outerRadius: 275, // Outer edge of segments
  innerRadius: 95, // Inner edge of segments (center hole)
  textRadius: 185, // Where text is positioned
  centerSize: 190, // Size of center circle
  mobileSize: 375, // Wheel size on mobile
} as const;

const WHEEL_CENTER = WHEEL_CONFIG.size / 2;

interface WheelOption {
  id: string
  text: string
  color: string
  bgColor: string
}

// Generate random offset once on initialization to vary starting colors
const colorOffset = Math.random() * 360;

function generateUniqueColor(index: number) {
  // Use HSL for better color distribution with random offset
  const hue = (index * 137.508 + colorOffset) % 360; // Golden angle + random offset
  const saturation = 65 + (index % 3) * 10; // Vary saturation slightly
  const lightness = 45 + (index % 4) * 8; // Vary lightness for distinction

  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Calculate if we need white or black text based on luminance
  const color = getContrastColor(hue, saturation, lightness);

  return { bgColor, color };
}

function getContrastColor(hue: number, saturation: number, lightness: number): string {
  // Convert HSL to RGB to calculate luminance
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  // Compact RGB calculation using array indexing
  const hueSegment = Math.floor(h * 6);
  const rgbValues = [
    [c, x, 0], // 0-60°
    [x, c, 0], // 60-120°
    [0, c, x], // 120-180°
    [0, x, c], // 180-240°
    [x, 0, c], // 240-300°
    [c, 0, x], // 300-360°
  ];

  const [r, g, b] = rgbValues[hueSegment].map(val => (val + m) * 255);

  // Calculate relative luminance and return appropriate contrast color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.6 ? '#ffffff' : '#000000';
}

const spinDuration = useQueryParamOrStorage({
  name: 'duration',
  storageName: 'fortune-wheel:dur',
  defaultValue: 3,
});

const savedOptions = useQueryParamOrStorage({
  name: 'options',
  storageName: 'fortune-wheel:options',
  defaultValue: '[]',
});

const wheelOptions = ref<WheelOption[]>([]);
const newOptionText = ref('');
const isSpinning = ref(false);
const wheelRotation = ref(0);
const result = ref<WheelOption | null>(null);
const lastResultIndex = ref<number | null>(null); // Track last result

// Load saved options
watchEffect(() => {
  try {
    const parsed = JSON.parse(savedOptions.value);
    wheelOptions.value = parsed.map((text: string, index: number) => ({
      id: `option-${index}`,
      text,
      ...generateUniqueColor(index),
    }));
  }
  catch {
    wheelOptions.value = [];
  }
});

// Save options when changed
watchEffect(() => {
  savedOptions.value = JSON.stringify(wheelOptions.value.map(opt => opt.text));
});

const segmentAngle = computed(() =>
  wheelOptions.value.length > 0 ? 360 / wheelOptions.value.length : 0,
);

function addOption() {
  if (!newOptionText.value.trim()) {
    return;
  }

  const newOption: WheelOption = {
    id: `option-${Date.now()}`,
    text: newOptionText.value.trim(),
    ...generateUniqueColor(wheelOptions.value.length),
  };

  wheelOptions.value.push(newOption);
  newOptionText.value = '';
}

function removeOption(id: string) {
  const index = wheelOptions.value.findIndex(opt => opt.id === id);
  if (index > -1) {
    wheelOptions.value.splice(index, 1);
    // Reassign colors after removal
    wheelOptions.value.forEach((opt, i) => {
      Object.assign(opt, generateUniqueColor(i));
    });
  }
}

function removeAllOptions() {
  wheelOptions.value = [];
}

function moveOption(fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= wheelOptions.value.length) {
    return;
  }

  const item = wheelOptions.value.splice(fromIndex, 1)[0];
  wheelOptions.value.splice(toIndex, 0, item);

  // Reassign colors after reordering
  wheelOptions.value.forEach((opt, i) => {
    Object.assign(opt, generateUniqueColor(i));
  });
}

function spinWheel() {
  if (isSpinning.value || wheelOptions.value.length === 0) {
    return;
  }

  isSpinning.value = true;
  result.value = null;

  // Calculate rotations based on duration to maintain consistent speed
  const baseRotationsPerSecond = 3;
  const calculatedRotations = Math.max(3, Math.floor(spinDuration.value * baseRotationsPerSecond));
  const extraRotations = Math.floor(Math.random() * 4);
  const fullRotations = calculatedRotations + extraRotations;

  // Improved randomness: weighted selection to avoid recent results
  let targetSegment: number;

  if (wheelOptions.value.length > 1) {
    // Create weights array - all segments start with equal weight
    const weights = Array.from({ length: wheelOptions.value.length }).fill(1) as number[];

    // Reduce weights for recently selected segments
    const recentResults = JSON.parse(localStorage.getItem('fortune-wheel:recent-results') || '[]');

    // Apply penalties to recent results (stronger penalty for more recent)
    recentResults.forEach((recentIndex: number, arrayIndex: number) => {
      if (recentIndex >= 0 && recentIndex < weights.length) {
        // More recent results get heavier penalties
        const penalty = arrayIndex === 0 ? 0.1 : (arrayIndex === 1 ? 0.3 : 0.6);
        weights[recentIndex] *= penalty;
      }
    });

    // Weighted random selection
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    targetSegment = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        targetSegment = i;
        break;
      }
    }

    // Update recent results history (keep last 3)
    const updatedRecent = [targetSegment, ...recentResults.slice(0, 2)];
    localStorage.setItem('fortune-wheel:recent-results', JSON.stringify(updatedRecent));
  }
  else {
    targetSegment = 0;
  }

  // Add randomness within the target segment (not always center)
  const segmentStart = targetSegment * segmentAngle.value;
  const randomWithinSegment = segmentStart + Math.random() * segmentAngle.value;

  // Calculate final rotation to land in the target segment
  const targetAngle = 360 - randomWithinSegment;
  const finalRotation = wheelRotation.value + fullRotations * 360 + targetAngle;

  wheelRotation.value = finalRotation;

  setTimeout(() => {
    isSpinning.value = false;

    // Calculate which segment the pointer is actually pointing to
    const normalizedRotation = finalRotation % 360;
    const pointerAngle = (360 - normalizedRotation) % 360;
    const segmentIndex = Math.floor(pointerAngle / segmentAngle.value) % wheelOptions.value.length;

    result.value = wheelOptions.value[segmentIndex];
    lastResultIndex.value = segmentIndex; // Keep for compatibility
  }, spinDuration.value * 1000);
}

function getSegmentPath(index: number) {
  const angle = segmentAngle.value;
  const outerRadius = WHEEL_CONFIG.outerRadius;
  const innerRadius = WHEEL_CONFIG.innerRadius;
  const centerX = WHEEL_CENTER;
  const centerY = WHEEL_CENTER;

  // Special case for single option (360 degree segment)
  if (wheelOptions.value.length === 1) {
    // Create a donut shape using two circles
    return `M ${centerX - outerRadius} ${centerY} 
            A ${outerRadius} ${outerRadius} 0 1 1 ${centerX + outerRadius} ${centerY}
            A ${outerRadius} ${outerRadius} 0 1 1 ${centerX - outerRadius} ${centerY} Z
            M ${centerX - innerRadius} ${centerY}
            A ${innerRadius} ${innerRadius} 0 1 0 ${centerX + innerRadius} ${centerY}
            A ${innerRadius} ${innerRadius} 0 1 0 ${centerX - innerRadius} ${centerY} Z`;
  }
  const startAngle = (index * angle - 90) * Math.PI / 180;
  const endAngle = ((index + 1) * angle - 90) * Math.PI / 180;

  const x1 = centerX + outerRadius * Math.cos(startAngle);
  const y1 = centerY + outerRadius * Math.sin(startAngle);
  const x2 = centerX + outerRadius * Math.cos(endAngle);
  const y2 = centerY + outerRadius * Math.sin(endAngle);

  const x3 = centerX + innerRadius * Math.cos(endAngle);
  const y3 = centerY + innerRadius * Math.sin(endAngle);
  const x4 = centerX + innerRadius * Math.cos(startAngle);
  const y4 = centerY + innerRadius * Math.sin(startAngle);

  const largeArcFlag = angle > 180 ? 1 : 0;

  return `M ${x4} ${y4} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
}

function getTextPosition(index: number) {
  const angle = segmentAngle.value;
  const radius = WHEEL_CONFIG.textRadius;
  const centerX = WHEEL_CENTER;
  const centerY = WHEEL_CENTER;

  const textAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
  // Round coordinates to whole numbers for sharp text rendering
  const x = Math.round(centerX + radius * Math.cos(textAngle));
  const y = Math.round(centerY + radius * Math.sin(textAngle));

  return { x, y, rotation: index * angle + angle / 2 + 90 };
}
</script>

<template>
  <div class="fortune-wheel-container">
    <!-- Controls -->
    <div class="wheel-controls">
      <n-form-item label="Spin Duration (seconds):" label-placement="left" my--5>
        <n-input-number v-model:value="spinDuration" :min="0" :max="10" />
      </n-form-item>

      <n-divider />

      <!-- Add new option -->
      <div class="add-option-section">
        <h3>Add New Option</h3>
        <div class="add-option-form">
          <c-input-text
            v-model:value="newOptionText"
            placeholder="Enter wheel option"
            @keyup.enter="addOption"
          />
          <c-button :disabled="!newOptionText.trim()" @click="addOption">
            Add Option
          </c-button>
          <c-button class="clear-all-button" @click="removeAllOptions">
            Clear All Options
          </c-button>
        </div>
      </div>

      <!-- Options list -->
      <div class="options-section">
        <h3>Wheel Options ({{ wheelOptions.length }})</h3>
        <div v-if="wheelOptions.length === 0" class="empty-state">
          No options added yet. Add some options to start spinning!
        </div>
        <div v-else class="options-list">
          <div
            v-for="(option, index) in wheelOptions"
            :key="option.id"
            class="option-item"
            :style="{ borderLeftColor: option.bgColor }"
          >
            <div class="option-content">
              <span class="option-text">{{ option.text }}</span>
              <div class="option-actions">
                <c-button
                  size="small"
                  :disabled="index === 0"
                  title="Move up"
                  @click="moveOption(index, index - 1)"
                >
                  ↑
                </c-button>
                <c-button
                  size="small"
                  :disabled="index === wheelOptions.length - 1"
                  title="Move down"
                  @click="moveOption(index, index + 1)"
                >
                  ↓
                </c-button>
                <c-button
                  size="small"
                  title="Remove"
                  @click="removeOption(option.id)"
                >
                  ✕
                </c-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <n-divider />

    <!-- Wheel -->
    <div class="wheel-section">
      <div class="wheel-container">
        <svg
          class="wheel"
          :class="{ spinning: isSpinning }"
          :style="{
            transform: `rotate(${wheelRotation}deg)`,
            transitionDuration: isSpinning ? `${spinDuration}s` : '0s',
          }"
          :width="WHEEL_CONFIG.size"
          :height="WHEEL_CONFIG.size"
          :viewBox="`0 0 ${WHEEL_CONFIG.size} ${WHEEL_CONFIG.size}`"
        >
          <g>
            <path
              v-for="(option, index) in wheelOptions"
              :key="option.id"
              :d="getSegmentPath(index)"
              :fill="option.bgColor"
              stroke="rgba(255,255,255,0.3)"
              stroke-width="2"
            />

            <text
              v-for="(option, index) in wheelOptions"
              :key="`text-${option.id}`"
              :x="getTextPosition(index).x"
              :y="getTextPosition(index).y"
              :fill="option.color"
              :transform="`rotate(${getTextPosition(index).rotation}, ${getTextPosition(index).x}, ${getTextPosition(index).y})`"
              text-anchor="middle"
              dominant-baseline="middle"
              class="segment-text"
            >
              {{ option.text.length > 20 ? `${option.text.slice(0, 20)}...` : option.text }}
            </text>

          </g>
        </svg>

        <!-- Center circle with result display -->
        <div
          class="wheel-center"
          :style="{ backgroundColor: result?.bgColor }"
        >
          <div v-if="result" class="center-result">
            <div
              class="result-text"
              :style="{
                color: result?.color || '#ffffff',
              }"
            >
              {{ result.text }}
            </div>
          </div>
          <div v-else class="center-placeholder">
            <div class="placeholder-text">
              {{ isSpinning ? 'Spinning...' : 'Spin to Win!' }}
            </div>
          </div>
        </div>
        <div class="wheel-pointer" />
      </div>

      <div class="spin-controls">
        <c-button
          :disabled="isSpinning || wheelOptions.length === 0"
          size="large"
          @click="spinWheel"
        >
          {{ isSpinning ? 'Spinning...' : 'Spin the Wheel!' }}
        </c-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fortune-wheel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.wheel-controls {
  margin-bottom: 20px;
}

.add-option-section h3,
.options-section h3 {
  margin: 16px 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.add-option-form {
  display: flex;
  gap: 10px;
  align-items: end;
  margin-bottom: 20px;
}

.add-option-form .c-input-text {
  flex: 1;
}

.options-list {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 280px);
  gap: 0;
}

.empty-state {
  text-align: center;
  color: var(--text-color-secondary);
  padding: 40px 20px;
  font-style: italic;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border-color);
  border-left: 4px solid;
  border-right: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.option-item:hover {
  background-color: var(--hover-color);
}

.option-item:last-child {
  border-bottom: none;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-text {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  padding-left: 2px;
}

.option-actions {
  display: flex;
  gap: 2px;
}

.option-actions .c-button {
  padding: 2px 6px;
  font-size: 12px;
}

.wheel-section {
  text-align: center;
}

.wheel-container {
  position: relative;
  display: inline-block;
  margin: 20px;
  /* Force pixel-aligned positioning */
  transform: translateZ(0);
}

.wheel {
  width: v-bind('`${WHEEL_CONFIG.size}px`');
  height: v-bind('`${WHEEL_CONFIG.size}px`');
  border-radius: 50%;
  border: 4px solid #333;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  /* Additional sharpness improvements */
  transform-style: flat;
  backface-visibility: hidden;
  /* Ensure the SVG is positioned on pixel boundaries */
  transform: translateZ(0);
}

.wheel.spinning {
  transition-property: transform;
}

.segment-text {
  font-weight: 700;
  font-size: 14px;
  pointer-events: none;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Force crisp edges */
  shape-rendering: crispEdges;
}

.wheel-center {
  position: absolute;
  top: 49.5%;
  left: 50%;
  width: v-bind('`${WHEEL_CONFIG.centerSize}px`');
  height: v-bind('`${WHEEL_CONFIG.centerSize}px`');
  border-radius: 50%;
  background: #414141;
  border: 4px solid #333;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #333;
  transform: translateX(-50%);
  z-index: 5;
}

.spin-controls {
  margin: 20px 0;
}

.center-result {
  text-align: center;
  padding: 8px;
}

.result-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.result-text {
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
  word-wrap: break-word;
  max-width: 100px;
}

.center-placeholder {
  text-align: center;
  padding: 8px;
}

.placeholder-text {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  line-height: 1.2;
}

.clear-all-button {
  background-color: #b31a29 !important;
  color: white !important;
  border-color: #b31a29 !important;
}

.clear-all-button:hover {
  background-color: #c82333 !important;
  border-color: #bd2130 !important;
}

@media (max-width: 768px) {
  .add-option-form {
    flex-direction: column;
  }

  .wheel {
    width: v-bind('`${WHEEL_CONFIG.mobileSize}px`');
    height: v-bind('`${WHEEL_CONFIG.mobileSize}px`');
  }

  .segment-text {
    font-size: 12px;
  }
}
</style>
