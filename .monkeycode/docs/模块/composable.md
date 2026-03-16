# 组合式函数

本目录包含 Vue 3 组合式函数 (Composables)。

## 模块职责

提供可复用的状态逻辑和工具函数，增强组件功能。

## 结构

```
src/composable/
├── copy.ts                   # 复制功能
├── flexSearch.ts             # 全文搜索
├── fuzzySearch.ts            # 模糊搜索
├── debouncedref.ts           # 防抖引用
├── validation.ts             # 验证工具
├── downloadBase64.ts         # Base64 下载
├── computed/                 # 计算属性
│   └── computedRefreshable.ts # 可刷新计算属性
└── queryParams.ts           # URL 查询参数
```

## 关键文件

| 文件             | 目的                |
| ---------------- | ------------------- |
| `copy.ts`        | 复制文本到剪贴板    |
| `flexSearch.ts`  | FlexSearch 全文搜索 |
| `fuzzySearch.ts` | Fuse.js 模糊搜索    |
| `validation.ts`  | 表单验证            |

## 使用示例

### useCopy - 复制功能

```typescript
import { useCopy } from '@/composable/copy';

const { copy, copied } = useCopy();
await copy('text to copy');
```

### useFlexSearch - 全文搜索

```typescript
import { useFlexSearch } from '@/composable/flexSearch';

const search = useFlexSearch<Tool>();
search.add('1', { name: 'Tool 1' });
const results = search.search('query');
```

### useFuzzySearch - 模糊搜索

```typescript
import { useFuzzySearch } from '@/composable/fuzzySearch';

const { results } = useFuzzySearch(() => tools.value, ['name', 'description']);
```

## 依赖

**本模块依赖**:

- `vue` - Vue Composition API
- `@vueuse/core` - VueUse 工具库
- `flexsearch` - 全文搜索库
- `fuse.js` - 模糊搜索库

**依赖本模块的**:

- `src/tools/` - 工具组件
- `src/ui/` - UI 组件
