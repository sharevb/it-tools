Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的强大工具。它使用一个 YAML 文件（`compose.yaml`）来配置应用服务、网络、卷等。该文件允许开发者以声明式的方式描述基础设施和依赖关系，从而更轻松地管理复杂的环境。

无论你是在搭建本地开发环境，还是部署到生产环境，Compose 都能简化编排过程，并让你的配置保持可读、可版本控制。

## 📁 文件名
```yaml
compose.yaml
```

### ✅ YAML 格式规则

- 缩进使用 **2 个空格**（不要使用制表符）
- 键和值是 **区分大小写** 的
- 列表使用 `-` 表示每一项
- 包含特殊字符的字符串应使用引号括起来
- 环境变量可以内联定义，也可以通过 `.env` 文件定义

## 🧱 基本结构

```yaml
services:
  service_name:
    image: image_name:tag
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "host_port:container_port"
    volumes:
      - ./host_path:/container_path
    environment:
      - VAR_NAME=value
    depends_on:
      - other_service
    networks:
      - custom_network
networks:
  custom_network:
    driver: bridge
volumes:
  custom_volume:
```

## ⚙️ 服务（Services）

每个 service 都定义一个容器。

### 常用服务选项

```yaml
services:
  web:
    image: nginx:latest
    build:
      context: ./app
      dockerfile: Dockerfile
    command: ["nginx", "-g", "daemon off;"]
    container_name: custom_name
    ports:
      - "8080:80"
    expose:
      - "80"
    environment:
      - DEBUG=true
    env_file:
      - .env
    volumes:
      - ./data:/data
    restart: always
    depends_on:
      - db
    networks:
      - frontend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 5
```

## 🏗️ 构建选项（Build Options）

```yaml
build:
  context: ./dir
  dockerfile: Dockerfile
  args:
    build_arg: value
  target: build-stage
```

- **`build:`** 告诉 Compose 如何构建镜像。
  - `context:` 是包含 Dockerfile 和源代码的目录。
  - `dockerfile:` 允许你指定自定义的 Dockerfile 名称或路径。

## 📦 卷（Volumes）

```yaml
volumes:
  data_volume:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
```

### 挂载卷

```yaml
volumes:
  - data_volume:/app/data
  - ./local:/container/path
```

- **`volumes:`** 将宿主机目录或具名卷挂载到容器中。
  - `./src:/app/src` 将本地的 `src` 文件夹挂载到容器中的 `/app/src`。

## 🌐 网络（Networks）

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: overlay
```

- **`networks:`** 将服务连接到一个或多个自定义网络。可实现服务发现和隔离。

### 为服务分配网络

```yaml
services:
  app:
    networks:
      - frontend
      - backend
```

## 🌐 端口（Ports）

```yaml
    ports:
      - "3000:3000"
```
- **`ports:`** 将容器端口映射到宿主机端口。格式为 `"宿主机:容器"`。常用于将服务暴露给本机访问。

## 🔐 密钥（Secrets，仅 Docker Swarm）

```yaml
secrets:
  db_password:
    file: ./db_password.txt

services:
  db:
    secrets:
      - db_password
```

## 🔑 配置（Configs，仅 Docker Swarm）

```yaml
configs:
  my_config:
    file: ./config.txt

services:
  app:
    configs:
      - source: my_config
        target: /etc/config.txt
```

## 🧪 健康检查（Healthcheck）

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 5s
```

- **`healthcheck:`** 定义 Docker 如何检查容器是否健康。
  - `test:` 要运行的命令
  - `interval:` 检查的间隔时间
  - `timeout:` 等待响应的超时时间
  - `retries:` 在标记为不健康之前允许失败的次数

## 🔄 重启策略（Restart Policies）

```yaml
restart: no         # 从不重启
restart: always     # 总是重启
restart: on-failure # 失败时重启
restart: unless-stopped
```

## 🧬 环境变量（Environment Variables）

```yaml
environment:
  - VAR1=value1
  - VAR2=value2
env_file:
  - .env
```

- **`environment:`** 在容器内设置环境变量。常用于配置。
- **`env_file:`** 从文件加载环境变量。可以将密钥和配置与 Compose 文件分离。

## 命令（Command）

```yaml
    command: npm start
```
- **`command:`** 覆盖 Dockerfile 中定义的默认命令。常用于自定义容器行为。

## 依赖（Dependencies）

```yaml
    depends_on:
      - db
```
- **`depends_on:`** 指定服务的启动顺序。在 Compose 中，这并不会等待服务"就绪"——只是"已启动"。

## 🧹 清理（Clean Up）

```bash
docker compose down         # 停止并删除容器、网络、卷
docker compose down -v      # 同时删除具名卷
```

## 🚀 命令（Commands）

| 命令 | 描述 |
|--------|-------------|
| `docker compose up` | 启动服务 |
| `docker compose up -d` | 以分离（后台）模式启动 |
| `docker compose down` | 停止并删除服务 |
| `docker compose build` | 构建镜像 |
| `docker compose ps` | 列出容器 |
| `docker compose logs` | 查看日志 |
| `docker compose exec <service> <cmd>` | 在容器中执行命令 |
| `docker compose config` | 校验并查看配置 |

## 🧠 挂载 GPU / iGPU

Docker Compose 通过 `device_requests` 字段支持 GPU 访问（Compose v3.8+ 和 Docker 19.03+）。

### ✅ NVIDIA GPU 示例

```yaml
services:
  gpu-app:
    image: nvidia/cuda:11.0-base
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

### ✅ Intel iGPU（通过 VAAPI 或 OpenCL）

```yaml
services:
  igpu-app:
    image: intel/openvino
    devices:
      - /dev/dri:/dev/dri
```

> 🔧 请确保你的宿主机上安装了必要的驱动和运行时（例如 NVIDIA Container Toolkit 或 Intel Media SDK）。

## 🔄 Compose 与 Swarm YAML 差异

| 特性            | Docker Compose (`compose.yaml`) | Docker Swarm (`stack.yml`) |
|--------------------|----------------------------------------|-----------------------------|
| `restart`          | ✅ 支持                          | ❌ 不支持             |
| `depends_on`       | ✅ 支持                          | ❌ 不支持             |
| `deploy`           | ❌ 忽略                            | ✅ 副本数必需     |
| `build`            | ✅ 支持                          | ❌ 不支持             |
| `volumes`（bind）  | ✅ 支持                          | ✅ 支持                 |
| `configs` / `secrets`| ❌ 忽略                            | ✅ 支持                 |
| `healthcheck`      | ✅ 支持                          | ✅ 支持                 |

> 🧠 **提示：** 本地开发请使用 `compose.yaml`，Swarm 部署请使用 `stack.yml`。

## 🧬 Profiles（Compose v3.9+）

Profiles 允许根据当前激活的 profile 有条件地包含服务。这对于区分 dev / test / staging 环境非常有用。

### ✅ 定义 Profiles

```yaml
services:
  web:
    image: nginx
    profiles:
      - default

  debug:
    image: busybox
    command: top
    profiles:
      - debug
```

### ✅ 激活 Profiles

```bash
docker compose --profile debug up
```

### ✅ 注意事项

- 没有 `profiles` 键的服务始终会被包含。
- 多个 profile 可以同时激活。
- 适用于功能开关、可选服务或针对不同环境的配置。

## ⚔️ YAML 差异：Docker Compose 与 Docker Swarm 模式

Docker Compose 和 Docker Swarm 都使用 YAML 文件来定义服务，但它们用途不同，支持的特性也不同。Compose 针对本地开发和测试进行了优化，而 Swarm 则是为跨集群的生产级编排而设计。

### 🧭 用途

| 模式        | 用途                          |
|-------------|-----------------------------------|
| Compose     | 本地开发、测试        |
| Swarm       | 集群部署、扩缩容       |

### 🧩 YAML 结构上的关键差异

| 特性              | Compose (`compose.yaml`) | Swarm (`stack.yml`) |
|----------------------|-------------------------------|----------------------|
| `build:`             | ✅ 支持                   | ❌ 忽略            |
| `restart:`           | ✅ 支持                   | ❌ 忽略            |
| `depends_on:`        | ✅ 支持                   | ❌ 忽略            |
| `deploy:`            | ❌ 忽略                     | ✅ 扩缩容、调度必需 |
| `configs:`           | ❌ 忽略                     | ✅ 支持           |
| `secrets:`           | ❌ 忽略                     | ✅ 支持           |
| `healthcheck:`       | ✅ 支持                   | ✅ 支持           |
| `volumes:`（bind）   | ✅ 支持                   | ✅ 支持           |
| `networks:`          | ✅ 支持                   | ✅ 支持           |
| `profiles:`          | ✅ 支持（v3.9+）           | ❌ 不支持       |

### 🔧 仅 Compose 支持的特性

以下特性对本地开发很有用，但在 Swarm 中会被忽略：

#### `build:`
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
```
- Compose 在本地构建镜像。
- Swarm 要求使用已推送到镜像仓库的预构建镜像。

#### `restart:`
```yaml
restart: unless-stopped
```
- Compose 使用此配置自动重启容器。
- Swarm 使用 `deploy.restart_policy`。

#### `depends_on:`
```yaml
depends_on:
  - db
```
- Compose 按顺序启动服务。
- Swarm 会忽略此配置；请使用 healthcheck 和 wait-for-it 脚本。

### 🛡️ 仅 Swarm 支持的特性

以下特性是 Swarm 独有的，Compose 会忽略：

#### `deploy:`
```yaml
services:
  app:
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == manager
      restart_policy:
        condition: on-failure
```
- 用于在集群中控制扩缩容、调度和重启行为。

#### `configs:` 和 `secrets:`
```yaml
configs:
  app_config:
    file: ./config.yml

secrets:
  db_password:
    file: ./password.txt
```
- 用于在节点间安全地分发配置和密钥。

#### `placement:`（位于 `deploy` 内）
```yaml
placement:
  constraints:
    - node.labels.env == production
```
- 根据 label 将服务分配到指定节点。

### 🧪 健康检查（两者均支持）

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost"]
  interval: 30s
  timeout: 10s
  retries: 3
```
- 在 Compose 和 Swarm 中均可使用。
- 在 Swarm 中，健康状态会影响服务的重新调度。

### 📦 卷的差异

| 类型        | Compose | Swarm |
|-------------|---------|-------|
| Bind mount（绑定挂载）  | ✅       | ✅     |
| Named volume（具名卷）| ✅       | ✅     |
| External volume（外部卷） | ✅   | ✅     |
| Volume driver options（卷驱动选项） | ✅ | ✅ |

Swarm 要求外部卷必须预先在所有节点上创建好。

### 🧠 总结

| 特性类别     | Compose | Swarm |
|----------------------|---------|-------|
| 本地构建         | ✅       | ❌     |
| 集群扩缩容      | ❌       | ✅     |
| Secrets / Configs      | ❌       | ✅     |
| Profiles             | ✅       | ❌     |
| 重启策略     | ✅       | ✅（通过 `deploy`） |
| 服务依赖 | ✅       | ❌     |

> 🧭 **提示：** 开发请使用 `compose.yaml`，Swarm 请使用 `stack.yml`。你也可以将配置拆分为多个文件，或使用 `kompose` 等工具将 Kubernetes 的清单进行转换。

## 📚 资源

- [Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Docker CLI 参考](https://docs.docker.com/engine/reference/commandline/compose/)
- [NVIDIA GPU 支持](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Intel GPU 支持](https://github.com/intel/media-driver)
