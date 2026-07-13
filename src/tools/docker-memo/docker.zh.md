Docker 能够将应用程序打包并运行在一个称为容器（container）的松散隔离环境中。这种隔离性和安全性使你可以在同一台主机上同时运行多个容器。容器十分轻量，包含了运行应用所需的一切，因此你无需依赖主机上当前已安装的内容。你可以在工作时轻松地共享容器，并确保每一位共享对象都能获得以相同方式运行的相同容器。

## 安装与资源

- Docker Desktop（Mac、Linux、Windows）：https://docs.docker.com/desktop
- 使用 Docker 的示例项目：https://github.com/docker/awesome-compose
- 官方文档：https://docs.docker.com

## 通用命令

启动 Docker 守护进程：
```bash
dockerd
```

获取 Docker 帮助（适用于所有子命令，例如 `docker run --help`）：
```bash
docker --help
```

显示系统级信息：
```bash
docker info
```

显示 Docker 版本（客户端和服务端）：
```bash
docker version
```

## 镜像

Docker 镜像是一种轻量、独立、可执行的软件包，包含运行应用所需的一切：代码、运行时、系统工具、系统库和设置。

从当前目录的 Dockerfile 构建镜像：
```bash
docker build -t <image_name> .
```

不使用缓存构建镜像：
```bash
docker build -t <image_name> . --no-cache
```

使用指定标签构建（例如 `myapp:v1.2`）：
```bash
docker build -t <image_name>:<tag> .
```

列出本地镜像：
```bash
docker images
```

为推送到镜像仓库给镜像打标签：
```bash
docker tag <image> <username>/<image>:<tag>
```

删除镜像：
```bash
docker rmi <image_name>
```

移除悬空（未使用）的镜像：
```bash
docker image prune
```

移除所有未使用的镜像，而不仅仅是悬空镜像：
```bash
docker image prune -a
```

显示镜像的各个层：
```bash
docker history <image_name>
```

## Docker Hub

Docker Hub 是一项用于查找和共享容器镜像的服务。了解更多请访问 https://hub.docker.com

登录 Docker Hub：
```bash
docker login -u <username>
```

登出：
```bash
docker logout
```

在 Docker Hub 中搜索镜像：
```bash
docker search <image_name>
```

从 Docker Hub 拉取镜像：
```bash
docker pull <image_name>
```

拉取指定标签的版本：
```bash
docker pull <image_name>:<tag>
```

将镜像发布到 Docker Hub：
```bash
docker push <username>/<image_name>
```

## 容器

容器是 Docker 镜像的运行时实例。无论基础设施如何，容器都会以相同的方式运行。容器将软件与其环境隔离，确保它在开发、预发布和生产环境中保持一致的运行效果。

### 运行容器

从镜像创建并运行容器：
```bash
docker run <image_name>
```

使用自定义名称运行：
```bash
docker run --name <container_name> <image_name>
```

在后台运行（分离模式）：
```bash
docker run -d <image_name>
```

以交互方式运行并进入 shell：
```bash
docker run -it <image_name> bash
```

容器退出时自动移除：
```bash
docker run --rm <image_name>
```

将容器的端口发布到主机：
```bash
docker run -p <host_port>:<container_port> <image_name>
```

设置环境变量：
```bash
docker run -e KEY=value <image_name>
```

从文件加载环境变量：
```bash
docker run --env-file ./env.list <image_name>
```

挂载命名卷：
```bash
docker run -v <volume_name>:/path/in/container <image_name>
```

将当前目录进行绑定挂载：
```bash
docker run -v $(pwd):/app <image_name>
```

设置重启策略（可选值：`no`、`on-failure`、`always`、`unless-stopped`）：
```bash
docker run --restart unless-stopped <image_name>
```

连接到指定网络：
```bash
docker run --network <network_name> <image_name>
```

### 管理容器

列出正在运行的容器：
```bash
docker ps
```

列出所有容器（运行中和已停止）：
```bash
docker ps -a
```

启动一个已停止的容器：
```bash
docker start <container_name>
```

停止一个正在运行的容器：
```bash
docker stop <container_name>
```

重启容器：
```bash
docker restart <container_name>
```

移除一个已停止的容器：
```bash
docker rm <container_name>
```

强制移除一个正在运行的容器：
```bash
docker rm -f <container_name>
```

移除所有已停止的容器：
```bash
docker container prune
```

重命名容器：
```bash
docker rename <old_name> <new_name>
```

### 检查与交互

进入正在运行容器的 shell：
```bash
docker exec -it <container_name> bash
```

对于不自带 bash 的精简镜像（例如 alpine），使用 `sh`：
```bash
docker exec -it <container_name> sh
```

获取日志：
```bash
docker logs <container_name>
```

持续跟踪日志（类似 `tail -f`）：
```bash
docker logs -f <container_name>
```

仅显示最后 100 行：
```bash
docker logs --tail 100 <container_name>
```

显示容器的底层详细信息（JSON）：
```bash
docker inspect <container_name>
```

实时查看所有容器的资源使用统计：
```bash
docker stats
```

显示容器内正在运行的进程：
```bash
docker top <container_name>
```

从容器中复制文件出来：
```bash
docker cp <container_name>:/path/in/container ./
```

将文件复制到容器中：
```bash
docker cp ./local_file <container_name>:/path/
```

显示容器启动以来的文件系统变更：
```bash
docker diff <container_name>
```

## 卷

卷（Volume）将数据持久化在容器的可写层之外，因此数据在容器被移除后仍然保留。

创建命名卷：
```bash
docker volume create <volume_name>
```

列出卷：
```bash
docker volume ls
```

显示卷的详细信息：
```bash
docker volume inspect <volume_name>
```

移除卷：
```bash
docker volume rm <volume_name>
```

移除所有未使用的卷：
```bash
docker volume prune
```

将命名卷挂载到容器（由 Docker 管理）：
```bash
docker run -v <volume_name>:/data <image_name>
```

将主机路径绑定挂载到容器：
```bash
docker run -v $(pwd):/app <image_name>
```

使用 `--mount` 语法的等价绑定挂载：
```bash
docker run --mount type=bind,src=$(pwd),dst=/app <image_name>
```

## 网络

同一网络中的容器可以通过容器名称相互访问。

列出网络：
```bash
docker network ls
```

创建网络：
```bash
docker network create <network_name>
```

显示网络详细信息：
```bash
docker network inspect <network_name>
```

将正在运行的容器连接到网络：
```bash
docker network connect <network_name> <container_name>
```

将容器从网络断开：
```bash
docker network disconnect <network_name> <container_name>
```

移除网络：
```bash
docker network rm <network_name>
```

移除所有未使用的网络：
```bash
docker network prune
```

## Docker Compose

Compose 通过单个 `compose.yaml`（或 `docker-compose.yml`）文件运行多容器应用。

启动所有服务（前台）：
```bash
docker compose up
```

启动所有服务（分离模式）：
```bash
docker compose up -d
```

启动前先重新构建镜像：
```bash
docker compose up --build
```

停止并移除容器和网络：
```bash
docker compose down
```

同时移除命名卷：
```bash
docker compose down -v
```

列出项目中的服务：
```bash
docker compose ps
```

持续跟踪所有服务的日志：
```bash
docker compose logs -f
```

持续跟踪单个服务的日志：
```bash
docker compose logs -f <service>
```

构建（或重新构建）服务：
```bash
docker compose build
```

拉取服务镜像：
```bash
docker compose pull
```

在正在运行的服务中打开 shell：
```bash
docker compose exec <service> bash
```

在新容器中运行一次性命令：
```bash
docker compose run --rm <service> <command>
```

重启单个服务：
```bash
docker compose restart <service>
```

校验并查看解析后的 compose 文件：
```bash
docker compose config
```

## 系统与清理

磁盘占用会迅速累积。以下命令可用于回收空间。

显示磁盘使用情况（镜像、容器、卷、构建缓存）：
```bash
docker system df
```

移除已停止的容器、悬空镜像和未使用的网络：
```bash
docker system prune
```

同时移除所有未使用的镜像（不仅仅是悬空镜像）：
```bash
docker system prune -a
```

同时移除未使用的卷（具有破坏性——运行前请再三确认）：
```bash
docker system prune -a --volumes
```

清理构建缓存：
```bash
docker builder prune
```

## 快速参考：常用标志

| 标志 | 含义 |
|------|---------|
| `-d` | 分离模式（在后台运行） |
| `-it` | 交互模式 + TTY（用于 shell） |
| `--rm` | 容器退出时移除它 |
| `-p host:container` | 发布端口 |
| `-v src:dst` | 挂载卷或绑定挂载 |
| `-e KEY=value` | 环境变量 |
| `--name` | 指定容器名称 |
| `--network` | 连接到网络 |
| `--restart` | 重启策略（`no`、`on-failure`、`always`、`unless-stopped`） |
