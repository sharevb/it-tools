<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import emojiUnicodeData from 'unicode-emoji-json';
import emojiKeywords from 'emojilib';
import _ from 'lodash';
import type { EmojiInfo } from './emoji.types';
import { escapeUnicodeComplete, getAllCodePoints } from './emoji-utils';
import useDebouncedRef from '@/composable/debouncedref';
import { useFlexSearch } from '@/composable/flexSearch';

const { t } = useI18n();

// Enhanced emoji processing functions
const escapeUnicode = ({ emoji }: { emoji: string }) => escapeUnicodeComplete(emoji);

function getEmojiCodePoints({ emoji }: { emoji: string }) {
  // Get all code points for complex emojis (like flags)
  const codePoints: string[] = [];
  for (const char of emoji) {
    const codePoint = char.codePointAt(0);
    if (codePoint) {
      codePoints.push(`0x${codePoint.toString(16)}`);
    }
  }
  return codePoints.length > 0 ? codePoints.join(' ') : undefined;
}

// Function to detect if a string contains emojis
function containsEmoji(text: string): boolean {
  // Check each character in the text against our emoji data
  for (const char of text) {
    if (emojiUnicodeData[char]) {
      return true;
    }
  }
  return false;
}
// Function to convert emojis in text to their unicode representations
function convertEmojisToUnicode(text: string): string {
  let result = text;

  // Process each character/emoji in the string
  for (const char of text) {
    // Check if this character is an emoji by looking it up in our emoji data
    if (emojiUnicodeData[char]) {
      const unicodeString = escapeUnicode({ emoji: char });
      if (unicodeString) {
        // Replace the emoji with its unicode representation
        result = result.replace(char, unicodeString);
      }
    }
  }

  return result;
}

// Process emojis with enhanced code point handling
const emojis = _.map(emojiUnicodeData, (emojiInfo, emoji) => ({
  ...emojiInfo,
  emoji,
  title: _.capitalize(emojiInfo.name),
  keywords: emojiKeywords[emoji as keyof typeof emojiKeywords],
  codePoints: getEmojiCodePoints({ emoji }),
  unicode: escapeUnicode({ emoji }),
  allCodePoints: getAllCodePoints(emoji), // Add complete code point info
}));

// Group emojis and sort groups for better organization
const emojisGroups: { emojiInfos: EmojiInfo[]; group: string }[] = _.chain(emojis)
  .groupBy('group')
  .map((emojiInfos, group) => ({
    group: _.startCase(group), // Better group name formatting
    emojiInfos,
  }))
  .value();

const limit = ref(150);
const rawSearchQuery = ref('');
const searchQuery = useDebouncedRef('', 250);

// Add automated lazy loading for emoji groups
const visibleGroupsCount = ref(1); // Start with 1 group
let loadingInterval: NodeJS.Timeout | null = null;

// Watch for raw search query changes and process emojis
watch(rawSearchQuery, (newQuery) => {
  if (containsEmoji(newQuery)) {
    // Convert emojis to unicode and update the debounced search query
    const unicodeQuery = convertEmojisToUnicode(newQuery);
    searchQuery.value = unicodeQuery;
  }
  else {
    // Regular text search
    searchQuery.value = newQuery;
  }
});

const { searchResult } = useFlexSearch({
  search: searchQuery,
  data: emojis,
  options: {
    keys: ['group', { name: 'name', weight: 3 }, 'keywords', 'unicode', 'codePoints', 'allCodePoints', 'emoji'],
    filterEmpty: false,
  },
  limit,
});

// Computed property for filtered results
const displayedSearchResults = computed(() => {
  return searchResult.value.slice(0, limit.value);
});

// Computed property for visible emoji groups
const visibleEmojisGroups = computed(() => {
  return emojisGroups.slice(0, visibleGroupsCount.value);
});

// Function to stop automated loading
function stopAutomatedLoading() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}

// Function to start automated loading
function startAutomatedLoading() {
  // Clear any existing interval
  if (loadingInterval) {
    clearInterval(loadingInterval);
  }

  // Start loading groups every 150ms
  loadingInterval = setInterval(() => {
    if (visibleGroupsCount.value < emojisGroups.length) {
      visibleGroupsCount.value++;
    }
    else {
      // Stop loading when all groups are visible
      stopAutomatedLoading();
    }
  }, 150);
}

// Watch for search query changes
watch(searchQuery, (newQuery, oldQuery) => {
  if (newQuery.trim()) {
    // Stop automated loading when searching
    stopAutomatedLoading();
  }
  else if (oldQuery && oldQuery.trim()) {
    // Reset and start automated loading when switching from search to browse
    visibleGroupsCount.value = 1;
    nextTick(() => {
      startAutomatedLoading();
    });
  }
});

// Start automated loading on component mount (when not searching)
onMounted(() => {
  if (!searchQuery.value.trim()) {
    startAutomatedLoading();
  }
});

// Clean up on component unmount
onUnmounted(() => {
  stopAutomatedLoading();
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div mx-auto mb-4 max-w-600px flex justify-center gap-3>
      <c-input-text
        v-model:value="rawSearchQuery"
        :placeholder="t('tools.emoji-picker.texts.placeholder-search-emojis-e-g-smile-or-paste-an-emoji-e-g')"
        class="flex-1"
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
      <n-form-item :label="t('tools.emoji-picker.texts.label-max-results')" label-placement="left">
        <n-input-number v-model:value="limit" :min="10" :max="500" :step="10" style="width: 100px" />
      </n-form-item>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery.trim().length > 0">
      <div v-if="displayedSearchResults.length === 0" mt-4 text-center text-20px font-bold op-70>
        <div>{{ t('tools.emoji-picker.texts.tag-no-results-found') }}</div>
        <div mt-2 text-14px font-normal>
          {{ t('tools.emoji-picker.texts.tag-try-searching-for-something-else-like-smile-flag-or') }}
        </div>
      </div>

      <div v-else>
        <div mb-3 mt-4 flex items-center gap-2 text-20px font-bold>
          <span>{{ t('tools.emoji-picker.texts.tag-search-results') }}</span>
          <span text-14px font-normal op-70>{{ $t('tools.emoji-picker.text.displayedsearchresults-length-found', [displayedSearchResults.length]) }}</span>
        </div>

        <emoji-grid :emoji-infos="displayedSearchResults" />
      </div>
    </div>

    <!-- All Emojis by Groups (Auto-loaded) -->
    <div v-else>
      <div v-for="{ group, emojiInfos } in visibleEmojisGroups" :key="group" mb-6>
        <div mb-3 mt-4 flex items-center gap-2 text-20px font-bold>
          <span>{{ group }}</span>
          <span text-14px font-normal op-70>({{ emojiInfos.length }})</span>
        </div>

        <emoji-grid :emoji-infos="emojiInfos" />
      </div>

      <!-- Loading indicator when more groups are coming -->
      <div v-if="visibleGroupsCount < emojisGroups.length" mt-6 text-center>
        <div text-14px op-70>
          <span>{{ $t('tools.emoji-picker.text.loading-more-groups') }}</span> ({{ visibleGroupsCount }}/{{ emojisGroups.length }})
        </div>
      </div>
    </div>
  </div>
</template>
