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
dockerd                   # start the Docker daemon (usually done by the service manager)
docker --help             # top-level help; works on every subcommand
docker info               # system-wide information: storage driver, resources, warnings
docker version            # client and server versions
docker context ls         # list contexts (local socket, remote hosts, ...)
docker context use <ctx>  # target another daemon with the same commands
docker events             # live stream of daemon events
```

## 📦 Images

An image is a stack of read-only layers: code, runtime, libraries and settings baked together.

```bash
docker build -t <image> .                         # build from the Dockerfile in this directory
docker build -t <image>:<tag> .                   # build and tag, e.g. myapp:1.2
docker build -t <image> . --no-cache              # rebuild every layer from scratch
docker build -f <path>/Dockerfile -t <image> .    # use a Dockerfile somewhere else
docker build --build-arg KEY=value -t <image> .   # pass a build argument
docker build --target <stage> -t <image> .        # stop at a stage of a multi-stage build
docker build --platform linux/amd64 -t <image> .  # build for another architecture
docker images                                     # list local images
docker images -a                                  # include intermediate layers
docker tag <image> <user>/<image>:<tag>           # add a name for a registry
docker inspect <image>                            # full metadata as JSON
docker history <image>                            # layers, sizes and the commands behind them
docker rmi <image>                                # delete an image
docker rmi -f <image>                             # ...even if containers reference it
docker image prune                                # remove dangling images
docker image prune -a                             # remove every image no container uses
docker save -o <file>.tar <image>                 # export an image to a tarball
docker load -i <file>.tar                         # import an image from a tarball
```

## 🐳 Registries & Docker Hub

[Docker Hub](https://hub.docker.com) is the default public registry; the same commands work against any other one.

```bash
docker login -u <username>                  # log in to Docker Hub
docker login <registry-url>                 # log in to a private registry (GHCR, ECR, ...)
docker logout                               # drop the stored credentials
docker search <term>                        # search Docker Hub from the terminal
docker pull <image>                         # pull the :latest tag
docker pull <image>:<tag>                   # pull a specific tag
docker pull --platform linux/arm64 <image>  # pull for another architecture
docker push <user>/<image>:<tag>            # publish an image
docker manifest inspect <image>:<tag>       # architectures available for a tag
```

## 🚢 Running Containers

```bash
docker run <image>                           # create and start a container
docker run --name <container> <image>        # give it a stable name
docker run -d <image>                        # detached: run in the background
docker run -it <image> bash                  # interactive shell (sh on minimal images)
docker run --rm <image>                      # delete the container as soon as it exits
docker run -p <host>:<container> <image>     # publish a port, e.g. -p 8080:80
docker run -P <image>                        # publish every EXPOSEd port on random ports
docker run -e KEY=value <image>              # set an environment variable
docker run --env-file ./.env <image>         # load environment variables from a file
docker run -v <volume>:/data <image>         # mount a named volume
docker run -v $(pwd):/app <image>            # bind-mount the current directory
docker run -v $(pwd):/app:ro <image>         # ...read-only
docker run -w /app <image> <command>         # set the working directory
docker run -u $(id -u):$(id -g) <image>      # run as your own UID/GID, not root
docker run --network <network> <image>       # attach to a user-defined network
docker run --restart unless-stopped <image>  # restart policy, see the flags table below
docker run --memory 512m --cpus 1.5 <image>  # cap the resources it may use
docker run --entrypoint <cmd> <image>        # override the image entrypoint
docker create --name <container> <image>     # create without starting
```

## 🎛 Managing Containers

```bash
docker ps                                   # running containers
docker ps -a                                # every container, running or exited
docker ps -q                                # IDs only — handy for scripting
docker ps --filter "status=exited"          # filter by status, name, label, ancestor, ...
docker start <container>                    # start a stopped container
docker stop <container>                     # graceful stop (SIGTERM, then SIGKILL)
docker restart <container>                  # stop and start again
docker kill <container>                     # immediate SIGKILL
docker pause <container>                    # freeze all processes in the container
docker unpause <container>                  # resume them
docker rm <container>                       # remove a stopped container
docker rm -f <container>                    # stop and remove in one go
docker rename <old> <new>                   # rename a container
docker update --restart=always <container>  # change resource limits or restart policy live
docker container prune                      # remove every stopped container
docker wait <container>                     # block until it exits, then print its exit code
```

## 🔍 Inspecting & Debugging

```bash
docker exec -it <container> bash                   # shell inside a running container
docker exec -it <container> sh                     # for alpine/distroless-style images
docker exec -it -u root <container> sh             # get in as root to install debug tools
docker exec <container> <command>                  # run a one-off command
docker logs <container>                            # print the container's output
docker logs -f <container>                         # follow it, like tail -f
docker logs --tail 100 -t <container>              # last 100 lines, with timestamps
docker logs --since 10m <container>                # only the last 10 minutes
docker inspect <container>                         # low-level details as JSON
docker inspect -f '{{.State.Status}}' <container>  # one field via a Go template
docker inspect -f '{{.NetworkSettings.IPAddress}}' <container>
docker stats                                       # live CPU/memory/IO for all containers
docker top <container>                             # processes running inside
docker port <container>                            # published port mappings
docker diff <container>                            # filesystem changes since it started
docker cp <container>:/path/file ./                # copy a file out of a container
docker cp ./file <container>:/path/                # copy a file into a container
docker commit <container> <image>:<tag>            # snapshot a container as a new image
docker attach <container>                          # attach to the main process (Ctrl-P Ctrl-Q detaches)
```

## 💾 Volumes

Volumes keep data outside the container's writable layer, so it survives `docker rm` and image upgrades.

```bash
docker volume create <volume>                             # create a named volume
docker volume ls                                          # list volumes
docker volume inspect <volume>                            # driver, mount point, labels
docker volume rm <volume>                                 # delete a volume (and its data)
docker volume prune                                       # delete every unused volume
docker run -v <volume>:/data <image>                      # named volume, managed by Docker
docker run -v $(pwd):/app <image>                         # bind mount from the host
docker run --mount type=bind,src=$(pwd),dst=/app <image>  # explicit bind-mount syntax
docker run --mount type=volume,src=<volume>,dst=/data <image>
docker run --tmpfs /tmp <image>                           # in-memory scratch space
```

> 💡 Back up a volume: `docker run --rm -v <volume>:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .`

## 🌐 Networks

Containers on the same user-defined network resolve each other by container name.

```bash
docker network ls                                # list networks
docker network create <network>                  # create a bridge network
docker network create --driver bridge --subnet 172.30.0.0/16 <network>
docker network inspect <network>                 # subnet and connected containers
docker network connect <network> <container>     # attach a running container
docker network disconnect <network> <container>  # detach it again
docker network rm <network>                      # delete a network
docker network prune                             # delete every unused network
docker run --network host <image>                # share the host network stack (Linux)
docker run --network none <image>                # no networking at all
```

## 🧩 Docker Compose

Compose describes a multi-container application in a single `compose.yaml` (or `docker-compose.yml`).

```bash
docker compose up                        # start every service in the foreground
docker compose up -d                     # start detached
docker compose up -d --build             # rebuild images first
docker compose up -d <service>           # start one service and its dependencies
docker compose down                      # stop and remove containers and networks
docker compose down -v                   # ...and the named volumes as well
docker compose ps                        # status of the project's services
docker compose logs -f                   # follow the logs of all services
docker compose logs -f <service>         # ...of a single service
docker compose build                     # (re)build the service images
docker compose pull                      # pull the service images
docker compose exec <service> sh         # shell inside a running service
docker compose run --rm <service> <cmd>  # one-off command in a new container
docker compose restart <service>         # restart one service
docker compose stop                      # stop the containers, keep them around
docker compose start                     # start them again
docker compose config                    # validate and print the resolved configuration
docker compose top                       # processes running in each service
docker compose -f <file> up -d           # use a specific compose file
docker compose --profile <name> up -d    # include services behind a profile
docker compose watch                     # rebuild/sync automatically on file changes
```

## 🧹 System & Cleanup

Disk usage adds up fast — these are the commands that give the space back.

```bash
docker system df                             # what images, containers, volumes and cache cost
docker system df -v                          # the same, itemised
docker system prune                          # stopped containers, dangling images, unused networks
docker system prune -a                       # ...plus every image no container uses
docker system prune -a --volumes             # ...plus unused volumes ⚠️ destructive
docker builder prune                         # clear the build cache
docker image prune -a --filter "until=168h"  # images unused for more than a week
```

> ⚠️ `--volumes` deletes data no running container is using. Check `docker volume ls` first.

## 💡 Handy One-Liners

```bash
docker stop $(docker ps -q)                            # stop every running container
docker rm -f $(docker ps -aq)                          # remove every container
docker rmi $(docker images -qf dangling=true)          # remove dangling images
docker exec -it $(docker ps -ql) sh                    # shell into the most recent container
docker run --rm -it -v $(pwd):/app -w /app node:22 sh  # disposable dev environment
docker logs -f $(docker ps -qf name=<partial>)         # follow logs by partial name
docker inspect -f '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}' <container>
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
