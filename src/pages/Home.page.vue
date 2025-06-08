<script setup lang="ts">
import { IconDragDrop, IconFileDescription, IconHeart } from '@tabler/icons-vue';
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

useHead({ title: 'IT Tools - Handy online tools for developers' });
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}

// Batch loading logic for tool cards
const TOOLS_PER_ROW = 4; // Based on xl:grid-cols-4
const ROWS_PER_BATCH = 8;
const TOOLS_PER_BATCH = TOOLS_PER_ROW * ROWS_PER_BATCH; // 32 tools per batch

const visibleToolsCount = ref(TOOLS_PER_BATCH); // Start with first batch
let loadingInterval: NodeJS.Timeout | null = null;

// Computed property for visible tools
const visibleTools = computed(() => {
  return toolStore.tools.slice(0, visibleToolsCount.value);
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

  // Start loading batches every 150ms
  loadingInterval = setInterval(() => {
    if (visibleToolsCount.value < toolStore.tools.length) {
      visibleToolsCount.value = Math.min(
        visibleToolsCount.value + TOOLS_PER_BATCH,
        toolStore.tools.length,
      );
    }
    else {
      // Stop loading when all tools are visible
      stopAutomatedLoading();
    }
  }, 150);
}

// Start automated loading on component mount
onMounted(() => {
  nextTick(() => {
    startAutomatedLoading();
  });
});

// Clean up on component unmount
onUnmounted(() => {
  stopAutomatedLoading();
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

        <a href="https://renderize.tech?utm_source=it-tools&utm_medium=banner" target="_blank" rel="noopener" class="text-current decoration-none">
          <c-card v-if="config.showSponsorBanner" class="cursor-pointer !border-2px !hover:border-primary">
            <div class="flex items-center justify-between">
              <n-icon :component="IconFileDescription" class="text-neutral-400 dark:text-neutral-600" size="40" />
              <div class="rounded-full bg-#eeeeee px-10px py-2px text-xs text-black dark:bg-#333333 dark:text-white">
                Sponsor
              </div>
            </div>

            <div class="my-5px flex items-baseline gap-4 text-balance text-lg text-black dark:text-white">
              Generate PDFs from HTML with Renderize API
            </div>
            <div class="text-neutral-500 dark:text-neutral-400">
              Automate your document generation with our fast, developer-friendly API. Start with a free forever plan.
            </div>
          </c-card>
        </a>
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
            :delay="250"
            @end="onUpdateFavoriteTools"
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
      <div v-if="visibleToolsCount < toolStore.tools.length" mt-6 text-center>
        <div text-14px op-70>
          Loading more tools... ({{ visibleTools.length }}/{{ toolStore.tools.length }})
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
