Docker Compose is a powerful tool for defining and running multi-container Docker applications. It uses a YAML file (`compose.yaml`) to configure application services, networks, volumes, and more. This file allows developers to declaratively describe infrastructure and dependencies, making it easier to manage complex environments.

Whether you're building a local dev stack or deploying to production, Compose simplifies orchestration and keeps your configuration readable and version-controlled.

## 📁 File Name
```yaml
compose.yaml
```

### ✅ YAML Formatting Rules

- Use **2 spaces** for indentation (not tabs)
- Keys and values are **case-sensitive**
- Lists use `-` for each item
- Strings with special characters should be quoted
- Environment variables can be defined inline or via `.env` files

## 🧱 Basic Structure

```yaml
services:
  service_name:
    image: image_name:tag
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 'host_port:container_port'
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

## ⚙️ Services

Each service defines a container.

### Common Service Options

```yaml
services:
  web:
    image: nginx:latest
    build:
      context: ./app
      dockerfile: Dockerfile
    command: [nginx, -g, daemon off;]
    container_name: custom_name
    ports:
      - '8080:80'
    expose:
      - '80'
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
      test: [CMD, curl, -f, 'http://localhost']
      interval: 30s
      timeout: 10s
      retries: 5
```

## 🏗️ Build Options

```yaml
build:
  context: ./dir
  dockerfile: Dockerfile
  args:
    build_arg: value
  target: build-stage
```

- **`build:`** Tells Compose how to build the image.
  - `context:` is the directory containing the Dockerfile and source code.
  - `dockerfile:` lets you specify a custom Dockerfile name or path.

## 📦 Volumes

```yaml
volumes:
  data_volume:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
```

### Mounting Volumes

```yaml
volumes:
  - data_volume:/app/data
  - ./local:/container/path
```

- **`volumes:`** Mounts host directories or named volumes into the container.
  - `./src:/app/src` mounts the local `src` folder into the container at `/app/src`.

## 🌐 Networks

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: overlay
```

- **`networks:`** Connects the service to one or more custom networks. Enables service discovery and isolation.

### Assigning Networks to Services

```yaml
services:
  app:
    networks:
      - frontend
      - backend
```

## 🌐 Ports

```yaml
ports:
  - '3000:3000'
```
- **`ports:`** Maps container ports to host ports. Format is `"host:container"`. Useful for exposing services to your local machine.

## 🔐 Secrets (Docker Swarm only)

```yaml
secrets:
  db_password:
    file: ./db_password.txt

services:
  db:
    secrets:
      - db_password
```

## 🔑 Configs (Docker Swarm only)

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

## 🧪 Healthcheck

```yaml
healthcheck:
  test: [CMD, curl, -f, 'http://localhost']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 5s
```

- **`healthcheck:`** Defines how Docker checks if the container is healthy.
  - `test:` is the command to run
  - `interval:` how often to run the check
  - `timeout:` how long to wait for a response
  - `retries:` how many failures before marking unhealthy

## 🔄 Restart Policies

```yaml
restart: no         # Never restart
restart: always     # Always restart
restart: on-failure # Restart on failure
restart: unless-stopped
```

## 🧬 Environment Variables

```yaml
environment:
  - VAR1=value1
  - VAR2=value2
env_file:
  - .env
```

- **`environment:`** Sets environment variables inside the container. Useful for configuration.
- **`env_file:`** Loads environment variables from a file. Keeps secrets and config separate from the Compose file.

## Command

```yaml
command: npm start
```
- **`command:`** Overrides the default command defined in the Dockerfile. Useful for customizing container behavior.

## Dependencies

```yaml
depends_on:
  - db
```
- **`depends_on:`** Specifies service startup order. In Compose, this does not wait for the service to be "ready"—just started.

## 🧹 Clean Up

```bash
docker compose down         # Stop and remove containers, networks, volumes
docker compose down -v      # Also remove named volumes
```

## 🚀 Commands

| Command | Description |
|--------|-------------|
| `docker compose up` | Start services |
| `docker compose up -d` | Start in detached mode |
| `docker compose down` | Stop and remove services |
| `docker compose build` | Build images |
| `docker compose ps` | List containers |
| `docker compose logs` | View logs |
| `docker compose exec <service> <cmd>` | Run command in container |
| `docker compose config` | Validate and view config |


## 🧠 Mounting GPU / iGPU

Docker Compose supports GPU access via the `device_requests` field (Compose v3.8+ and Docker 19.03+).

### ✅ NVIDIA GPU Example

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

### ✅ Intel iGPU (via VAAPI or OpenCL)

```yaml
services:
  igpu-app:
    image: intel/openvino
    devices:
      - /dev/dri:/dev/dri
```

> 🔧 Make sure your host has the necessary drivers and runtime (e.g., NVIDIA Container Toolkit or Intel Media SDK).

## 🔄 Compose vs Swarm YAML Differences

| Feature            | Docker Compose (`compose.yaml`) | Docker Swarm (`stack.yml`) |
|--------------------|----------------------------------------|-----------------------------|
| `restart`          | ✅ Supported                          | ❌ Not supported             |
| `depends_on`       | ✅ Supported                          | ❌ Not supported             |
| `deploy`           | ❌ Ignored                            | ✅ Required for replicas     |
| `build`            | ✅ Supported                          | ❌ Not supported             |
| `volumes` (bind)   | ✅ Supported                          | ✅ Supported                 |
| `configs`/`secrets`| ❌ Ignored                            | ✅ Supported                 |
| `healthcheck`      | ✅ Supported                          | ✅ Supported                 |

> 🧠 **Tip:** Use `compose.yaml` for local development and `stack.yml` for Swarm deployments.

## 🧬 Profiles (Compose v3.9+)

Profiles allow conditional inclusion of services based on the active profile. This is useful for separating dev/test/staging environments.

### ✅ Defining Profiles

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

### ✅ Activating Profiles

```bash
docker compose --profile debug up
```

### ✅ Notes

- Services without a `profiles` key are always included.
- Multiple profiles can be activated simultaneously.
- Useful for feature toggles, optional services, or environment-specific setups.

## ⚔️ YAML Differences: Docker Compose vs Docker Swarm Mode

Docker Compose and Docker Swarm both use YAML files to define services, but they serve different purposes and support different features. Compose is optimized for local development and testing, while Swarm is designed for production-grade orchestration across clusters.

### 🧭 Purpose

| Mode        | Use Case                          |
|-------------|-----------------------------------|
| Compose     | Local development, testing        |
| Swarm       | Cluster deployment, scaling       |

### 🧩 Key Differences in YAML Structure

| Feature              | Compose (`compose.yaml`) | Swarm (`stack.yml`) |
|----------------------|-------------------------------|----------------------|
| `build:`             | ✅ Supported                   | ❌ Ignored            |
| `restart:`           | ✅ Supported                   | ❌ Ignored            |
| `depends_on:`        | ✅ Supported                   | ❌ Ignored            |
| `deploy:`            | ❌ Ignored                     | ✅ Required for scaling, placement |
| `configs:`           | ❌ Ignored                     | ✅ Supported           |
| `secrets:`           | ❌ Ignored                     | ✅ Supported           |
| `healthcheck:`       | ✅ Supported                   | ✅ Supported           |
| `volumes:` (bind)    | ✅ Supported                   | ✅ Supported           |
| `networks:`          | ✅ Supported                   | ✅ Supported           |
| `profiles:`          | ✅ Supported (v3.9+)           | ❌ Not supported       |

### 🔧 Compose-Only Features

These features are useful for local development but are ignored in Swarm:

#### `build:`
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
```
- Compose builds images locally.
- Swarm requires pre-built images pushed to a registry.

#### `restart:`
```yaml
restart: unless-stopped
```
- Compose uses this to auto-restart containers.
- Swarm uses `deploy.restart_policy` instead.

#### `depends_on:`
```yaml
depends_on:
  - db
```
- Compose starts services in order.
- Swarm ignores this; use healthchecks and wait-for-it scripts.

### 🛡️ Swarm-Only Features

These features are exclusive to Swarm and ignored by Compose:

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
- Controls scaling, placement, and restart behavior in a cluster.

#### `configs:` and `secrets:`
```yaml
configs:
  app_config:
    file: ./config.yml

secrets:
  db_password:
    file: ./password.txt
```
- Used to securely distribute configuration and secrets across nodes.

#### `placement:` (inside `deploy`)
```yaml
placement:
  constraints:
    - node.labels.env == production
```
- Assigns services to specific nodes based on labels.

### 🧪 Healthchecks (Supported in Both)

```yaml
healthcheck:
  test: [CMD, curl, -f, 'http://localhost']
  interval: 30s
  timeout: 10s
  retries: 3
```
- Works in both Compose and Swarm.
- In Swarm, health status can influence service rescheduling.

### 📦 Volume Differences

| Type        | Compose | Swarm |
|-------------|---------|-------|
| Bind mount  | ✅       | ✅     |
| Named volume| ✅       | ✅     |
| External volume | ✅   | ✅     |
| Volume driver options | ✅ | ✅ |

Swarm requires external volumes to be pre-created on all nodes.

### 🧠 Summary

| Feature Category     | Compose | Swarm |
|----------------------|---------|-------|
| Local builds         | ✅       | ❌     |
| Cluster scaling      | ❌       | ✅     |
| Secrets/configs      | ❌       | ✅     |
| Profiles             | ✅       | ❌     |
| Restart policies     | ✅       | ✅ (via `deploy`) |
| Service dependencies | ✅       | ❌     |

> 🧭 **Tip:** Use `compose.yaml` for development and `stack.yml` for Swarm. You can split your configuration into multiple files or use tools like `kompose` to convert Kubernetes manifests.

## 📚 Resources

- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/compose/)
- [NVIDIA GPU Support](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Intel GPU Support](https://github.com/intel/media-driver)
