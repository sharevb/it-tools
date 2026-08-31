## 容器镜像的重大更改

由于基础镜像现在是 `nginx-unpriviledged`，容器将监听端口 **8080** 而不是 80。因此需要更新端口映射，即从 `8080:80` 改为 `8080:8080`。

可以使用环境变量 `PORT` 覆盖监听端口（docker 选项 `-e PORT=8888`）。

## 欢迎贡献

特别欢迎UI改进和翻译，也欢迎其他任何贡献！

支持这个fork： [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## 建议使用HTTPS

某些工具（如PGP加密）依赖仅在HTTPS/SSL下可用的WebCrypto API。此外，如果想使用PWA，也需要HTTPS。

因此，即使在内部安装时，也应使用Let's Encrypt的DNS Challenge启用HTTPS。

## 开发者

感谢所有贡献者！

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## 在Windows下开发

建议使用WSL2在VSCode中开发。直接开发比较麻烦（因为一些依赖）。

## 新增功能

- 几乎所有[原始it-tools的PR，192个我的](https://github.com/CorentinTh/it-tools/pulls)
- 95%的[原始it-tools问题](https://github.com/CorentinTh/it-tools/issues)
- 完整UI翻译（谷歌翻译）
- 许多[新工具](https://sharevb-it-tools.vercel.app/about)
- 许多错误修复和改进
- 许多自定义（Docker版本）

## 容器镜像

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## 在Docker Compose中使用

```yml
services:
  it-tools:
    container_name: it-tools
    image: sharevb/it-tools:latest
    pull_policy: always
    restart: unless-stopped
    ports:
      - 8080:8080
```

## 过滤工具和添加自定义首页内容

您可以通过挂载 `home.custom.md` 到 `/usr/share/nginx/html` 来添加自定义内容到首页。

您可以通过挂载 `tools-filter.json` 到 `/usr/share/nginx/html` 来过滤可用的工具。

## 贡献

### 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) 配合以下扩展：

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（禁用Vetur）
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### 项目设置

```sh
pnpm install --ignore-scripts
```

### 开发环境编译和热重载

```sh
pnpm dev
```

### 类型检查、编译和生产构建

```sh
pnpm build
```

### 使用Vitest运行单元测试

```sh
pnpm test
```

### 使用ESLint检查

```sh
pnpm lint
```

### 创建新工具

创建新工具有一个脚本生成模板，只需运行：

```sh
pnpm run script:create:tool my-tool-name
```

## 许可证

本项目基于 [GNU GPLv3](LICENSE)。
