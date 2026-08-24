# 约定式提交速查表

## 结构

约定式提交信息遵循以下结构：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]  
```

## 元素

### 类型(Type)（必填）
类型描述所做更改的种类。常用类型包括：

- **feat**: 面向用户的新功能
- **fix**: 面向用户的 Bug 修复
- **docs**: 文档更改
- **style**: 代码风格更改（格式化、缺少分号等）
- **refactor**: 既不修复 Bug 也不添加功能的代码更改
- **test**: 添加或更新测试
- **chore**: 维护任务、依赖更新、构建变更
- **perf**: 性能优化
- **ci**: CI/CD 配置更改
- **build**: 构建系统或外部依赖更改
- **revert**: 回退之前的提交

### 作用域(Scope)（可选）
作用域提供关于代码库中受影响部分的附加上下文：

```
feat(auth): add OAuth2 integration
fix(api): resolve timeout issues
docs(readme): update installation instructions
```

### 描述（必填）
对更改的简要描述：

- 使用祈使语气（"add" 而非 "added" 或 "adds"）
- 保持简洁（建议不超过 50 个字符）
- 首字母不大写
- 结尾不加句号

### 正文（可选）
提供更详细的更改说明：

- 用空行与描述分隔
- 解释动机并与之前的行为进行对比
- 使用祈使语气

### 脚注（可选）
包含提交的元数据：

- **破坏性更改**: 以 `BREAKING CHANGE:` 开头
- **Issue 引用**: `Closes #123`、`Fixes #456`
- **共同作者**: `Co-authored-by: Name <email>`

## 示例

### 简单提交
```
feat: add user authentication
```

### 带作用域
```
fix(parser): handle edge case in JSON parsing
```

### 带正文
```
feat: add email notifications

Users can now receive email notifications for important events.
This includes account changes, security alerts, and system updates.
```

### 带脚注
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Closes #123
```

### 破坏性更改
```
feat!: send an email to the customer when a product is shipped

BREAKING CHANGE: The shipping service now requires an email address
```

### 完整示例
```
feat(shopping cart): add ability to remove items

Users can now remove items from their shopping cart by clicking
the remove button next to each item. This improves the user
experience by allowing corrections without starting over.

Closes #456
Co-authored-by: Jane Doe <jane@example.com>
```

## 常用工具

### Commitizen
用于创建约定式提交的交互式工具：

```shell
npm install -g commitizen
npm install -g cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

用法：
```shell
git cz
```

### Commitlint
对提交信息进行 lint 检查，确保遵循约定式格式：

```shell
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

在 `.commitlintrc.json` 中配置：
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

### Husky
用于强制执行提交信息格式的 Git 钩子：

```shell
npm install --save-dev husky
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

### Semantic Release
根据约定式提交自动生成发布版本：

```shell
npm install --save-dev semantic-release
```

### Conventional Changelog
根据约定式提交生成变更日志：

```shell
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```