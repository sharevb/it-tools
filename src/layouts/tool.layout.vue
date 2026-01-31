<script lang="ts" setup>
import { Lock, World } from '@vicons/tabler';

import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import VueMarkdown from 'vue-markdown-render';

import { useThemeVars } from 'naive-ui';
import { useTheme } from '../ui/c-link/c-link.theme';
import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const route = useRoute();

const head = computed<HeadObject>(() => ({
  title: `${route.meta.name} - IT Tools`,
  meta: [
    {
      itemprop: 'name',
      content: `${route.meta.name} - IT Tools`,
    },
    {
      property: 'og:title',
      content: `${route.meta.name} - IT Tools`,
    },
    {
      property: 'twitter:title',
      content: `${route.meta.name} - IT Tools`,
    },
    {
      name: 'description',
      content: route.meta?.description as string,
    },
    {
      itemprop: 'description',
      content: route.meta?.description as string,
    },
    {
      property: 'og:description',
      content: route.meta?.description as string,
    },
    {
      property: 'twitter:description',
      content: route.meta?.description as string,
    },
    {
      name: 'keywords',
      content: ((route.meta.keywords ?? []) as string[]).join(','),
    },
  ],
}));
useHead(head);
const { t } = useI18n();

const i18nKey = computed<string>(() => route.path.trim().replace('/', ''));
const toolTitle = computed<string>(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
const toolDescription = computed<string>(() => t(`tools.${i18nKey.value}.description`, String(route.meta.description)));
const toolFooter = computed<string>(() => {
  const createLink = (linkText: string, url: string) => {
    return `[${linkText.replace('[', '\\[').replace(']', '\\]')}](${url.replace('(', '%28').replace(')', '%29')})`;
  };
  let footer = t(`tools.${i18nKey.value}.footer`, String(route.meta.footer));
  if (footer === 'undefined') {
    footer = '';
  }
  const npmPackages = (route.meta.npmPackages as string[] || [])
    .map(
      packageName => createLink(
        packageName,
        packageName.includes('://') ? packageName : `https://www.npmjs.com/package/${packageName}`),
    );
  return ((npmPackages.length > 0 ? `${t('tools.tool.layout.text.made-with-npmpackages', [npmPackages.join(', ')])}\n` : '') + footer).trim();
});
const themeVars = useThemeVars();

const linkTheme = useTheme();
</script>

<template>
  <BaseLayout>
    <div class="tool-layout">
      <div class="tool-header">
        <div flex flex-nowrap items-center justify-between>
          <n-h1>
            {{ toolTitle }}
            <n-tooltip
              placement="right"
              trigger="click"
              content-class="tool-privacy-info"
            >
              <template #trigger>
                <World
                  v-if="route.meta.externAccessDescription"
                  class="tool-privacy-icon"
                />
                <Lock
                  v-else
                  class="tool-privacy-icon"
                />
              </template>
              <VueMarkdown
                v-if="route.meta.externAccessDescription"
                :source="route.meta.externAccessDescription"
                :options="{ linkify: true }"
              />
              <template v-else>
                Runs entirely in your browser. No external requests.
              </template>
            </n-tooltip>
          </n-h1>

          <div>
            <FavoriteButton :tool="{ name: route.meta.name, path: route.path } as Tool" />
          </div>
        </div>

        <div class="separator" />

        <div class="description">
          {{ toolDescription }}
        </div>
      </div>
    </div>

    <div class="tool-content">
      <Suspense>
        <slot />
      </Suspense>
    </div>

    <div class="tool-footer">
      <VueMarkdown :source="toolFooter" />
    </div>
  </BaseLayout>
</template>

<style lang="less">
.tool-privacy-info {
  p {
    margin:0;
  }
  a {
    color: inherit !important;
    font-style: italic;
  }
}
</style>

<style lang="less" scoped>
.tool-privacy-icon {
  display: inline-block;
  height: .6em;
}
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  overflow-x: auto;

  ::v-deep(& > *) {
    flex: 0 1 1200px;
    min-width:0;
  }
}

.tool-layout {
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    padding: 40px 0;
    width: 100%;

    .n-h1 {
      opacity: 0.9;
      font-size: 40px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);
      opacity: 0.2;

      margin: 10px 0;
    }

    .description {
      margin: 0;

      opacity: 0.7;
    }
  }
}
.tool-footer {
    opacity: 0.7;
    font-size: 12px;
    text-align: center;

    ::v-deep(a) {
      color: v-bind('themeVars.textColor1');
      font-style: italic;
    }
  }
::v-deep(.external-tool) a {
  line-height: inherit;
  font-family: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  color: v-bind('linkTheme.default.textColor');
  border-radius: 4px;
  transition: color cubic-bezier(0.4, 0, 0.2, 1) 0.3s;

  outline-offset: 1px;

  &:hover {
    color: v-bind('linkTheme.default.hover.textColor');
  }

  &:active {
    color: v-bind('linkTheme.default.textColor');
  }

  &:focus {
    color: v-bind('linkTheme.default.outline.color');
  }
}
</style>
