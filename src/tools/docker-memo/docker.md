Docker provides the ability to package and run an application in a loosely isolated environment called a container. The isolation and security allows you to run many containers simultaneously on a given host. Containers are lightweight and contain everything needed to run the application, so you do not need to rely on what is currently installed on the host. You can easily share containers while you work, and be sure that everyone you share with gets the same container that works in the same way.

## Installation & Resources

- Docker Desktop (Mac, Linux, Windows): https://docs.docker.com/desktop
- Example projects using Docker: https://github.com/docker/awesome-compose
- Official documentation: https://docs.docker.com

## General Commands

Start the Docker daemon:
```bash
dockerd
```

Get help with Docker (works on all subcommands, e.g. `docker run --help`):
```bash
docker --help
```

Display system-wide information:
```bash
docker info
```

Show Docker version (client and server):
```bash
docker version
```

## Images

Docker images are a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries, and settings.

Build an image from a Dockerfile in the current directory:
```bash
docker build -t <image_name> .
```

Build an image without using the cache:
```bash
docker build -t <image_name> . --no-cache
```

Build with a specific tag (e.g. `myapp:v1.2`):
```bash
docker build -t <image_name>:<tag> .
```

List local images:
```bash
docker images
```

Tag an image for pushing to a registry:
```bash
docker tag <image> <username>/<image>:<tag>
```

Delete an image:
```bash
docker rmi <image_name>
```

Remove dangling (unused) images:
```bash
docker image prune
```

Remove all unused images, not just dangling:
```bash
docker image prune -a
```

Show the layers of an image:
```bash
docker history <image_name>
```

## Docker Hub

Docker Hub is a service for finding and sharing container images. Learn more at https://hub.docker.com

Log in to Docker Hub:
```bash
docker login -u <username>
```

Log out:
```bash
docker logout
```

Search Docker Hub for an image:
```bash
docker search <image_name>
```

Pull an image from Docker Hub:
```bash
docker pull <image_name>
```

Pull a specific tagged version:
```bash
docker pull <image_name>:<tag>
```

Publish an image to Docker Hub:
```bash
docker push <username>/<image_name>
```

## Containers

A container is a runtime instance of a Docker image. A container will always run the same, regardless of the infrastructure. Containers isolate software from its environment and ensure it works uniformly across development, staging, and production.

### Running containers

Create and run a container from an image:
```bash
docker run <image_name>
```

Run with a custom name:
```bash
docker run --name <container_name> <image_name>
```

Run in the background (detached):
```bash
docker run -d <image_name>
```

Run interactively with a shell:
```bash
docker run -it <image_name> bash
```

Auto-remove the container when it exits:
```bash
docker run --rm <image_name>
```

Publish a container's port to the host:
```bash
docker run -p <host_port>:<container_port> <image_name>
```

Set an environment variable:
```bash
docker run -e KEY=value <image_name>
```

Load environment variables from a file:
```bash
docker run --env-file ./env.list <image_name>
```

Mount a named volume:
```bash
docker run -v <volume_name>:/path/in/container <image_name>
```

Bind-mount the current directory:
```bash
docker run -v $(pwd):/app <image_name>
```

Set a restart policy (options: `no`, `on-failure`, `always`, `unless-stopped`):
```bash
docker run --restart unless-stopped <image_name>
```

Attach to a specific network:
```bash
docker run --network <network_name> <image_name>
```

### Managing containers

List currently running containers:
```bash
docker ps
```

List all containers (running and stopped):
```bash
docker ps -a
```

Start a stopped container:
```bash
docker start <container_name>
```

Stop a running container:
```bash
docker stop <container_name>
```

Restart a container:
```bash
docker restart <container_name>
```

Remove a stopped container:
```bash
docker rm <container_name>
```

Force-remove a running container:
```bash
docker rm -f <container_name>
```

Remove all stopped containers:
```bash
docker container prune
```

Rename a container:
```bash
docker rename <old_name> <new_name>
```

### Inspecting and interacting

Open a shell inside a running container:
```bash
docker exec -it <container_name> bash
```

Use `sh` for minimal images (e.g. alpine) that don't ship bash:
```bash
docker exec -it <container_name> sh
```

Fetch logs:
```bash
docker logs <container_name>
```

Follow logs (like `tail -f`):
```bash
docker logs -f <container_name>
```

Show only the last 100 lines:
```bash
docker logs --tail 100 <container_name>
```

Show low-level container details (JSON):
```bash
docker inspect <container_name>
```

Live resource usage stats for all containers:
```bash
docker stats
```

Show running processes inside a container:
```bash
docker top <container_name>
```

Copy a file out of a container:
```bash
docker cp <container_name>:/path/in/container ./
```

Copy a file into a container:
```bash
docker cp ./local_file <container_name>:/path/
```

Show filesystem changes since container start:
```bash
docker diff <container_name>
```

## Volumes

Volumes persist data outside the container's writable layer, so data survives container removal.

Create a named volume:
```bash
docker volume create <volume_name>
```

List volumes:
```bash
docker volume ls
```

Show details about a volume:
```bash
docker volume inspect <volume_name>
```

Remove a volume:
```bash
docker volume rm <volume_name>
```

Remove all unused volumes:
```bash
docker volume prune
```

Attach a named volume to a container (managed by Docker):
```bash
docker run -v <volume_name>:/data <image_name>
```

Bind-mount a host path into a container:
```bash
docker run -v $(pwd):/app <image_name>
```

Equivalent bind mount using the `--mount` syntax:
```bash
docker run --mount type=bind,src=$(pwd),dst=/app <image_name>
```

## Networks

Containers on the same network can reach each other by container name.

List networks:
```bash
docker network ls
```

Create a network:
```bash
docker network create <network_name>
```

Show network details:
```bash
docker network inspect <network_name>
```

Attach a running container to a network:
```bash
docker network connect <network_name> <container_name>
```

Detach a container from a network:
```bash
docker network disconnect <network_name> <container_name>
```

Remove a network:
```bash
docker network rm <network_name>
```

Remove all unused networks:
```bash
docker network prune
```

## Docker Compose

Compose runs multi-container apps from a single `compose.yaml` (or `docker-compose.yml`) file.

Start all services (foreground):
```bash
docker compose up
```

Start all services (detached):
```bash
docker compose up -d
```

Rebuild images before starting:
```bash
docker compose up --build
```

Stop and remove containers and networks:
```bash
docker compose down
```

Also remove named volumes:
```bash
docker compose down -v
```

List services in the project:
```bash
docker compose ps
```

Follow logs for all services:
```bash
docker compose logs -f
```

Follow logs for one service:
```bash
docker compose logs -f <service>
```

Build (or rebuild) services:
```bash
docker compose build
```

Pull service images:
```bash
docker compose pull
```

Open a shell in a running service:
```bash
docker compose exec <service> bash
```

Run a one-off command in a new container:
```bash
docker compose run --rm <service> <command>
```

Restart a single service:
```bash
docker compose restart <service>
```

Validate and view the resolved compose file:
```bash
docker compose config
```

## System & Cleanup

Disk usage adds up fast. These commands reclaim space.

Show disk usage (images, containers, volumes, build cache):
```bash
docker system df
```

Remove stopped containers, dangling images, and unused networks:
```bash
docker system prune
```

Also remove all unused images (not just dangling):
```bash
docker system prune -a
```

Also remove unused volumes (destructive — double-check before running):
```bash
docker system prune -a --volumes
```

Clean the build cache:
```bash
docker builder prune
```

## Quick Reference: Common Flags

| Flag | Meaning |
|------|---------|
| `-d` | Detached (run in background) |
| `-it` | Interactive + TTY (for shells) |
| `--rm` | Remove container when it exits |
| `-p host:container` | Publish a port |
| `-v src:dst` | Mount volume or bind mount |
| `-e KEY=value` | Environment variable |
| `--name` | Assign a container name |
| `--network` | Attach to a network |
| `--restart` | Restart policy (`no`, `on-failure`, `always`, `unless-stopped`) |
