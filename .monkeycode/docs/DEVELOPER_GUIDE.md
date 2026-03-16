# IT-Tools 开发者指南

## 项目目的

IT-Tools 是一个面向开发者的在线工具集合，提供超过 400 种实用的开发工具。该项目的核心职责是：

**核心职责**:

- 提供高质量、易用的开发者工具
- 支持工具的动态加载和按需加载
- 提供优秀的用户体验和界面设计
- 支持多语言国际化
- 支持主题切换（明暗主题）

**相关系统**:

- Vue 3 生态系统 - 核心框架
- Naive UI - UI 组件库
- Vite - 构建工具

## 环境搭建

### 前置条件

- **Node.js**: >= 18.0.0 (推荐使用 nvm 管理)
- **pnpm**: >= 9.0.0 (项目使用 pnpm 作为包管理器)
- **Git**: 用于版本控制

### 安装

```bash
# 克隆仓库
git clone https://github.com/sharevb/it-tools.git
cd it-tools

# 安装依赖
pnpm install
```

### 运行

```bash
# 开发服务器 (http://localhost:5173)
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# 运行测试
pnpm test

# 运行端到端测试
pnpm test:e2e
```

## 开发工作流

### 代码质量工具

| 工具       | 命令                    | 目的       |
| ---------- | ----------------------- | ---------- |
| TypeScript | `pnpm typecheck`        | 类型检查   |
| ESLint     | `pnpm lint`             | 代码检查   |
| Prettier   | `pnpm prettier --write` | 代码格式化 |
| Vitest     | `pnpm test`             | 单元测试   |
| Playwright | `pnpm test:e2e`         | 端到端测试 |

### 提交前检查

建议在提交前运行以下命令：

```bash
# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 单元测试
pnpm test
```

### 分支策略

- `main` - 主分支，稳定代码
- `feature/*` - 新功能开发
- `fix/*` - Bug 修复
- `chore/*` - 杂项任务

### Pull Request 流程

1. 从 main 创建功能分支
2. 编写代码和测试
3. 运行类型检查和代码检查
4. 创建 PR 并填写描述
5. 处理审查反馈
6. Squash 合并

## 常见任务

### 添加新工具

**需修改的文件**:

1. `src/tools/[tool-name]/index.ts` - 工具定义
2. `src/tools/[tool-name]/[tool-name].vue` - 工具组件
3. `locales/en.yml` - 添加英文翻译

**步骤**:

1. 使用创建工具脚本生成模板：
   ```bash
   pnpm script:create:tool
   ```
2. 在 `index.ts` 中定义工具
3. 实现 Vue 组件
4. 添加国际化文本
5. 编写测试（如需要）

**示例提交**: `feat: add base64-string-converter tool`

### 添加新 UI 组件

**需修改的文件**:

1. `src/ui/[component-name]/index.ts` - 组件定义
2. `src/ui/[component-name]/[component-name].vue` - 组件实现

**步骤**:

1. 使用 UI 组件创建脚本：
   ```bash
   pnpm script:create:ui
   ```
2. 实现组件
3. 编写测试

### 添加国际化文本

**需修改的文件**:

1. `locales/en.yml` - 英文原文
2. `locales/[lang].yml` - 其他语言翻译

**步骤**:

1. 在 `locales/en.yml` 中添加英文键值对
2. 在对应语言文件中添加翻译

**格式**:

```yaml
tools:
  tool-name:
    title: '工具名称'
    description: '工具描述'
```

### 修复 Bug

**流程**:

1. 编写复现 bug 的失败测试
2. 在代码中定位根因
3. 用最小改动修复
4. 验证测试通过
5. 检查其他地方是否有类似问题

**示例提交**: `fix: resolve input validation error in base64 converter`

## 编码规范

### 文件组织

- 每个工具放在 `src/tools/[tool-name]/` 目录
- 每个 UI 组件放在 `src/ui/[component-name]/` 目录
- 组件文件以其目录名称命名

### 命名约定

| 类型 | 约定            | 示例                        |
| ---- | --------------- | --------------------------- |
| 目录 | kebab-case      | `base64-string-converter/`  |
| 组件 | PascalCase      | `Base64StringConverter.vue` |
| 函数 | camelCase       | `useCopy()`, `defineTool()` |
| 常量 | SCREAMING_SNAKE | `MAX_LENGTH`                |

### 工具定义规范

每个工具必须包含以下属性：

```typescript
export const tool = defineTool({
  name: t('tools.tool-name.title'), // 工具名称（支持国际化）
  path: '/tool-name', // 路由路径
  description: t('tools.tool-name.description'), // 工具描述
  keywords: ['keyword1', 'keyword2'], // 搜索关键词
  component: () => import('./ToolName.vue'), // 组件路径
  icon: IconName, // 图标组件
  category: 'CategoryName', // 分类名称
});
```

### 国际化规范

使用 `t()` 函数获取翻译文本：

```typescript
import { translate as t } from '@/plugins/i18n.plugin';

// 在工具定义中
name: t('tools.base64-string-converter.title');

// 在组件模板中
{
  {
    t('tools.base64-string-converter.description');
  }
}
```

### 组件结构

推荐的工具组件结构：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { translate as t } from '@/plugins/i18n.plugin';
import { useCopy } from '@/composable/copy';

const input = ref('');
const output = ref('');
const { copy, copied } = useCopy();

function convert() {
  // 转换逻辑
}
</script>

<template>
  <div class="tool-container">
    <n-input v-model:value="input" type="textarea" />
    <n-button @click="convert">{{ t('convert') }}</n-button>
    <c-text-copyable :value="output" />
  </div>
</template>
```

### 错误处理

```typescript
// 推荐：使用 try-catch 处理异步操作
async function processData() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    // 显示错误提示
  }
}
```

### 测试规范

- 测试文件命名: `[name].test.ts` 与源码同目录
- 使用 Vitest 框架
- 测试组件使用 `@vue/test-utils`

```typescript
import { describe, it, expect } from 'vitest';

describe('useCopy', () => {
  it('should copy text to clipboard', async () => {
    const { copy } = useCopy();
    await copy('test text');
    // 验证复制成功
  });
});
```

## 目录结构详解

### src/tools/

工具模块目录，每个子目录代表一个工具：

```
src/tools/
├── tool.ts                  # defineTool 工具定义函数
├── tools.types.ts           # 工具类型定义
├── index.ts                 # 工具加载和路由生成
├── base64-string-converter/ # 单个工具目录
│   ├── index.ts            # 工具定义
│   └── base64-string-converter.vue  # 工具组件
└── pomodoro-timer/         # 番茄钟应用（子应用）
    ├── app/
    │   ├── store.ts        # 状态管理
    │   └── App.vue         # 应用组件
    └── ...
```

### src/ui/

自定义 UI 组件库：

```
src/ui/
├── c-button/               # 按钮组件
├── c-modal/                # 模态框
├── c-input-text/           # 文本输入
├── c-select/               # 下拉选择
├── c-diff-editor/          # Diff 编辑器
├── c-monaco-editor/        # Monaco 编辑器
└── ...
```

### locales/

国际化文件目录，使用 YAML 格式：

```
locales/
├── en.yml     # 英语（默认）
├── fr.yml     # 法语
├── zh.yml     # 中文
├── de.yml     # 德语
└── ...
```

## 依赖管理

### 添加新的 npm 依赖

```bash
# 生产依赖
pnpm add package-name

# 开发依赖
pnpm add -D package-name
```

### 使用外部库在工具中

在工具的 `index.ts` 中声明依赖：

```typescript
export const tool = defineTool({
  name: 'Tool Name',
  // ...
  npmPackages: ['package-name'],
});
```

## 部署

### Vercel 部署

项目已配置 Vercel 部署，在 `vercel.json` 中定义了路由规则。

### Docker 部署

项目包含 Dockerfile 和 docker-compose.yml：

```bash
docker-compose up -d
```

### Netlify 部署

项目已配置 Netlify 部署 (`netlify.toml`)。

## 常见问题

### Q: 如何添加一个新的工具分类？

A: 在工具定义的 `category` 属性中直接使用新的分类名称，系统会自动创建该分类。

### Q: 如何使用远程工具配置？

A: 在 `public/external-tools.json` 中定义外部工具，系统会自动加载。

### Q: 如何禁用某些工具？

A: 在 `public/tools-filter.json` 中配置过滤规则，或使用 `tools-settings.json` 配置工具设置。
