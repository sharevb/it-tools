**Docker Swarm 模式** 是 Docker 原生的集群与编排解决方案。它允许你将一组 Docker 节点作为一个虚拟系统统一管理，从而实现高可用性、负载均衡以及容器化应用的简化部署。

主要特性：
- 内置编排
- 声明式服务模型
- 滚动更新
- 自动扩缩容与自愈
- 通过 TLS 实现安全的节点通信

## 📌 Swarm 初始化

- **初始化 Swarm**
  ```bash
  docker swarm init
  ```

- **加入 Swarm（在工作节点/管理节点上）**
  ```bash
  docker swarm join-token worker
  ```

- **离开 Swarm**
  ```bash
  docker swarm leave
  ```

- **强制离开（在管理节点上）**
  ```bash
  docker swarm leave --force
  ```

## 👥 节点管理

- **列出节点**
  ```bash
  docker node ls
  ```

- **将节点提升为管理节点**
  ```bash
  docker node promote <node-name>
  ```

- **将节点降级为工作节点**
  ```bash
  docker node demote <node-name>
  ```

- **查看节点详情**
  ```bash
  docker node inspect <node-name> --pretty
  ```

- **排空节点（禁止调度）**
  ```bash
  docker node update --availability drain <node-name>
  ```

- **激活节点**
  ```bash
  docker node update --availability active <node-name>
  ```

## 🧠 管理节点

管理节点负责：
- 编排任务与服务
- 维护集群状态
- 处理 API 请求

你可以部署多个管理节点以实现高可用性，但任意时刻只有一个是 **leader（领导者）**。

- **查看管理节点状态**
  ```bash
  docker node ls
  ```

- **查看 Raft 共识信息**
  ```bash
  docker swarm inspect
  ```

## 📦 服务管理

- **创建服务**
  ```bash
  docker service create --name <service-name> <image>
  ```

- **创建带副本的服务**
  ```bash
  docker service create --name <service-name> --replicas <n> <image>
  ```

- **列出服务**
  ```bash
  docker service ls
  ```

- **查看服务详情**
  ```bash
  docker service inspect <service-name> --pretty
  ```

- **扩缩容服务**
  ```bash
  docker service scale <service-name>=<n>
  ```

- **更新服务**
  ```bash
  docker service update --image <new-image> <service-name>
  ```

- **删除服务**
  ```bash
  docker service rm <service-name>
  ```

## 🔁 副本(Replicas)

副本定义了某个服务在 Swarm 集群中应运行的实例数量。

- **创建服务时设置副本数**
  ```bash
  docker service create --replicas 5 --name myapp myimage
  ```

- **扩缩容副本**
  ```bash
  docker service scale myapp=10
  ```

Swarm 会自动将副本分配到可用的节点上，并在副本失败时自动重启。

## 🐝 任务与容器管理

- **列出服务的任务**
  ```bash
  docker service ps <service-name>
  ```

- **列出所有任务**
  ```bash
  docker node ps <node-name>
  ```

- **列出容器**
  ```bash
  docker container ls
  ```

- **查看容器详情**
  ```bash
  docker container inspect <container-id>
  ```

## 🌐 网络

### 🧠 什么是覆盖网络(Overlay Network)？
覆盖网络(overlay network)是一种跨越多个 Docker 主机的虚拟网络。它允许运行在不同节点上的容器

### 命令

- **创建覆盖网络**
  ```bash
  docker network create --driver overlay <network-name>
  ```

- **列出网络**
  ```bash
  docker network ls
  ```

- **将服务连接到网络**
  ```bash
  docker service create --name <service-name> --network <network-name> <image>
  ```

## 🛠 常用参数

| 参数 | 说明 |
|------|------|
| `--replicas` | 服务实例的数量 |
| `--publish` | 端口映射（`<host>:<container>`） |
| `--mount` | 卷挂载 |
| `--constraint` | 节点放置规则 |
| `--update-delay` | 更新之间的延迟 |
| `--limit-cpu` / `--limit-memory` | 资源限制 |

## 📄 示例：创建一个 Web 服务

```bash
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  --network webnet \
  nginx
```
