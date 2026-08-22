**Docker Compose** describes a multi-container application in one YAML file and runs it with a single command. The file declares *services* (containers), plus the *networks*, *volumes*, *secrets* and *configs* they use.

> ℹ️ The `version:` key at the top is obsolete — the Compose Spec ignores it. Start the file with `services:`.

## 📁 File Names & Precedence

| File                    | Role                                                         |
|-------------------------|--------------------------------------------------------------|
| `compose.yaml`          | The preferred name (`compose.yml` also works)                |
| `docker-compose.yaml`   | Legacy name, still supported                                 |
| `compose.override.yaml` | Merged on top of the base file automatically                 |
| `-f a.yaml -f b.yaml`   | Explicit list; later files override earlier ones             |
| `.env`                  | Variables for interpolation, read from the project directory |

```bash
# check what Compose actually resolved, after merges and interpolation
docker compose config

# use a specific set of files
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

### YAML rules that bite

- Two spaces per indent level, never tabs
- Keys and values are case-sensitive
- Lists use `-`; quote any string containing `:`, `#`, `{`, `}` or a leading `*`
- `yes`/`no`/`on`/`off` are booleans — quote them if you mean the words

## 🧱 Minimal Structure

```yaml
services:
  web:
    image: nginx:1.27
    ports:
      - "8080:80"
    depends_on:
      - api

  api:
    build: .
    environment:
      DATABASE_URL: postgres://db:5432/app
    networks:
      - backend

networks:
  backend:

volumes:
  db-data:
```

## ⚙️ Service Options

```yaml
services:
  app:
    # where the image comes from
    image: myapp:1.2
    build: .
    pull_policy: always

    # identity and lifecycle
    container_name: myapp
    hostname: app
    restart: unless-stopped
    init: true
    stop_grace_period: 30s

    # what it runs
    entrypoint: ["/entrypoint.sh"]
    command: ["node", "server.js"]
    working_dir: /app
    user: "1000:1000"

    # configuration
    environment:
      NODE_ENV: production
      API_KEY: ${API_KEY}
    env_file:
      - .env
      - .env.production

    # connectivity
    ports:
      - "8080:80"
    expose:
      - "9000"
    networks:
      - frontend
    extra_hosts:
      - "host.docker.internal:host-gateway"
    dns:
      - 1.1.1.1

    # storage
    volumes:
      - db-data:/var/lib/data
      - ./src:/app/src:ro
    tmpfs:
      - /tmp

    # ordering and health
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s

    # host access and limits
    cap_add:
      - SYS_PTRACE
    devices:
      - /dev/dri:/dev/dri
    ulimits:
      nofile: 65535
    deploy:
      resources:
        limits:
          cpus: "1.5"
          memory: 512M

    # bookkeeping
    labels:
      com.example.team: platform
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## 🏗 Build Options

```yaml
services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
      target: production
      args:
        NODE_VERSION: "22"
      cache_from:
        - myapp:cache
      secrets:
        - npmrc
      platforms:
        - linux/amd64
        - linux/arm64
    image: myapp:1.2   # the name given to the built image
```

## 📦 Volumes

```yaml
services:
  db:
    volumes:
      # named volume — managed by Docker, survives 'down'
      - db-data:/var/lib/postgresql/data
      # bind mount — a host path, read-only
      - ./config:/etc/app:ro
      # anonymous volume — keeps node_modules out of the bind mount above
      - /app/node_modules
      # long syntax
      - type: bind
        source: ./src
        target: /app/src
        read_only: true

volumes:
  db-data:
  shared:
    external: true          # created outside Compose
  nfs-data:
    driver_opts:
      type: nfs
      o: addr=10.0.0.10,rw
      device: ":/exports/data"
```

## 🌐 Networks

```yaml
services:
  web:
    networks:
      - frontend
  api:
    networks:
      frontend:
        aliases:
          - api.internal
      backend:

networks:
  frontend:
    driver: bridge
  backend:
    internal: true          # no outbound access
  existing:
    external: true
    name: some-other-network
```

> 💡 Compose creates a default network per project and every service joins it, so containers already reach each other by service name. Declare networks when you want to *separate* things.

## 🔀 Ports

```yaml
services:
  web:
    ports:
      - "8080:80"             # host:container
      - "127.0.0.1:8080:80"   # bind to one interface only
      - "8080-8090:80-90"     # a range
      - "80"                  # random host port
      - target: 80            # long syntax
        published: "8080"
        protocol: tcp
        mode: host
```

## 🧬 Environment Variables

```yaml
services:
  app:
    environment:
      # map form (preferred)
      LOG_LEVEL: debug
      # take the value from the shell or .env
      API_KEY: ${API_KEY}
      # with a default, and a hard requirement
      PORT: ${PORT:-3000}
      DB_URL: ${DB_URL:?DB_URL must be set}
    env_file:
      - path: .env.production
        required: false
```

```bash
# variables come from the shell, .env, and --env-file, in that order of precedence
API_KEY=abc docker compose up -d
docker compose --env-file .env.staging up -d
```

## 🩺 Healthchecks & Startup Order

`depends_on` on its own only waits for the container to *start*. Wait for it to be **healthy** instead:

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  api:
    image: myapi
    depends_on:
      db:
        condition: service_healthy      # or service_started, service_completed_successfully
```

## 🔄 Restart Policies

| Policy           | Behaviour                                                     |
|------------------|---------------------------------------------------------------|
| `no`             | Never restart (the default)                                   |
| `on-failure`     | Restart only on a non-zero exit — `on-failure:5` to cap tries |
| `always`         | Always restart, including after a daemon restart              |
| `unless-stopped` | Like `always`, but stays stopped if you stopped it yourself   |

## 🧩 Profiles

Profiles keep optional services out of the way until you ask for them.

```yaml
services:
  web:
    image: nginx                # no profile: always started

  debug:
    image: busybox
    command: top
    profiles: [debug]

  seed:
    image: myapp
    command: npm run seed
    profiles: [tools]
```

```bash
# start the default services plus one profile
docker compose --profile debug up -d

# several at once
docker compose --profile debug --profile tools up -d

# COMPOSE_PROFILES works too
COMPOSE_PROFILES=debug,tools docker compose up -d
```

## 👀 Watch Mode

`docker compose watch` syncs or rebuilds automatically as you edit — a dev loop without bind-mount surprises.

```yaml
services:
  web:
    build: .
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
        - action: sync+restart
          path: ./config
          target: /etc/app
```

```bash
docker compose watch
```

## ♻️ Reuse: include, extends & anchors

```yaml
# pull in another compose file as if it were written here
include:
  - path: ./monitoring/compose.yaml

services:
  # inherit another service's definition
  worker:
    extends:
      file: common.yaml
      service: base-app
    command: ["node", "worker.js"]

# YAML anchors for repeated blocks
x-logging: &default-logging
  driver: json-file
  options:
    max-size: "10m"

services:
  api:
    logging: *default-logging
  web:
    logging: *default-logging
```

## 🔐 Secrets & Configs

File-based secrets work in plain Compose: each one is mounted read-only at `/run/secrets/<name>`. External secrets and configs require Swarm.

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    configs:
      - source: pg_conf
        target: /etc/postgresql/postgresql.conf

secrets:
  db_password:
    file: ./db_password.txt
  api_token:
    external: true      # Swarm only

configs:
  pg_conf:
    file: ./postgresql.conf
```

## 🖥 GPU & Device Access

```yaml
services:
  # NVIDIA — needs the NVIDIA Container Toolkit on the host
  cuda-app:
    image: nvidia/cuda:12.4.1-base-ubuntu22.04
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all          # or: device_ids: ["0"]
              capabilities: [gpu]

  # Intel iGPU — VAAPI/OpenCL through the render device
  igpu-app:
    image: intel/openvino
    devices:
      - /dev/dri:/dev/dri
    group_add:
      - video
```

## 🚀 Everyday Commands

```bash
# start everything in the background
docker compose up -d

# rebuild the images first
docker compose up -d --build

# start one service and what it depends on
docker compose up -d <service>

# recreate containers even if nothing changed
docker compose up -d --force-recreate

# stop and remove containers and networks
docker compose down

# also remove the named volumes and local images
docker compose down -v --rmi local

# what is running, including health
docker compose ps

# follow the logs
docker compose logs -f
docker compose logs -f --tail 100 <service>

# a shell inside a running service
docker compose exec <service> sh

# a one-off container for a task
docker compose run --rm <service> npm test

# rebuild, pull, restart
docker compose build --no-cache
docker compose pull
docker compose restart <service>

# scale a stateless service
docker compose up -d --scale worker=3

# validate and print the effective configuration
docker compose config
docker compose config --services

# processes and resource usage
docker compose top
docker compose stats
```

## ⚔️ Compose vs Swarm Stacks

Both read a Compose file, but `docker stack deploy` honours a different subset of it.

| Key                              | `docker compose`            | `docker stack deploy`                           |
|----------------------------------|-----------------------------|-------------------------------------------------|
| `build:`                         | ✅ builds locally           | ❌ ignored — push the image to a registry first |
| `restart:`                       | ✅                          | ❌ use `deploy.restart_policy`                  |
| `depends_on:`                    | ✅                          | ❌ ignored — rely on health checks and retries  |
| `profiles:`                      | ✅                          | ❌                                              |
| `develop.watch:`                 | ✅                          | ❌                                              |
| `deploy.replicas/placement`      | ❌ ignored                  | ✅ this is how you scale                        |
| `configs:` / external `secrets:` | ❌ external ones need Swarm | ✅                                              |
| `healthcheck:`                   | ✅                          | ✅ also drives rescheduling                     |
| `volumes:` / `networks:`         | ✅                          | ✅ (overlay networks in Swarm)                  |

> 🧭 Keep `compose.yaml` for local development and a separate `stack.yaml` for Swarm, or put the Swarm-only bits in an override file.

## 📚 Resources

- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [`docker compose` CLI reference](https://docs.docker.com/reference/cli/docker/compose/)
- [Compose watch](https://docs.docker.com/compose/how-tos/file-watch/)
- [Environment variables and interpolation](https://docs.docker.com/compose/how-tos/environment-variables/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
