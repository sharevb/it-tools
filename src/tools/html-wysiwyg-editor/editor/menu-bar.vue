<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import {
  ArrowBack,
  ArrowForwardUp,
  Blockquote,
  Bold,
  ClearFormatting,
  Code,
  CodePlus,
  ColorPicker,
  ColumnInsertLeft,
  ColumnInsertRight,
  Cross,
  H1,
  H2,
  H3,
  H4,
  Heading,
  Italic,
  LayersIntersect2,
  LayersUnion,
  LayoutDistributeHorizontal,
  LayoutDistributeVertical,
  List,
  ListNumbers,
  RowInsertBottom,
  RowInsertTop,
  SeparatorVertical, Strikethrough, Table, TableOff, TextWrap, Tool,
} from '@vicons/tabler';
import type { Component } from 'vue';
import MenuBarItem from './menu-bar-item.vue';

const props = defineProps<{ editor: Editor }>();
const { editor } = toRefs(props);

const { t } = useI18n();

type MenuItem =
  | {
    icon: Component
    title: string
    action: () => void
    value?: () => string
    isActive?: () => boolean
    enabled?: () => boolean
    type: 'button'
  }
  | {
    icon: Component
    title: string
    action: (color: string) => void
    value: () => string
    type: 'color'
  }
  | { type: 'divider' };

const items: MenuItem[] = [
  {
    type: 'button',
    icon: Bold,
    title: t('tools.__i18n_ally_root__.unicode-formatter.texts.title-bold'),
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value.isActive('bold'),
  },
  {
    type: 'button',
    icon: Italic,
    title: t('tools.__i18n_ally_root__.unicode-formatter.texts.title-italic'),
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value.isActive('italic'),
  },
  {
    type: 'button',
    icon: Strikethrough,
    title: t('tools.menu-bar.text.strike'),
    action: () => editor.value.chain().focus().toggleStrike().run(),
    isActive: () => editor.value.isActive('strike'),
  },
  {
    type: 'button',
    icon: Code,
    title: t('tools.menu-bar.text.inline-code'),
    action: () => editor.value.chain().focus().toggleCode().run(),
    isActive: () => editor.value.isActive('code'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: H1,
    title: t('tools.menu-bar.text.heading-1'),
    action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 1 }),
  },
  {
    type: 'button',
    icon: H2,
    title: t('tools.menu-bar.text.heading-2'),
    action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 2 }),
  },
  {
    type: 'button',
    icon: H3,
    title: t('tools.menu-bar.text.heading-3'),
    action: () => editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 3 }),
  },
  {
    type: 'button',
    icon: H4,
    title: t('tools.menu-bar.text.heading-4'),
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: List,
    title: t('tools.menu-bar.text.bullet-list'),
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value.isActive('bulletList'),
  },
  {
    type: 'button',
    icon: ListNumbers,
    title: t('tools.menu-bar.text.ordered-list'),
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value.isActive('orderedList'),
  },
  {
    type: 'button',
    icon: CodePlus,
    title: t('tools.menu-bar.text.code-block'),
    action: () => editor.value.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value.isActive('codeBlock'),
  },

  {
    type: 'button',
    icon: Blockquote,
    title: t('tools.menu-bar.text.blockquote'),
    action: () => editor.value.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value.isActive('blockquote'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: TextWrap,
    title: t('tools.menu-bar.text.hard-break'),
    action: () => editor.value.chain().focus().setHardBreak().run(),
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: t('tools.menu-bar.text.clear-format'),
    action: () => editor.value.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    type: 'divider',
  },
  {
    type: 'color',
    title: t('tools.menu-bar.text.forecolor'),
    icon: ColorPicker,
    action: color => editor.value.chain().focus().setColor(color).run(),
    value: () => editor.value.getAttributes('textStyle').color,
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: t('tools.menu-bar.text.clear-forecolor'),
    action: () => editor.value.chain().focus().unsetColor().run(),
  },
  {
    type: 'divider',
  },
  {
    type: 'color',
    title: t('tools.menu-bar.text.highlight-color'),
    icon: ColorPicker,
    action: color => editor.value.chain().focus().setHighlight({ color }).run(),
    value: () => '#FAF594',
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: t('tools.menu-bar.text.clear-highlight'),
    action: () => editor.value.chain().focus().unsetHighlight().run(),
    isActive: () => editor.value.isActive('highlight'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: ArrowBack,
    title: t('tools.menu-bar.text.undo'),
    action: () => editor.value.chain().focus().undo().run(),
  },
  {
    type: 'button',
    icon: ArrowForwardUp,
    title: t('tools.menu-bar.text.redo'),
    action: () => editor.value.chain().focus().redo().run(),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    enabled: () => editor.value.can().insertTable(),
    title: t('tools.menu-bar.text.insert-table'),
    icon: Table,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addColumnBefore().run(),
    enabled: () => editor.value.can().addColumnBefore(),
    title: t('tools.menu-bar.text.add-column-before'),
    icon: ColumnInsertLeft,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addColumnAfter().run(),
    enabled: () => editor.value.can().addColumnAfter(),
    title: t('tools.menu-bar.text.add-column-after'),
    icon: ColumnInsertRight,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteColumn().run(),
    enabled: () => editor.value.can().deleteColumn(),
    title: t('tools.menu-bar.text.delete-column'),
    icon: Cross,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addRowBefore().run(),
    enabled: () => editor.value.can().addRowBefore(),
    title: t('tools.menu-bar.text.add-row-before'),
    icon: RowInsertTop,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addRowAfter().run(),
    enabled: () => editor.value.can().addRowAfter(),
    title: t('tools.menu-bar.text.add-row-after'),
    icon: RowInsertBottom,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteRow().run(),
    enabled: () => editor.value.can().deleteRow(),
    title: t('tools.menu-bar.text.delete-row'),
    icon: Cross,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteTable().run(),
    enabled: () => editor.value.can().deleteTable(),
    title: t('tools.menu-bar.text.delete-table'),
    icon: TableOff,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().mergeCells().run(),
    enabled: () => editor.value.can().mergeCells(),
    title: t('tools.menu-bar.text.merge-cells'),
    icon: LayersUnion,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().splitCell().run(),
    enabled: () => editor.value.can().splitCell(),
    title: t('tools.menu-bar.text.split-cell'),
    icon: SeparatorVertical,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().mergeOrSplit().run(),
    enabled: () => editor.value.can().mergeOrSplit(),
    title: t('tools.menu-bar.text.merge-or-split'),
    icon: LayersIntersect2,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderColumn().run(),
    enabled: () => editor.value.can().toggleHeaderColumn(),
    title: t('tools.menu-bar.text.toggle-header-column'),
    icon: LayoutDistributeVertical,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderRow().run(),
    enabled: () => editor.value.can().toggleHeaderRow(),
    title: t('tools.menu-bar.text.toggle-header-row'),
    icon: LayoutDistributeHorizontal,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderCell().run(),
    enabled: () => editor.value.can().toggleHeaderCell(),
    title: t('tools.menu-bar.text.toggle-header-cell'),
    icon: Heading,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().fixTables().run(),
    enabled: () => editor.value.can().fixTables(),
    title: t('tools.menu-bar.text.fix-tables'),
    icon: Tool,
  },
];
</script>

<template>
  <div flex flex-wrap items-center>
    <template v-for="(item, index) in items">
      <n-divider v-if="item.type === 'divider'" :key="`divider${index}`" vertical />
      <MenuBarItem v-else-if="item.type === 'button'" :key="index" v-bind="item" />
      <c-tooltip
        v-if="item.type === 'color'" :key="`color${index}`"
        :tooltip="item.title"
      >
        <n-color-picker
          style="width: 120px"
          :show-alpha="false"
          :actions="['confirm']"
          :value="item.value()"
          @confirm="item.action"
        />
      </c-tooltip>
    </template>
  </div>
</template>
