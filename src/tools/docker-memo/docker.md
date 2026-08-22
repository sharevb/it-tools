**Docker** packages an application and everything it needs into a *container* — a lightweight, isolated process that runs the same way on any host. Images are the immutable blueprints; containers are running instances of them.

- **Image** — a read-only template built from a `Dockerfile`
- **Container** — a running (or stopped) instance of an image
- **Volume** — storage that outlives the container that wrote it
- **Network** — a virtual network where containers reach each other by name
- **Registry** — where images are pushed and pulled (Docker Hub, GHCR, ECR, …)

> 💡 Every subcommand has its own help: `docker run --help`, `docker compose up --help`.

## ⚡ Most-Used Commands

| Command                          | What it does                               |
|----------------------------------|--------------------------------------------|
| `docker ps -a`                   | List all containers, running or not        |
| `docker images`                  | List local images                          |
| `docker run -it --rm <image> sh` | Throwaway shell in a fresh container       |
| `docker exec -it <container> sh` | Shell inside a *running* container         |
| `docker logs -f <container>`     | Follow a container's output                |
| `docker build -t <name>:<tag> .` | Build an image from the local `Dockerfile` |
| `docker compose up -d --build`   | Rebuild and start a whole stack            |
| `docker system df`               | See what is eating your disk               |

## 🧭 General

```bash
# start the Docker daemon (usually done by the service manager)
dockerd

# top-level help; works on every subcommand
docker --help

# system-wide information: storage driver, resources, warnings
docker info

# client and server versions
docker version

# list contexts (local socket, remote hosts, ...)
docker context ls

# target another daemon with the same commands
docker context use <ctx>

# live stream of daemon events
docker events
```

## 📦 Images

An image is a stack of read-only layers: code, runtime, libraries and settings baked together.

```bash
# build from the Dockerfile in this directory
docker build -t <image> .

# build and tag, e.g. myapp:1.2
docker build -t <image>:<tag> .

# rebuild every layer from scratch
docker build -t <image> . --no-cache

# use a Dockerfile somewhere else
docker build -f <path>/Dockerfile -t <image> .

# pass a build argument
docker build --build-arg KEY=value -t <image> .

# stop at a stage of a multi-stage build
docker build --target <stage> -t <image> .

# build for another architecture
docker build --platform linux/amd64 -t <image> .

# list local images
docker images

# include intermediate layers
docker images -a

# add a name for a registry
docker tag <image> <user>/<image>:<tag>

# full metadata as JSON
docker inspect <image>

# layers, sizes and the commands behind them
docker history <image>

# delete an image
docker rmi <image>

# force-delete an image containers still reference
docker rmi -f <image>

# remove dangling images
docker image prune

# remove every image no container uses
docker image prune -a

# export an image to a tarball
docker save -o <file>.tar <image>

# import an image from a tarball
docker load -i <file>.tar
```

## 🐳 Registries & Docker Hub

[Docker Hub](https://hub.docker.com) is the default public registry; the same commands work against any other one.

```bash
# log in to Docker Hub
docker login -u <username>

# log in to a private registry (GHCR, ECR, ...)
docker login <registry-url>

# drop the stored credentials
docker logout

# search Docker Hub from the terminal
docker search <term>

# pull the :latest tag
docker pull <image>

# pull a specific tag
docker pull <image>:<tag>

# pull for another architecture
docker pull --platform linux/arm64 <image>

# publish an image
docker push <user>/<image>:<tag>

# architectures available for a tag
docker manifest inspect <image>:<tag>
```

## 🚢 Running Containers

```bash
# create and start a container
docker run <image>

# give it a stable name
docker run --name <container> <image>

# detached: run in the background
docker run -d <image>

# interactive shell (sh on minimal images)
docker run -it <image> bash

# delete the container as soon as it exits
docker run --rm <image>

# publish a port, e.g. -p 8080:80
docker run -p <host>:<container> <image>

# publish every EXPOSEd port on random ports
docker run -P <image>

# set an environment variable
docker run -e KEY=value <image>

# load environment variables from a file
docker run --env-file ./.env <image>

# mount a named volume
docker run -v <volume>:/data <image>

# bind-mount the current directory
docker run -v $(pwd):/app <image>

# bind-mount the current directory read-only
docker run -v $(pwd):/app:ro <image>

# set the working directory
docker run -w /app <image> <command>

# run as your own UID/GID, not root
docker run -u $(id -u):$(id -g) <image>

# attach to a user-defined network
docker run --network <network> <image>

# restart policy, see the flags table below
docker run --restart unless-stopped <image>

# cap the resources it may use
docker run --memory 512m --cpus 1.5 <image>

# override the image entrypoint
docker run --entrypoint <cmd> <image>

# create without starting
docker create --name <container> <image>
```

## 🎛 Managing Containers

```bash
# running containers
docker ps

# every container, running or exited
docker ps -a

# IDs only — handy for scripting
docker ps -q

# filter by status, name, label, ancestor, ...
docker ps --filter "status=exited"

# start a stopped container
docker start <container>

# graceful stop (SIGTERM, then SIGKILL)
docker stop <container>

# stop and start again
docker restart <container>

# immediate SIGKILL
docker kill <container>

# freeze all processes in the container
docker pause <container>

# resume them
docker unpause <container>

# remove a stopped container
docker rm <container>

# stop and remove in one go
docker rm -f <container>

# rename a container
docker rename <old> <new>

# change resource limits or restart policy live
docker update --restart=always <container>

# remove every stopped container
docker container prune

# block until it exits, then print its exit code
docker wait <container>
```

## 🔍 Inspecting & Debugging

```bash
# shell inside a running container
docker exec -it <container> bash

# for alpine/distroless-style images
docker exec -it <container> sh

# get in as root to install debug tools
docker exec -it -u root <container> sh

# run a one-off command
docker exec <container> <command>

# print the container's output
docker logs <container>

# follow it, like tail -f
docker logs -f <container>

# last 100 lines, with timestamps
docker logs --tail 100 -t <container>

# only the last 10 minutes
docker logs --since 10m <container>

# low-level details as JSON
docker inspect <container>

# one field via a Go template
docker inspect -f '{{.State.Status}}' <container>

# the container's IP address on the default bridge
docker inspect -f '{{.NetworkSettings.IPAddress}}' <container>

# live CPU/memory/IO for all containers
docker stats

# processes running inside
docker top <container>

# published port mappings
docker port <container>

# filesystem changes since it started
docker diff <container>

# copy a file out of a container
docker cp <container>:/path/file ./

# copy a file into a container
docker cp ./file <container>:/path/

# snapshot a container as a new image
docker commit <container> <image>:<tag>

# attach to the main process (Ctrl-P Ctrl-Q detaches)
docker attach <container>
```

## 💾 Volumes

Volumes keep data outside the container's writable layer, so it survives `docker rm` and image upgrades.

```bash
# create a named volume
docker volume create <volume>

# list volumes
docker volume ls

# driver, mount point, labels
docker volume inspect <volume>

# delete a volume (and its data)
docker volume rm <volume>

# delete every unused volume
docker volume prune

# named volume, managed by Docker
docker run -v <volume>:/data <image>

# bind mount from the host
docker run -v $(pwd):/app <image>

# explicit bind-mount syntax
docker run --mount type=bind,src=$(pwd),dst=/app <image>

# the same named volume, spelled out with --mount
docker run --mount type=volume,src=<volume>,dst=/data <image>

# in-memory scratch space
docker run --tmpfs /tmp <image>
```

> 💡 Back up a volume: `docker run --rm -v <volume>:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .`

## 🌐 Networks

Containers on the same user-defined network resolve each other by container name.

```bash
# list networks
docker network ls

# create a bridge network
docker network create <network>

# create a network with a fixed subnet
docker network create --driver bridge --subnet 172.30.0.0/16 <network>

# subnet and connected containers
docker network inspect <network>

# attach a running container
docker network connect <network> <container>

# detach it again
docker network disconnect <network> <container>

# delete a network
docker network rm <network>

# delete every unused network
docker network prune

# share the host network stack (Linux)
docker run --network host <image>

# no networking at all
docker run --network none <image>
```

## 🧩 Docker Compose

Compose describes a multi-container application in a single `compose.yaml` (or `docker-compose.yml`).

```bash
# start every service in the foreground
docker compose up

# start detached
docker compose up -d

# rebuild images first
docker compose up -d --build

# start one service and its dependencies
docker compose up -d <service>

# stop and remove containers and networks
docker compose down

# stop, remove, and delete the named volumes too
docker compose down -v

# status of the project's services
docker compose ps

# follow the logs of all services
docker compose logs -f

# follow the logs of a single service
docker compose logs -f <service>

# (re)build the service images
docker compose build

# pull the service images
docker compose pull

# shell inside a running service
docker compose exec <service> sh

# one-off command in a new container
docker compose run --rm <service> <cmd>

# restart one service
docker compose restart <service>

# stop the containers, keep them around
docker compose stop

# start them again
docker compose start

# validate and print the resolved configuration
docker compose config

# processes running in each service
docker compose top

# use a specific compose file
docker compose -f <file> up -d

# include services behind a profile
docker compose --profile <name> up -d

# rebuild/sync automatically on file changes
docker compose watch
```

## 🧹 System & Cleanup

Disk usage adds up fast — these are the commands that give the space back.

```bash
# what images, containers, volumes and cache cost
docker system df

# the same, itemised
docker system df -v

# stopped containers, dangling images, unused networks
docker system prune

# the same, plus every image no container uses
docker system prune -a

# the same, plus unused volumes ⚠️ destructive
docker system prune -a --volumes

# clear the build cache
docker builder prune

# images unused for more than a week
docker image prune -a --filter "until=168h"
```

> ⚠️ `--volumes` deletes data no running container is using. Check `docker volume ls` first.

## 💡 Handy One-Liners

```bash
# stop every running container
docker stop $(docker ps -q)

# remove every container
docker rm -f $(docker ps -aq)

# remove dangling images
docker rmi $(docker images -qf dangling=true)

# shell into the most recent container
docker exec -it $(docker ps -ql) sh

# disposable dev environment
docker run --rm -it -v $(pwd):/app -w /app node:22 sh

# follow logs by partial name
docker logs -f $(docker ps -qf name=<partial>)

# list every mount of a container
docker inspect \
  -f '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}' <container>
```

## 🛠 Common Flags Reference

| Flag                          | Meaning                                          |
|-------------------------------|--------------------------------------------------|
| `-d`, `--detach`              | Run in the background                            |
| `-it`                         | Interactive session with a TTY (shells)          |
| `--rm`                        | Remove the container when it exits               |
| `-p <host>:<container>`       | Publish a port to the host                       |
| `-v <src>:<dst>[:ro]`         | Named volume or bind mount, optionally read-only |
| `-e KEY=value` / `--env-file` | Environment variables                            |
| `--name`                      | Assign a stable container name                   |
| `--network`                   | Attach to a network                              |
| `--restart`                   | `no`, `on-failure`, `always`, `unless-stopped`   |
| `-u <uid>:<gid>`              | Run as a specific user                           |
| `-w <dir>`                    | Working directory inside the container           |
| `--memory` / `--cpus`         | Resource limits                                  |
| `--platform`                  | Target architecture, e.g. `linux/arm64`          |

## 📚 Resources

- [Official documentation](https://docs.docker.com)
- [Docker Desktop (Mac, Linux, Windows)](https://docs.docker.com/desktop)
- [CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Awesome Compose — example projects](https://github.com/docker/awesome-compose)
