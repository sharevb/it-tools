# UI 组件库

本目录包含 IT-Tools 自定义的 Vue 3 组件库。

## 模块职责

提供统一的 UI 组件层，基于 Naive UI 构建。

## 结构

```
src/ui/
├── c-alert/                   # 警告提示
├── c-button/                  # 按钮
├── c-buttons-select/          # 按钮组选择器
├── c-card/                    # 卡片
├── c-collapse/                # 折叠面板
├── c-diff-editor/             # Diff 编辑器
├── c-file-upload/             # 文件上传
├── c-input-text/              # 文本输入
├── c-key-value-list/          # 键值对列表
├── c-label/                   # 标签
├── c-link/                    # 链接
├── c-markdown/                # Markdown 渲染
├── c-modal/                   # 模态框
├── c-modal-value/             # 模态数值
├── c-monaco-editor/           # Monaco 编辑器
├── c-select/                  # 下拉选择
├── c-table/                   # 表格
├── c-text-copyable/           # 可复制文本
├── c-tooltip/                 # 提示框
├── color/                     # 颜色系统
├── demo/                      # 演示组件
├── n-input-number-i18n/       # 国际化数字输入
└── theme/                     # 主题系统
```

## 组件类别

### 基础组件

- c-button - 按钮
- c-input-text - 文本输入
- c-select - 选择器
- c-label - 标签
- c-link - 链接

### 容器组件

- c-card - 卡片容器
- c-modal - 模态对话框
- c-collapse - 折叠面板

### 编辑器组件

- c-diff-editor - Diff 对比编辑器
- c-monaco-editor - Monaco 代码编辑器
- c-markdown - Markdown 渲染

### 交互组件

- c-file-upload - 文件上传
- c-text-copyable - 可复制文本
- c-tooltip - 提示信息
- c-buttons-select - 按钮组选择
- c-key-value-list - 键值对列表
- c-table - 表格
- c-alert - 警告提示
- c-modal-value - 模态数值显示

## 使用示例

```vue
<script setup lang="ts">
import CButton from '@/ui/c-button/c-button.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
</script>

<template>
  <div>
    <c-input-text v-model:value="text" />
    <c-button @click="handleClick">确认</c-button>
  </div>
</template>
```

## 依赖

**本模块依赖**:

- `vue` - Vue 3 框架
- `naive-ui` - Naive UI 组件库
- `@vueuse/core` - VueUse 工具库
- `@vueuse/head` - 文档头管理

**依赖本模块的**:

- `src/tools/` - 工具组件
- `src/pages/` - 页面组件
