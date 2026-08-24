<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { refAutoReset, useFullscreen, useResizeObserver, watchDebounced } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import mermaid from 'mermaid';
import type { ViewTransform } from './mermaid-exporter.service';
import {
  centerTransform,
  exceedsRefitThreshold,
  fitTransform,
  wheelZoomFactor,
  zoomAround,
} from './mermaid-exporter.service';
import { useStyleStore } from '@/stores/style.store';

const { t } = useI18n();
const themeVars = useThemeVars();
const styleStore = useStyleStore();

const mermaidCode = ref<string>(`graph TD
A[Start] --> B{Is it working?}
B -- Yes --> C[Great!]
B -- No --> D[Fix it!]
`);

const mermaidContainer = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const previewWrapper = ref<HTMLElement | null>(null);

const { isFullscreen, isSupported: isFullscreenSupported, toggle: toggleFullscreen } = useFullscreen(previewWrapper);

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 10;
const ZOOM_STEP = 1.25;
const WHEEL_SENSITIVITY = 0.0015;
// macOS trackpad pinch arrives as a ctrl+wheel event with much smaller deltas
const PINCH_SENSITIVITY = 0.01;
const FIT_PADDING = 20;
const KEYBOARD_PAN_STEP = 40;
const KEYBOARD_PAN_FAST_MULTIPLIER = 4;
// PointerEvent.buttons bit for the primary (left) button
const PRIMARY_BUTTON = 1;
const RENDER_DEBOUNCE_MS = 300;
const HINT_DURATION_MS = 2000;
// how far the rendered diagram must differ from the one the view was fitted to
// before it is re-fitted: a low bar while the view is still the automatic one, a
// much higher one once the user has zoomed in deliberately, so that only a
// wholesale change of diagram pulls them out of the region they are reading
const REFIT_RATIO_FITTED = 0.02;
const REFIT_RATIO_ADJUSTED = 0.5;

const zoom = ref(1);
const pan = reactive({ x: 0, y: 0 });
const contentSize = reactive({ width: 0, height: 0 });
const isDragging = ref(false);
const renderError = ref(false);
// shown for a moment when a plain wheel scroll was let through to the page,
// so that "the wheel does not zoom" does not read as a broken preview
const showWheelHint = refAutoReset(false, HINT_DURATION_MS);

// view and drag state that nothing renders from, so plain variables
let viewIsFitted = true;
let fittedSize = { width: 0, height: 0 };
let lastPointerX = 0;
let lastPointerY = 0;
let activePointerId: number | null = null;
let renderSeq = 0;

const hasDiagram = computed(() => contentSize.width > 0);
const canZoomIn = computed(() => hasDiagram.value && zoom.value < MAX_ZOOM);
const canZoomOut = computed(() => hasDiagram.value && zoom.value > MIN_ZOOM);
const canExport = computed(() => hasDiagram.value && !renderError.value);

const canvasStyle = computed(() => ({
  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom.value})`,
}));

function applyView({ zoom: newZoom, x, y }: ViewTransform): void {
  zoom.value = newZoom;
  pan.x = x;
  pan.y = y;
}

function zoomAt(factor: number, originX: number, originY: number): void {
  applyView(zoomAround({ zoom: zoom.value, ...pan }, factor, originX, originY, MIN_ZOOM, MAX_ZOOM));
  viewIsFitted = false;
}

function zoomAtCenter(factor: number): void {
  const vp = viewport.value;
  if (!vp) {
    return;
  }
  zoomAt(factor, vp.clientWidth / 2, vp.clientHeight / 2);
}

function fitView(): void {
  const vp = viewport.value;
  if (!vp || !contentSize.width || !contentSize.height) {
    return;
  }
  const viewportSize = { width: vp.clientWidth, height: vp.clientHeight };
  applyView(fitTransform(viewportSize, contentSize, FIT_PADDING, MIN_ZOOM, MAX_ZOOM));
  viewIsFitted = true;
  fittedSize = { ...contentSize };
}

function resetZoom(): void {
  const vp = viewport.value;
  if (!vp) {
    return;
  }
  applyView(centerTransform({ width: vp.clientWidth, height: vp.clientHeight }, contentSize, 1));
  viewIsFitted = false;
}

function onWheel(event: WheelEvent): void {
  const vp = viewport.value;
  if (!vp) {
    return;
  }
  // a trackpad pinch reaches us as ctrl+wheel; in fullscreen there is no page
  // left to scroll, so the wheel can own the zoom there
  const isZoomGesture = event.ctrlKey || event.metaKey || isFullscreen.value;
  if (!isZoomGesture) {
    showWheelHint.value = true;
    return;
  }

  event.preventDefault();
  const rect = vp.getBoundingClientRect();
  const sensitivity = event.ctrlKey ? PINCH_SENSITIVITY : WHEEL_SENSITIVITY;
  const factor = wheelZoomFactor(event.deltaY, event.deltaMode, sensitivity);
  zoomAt(factor, event.clientX - rect.left, event.clientY - rect.top);
}

function onPointerDown(event: PointerEvent): void {
  if (event.button !== 0) {
    return;
  }
  // a single pointer pans, extra fingers are ignored — but a new primary press
  // always takes over, so a drag whose pointerup never arrived cannot wedge the
  // canvas into following the cursor forever
  if (activePointerId !== null && event.isPrimary === false) {
    return;
  }
  activePointerId = event.pointerId;
  isDragging.value = true;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent): void {
  if (event.pointerId !== activePointerId) {
    return;
  }
  // a mouse drag whose pointerup never arrived (released outside the window, or
  // interrupted by the OS) reports no button held: stop panning instead of
  // sticking to the cursor
  if (event.pointerType === 'mouse' && event.buttons === 0) {
    onPointerUp(event);
    return;
  }
  pan.x += event.clientX - lastPointerX;
  pan.y += event.clientY - lastPointerY;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  viewIsFitted = false;
}

function onPointerUp(event: PointerEvent): void {
  if (event.pointerId !== activePointerId) {
    return;
  }
  // the pan ends when the primary button is released, not merely when an event
  // arrives: a right-click mid-drag makes Chrome drop the pointer capture, and
  // that must not strand the user holding a button that no longer pans
  const primaryStillHeld = (event.buttons & PRIMARY_BUTTON) === PRIMARY_BUTTON;
  if (primaryStillHeld) {
    return;
  }
  activePointerId = null;
  isDragging.value = false;
}

// the viewport is focusable, so panning and zooming stay available without a
// mouse: the pointer handlers above are the only other way to reach a region
// that the fitted view clips
function onKeydown(event: KeyboardEvent): void {
  const step = event.shiftKey ? KEYBOARD_PAN_STEP * KEYBOARD_PAN_FAST_MULTIPLIER : KEYBOARD_PAN_STEP;
  switch (event.key) {
    case 'ArrowLeft':
      pan.x += step;
      break;
    case 'ArrowRight':
      pan.x -= step;
      break;
    case 'ArrowUp':
      pan.y += step;
      break;
    case 'ArrowDown':
      pan.y -= step;
      break;
    case '+':
    case '=':
      zoomAtCenter(ZOOM_STEP);
      break;
    case '-':
      zoomAtCenter(1 / ZOOM_STEP);
      break;
    case '0':
      resetZoom();
      break;
    case 'f':
      fitView();
      break;
    default:
      return;
  }
  if (event.key.startsWith('Arrow')) {
    viewIsFitted = false;
  }
  event.preventDefault();
}

/**
 * Sizes the freshly injected SVG and re-fits the view if the diagram changed
 * enough to warrant it. Kept out of the mermaid try/catch below so a failure to
 * measure is never reported as a syntax error.
 */
function measureAndFit(svgElement: SVGSVGElement): void {
  svgElement.style.maxWidth = 'none';
  const viewBox = svgElement.viewBox.baseVal;
  const hasViewBox = Boolean(viewBox?.width && viewBox?.height);
  // diagrams without a viewBox (e.g. `info`) may not start at the origin, so
  // the measured box has to become the viewBox or the content gets clipped
  const box = hasViewBox ? viewBox : svgElement.getBBox();
  if (!hasViewBox) {
    svgElement.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
  }
  svgElement.setAttribute('width', String(box.width));
  svgElement.setAttribute('height', String(box.height));

  const rendered = { width: box.width, height: box.height };
  const ratio = viewIsFitted ? REFIT_RATIO_FITTED : REFIT_RATIO_ADJUSTED;
  const shouldRefit = exceedsRefitThreshold(fittedSize, rendered, ratio);
  Object.assign(contentSize, rendered);

  if (shouldRefit) {
    fitView();
  }
}

async function renderMermaid(): Promise<void> {
  const container = mermaidContainer.value;
  if (!container) {
    return;
  }
  // parse and render are async (mermaid lazy-loads diagram chunks): tag each
  // invocation so a stale result cannot overwrite the state of a newer one, and
  // snapshot the code so render cannot receive text that parse never validated
  const seq = ++renderSeq;
  const code = mermaidCode.value;
  try {
    await mermaid.parse(code);
    if (seq !== renderSeq) {
      return;
    }
    const { svg } = await mermaid.render('graphDiv', code);
    if (seq !== renderSeq) {
      return;
    }
    renderError.value = false;
    container.innerHTML = svg;
  }
  catch (error: unknown) {
    if (seq !== renderSeq) {
      return;
    }
    // keep the last-good diagram and the user's zoom/pan: the error is
    // shown as an overlay instead of replacing the rendered SVG
    renderError.value = true;
    console.error('Mermaid error:', error);
    return;
  }

  const svgElement = container.querySelector('svg');
  if (svgElement) {
    measureAndFit(svgElement);
  }
}

/**
 * Mermaid renders with its light palette by default, which would leave a white
 * diagram inside dark chrome.
 */
function initMermaid(isDark: boolean): void {
  mermaid.initialize({
    startOnLoad: false,
    // without this, a diagram that fails to render leaves its error SVG behind
    // in document.body instead of cleaning up before throwing
    suppressErrorRendering: true,
    theme: isDark ? 'dark' : 'default',
  });
}

initMermaid(styleStore.isDarkTheme);

watch(() => styleStore.isDarkTheme, (isDark) => {
  initMermaid(isDark);
  renderMermaid();
});

watchDebounced(mermaidCode, () => renderMermaid(), { debounce: RENDER_DEBOUNCE_MS });

// entering or leaving fullscreen is an explicit "show me the diagram" action,
// so let the resize observer below refit once the new geometry has settled
watch(isFullscreen, () => {
  viewIsFitted = true;
});

// follow the viewport geometry (fullscreen transitions, window resizes) only
// while the view is still the fitted one the tool chose by itself
useResizeObserver(viewport, () => {
  if (viewIsFitted) {
    fitView();
  }
});

onMounted(renderMermaid);

function fixSvgSize(svg: string): string {
  const match = svg.match(/viewBox="([\d\s.-]+)"/);
  if (!match) {
    return svg;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [minX, minY, width, height] = match[1].split(/\s+/).map(Number);

  svg = svg.replace(/width="[^"]*"/, `width="${width}"`);
  svg = svg.replace(/height="[^"]*"/, `height="${height}"`);

  if (!/width="/.test(svg)) {
    svg = svg.replace('<svg', `<svg width="${width}"`);
  }
  if (!/height="/.test(svg)) {
    svg = svg.replace('<svg', `<svg height="${height}"`);
  }

  return svg;
}

function exportAs(format: 'svg' | 'png' | 'jpg'): void {
  const container = mermaidContainer.value;
  // the preview keeps the last valid diagram on a syntax error: exporting it
  // would hand back a file that does not match the code on screen
  if (!container || !canExport.value) {
    return;
  }

  const svgElement = container.querySelector('svg');
  if (!svgElement) {
    return;
  }

  let svgData = new XMLSerializer().serializeToString(svgElement);

  if (!svgData.includes('xmlns=')) {
    svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  svgData = fixSvgSize(svgData);

  if (format === 'svg') {
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const reader = new FileReader();
  const scaleFactor = 3;

  reader.onloadend = () => {
    const base64data = reader.result as string;
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width * scaleFactor;
      canvas.height = image.height * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
      ctx.drawImage(image, 0, 0);

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const link = document.createElement('a');
      link.download = `diagram.${format}`;
      link.href = canvas.toDataURL(mime);
      link.click();
    };

    image.src = base64data;
  };

  reader.readAsDataURL(blob);
}
</script>

<template>
  <div>
    <div flex flex-col gap-2 md:flex-row>
      <c-card :title="t('tools.mermaid-exporter.texts.title-input-mermaid')" mb-2 flex-1>
        <c-input-text
          v-model:value="mermaidCode"
          class=""
          multiline raw-text
          :placeholder="t('tools.mermaid-exporter.texts.placeholder-write-your-mermaid-code-here')"
          rows="8"
          autofocus
          :label="t('tools.mermaid-exporter.texts.label-your-mermaid-to-convert')"
        />
      </c-card>

      <c-card :title="t('tools.mermaid-exporter.texts.title-preview')" mb-2 flex-1>
        <div ref="previewWrapper" class="preview-wrapper" :class="{ fullscreen: isFullscreen }">
          <div class="toolbar">
            <c-button
              circle variant="text" size="small"
              data-test-id="zoom-out"
              :disabled="!canZoomOut"
              :aria-disabled="!canZoomOut"
              :title="t('tools.mermaid-exporter.texts.title-zoom-out')"
              @click="zoomAtCenter(1 / ZOOM_STEP)"
            >
              <icon-mdi-magnify-minus-outline />
            </c-button>
            <c-button
              variant="text" size="small"
              class="zoom-level"
              data-test-id="zoom-level"
              :disabled="!hasDiagram"
              :aria-disabled="!hasDiagram"
              :title="t('tools.mermaid-exporter.texts.title-reset-zoom')"
              :aria-label="t('tools.mermaid-exporter.texts.label-zoom-level-reset', { zoom: Math.round(zoom * 100) })"
              @click="resetZoom"
            >
              {{ Math.round(zoom * 100) }}%
            </c-button>
            <c-button
              circle variant="text" size="small"
              data-test-id="zoom-in"
              :disabled="!canZoomIn"
              :aria-disabled="!canZoomIn"
              :title="t('tools.mermaid-exporter.texts.title-zoom-in')"
              @click="zoomAtCenter(ZOOM_STEP)"
            >
              <icon-mdi-magnify-plus-outline />
            </c-button>
            <c-button
              circle variant="text" size="small"
              data-test-id="fit-view"
              :disabled="!hasDiagram"
              :aria-disabled="!hasDiagram"
              :title="t('tools.mermaid-exporter.texts.title-fit-view')"
              @click="fitView"
            >
              <icon-mdi-fit-to-screen-outline />
            </c-button>
            <c-button
              v-if="isFullscreenSupported"
              circle variant="text" size="small"
              data-test-id="toggle-fullscreen"
              :title="isFullscreen
                ? t('tools.mermaid-exporter.texts.title-exit-fullscreen')
                : t('tools.mermaid-exporter.texts.title-fullscreen')"
              @click="toggleFullscreen"
            >
              <icon-mdi-fullscreen-exit v-if="isFullscreen" />
              <icon-mdi-fullscreen v-else />
            </c-button>
          </div>
          <div
            ref="viewport"
            class="viewport"
            :class="{ dragging: isDragging }"
            tabindex="0"
            role="group"
            :aria-label="t('tools.mermaid-exporter.texts.label-diagram-preview')"
            @wheel="onWheel"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @lostpointercapture="onPointerUp"
            @keydown="onKeydown"
            @dblclick="fitView"
          >
            <div ref="mermaidContainer" class="canvas" :class="{ stale: renderError }" :style="canvasStyle" />
          </div>
          <div v-if="renderError" class="error-overlay" role="alert">
            <strong>{{ t('tools.mermaid-exporter.texts.tag-invalid-mermaid-syntax') }}</strong>
            <span>{{ t('tools.mermaid-exporter.texts.tag-showing-last-valid-diagram') }}</span>
          </div>
          <div v-else-if="showWheelHint" class="wheel-hint">
            {{ t('tools.mermaid-exporter.texts.tag-hint-ctrl-scroll-to-zoom') }}
          </div>
        </div>
      </c-card>
    </div>
    <div flex justify-center class="buttons">
      <n-button :disabled="!canExport" @click="exportAs('png')">
        {{ t('tools.mermaid-exporter.texts.tag-export-as-png') }}
      </n-button>
      <n-button :disabled="!canExport" @click="exportAs('jpg')">
        {{ t('tools.mermaid-exporter.texts.tag-export-as-jpg') }}
      </n-button>
      <n-button :disabled="!canExport" @click="exportAs('svg')">
        {{ t('tools.mermaid-exporter.texts.tag-export-as-svg') }}
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.preview-wrapper {
  position: relative;
  border: 1px solid v-bind('themeVars.borderColor');
  border-radius: 6px;
  // a recessed surface inside the card, so the floating toolbar and overlays
  // keep their cardColor and read as raised above it
  background-color: v-bind('themeVars.bodyColor');
  margin-bottom: 20px;

  &.fullscreen {
    margin-bottom: 0;
    border: none;
    border-radius: 0;

    .viewport {
      height: 100vh;
      // no page left to scroll: the preview can own every gesture
      touch-action: none;
    }
  }

  .toolbar {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px solid v-bind('themeVars.borderColor');
    background-color: v-bind('themeVars.cardColor');
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);

    .zoom-level {
      min-width: 42px;
      padding: 0 4px;
      opacity: 0.8;
    }
  }

  .error-overlay,
  .wheel-hint {
    position: absolute;
    bottom: 8px;
    left: 8px;
    z-index: 10;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid v-bind('themeVars.borderColor');
    background-color: v-bind('themeVars.cardColor');
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }

  .error-overlay {
    display: flex;
    flex-direction: column;
    color: v-bind('themeVars.errorColor');

    span {
      opacity: 0.75;
      font-size: 12px;
    }
  }

  .wheel-hint {
    font-size: 12px;
    opacity: 0.75;
  }

  .viewport {
    position: relative;
    height: 450px;
    overflow: hidden;
    cursor: grab;
    // a vertical swipe still scrolls the page and pinch still zooms the page:
    // owning every touch gesture would trap the reader on the stacked layout
    touch-action: pan-y pinch-zoom;
    // dragging to pan must not sweep a native text selection across labels
    -webkit-user-select: none;
    user-select: none;

    &:focus-visible {
      outline: 2px solid v-bind('themeVars.primaryColor');
      outline-offset: -2px;
    }

    &.dragging {
      cursor: grabbing;
    }

    // position absolute so the untransformed content size does not blow up
    // the flex layout (CSS transform only affects painting, not layout)
    .canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: max-content;
      transform-origin: 0 0;

      // the diagram on screen no longer matches the code being edited
      &.stale {
        opacity: 0.4;
      }
    }
  }
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
