<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IconInfoCircleFilled, IconLock, IconLockOpen2, IconReload } from '@tabler/icons-vue';

// State variables
const imageFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const originalImageUrl = ref<string | null>(null); // To store original image data
const imageWidth = ref(1920); // Default width
const imageHeight = ref(1080); // Default height
const originalImageWidth = ref<number | null>(null); // Store original image width
const originalImageHeight = ref<number | null>(null); // Store original image height
const resizedImageUrl = ref<string | null>(null);
const aspectRatioLocked = ref(false);
const aspectRatio = ref<number | null>(null);
const isUpdatingDimensions = ref(false);
const selectedAspectRatio = ref<string>('custom');
const customAspectRatioWidth = ref<number>(16);
const customAspectRatioHeight = ref<number>(9);
const aspectRatioPriority = ref<'width' | 'height'>('width');

// Predefined aspect ratios
const aspectRatioOptions = [
  { label: 'Custom', value: 'custom' },
  { label: 'Original', value: 'original' },
  { label: '21:9 (Ultrawide)', value: '21:9' },
  { label: '16:9 (Widescreen)', value: '16:9' },
  { label: '4:3 (Standard)', value: '4:3' },
  { label: '3:2 (Photography)', value: '3:2' },
  { label: '1:1 (Square)', value: '1:1' },
  { label: '3:4 (Portrait)', value: '3:4' },
  { label: '9:16 (Portrait)', value: '9:16' },
];

const MAX_CANVAS_DIMENSION = 32767; // Maximum pixels per side
const MAX_CANVAS_AREA = 268435456; // Maximum total pixels (conservative estimate)

const isCanvasTooLarge = computed(() => {
  return imageWidth.value > MAX_CANVAS_DIMENSION
         || imageHeight.value > MAX_CANVAS_DIMENSION
         || (imageWidth.value * imageHeight.value) > MAX_CANVAS_AREA;
});

const isPreviewTooLarge = computed(() => {
  return imageWidth.value > 7680 || imageHeight.value > 7680;
});

// Computed property to check if dimensions are valid for download
const canDownload = computed(() => {
  return (resizedImageUrl.value || (originalImageUrl.value && isPreviewTooLarge.value))
         && imageFile.value
         && imageWidth.value > 0
         && imageHeight.value > 0
         && !isCanvasTooLarge.value;
});

// Computed property to check if reset is available
const canReset = computed(() => {
  return originalImageWidth.value !== null && originalImageHeight.value !== null;
});

// Helper function to calculate Greatest Common Divisor
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Computed property to display aspect ratio
const displayedAspectRatio = computed(() => {
  if (!imageWidth.value || !imageHeight.value || imageWidth.value <= 0 || imageHeight.value <= 0) {
    return '';
  }

  const currentRatio = imageWidth.value / imageHeight.value;
  const tolerance = 0.01; // Allow 1% tolerance for matching standard ratios

  // Standard aspect ratios to check against
  const standardRatios = [
    { ratio: 21 / 9, display: '21:9' },
    { ratio: 16 / 9, display: '16:9' },
    { ratio: 4 / 3, display: '4:3' },
    { ratio: 3 / 2, display: '3:2' },
    { ratio: 1 / 1, display: '1:1' },
    { ratio: 3 / 4, display: '3:4' },
    { ratio: 2 / 3, display: '2:3' },
    { ratio: 9 / 16, display: '9:16' },
  ];

  // Check if current ratio matches any standard ratio within tolerance
  for (const standard of standardRatios) {
    if (Math.abs(currentRatio - standard.ratio) <= tolerance) {
      return standard.display;
    }
  }

  // If no standard ratio matches, calculate simplified ratio using GCD
  const width = Math.round(imageWidth.value);
  const height = Math.round(imageHeight.value);
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;

  return `${simplifiedWidth}:${simplifiedHeight}`;
});

// Function to get aspect ratio value from selection
function getAspectRatioValue(ratioString: string): number | null {
  switch (ratioString) {
    case 'original':
      return originalImageWidth.value && originalImageHeight.value
        ? originalImageWidth.value / originalImageHeight.value
        : null;
    case '16:9':
      return 16 / 9;
    case '4:3':
      return 4 / 3;
    case '1:1':
      return 1;
    case '3:2':
      return 3 / 2;
    case '21:9':
      return 21 / 9;
    case '9:16':
      return 9 / 16;
    case '3:4':
      return 3 / 4;
    case 'custom':
      return customAspectRatioWidth.value && customAspectRatioHeight.value
        ? customAspectRatioWidth.value / customAspectRatioHeight.value
        : null;
    default:
      return null;
  }
}

// Watch for aspect ratio selection changes
watch(selectedAspectRatio, (newRatio) => {
  const newAspectRatioValue = getAspectRatioValue(newRatio);
  if (newAspectRatioValue) {
    aspectRatio.value = newAspectRatioValue;
    if (!aspectRatioLocked.value) {
      aspectRatioLocked.value = true;
    }
    imageHeight.value = Math.round(imageWidth.value / newAspectRatioValue);
  }
});

// Watch for custom aspect ratio changes
watch([customAspectRatioWidth, customAspectRatioHeight], () => {
  if (selectedAspectRatio.value === 'custom' && aspectRatioLocked.value) {
    const newAspectRatioValue = getAspectRatioValue('custom');
    if (newAspectRatioValue) {
      aspectRatio.value = newAspectRatioValue;
      imageHeight.value = Math.round(imageWidth.value / newAspectRatioValue);
    }
  }
});

function toggleAspectRatioLock() {
  aspectRatioLocked.value = !aspectRatioLocked.value;

  if (aspectRatioLocked.value) {
    if (selectedAspectRatio.value !== 'custom') {
      aspectRatio.value = getAspectRatioValue(selectedAspectRatio.value);
    }
    else if (imageWidth.value && imageHeight.value && imageWidth.value > 0 && imageHeight.value > 0) {
      aspectRatio.value = imageWidth.value / imageHeight.value;
      const divisor = gcd(Math.round(imageWidth.value), Math.round(imageHeight.value));
      customAspectRatioWidth.value = Math.round(imageWidth.value) / divisor;
      customAspectRatioHeight.value = Math.round(imageHeight.value) / divisor;
    }
    else {
      // Don't lock if dimensions are invalid
      aspectRatioLocked.value = false;
    }
  }
  else {
    aspectRatio.value = null;
  }
}

function getLockStateIcon() {
  return aspectRatioLocked.value ? IconLock : IconLockOpen2;
}

// Function to apply selected aspect ratio
function applyAspectRatio() {
  const newAspectRatioValue = getAspectRatioValue(selectedAspectRatio.value);
  if (newAspectRatioValue) {
    aspectRatio.value = newAspectRatioValue;
    if (!aspectRatioLocked.value) {
      aspectRatioLocked.value = true;
    }
    imageHeight.value = Math.round(imageWidth.value / newAspectRatioValue);
  }
}

// Function to reset dimensions to original values
function resetToOriginal() {
  if (originalImageWidth.value && originalImageHeight.value) {
    // Temporarily turn off aspect ratio lock to prevent issues during reset
    if (aspectRatioLocked.value) {
      toggleAspectRatioLock();
    }

    imageWidth.value = originalImageWidth.value;
    imageHeight.value = originalImageHeight.value;

    // Update custom aspect ratio to match original image
    const divisor = gcd(originalImageWidth.value, originalImageHeight.value);
    customAspectRatioWidth.value = originalImageWidth.value / divisor;
    customAspectRatioHeight.value = originalImageHeight.value / divisor;
  }
}

// Watch width to trigger resizing
watch(imageWidth, () => {
  if (aspectRatioLocked.value && aspectRatio.value && !isUpdatingDimensions.value && imageWidth.value > 0) {
    isUpdatingDimensions.value = true;
    const newHeight = Math.round(imageWidth.value / aspectRatio.value);
    if (newHeight > 0) {
      imageHeight.value = newHeight;
    }
    isUpdatingDimensions.value = false;
  }
  resizeImage();
});

// Watch height to trigger resizing
watch(imageHeight, () => {
  if (aspectRatioLocked.value && aspectRatio.value && !isUpdatingDimensions.value && imageHeight.value > 0) {
    isUpdatingDimensions.value = true;
    const newWidth = Math.round(imageHeight.value * aspectRatio.value);
    if (newWidth > 0) {
      imageWidth.value = newWidth;
    }
    isUpdatingDimensions.value = false;
  }
  resizeImage();
});

// Handle file upload
async function handleFileUpload(uploadedFile: File) {
  if (!uploadedFile) {
    return;
  }

  imageFile.value = uploadedFile;

  try {
    // Read the file as a Data URL
    const reader = new FileReader();
    const fileDataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(uploadedFile);
    });

    imageUrl.value = fileDataUrl; // Preview image
    originalImageUrl.value = fileDataUrl; // Store original image for resizing
    resizedImageUrl.value = null; // Clear previous resized image

    // Create an image to get original dimensions
    const img = new Image();
    img.src = fileDataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Set original image dimensions
        originalImageWidth.value = img.naturalWidth;
        originalImageHeight.value = img.naturalHeight;

        // Temporarily turn off the aspect ratio lock to prevent issues during setting the new values if it is turned on
        let restoreAspectRatioLock = false;
        if (aspectRatioLocked.value) {
          restoreAspectRatioLock = true;
          toggleAspectRatioLock();
        }

        // Load the current image dimensions into the width and height inputs
        imageWidth.value = img.naturalWidth;
        imageHeight.value = img.naturalHeight;

        // Update custom aspect ratio to match original image
        const divisor = gcd(img.naturalWidth, img.naturalHeight);
        customAspectRatioWidth.value = img.naturalWidth / divisor;
        customAspectRatioHeight.value = img.naturalHeight / divisor;

        // Restore the aspect ratio lock if it was on before
        if (restoreAspectRatioLock) {
          toggleAspectRatioLock();
        }

        // Automatically resize if width and height are set
        if (imageWidth.value > 0 && imageHeight.value > 0) {
          resizeImage();
        }

        resolve();
      };
    });
  }
  catch (error) {
    console.error('Error reading file:', error);
  }
}

async function resizeImage() {
  if (!originalImageUrl.value) {
    return; // Ensure there's an original image to work with
  }

  // Check if canvas would exceed browser limits
  if (isCanvasTooLarge.value) {
    resizedImageUrl.value = null; // Clear preview
    return;
  }

  const img = new Image();
  img.src = originalImageUrl.value; // Use the original image for resizing

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth.value;
    canvas.height = imageHeight.value;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, imageWidth.value, imageHeight.value);
    resizedImageUrl.value = canvas.toDataURL('image/png');
  };
}

// Function to download resized image with validation and correct format conversion
function downloadImage(format: string) {
  // Validate dimensions before download
  if (!imageFile.value || !originalImageUrl.value) {
    console.warn('No image available for download');
    return;
  }

  // Check for invalid dimensions
  if (imageWidth.value <= 0 || imageHeight.value <= 0) {
    console.warn('Invalid dimensions: Width and height must be greater than 0');
    return;
  }

  // Check for canvas size limits
  if (isCanvasTooLarge.value) {
    console.warn('Canvas size exceeds browser limits');
    return;
  }

  // Create a new canvas for the specific format
  const img = new Image();
  img.src = originalImageUrl.value;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth.value;
    canvas.height = imageHeight.value;

    const ctx = canvas.getContext('2d');

    // For JPG format, fill with white background since JPG doesn't support transparency
    if (format === 'jpg' || format === 'jpeg') {
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, imageWidth.value, imageHeight.value);
    }

    ctx?.drawImage(img, 0, 0, imageWidth.value, imageHeight.value);

    // Get the correct MIME type and convert to the requested format
    let mimeType: string;
    const quality = 0.9; // Default quality for lossy formats

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      default:
        mimeType = 'image/png';
        format = 'png';
    }

    // Convert canvas to the specified format
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Create download
    const originalFilename = imageFile.value!.name.replace(/\.[^/.]+$/, ''); // Remove file extension
    const newFilename = `${originalFilename}-${imageWidth.value}x${imageHeight.value}.${format}`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = newFilename;
    link.click();
  };
}
</script>

<template>
  <n-card>
    <div>
      <!-- File input -->
      <c-file-upload
        mb-2
        accept="image/*"
        title="Drag and drop an image file here"
        @file-upload="handleFileUpload"
      />

      <!-- Original image dimensions -->
      <div v-if="originalImageWidth && originalImageHeight" display="flex" direction="row" style="align-items: center;">
        <p style="margin: 0; margin-right: 10px;">
          Original Image Dimensions: {{ originalImageWidth }}x{{ originalImageHeight }}px
        </p>
        <n-button
          v-if="canReset"
          type="tertiary"
          title="Reset to Original Dimensions"
          mt-1
          @click="resetToOriginal"
        >
          <n-icon :component="IconReload" size="16" style="margin-right: 5px;" />
          Reset width and height to image dimensions
        </n-button>
      </div>

      <!-- Compact Width/Height and Aspect Ratio Controls -->
      <div class="compact-controls" style="margin-bottom: 20px; margin-top: 20px;">
        <!-- Left side: Width and Height inputs -->
        <div class="dimensions-section">
          <h4>Dimensions</h4>
          <div class="input-group">
            <label for="widthInput">Width (px):</label>
            <n-input-number
              id="widthInput"
              v-model:value="imageWidth"
              placeholder="Width (px)"
              :min="1"
              :max="MAX_CANVAS_DIMENSION"
            />
          </div>
          <div class="input-group">
            <label for="heightInput">Height (px):</label>
            <n-input-number
              id="heightInput"
              v-model:value="imageHeight"
              placeholder="Height (px)"
              :min="1"
              :max="MAX_CANVAS_DIMENSION"
            />
          </div>

          <!-- Validation warnings -->
          <div v-if="imageWidth <= 0 || imageHeight <= 0" class="validation-warning">
            <p style="color: red; font-size: 12px; margin: 5px 0 0 0;">
              ⚠️ Width and height must be greater than 0
            </p>
          </div>
          <div v-else-if="isCanvasTooLarge" class="validation-warning">
            <p style="color: red; font-size: 12px; margin: 5px 0 0 0;">
              ⚠️ Canvas size exceeds browser limits (max: {{ MAX_CANVAS_DIMENSION.toLocaleString() }}px per side, max area: {{ Math.floor(MAX_CANVAS_AREA / 1000000) }}M pixels)
            </p>
          </div>
        </div>

        <!-- Middle: Current aspect ratio display, lock, and priority options -->
        <div class="aspect-ratio-middle">
          <h4>Aspect Ratio</h4>

          <!-- Current aspect ratio display -->
          <div v-if="displayedAspectRatio" class="current-ratio-display">
            {{ displayedAspectRatio }}
          </div>

          <!-- Lock icon -->
          <div
            class="lock-icon flex cursor-pointer items-center justify-center rounded text-gray-500 transition-colors hover:text-blue-600"
            title="Lock/Unlock Aspect Ratio"
            @click="toggleAspectRatioLock()"
          >
            <n-icon :component="getLockStateIcon()" size="26" />
          </div>

          <!-- Priority radio buttons -->
          <div class="priority-options">
            <n-radio-group v-model:value="aspectRatioPriority" size="small">
              <div class="radio-option">
                <n-radio value="width">
                  Prioritize width
                </n-radio>
              </div>
              <div class="radio-option">
                <n-radio value="height">
                  Prioritize height
                </n-radio>
              </div>
            </n-radio-group>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon :component="IconInfoCircleFilled" size="16" style="color: #666; cursor: help; margin-top: 5px;" />
              </template>
              <span>These settings determine which dimension is prioritized when calculating the new dimensions for the aspect ratio.<br>While any number can be freely entered in the prioritized field, the non-prioritized field is susceptible to the value being autocorrected to comply with the current aspect ratio</span>
            </n-tooltip>
          </div>
        </div>

        <!-- Right side: Aspect Ratio controls -->
        <div class="aspect-ratio-section-compact">
          <h4>Aspect Ratio Presets</h4>

          <!-- Aspect ratio selector -->
          <div class="aspect-ratio-selector-compact">
            <n-select
              id="aspectRatioSelect"
              v-model:value="selectedAspectRatio"
              :options="aspectRatioOptions"
              placeholder="Choose ratio"
              size="small"
              style="width: 160px;"
            />
            <n-button type="primary" size="small" @click="applyAspectRatio">
              Apply
            </n-button>
          </div>

          <!-- Custom aspect ratio inputs -->
          <div v-if="selectedAspectRatio === 'custom'" class="custom-ratio-inputs-compact">
            <div class="custom-ratio-group-compact">
              <n-input-number
                v-model:value="customAspectRatioWidth"
                placeholder="W"
                :min="1"
                size="small"
                style="width: 100px;"
              />
              <span>:</span>
              <n-input-number
                v-model:value="customAspectRatioHeight"
                placeholder="H"
                :min="1"
                size="small"
                style="width: 100px;"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Image preview and download section -->
      <div v-if="originalImageUrl" class="image-container" style="text-align: center; margin-top: 20px;">
        <!-- Show preview when dimensions are within limits -->
        <div v-if="resizedImageUrl && !isPreviewTooLarge" class="image-wrapper">
          <img :src="resizedImageUrl" :alt="`Resized Preview (${imageWidth}px x ${imageHeight}px)`" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }">
          <p>Preview: {{ imageWidth }}x{{ imageHeight }}px</p>
        </div>

        <!-- Show message when preview is too large -->
        <div v-if="isPreviewTooLarge" class="preview-too-large">
          <p style="color: #666; font-style: italic; margin: 20px 0;">
            ⚠️ Preview not shown - dimensions too large ({{ imageWidth }}x{{ imageHeight }}px)
            <br>
            Preview is disabled when width or height exceeds 7,680 pixels for performance reasons.
          </p>
        </div>

        <!-- Download options (always show when image is loaded) -->
        <div v-if="originalImageUrl">
          <h3>Download Options:</h3>
          <div class="download-grid">
            <n-button :disabled="!canDownload" @click.prevent="downloadImage('jpg')">
              Download JPG
            </n-button>
            <n-button :disabled="!canDownload" @click.prevent="downloadImage('png')">
              Download PNG
            </n-button>
            <n-button :disabled="!canDownload" @click.prevent="downloadImage('webp')">
              Download WebP
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.compact-controls {
  display: flex;
  gap: 30px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.dimensions-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dimensions-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group label {
  min-width: 80px;
  font-size: 13px;
  font-weight: 500;
}

.aspect-ratio-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.aspect-ratio-middle h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.current-ratio-display {
  font-weight: 600;
  font-size: 16px;
  color: #1ea54c;
  text-align: center;
}

.lock-icon {
  margin: 5px 0;
}

.priority-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.radio-option {
  font-size: 12px;
}

.aspect-ratio-section-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.aspect-ratio-section-compact h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.aspect-ratio-selector-compact {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-ratio-inputs-compact {
  margin-top: 5px;
}

.custom-ratio-group-compact {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
}

.custom-ratio-group-compact span {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.validation-warning {
  margin-top: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .compact-controls {
    flex-direction: column;
    gap: 20px;
  }
}

.aspect-ratio-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
}

.aspect-ratio-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.aspect-ratio-selector label {
  font-weight: 600;
  min-width: 100px;
}

.custom-ratio-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.custom-ratio-inputs label {
  font-weight: 600;
  text-align: center;
}

.custom-ratio-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.custom-ratio-group span {
  font-weight: bold;
  color: #666;
}

.image-container {
  max-width: 100%;
  overflow: auto;
}

.image-wrapper {
  max-width: 100%;
  max-height: 500px;
  overflow: auto;
}

.preview-too-large {
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin: 20px 0;
}

.download-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
