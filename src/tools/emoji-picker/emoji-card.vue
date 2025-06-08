<script setup lang="ts">
import type { EmojiInfo } from './emoji.types';
import { getAllCodePoints, isEmojiSupported } from './emoji-utils';
import { useCopy } from '@/composable/copy';

const props = defineProps<{ emojiInfo: EmojiInfo }>();
const { emojiInfo } = toRefs(props);

const { copy } = useCopy();

// Check if emoji is properly supported
const emojiSupported = computed(() => isEmojiSupported(emojiInfo.value.emoji));

// Get complete code point information
const completeCodePoints = computed(() => getAllCodePoints(emojiInfo.value.emoji));

// Check if keywords are truncated
const keywordsEl = ref<HTMLElement>();
const isKeywordsTruncated = computed(() => {
  if (!keywordsEl.value) {
    return false;
  }
  return keywordsEl.value.scrollWidth > keywordsEl.value.clientWidth;
});

// Copy functions with better notifications
async function copyEmoji() {
  await copy(emojiInfo.value.emoji, {
    notificationMessage: `Emoji ${emojiInfo.value.emoji} copied to clipboard`,
  });
}

async function copyCodePoints() {
  await copy(completeCodePoints.value, {
    notificationMessage: `Code points '${completeCodePoints.value}' copied to clipboard`,
  });
}

async function copyUnicode() {
  await copy(emojiInfo.value.unicode, {
    notificationMessage: `Unicode '${emojiInfo.value.unicode}' copied to clipboard`,
  });
}

async function copyName() {
  await copy(emojiInfo.value.title, {
    notificationMessage: `Name '${emojiInfo.value.title}' copied to clipboard`,
  });
}
</script>

<template>
  <c-card
    :class="{ 'emoji-unsupported': !emojiSupported }"
    flex
    items-center
    gap-3
    transition-all
    important:py-8px
    important:pl-10px
    important:pr-5px
    hover:shadow-md
  >
    <!-- Emoji Display -->
    <div
      cursor-pointer
      text-30px
      class="emoji-display"
      :class="{
        'emoji-fallback': !emojiSupported,
        'emoji-supported': emojiSupported,
      }"
      :title="`Click to copy ${emojiInfo.emoji}`"
      @click="copyEmoji"
    >
      {{ emojiInfo.emoji }}
    </div>

    <!-- Emoji Information -->
    <div min-w-0 flex-1>
      <!-- Title (clickable to copy name) -->
      <div
        cursor-pointer
        truncate
        font-bold
        transition
        hover:text-primary
        :title="`Click to copy name: ${emojiInfo.title}`"
        @click="copyName"
      >
        {{ emojiInfo.title }}
      </div>

      <!-- Keywords (if available) -->
      <div
        v-if="emojiInfo.keywords && emojiInfo.keywords.length > 0"
        ref="keywordsEl"
        mb-1
        truncate
        text-xs
        op-60
        :title="isKeywordsTruncated ? emojiInfo.keywords.join(', ') : undefined"
      >
        {{ emojiInfo.keywords.join(', ') }}
      </div>

      <!-- Code Points and Unicode -->
      <div flex flex-col text-xs font-mono op-70>
        <!-- Code Points -->
        <span
          cursor-pointer
          truncate
          px-1
          py-0.25
          transition
          hover:bg-gray-100
          hover:text-primary
          hover:op-100
          dark:hover:bg-gray-800
          :title="`Click to copy: ${completeCodePoints}`"
          @click="copyCodePoints"
        >
          {{ completeCodePoints }}
        </span>

        <!-- Unicode Escape -->
        <span
          cursor-pointer
          truncate
          rounded
          px-1
          py-0.25
          transition
          hover:bg-gray-100
          hover:text-primary
          hover:op-100
          dark:hover:bg-gray-800
          :title="`Click to copy: ${emojiInfo.unicode}`"
          @click="copyUnicode"
        >
          {{ emojiInfo.unicode }}
        </span>
      </div>
    </div>

    <!-- Support indicator -->
    <div v-if="!emojiSupported" text-xs op-50 title="This emoji might not display correctly on your system">
      ⚠️
    </div>
  </c-card>
</template>

<style scoped>
.emoji-display {
  font-family:
    'Noto Color Emoji', /* Best flag and complex emoji support */
    'Apple Color Emoji', /* Apple devices */
    'Segoe UI Emoji', /* Windows */
    'Twemoji Mozilla', /* Firefox fallback */
    'EmojiOne Color', /* Additional fallback */
    sans-serif;
  font-feature-settings: 'liga' off;
  font-variant-emoji: emoji;
  text-rendering: optimizeQuality;
  line-height: 1;
  transition: transform 0.2s ease;
}

.emoji-display:hover {
  transform: scale(1.1);
}

.emoji-supported {
  /* Additional styles for well-supported emojis */
  filter: none;
}

.emoji-fallback {
  /* Styling for potentially unsupported emojis */
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  padding: 2px 4px;
  border: 1px dashed rgba(128, 128, 128, 0.3);
}

.emoji-unsupported {
  opacity: 0.8;
  border-left: 3px solid orange;
}

/* Hover effects for interactive elements */
.emoji-display,
[title*='Click to copy'] {
  user-select: none;
}

/* Better responsive design */
@media (max-width: 640px) {
  .emoji-display {
    font-size: 24px;
  }
}
</style>
