**Dockerfile** 是一个由指令组成的脚本，用于构建 Docker 镜像。每条指令都会在镜像中创建一个层。

## 📦 基本结构

```Dockerfile
# 注释
INSTRUCTION arguments
```

## 🚀 核心指令

### `FROM`
指定基础镜像。

```Dockerfile
FROM ubuntu:20.04@sha256:8feb4d8ca5354def3d8fce243717141ce31e2c428701f6682bd2fafe15388214
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32
```

### `LABEL`
为镜像添加元数据。

```Dockerfile
LABEL maintainer="you@example.com"
LABEL version="1.0" description="My App"
```

### `ENV`
设置环境变量。

```Dockerfile
ENV NODE_ENV=production
ENV PATH="/app/bin:$PATH"
```

### `RUN`
在构建过程中于 shell 中执行命令。

```Dockerfile
RUN apt-get update && apt-get install -y curl
RUN npm install
```

使用 `RUN ["executable", "param1", "param2"]` 以 JSON 数组形式书写。

### `COPY`
将文件从主机复制到镜像中。

```Dockerfile
COPY . /app
COPY config.json /app/config.json
```

### `ADD`
类似于 `COPY`，但支持远程 URL 并可自动解压归档文件。

```Dockerfile
ADD https://example.com/file.tar.gz /app/
ADD archive.zip /app/
```

### `CMD`
设置容器启动时运行的默认命令。

```Dockerfile
CMD ["node", "server.js"]     # 推荐的 exec 形式
CMD node server.js            # shell 形式
```

只允许一条 `CMD`；后面的会覆盖前面的。

### `ENTRYPOINT`
将容器配置为可执行程序运行。

```Dockerfile
ENTRYPOINT ["python", "app.py"]
```

与 `CMD` 搭配使用可传递默认参数。

### `WORKDIR`
为后续指令设置工作目录。

```Dockerfile
WORKDIR /app
```

### `EXPOSE`
声明容器监听的端口。

```Dockerfile
EXPOSE 80
EXPOSE 443
```

注意：这并不会发布端口。

### `VOLUME`
为持久化或共享数据创建挂载点。

```Dockerfile
VOLUME ["/data"]
```

### `USER`
设置运行后续指令的用户。

```Dockerfile
USER appuser
```

### `ARG`
定义构建时变量。

```Dockerfile
ARG VERSION=1.0
RUN echo $VERSION
```

在 `docker build` 时使用 `--build-arg VERSION=2.0`。

### `ONBUILD`
当该镜像被用作基础镜像时触发相应指令。

```Dockerfile
ONBUILD COPY . /app
```

## 🧠 最佳实践

- 使用精简的基础镜像（例如 `alpine`）以减小体积。
- 合并 `RUN` 命令以减少层数。
- 使用 `.dockerignore` 排除不必要的文件。
- 除非需要解压归档，否则优先使用 `COPY` 而非 `ADD`。
- 使用 `ENTRYPOINT` 定义固定命令，使用 `CMD` 传递参数。
- 避免硬编码密钥或凭据。

## 🧪 示例 Dockerfile

```Dockerfile
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32

LABEL maintainer="guillaume@example.com"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]
```

## 🛠️ 构建与运行

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -p 3000:3000 my-app
```

## 📁 .dockerignore 示例

```plaintext
node_modules
*.log
Dockerfile
.git
```

## 🏗️ 多阶段构建

**多阶段构建**允许你在一个 Dockerfile 中使用多条 `FROM` 语句，以优化镜像体积并将构建依赖与运行时分离。

### 🎯 为什么使用多阶段构建？

- 通过排除构建工具和中间文件来减小最终镜像体积。
- 通过最小化攻击面来提升安全性。
- 保持 Dockerfile 简洁且易于维护。

### 🧱 基本语法

```Dockerfile
# 阶段 1：构建
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段 2：生产
FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 🏷️ 命名阶段

你可以使用 `AS <name>` 为每个阶段命名，并在之后通过 `--from=<name>` 引用它。

```Dockerfile
FROM golang:1.21@sha256:4746d26432a9117a5f58e95cb9f954ddf0de128e9d5816886514199316e4a2fb AS build
WORKDIR /src
COPY . .
RUN go build -o myapp

FROM alpine:latest@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b
COPY --from=build /src/myapp /usr/local/bin/myapp
ENTRYPOINT ["myapp"]
```

### 📦 复制构建产物

使用 `COPY --from=<stage>` 将文件从一个阶段复制到另一个阶段。

```Dockerfile
COPY --from=builder /app/output /app/output
```

你可以复制：
- 文件
- 目录
- 二进制文件
- 配置

### 🧼 精简的最终镜像

多阶段构建可帮助你避免臃肿的镜像：

```Dockerfile
# 不使用多阶段：包含编译器、源代码等
# 使用多阶段：仅包含运行时必需项
```

### 🧪 实战示例：React 应用

```Dockerfile
# 构建阶段
FROM node:22@sha256:0557ac14e0d45d02ed563067b82856ca5e7aa3437fa28d98d4350ea9c3d9494a AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 服务阶段
FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
