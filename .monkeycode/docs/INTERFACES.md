# IT-Tools 接口文档

## 工具系统接口

### 工具定义接口

```typescript
interface Tool {
  name: string; // 工具显示名称
  path: string; // 路由路径（如：'/base64-converter'）
  description: string; // 工具描述
  keywords: string[]; // 搜索关键词数组
  component: () => Promise<Component>; // 异步加载的 Vue 组件
  icon: Component; // 工具图标组件
  redirectFrom?: string[]; // 别名路径数组
  isNew: boolean; // 是否为新工具（自动计算）
  createdAt?: Date; // 工具创建时间
  npmPackages?: string[]; // 依赖的 npm 包列表
  category: string; // 工具分类
}
```

### 外部工具接口

```typescript
interface ExternalTool {
  name: string; // 工具名称
  path: string; // 路由路径
  description?: string; // 工具描述
  keywords?: string[]; // 搜索关键词
  icon?: Component; // 工具图标
  redirectFrom?: string[]; // 重定向路径
  isNew: boolean; // 是否为新工具
  createdAt?: Date; // 创建时间
  category: string; // 工具分类
  markdownContent?: string; // Markdown 内容
  href?: string; // 外部链接
}
```

### 工具分类接口

```typescript
interface ToolCategory {
  name: string; // 分类名称
  components: Tool[]; // 该分类下的工具列表
}
```

### 工具过滤器接口

```typescript
interface ToolsFilter {
  excludeCategoryFilterRegex?: string; // 排除的分类正则
  includeCategoryFilterRegex?: string; // 包含的分类正则
  excludeToolsFilterRegex?: string; // 排除的工具正则
  includeToolsFilterRegex?: string; // 包含的工具正则
}
```

## 组合式函数接口 (Composable APIs)

### useCopy - 复制功能

```typescript
// 文件位置: src/composable/copy.ts

function useCopy(): {
  copy: (text: string) => Promise<void>; // 复制文本到剪贴板
  copied: Ref<boolean>; // 复制状态标志
};

使用示例: const { copy, copied } = useCopy();
await copy('要复制的文本');
```

### useFlexSearch - 全文搜索

```typescript
// 文件位置: src/composable/flexSearch.ts

interface FlexSearchOptions {
  tokenize?: 'forward' | 'reverse' | 'full' | 'strict';
  resolution?: number;
  cache?: boolean;
}

function useFlexSearch<T = unknown>(
  options?: FlexSearchOptions,
): {
  search: (query: string) => T[]; // 搜索方法
  add: (id: string | number, doc: T) => void; // 添加文档
  remove: (id: string | number) => void; // 移除文档
};

使用示例: const search = useFlexSearch<Tool>();
search.add(tool.path, tool);
const results = search.search('base64');
```

### useFuzzySearch - 模糊搜索

```typescript
// 文件位置: src/composable/fuzzySearch.ts

function useFuzzySearch<T>(
  items: MaybeRefOrGetter<T[]>,
  keys: string[],
  options?: FuzzySearchOptions,
): {
  results: ComputedRef<FuzzySearchResult<T>[]>; // 搜索结果
  search: (query: string) => void; // 搜索方法
};
```

### useDebouncedRef - 防抖引用

```typescript
// 文件位置: src/composable/debouncedref.ts

function useDebouncedRef<T>(value: T, delay?: number): Ref<T>;
```

### useValidation - 验证工具

```typescript
// 文件位置: src/composable/validation.ts

interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

function useValidation<T>(
  value: Ref<T>,
  rules: ValidationRule[],
): {
  error: ComputedRef<string | null>; // 验证错误信息
  validate: () => boolean; // 执行验证
};
```

### useDownloadBase64 - Base64 下载

```typescript
// 文件位置: src/composable/downloadBase64.ts

function useDownloadBase64(): {
  download: (base64: string, filename: string, mimeType?: string) => void;
};
```

## 工具函数 (Utility Functions)

### defineTool - 工具定义

```typescript
// 文件位置: src/tools/tool.ts

function defineTool(tool: Partial<Tool>): Tool;

使用示例: export const tool = defineTool({
  name: 'Base64 Converter',
  path: '/base64-converter',
  description: 'Convert strings to base64 and vice versa',
  keywords: ['base64', 'converter', 'encode', 'decode'],
  component: () => import('./Base64Converter.vue'),
  icon: FileDigit,
  category: 'Converters',
});
```

### defineTool 配置属性

| 属性         | 类型                     | 必填 | 描述             |
| ------------ | ------------------------ | ---- | ---------------- |
| name         | string                   | 是   | 工具显示名称     |
| path         | string                   | 是   | 路由路径         |
| description  | string                   | 是   | 工具描述         |
| keywords     | string[]                 | 是   | 搜索关键词       |
| component    | () => Promise<Component> | 是   | Vue 组件加载函数 |
| icon         | Component                | 是   | 图标组件         |
| redirectFrom | string[]                 | 否   | 别名路径         |
| isNew        | boolean                  | 否   | 是否为新工具     |
| createdAt    | Date                     | 否   | 创建时间         |
| npmPackages  | string[]                 | 否   | 依赖的 npm 包    |
| category     | string                   | 是   | 工具分类         |

## 状态管理接口 (Store APIs)

### Style Store - 样式状态

```typescript
// 文件位置: src/stores/style.store.ts

interface StyleStore {
  isDarkTheme: boolean; // 是否为深色主题
  themeOverrides: ThemeOverrides; // 主题覆盖配置
  toggleTheme(): void; // 切换主题
  setTheme(isDark: boolean): void; // 设置主题
}
```

### Pomodoro Timer Store - 番茄钟状态

```typescript
// 文件位置: src/tools/pomodoro-timer/app/store.ts

interface PomodoroStore {
  timeLeft: number; // 剩余时间（秒）
  isRunning: boolean; // 是否运行中
  mode: 'work' | 'shortBreak' | 'longBreak'; // 当前模式
  sessions: number; // 已完成的工作会话数
  start(): void; // 开始
  pause(): void; // 暂停
  reset(): void; // 重置
  skip(): void; // 跳过
}
```

## 路由接口

### 工具路由

每个工具自动生成对应的路由，格式为 `/工具路径`。

```typescript
// 工具路由示例
{
  path: '/base64-string-converter',
  name: 'base64-string-converter',
  component: () => Promise<Component>,
  meta: {
    isTool: true,
    layout: layouts.toolLayout,
    name: 'Base64 String Converter',
    // ...其他工具配置
  }
}
```

### 内置路由

| 路径               | 名称     | 描述     |
| ------------------ | -------- | -------- |
| `/`                | home     | 首页     |
| `/about`           | about    | 关于页面 |
| `/:pathMatch(.*)*` | NotFound | 404 页面 |

## 配置接口

### 应用配置

```typescript
// 文件位置: src/config.ts

interface AppConfig {
  app: {
    version: string; // 应用版本
    lastCommitSha: string; // 最后提交 SHA
    baseUrl: string; // 基础 URL
    env: 'production' | 'development' | 'preview' | 'test';
  };
  plausible: {
    isTrackerEnabled: boolean;
    domain: string;
    apiHost: string;
    trackLocalhost: boolean;
  };
  showBanner: boolean;
  showSponsorBanner: boolean;
}
```

## 组件接口

### 自定义 UI 组件

| 组件             | 路径                     | 描述              |
| ---------------- | ------------------------ | ----------------- |
| c-alert          | src/ui/c-alert/          | 警告提示组件      |
| c-button         | src/ui/c-button/         | 按钮组件          |
| c-buttons-select | src/ui/c-buttons-select/ | 按钮组选择器      |
| c-card           | src/ui/c-card/           | 卡片组件          |
| c-collapse       | src/ui/c-collapse/       | 折叠面板          |
| c-diff-editor    | src/ui/c-diff-editor/    | Diff 编辑器       |
| c-file-upload    | src/ui/c-file-upload/    | 文件上传          |
| c-input-text     | src/ui/c-input-text/     | 文本输入          |
| c-key-value-list | src/ui/c-key-value-list/ | 键值对列表        |
| c-label          | src/ui/c-label/          | 标签组件          |
| c-link           | src/ui/c-link/           | 链接组件          |
| c-markdown       | src/ui/c-markdown/       | Markdown 渲染     |
| c-modal          | src/ui/c-modal/          | 模态框            |
| c-modal-value    | src/ui/c-modal-value/    | 模态框数值显示    |
| c-monaco-editor  | src/ui/c-monaco-editor/  | Monaco 代码编辑器 |
| c-select         | src/ui/c-select/         | 下拉选择器        |
| c-table          | src/ui/c-table/          | 表格组件          |
| c-text-copyable  | src/ui/c-text-copyable/  | 可复制文本        |
| c-tooltip        | src/ui/c-tooltip/        | 提示框            |

## 事件系统

### 路由事件

```typescript
// 路由切换加载状态
router.beforeEach((to, from) => {
  // 显示加载动画
});

router.afterEach(() => {
  // 隐藏加载动画
});
```

### PWA 事件

```typescript
// Vite PWA 插件
registerSW({
  onNeedRefresh() {
    // 需要刷新时提示用户
  },
  onOfflineReady() {
    // 离线准备就绪
  },
});
```

## 环境变量

| 变量                         | 描述               | 默认值            |
| ---------------------------- | ------------------ | ----------------- |
| `VITE_APP_VERSION`           | 应用版本           | 来自 package.json |
| `BASE_URL`                   | 基础 URL           | `/`               |
| `VITE_VERCEL_ENV`            | 部署环境           | `development`     |
| `VITE_VERCEL_GIT_COMMIT_SHA` | Git 提交 SHA       | -                 |
| `VITE_TRACKER_ENABLED`       | 是否启用追踪       | `false`           |
| `VITE_PLAUSIBLE_DOMAIN`      | Plausible 域名     | -                 |
| `VITE_PLAUSIBLE_API_HOST`    | Plausible API 主机 | -                 |
