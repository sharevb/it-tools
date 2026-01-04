<script setup lang="ts">
import { IconDragDrop, IconHeart } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import Draggable from 'vuedraggable';
import VueMarkdown from 'vue-markdown-render';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { config } from '@/config';

const base = import.meta.env.BASE_URL ?? '/';
const homeCustomMarkdown = computedAsync(async () => {
  try {
    const remoteCustomHomeMarkdownResponse = await fetch(`${base}home.custom.md`);
    if (remoteCustomHomeMarkdownResponse.ok) {
      return await remoteCustomHomeMarkdownResponse.text();
    }
  }
  catch {}
  return '';
});

const toolStore = useToolStore();
const desc = 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.';
const title = 'IT Tools - Handy online tools for developers';

useHead({
  title,
  meta: [
    {
      itemprop: 'name',
      content: title,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      name: 'description',
      content: desc,
    },
    {
      itemprop: 'description',
      content: desc,
    },
    {
      property: 'og:description',
      content: desc,
    },
    {
      property: 'twitter:description',
      content: desc,
    },
  ],
});
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);

const isOrderingFavorites = ref(false);

window.addEventListener('contextmenu', (e) => {
  if (isOrderingFavorites.value) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }
});

function startOrderingFavorites() {
  isOrderingFavorites.value = true;
}

// Update favorite tools order when drag is finished
function stopOrderingFavorites() {
  isOrderingFavorites.value = false;
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}

// Batch loading logic for tool cards
const TOOLS_PER_ROW = 4; // Based on xl:grid-cols-4
const ROWS_PER_BATCH = 6;
const TOOLS_PER_BATCH = TOOLS_PER_ROW * ROWS_PER_BATCH; // 32 tools per batch

const visibleToolsCount = ref(TOOLS_PER_BATCH); // Start with first batch
let loadingObserver: IntersectionObserver | null = null;

// Computed property for visible tools
const visibleTools = computed(() => {
  return toolStore.tools.slice(0, visibleToolsCount.value);
});

// Function to load next batch
function loadNextBatch() {
  if (visibleToolsCount.value < toolStore.tools.length) {
    visibleToolsCount.value = Math.min(
      visibleToolsCount.value + TOOLS_PER_BATCH,
      toolStore.tools.length,
    );
  }
}

// Start intersection observer on component mount
onMounted(() => {
  nextTick(() => {
    // Load first batch immediately
    loadNextBatch();

    // Setup intersection observer for lazy loading
    const loadingIndicator = document.querySelector('[data-loading-indicator]');
    if (loadingIndicator) {
      loadingObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && visibleToolsCount.value < toolStore.tools.length) {
            loadNextBatch();
          }
        },
        { rootMargin: '200px' },
      );
      loadingObserver.observe(loadingIndicator);
    }
  });
});

// Clean up on component unmount
onUnmounted(() => {
  if (loadingObserver) {
    loadingObserver.disconnect();
    loadingObserver = null;
  }
});
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconHeart">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/sharevb/it-tools"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.githubRepository')"
          >GitHub</a>
          {{ $t('home.follow.thankYou') }}
          <n-icon :component="IconHeart" />
        </ColoredCard>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px font-500 text-neutral-400">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            :delay="100"
            @start="startOrderingFavorites"
            @end="stopOrderingFavorites"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px font-500 text-neutral-400">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <div v-if="homeCustomMarkdown">
        <VueMarkdown :source="homeCustomMarkdown" />
      </div>

      <h3 class="mb-5px mt-25px font-500 text-neutral-400">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in visibleTools" :key="tool.name" :tool="tool" />
      </div>

      <!-- Loading indicator when more tools are coming -->
      <div v-if="visibleToolsCount < toolStore.tools.length" data-loading-indicator mt-6 text-center>
        <div text-14px op-70>
          {{ t('home.loading-more-tools') }} <span>({{ visibleTools.length }}/{{ toolStore.tools.length }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
