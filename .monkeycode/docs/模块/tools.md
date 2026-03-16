# 工具模块

本目录包含 IT-Tools 的所有工具实现。

## 模块职责

工具模块是 IT-Tools 的核心功能单元，提供超过 400 种实用的开发者工具。

## 结构

```
src/tools/
├── tool.ts                    # defineTool 工具定义函数
├── tools.types.ts             # 工具类型定义
├── index.ts                  # 工具加载和路由生成
├── base64-string-converter/   # 工具示例
│   ├── index.ts              # 工具定义
│   └── base64-string-converter.vue  # 工具组件
└── pomodoro-timer/          # 番茄钟应用
    ├── app/
    │   ├── store.ts         # 状态管理
    │   └── App.vue          # 应用组件
    └── index.ts             # 应用入口
```

## 关键文件

| 文件             | 目的               |
| ---------------- | ------------------ |
| `tool.ts`        | 工具定义函数       |
| `tools.types.ts` | 类型定义           |
| `index.ts`       | 动态加载和路由生成 |

## 定义工具

```typescript
// src/tools/tool.ts
import { defineTool } from './tool';

export const tool = defineTool({
  name: 'Tool Name',
  path: '/tool-path',
  description: 'Tool description',
  keywords: ['keyword1', 'keyword2'],
  component: () => import('./ToolName.vue'),
  icon: IconName,
  category: 'CategoryName',
});
```

## 工具组件结构

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { translate as t } from '@/plugins/i18n.plugin';
import { useCopy } from '@/composable/copy';

const input = ref('');
const { copy } = useCopy();
</script>

<template>
  <div class="tool-container">
    <n-input v-model:value="input" />
    <n-button @click="copy(input)">{{ t('copy') }}</n-button>
  </div>
</template>
```

## 依赖

**本模块依赖**:

- `vue` - 框架
- `@vueuse/core` - 组合式工具库
- `@/plugins/i18n.plugin` - 国际化

**依赖本模块的**:

- `src/router.ts` - 路由系统
- `src/pages/` - 页面组件
