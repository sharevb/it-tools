<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { evaluate } from 'mathjs';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

Chart.register(...registerables, zoomPlugin);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart<'line', number[], number> | null>(null);

// Equation input
const equation = ref('sin(x)');
const xmin = useQueryParamOrStorage({ name: 'xmin', storageName: 'trigo-vw:xmin', defaultValue: -180 });
const xmax = useQueryParamOrStorage({ name: 'xmax', storageName: 'trigo-vw:xmax', defaultValue: 180 });

// Generate data points
function generateData(expr: string) {
  const xValues: number[] = [];
  const yValues: number[] = [];

  for (let i = xmin.value; i <= xmax.value; i += 1) {
    const x = (i * Math.PI) / 180;
    xValues.push(i);
    try {
      const y = evaluate(expr, { x });
      if (typeof y === 'number' && Math.abs(y) < 1e4) {
        yValues.push(y);
      }
      else {
        yValues.push(Number.NaN);
      }
    }
    catch {
      yValues.push(Number.NaN);
    }
  }

  return { xValues, yValues };
}

// Initialize chart
function initChart() {
  if (!canvasRef.value) {
    return;
  }
  const { xValues, yValues } = generateData(equation.value);

  if (chartInstance.value) {
    const chart = chartInstance.value;
    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues;
    chart.update();
  }
  else {
    chartInstance.value = new Chart(canvasRef.value, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [
          {
            label: equation.value,
            data: yValues,
            borderColor: '#42b983',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: t('tools.trigo-viewer.texts.text-degrees') },
          },
          y: {
            title: { display: true, text: t('tools.trigo-viewer.texts.text-value') },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'xy',
            },
            pan: {
              enabled: true,
              mode: 'xy',
            },
          },
        },
      },
    });
  }
}

// Watchers
watch([equation, xmin, xmax], () => {
  initChart();
});

onMounted(() => {
  initChart();
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="equation"
      :placeholder="t('tools.trigo-viewer.texts.placeholder-enter-equation-in-terms-of-x-e-g-sin-x-cos-2-x')"
      :label="t('tools.trigo-viewer.texts.label-equation-in-term-of-x')"
      label-position="left"
      mb-1
    />

    <n-form-item :label="t('tools.trigo-viewer.texts.label-domain')" label-placement="left">
      <NInputNumber
        v-model:value="xmin"
        :min="-720"
        :max="720"
        :step="10"
        mr-1
      />
      <NInputNumber
        v-model:value="xmax"
        :min="-720"
        :max="720"
        :step="10"
        mr-1
      />
    </n-form-item>

    <n-card style="position: relative; height: 50vh;" mb-1>
      <canvas ref="canvasRef" style="width: 100%; height: 100%" />
    </n-card>
    <n-space justify="center">
      <n-button @click="chartInstance?.resetZoom()">
        {{ t('tools.trigo-viewer.texts.tag-reset-zoom') }}
      </n-button>
    </n-space>
  </div>
</template>
