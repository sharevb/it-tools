# IT-Tools 项目文档

IT-Tools 是一个面向开发者的在线工具集合，提供超过 400 种实用的开发工具，帮助开发者提高工作效率。本文档涵盖系统架构、接口定义、开发者指南等内容。

**快速链接**: [架构](./ARCHITECTURE.md) | [接口](./INTERFACES.md) | [开发者指南](./DEVELOPER_GUIDE.md)

---

## 核心文档

### [架构](./ARCHITECTURE.md)

系统设计、技术栈、组件结构和数据流程。从这里开始了解系统如何运作。

### [接口](./INTERFACES.md)

公开 API、类型定义、组合式函数和组件接口。开发新工具和组件的参考。

### [开发者指南](./DEVELOPER_GUIDE.md)

环境搭建、开发工作流、编码规范和常见任务。贡献者必读。

---

## 项目概览

| 项目         | 信息                      |
| ------------ | ------------------------- |
| **项目名称** | IT-Tools                  |
| **版本**     | 2026.1.4                  |
| **技术栈**   | Vue 3 + TypeScript + Vite |
| **工具数量** | 435+                      |
| **许可证**   | GNU GPLv3                 |

---

## 核心概念

理解这些核心概念有助于导航代码库：

| 概念                                | 描述                        |
| ----------------------------------- | --------------------------- |
| [工具定义](./专有概念/工具定义.md)  | 工具的结构定义和加载机制    |
| [工具分类](./专有概念/工具分类.md)  | 工具的分类方式和组织结构    |
| [UI 组件库](./专有概念/UI组件库.md) | 自定义 Vue 组件的设计和使用 |
| [国际化](./专有概念/国际化.md)      | 多语言支持的实现方式        |

---

## 目录结构

```
it-tools/
├── src/
│   ├── tools/              # 工具模块 (435+ 工具)
│   ├── ui/                 # 自定义 UI 组件库
│   ├── composable/         # 组合式函数
│   ├── plugins/            # Vue 插件
│   ├── stores/             # Pinia 状态存储
│   ├── pages/              # 页面组件
│   └── utils/              # 工具函数
├── locales/               # 国际化文件
├── scripts/                # 构建脚本
└── public/                 # 静态资源
```

---

## 快速参考

### 命令

```bash
pnpm dev          # 启动开发服务器
pnpm test         # 运行单元测试
pnpm build        # 生产构建
pnpm lint         # 代码检查
pnpm typecheck    # 类型检查
```

### 重要文件

| 文件                 | 目的           |
| -------------------- | -------------- |
| `src/main.ts`        | 应用入口       |
| `src/tools/index.ts` | 工具加载和路由 |
| `src/router.ts`      | 路由配置       |
| `src/config.ts`      | 应用配置       |
| `package.json`       | 依赖和脚本     |

---

## 入门指南

### 项目新人？

按此路径学习：

1. **[架构](./ARCHITECTURE.md)** - 了解全局
2. **[核心概念](#核心概念)** - 学习领域术语
3. **[开发者指南](./DEVELOPER_GUIDE.md)** - 搭建环境
4. **[接口](./INTERFACES.md)** - 探索公开 API

### 首次贡献？

1. **[开发者指南](./DEVELOPER_GUIDE.md)** - 搭建和工作流
2. **添加新工具** - 学习如何创建工具
3. **常见任务** - 分步指南

---

## 工具分类

项目包含以下主要工具分类：

- **Converters** - 格式转换工具
- **Generators** - 代码生成工具
- **Validators** - 验证工具
- **Encoders** - 编码解码工具
- **Developer** - 开发辅助工具
- **Network** - 网络工具
- **Security** - 安全工具
- **Text** - 文本处理工具

---

## 相关资源

- [GitHub 仓库](https://github.com/sharevb/it-tools)
- [在线工具](https://it-tools.tech)
- [Vue 3 文档](https://vuejs.org)
- [Naive UI 文档](https://www.naiveui.com)
- [Vite 文档](https://vitejs.dev)
