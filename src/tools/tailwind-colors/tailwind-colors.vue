<script setup lang="ts">
import { ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { NButton, NIcon, NSelect, useMessage } from 'naive-ui';
import { ArrowsMaximize as IconMdiFullscreen } from '@vicons/tabler';
import { colord } from 'colord';
import { convert } from 'colorizr';
import { informationalSections, tailwindColors } from './tailwind-colors.service';

// Initialize message object
const message = useMessage();

// Define types
interface TailwindColor {
  name: string
  shades: {
    [shade: string]: string
  }
}

// Data
const colors = ref<TailwindColor[]>(tailwindColors);
const selectedFormat = ref<string>('tailwind');
const el = ref<HTMLElement | null>(null);
const formatOptions = [
  { label: 'Tailwind', value: 'tailwind' },
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'HSL', value: 'hsl' },
  { label: 'OKLCH', value: 'oklch' },
];

// Methods
function toggleFullscreen() {
  const { toggle } = useFullscreen(el);
  toggle();
}

function formatColorValue(hex: string) {
  const color = colord(hex);
  switch (selectedFormat.value) {
    case 'hex':
      return hex;
    case 'rgb':
      return color.toRgbString();
    case 'hsl':
      return color.toHslString();
    case 'oklch': {
      // Parse the oklch string and apply specific rounding rules
      const oklchStr = convert(hex, 'oklch');
      // Match the oklch values: oklch(lightness% c hue) - account for optional % sign
      const matches = oklchStr.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
      if (matches) {
        const lightnessValue = Number.parseFloat(matches[1]);
        const chromaValue = Number.parseFloat(matches[2]);
        const hueValue = Number.parseFloat(matches[3]);

        const lightness = `${lightnessValue.toFixed(1)}%`; // Round to 1 decimal and add %
        const chroma = chromaValue.toFixed(3); // Round to 3 decimals
        const hue = hueValue.toFixed(3); // Round to 3 decimals
        return `oklch(${lightness} ${chroma} ${hue})`;
      }
      return oklchStr;
    }
    default:
      return hex;
  }
}

function copyColor(colorValue: string) {
  navigator.clipboard.writeText(colorValue);
  message.success('Color copied to clipboard!');
}
</script>

<template>
  <n-message-provider>
    <div ref="el" class="tailwind-colors">
      <div class="header">
        <h1 class="title" />
        <div class="controls">
          <NSelect
            v-model:value="selectedFormat"
            :options="formatOptions"
            class="format-selector"
            placeholder="Select color format"
          />
          <NButton class="fullscreen-btn" @click="toggleFullscreen">
            <NIcon>
              <IconMdiFullscreen />
            </NIcon>
          </NButton>
        </div>
      </div>

      <div class="colors-container">
        <div
          v-for="color in colors"
          :key="color.name"
          class="color-category"
        >
          <h2 class="category-title">
            {{ color.name }}
          </h2>
          <div class="shades-container">
            <div
              v-for="(hex, shade) in color.shades"
              :key="`${color.name}-${shade}`"
              class="color-swatch"
              :style="{ backgroundColor: hex }"
              @click="copyColor(selectedFormat === 'tailwind' ? `${color.name.toLowerCase()}-${shade}` : formatColorValue(hex))"
            >
              <span class="shade-label text-transparent">{{ String(shade).toUpperCase() }}</span>
              <span class="color-value">{{ selectedFormat === 'tailwind' ? `${color.name.toLowerCase()}-${shade}` : formatColorValue(hex) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="information-section">
        <section
          v-for="section in informationalSections"
          :key="section.title"
          class="info-section"
        >
          <h2>{{ section.title }}</h2>
          <!-- Render paragraph content -->
          <p v-if="section.type === 'paragraph'">
            {{ section.content }}
          </p>

          <!-- Render list content -->
          <ul v-else-if="section.type === 'list'">
            <li v-for="(item, index) in section.content" :key="index">
              {{ item }}
            </li>
          </ul>

          <!-- Render FAQ content -->
          <div v-else-if="section.type === 'faq'" class="faq-container">
            <div
              v-for="(faq, index) in section.content"
              :key="index"
              class="faq-item"
            >
              <h3 v-if="typeof faq !== 'string'">{{ faq.question }}</h3>
              <p v-if="typeof faq !== 'string'">{{ faq.answer }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </n-message-provider>
</template>

<style lang="less" scoped>
.tailwind-colors {
  padding: 20px;
  min-height: 100vh;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;

    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .controls {
      display: flex;
      gap: 10px;
      align-items: center;

      .format-selector {
        width: 150px;
      }

      .fullscreen-btn {
        height: 36px;
      }
    }
  }

  .colors-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 25px;
  }

  .color-category {
    display: flex;
    flex-direction: column;
    .category-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: #444;
    }

    .shades-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 10px;

      .color-swatch {
        flex: 1;
        min-width: 80px;
        height: 80px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 8px;
        cursor: pointer;
        border: 1px solid #ddd;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .shade-label {
          font-size: 12px;
          font-weight: bold;
          // color: rgba(0, 0, 0, 0.7);
          text-align: center;
        }

        .color-value {
          font-size: 11px;
          color: rgba(0, 0, 0, 0.7);
          text-align: center;
          background: rgba(255, 255, 255, 0.7);
          padding: 2px 4px;
          border-radius: 3px;
          margin-top: auto;
        }
      }
    }
  }

  .information-section {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #e0e0e0;

    .info-section {
      margin-bottom: 30px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #444;
        margin: 20px 0 10px 0;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin: 10px 0;
      }

      ul {
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          color: #666;
          line-height: 1.5;
        }
      }

      .faq-item {
        margin-top: 20px;

        h3 {
          color: #222;
        }

        p {
          margin-top: 5px;
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
