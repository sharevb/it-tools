A **Dockerfile** is the recipe for an image: each instruction runs in order and most of them add a layer. Layers are cached, so the order you write them in decides how fast your rebuilds are.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

> 💡 Start the file with `# syntax=docker/dockerfile:1` to get the current BuildKit frontend — that is what enables heredocs, cache mounts and build secrets.

## 📋 Instruction Reference

| Instruction   | Purpose                                                       |
|---------------|---------------------------------------------------------------|
| `FROM`        | The base image, and the start of a build stage                |
| `ARG`         | A build-time variable (`--build-arg`)                         |
| `ENV`         | An environment variable, kept in the final image              |
| `WORKDIR`     | The working directory for the instructions that follow        |
| `COPY`        | Copy files from the context (or another stage) into the image |
| `ADD`         | Like `COPY`, but also fetches URLs and unpacks archives       |
| `RUN`         | Execute a command at build time and commit the result         |
| `CMD`         | Default command, easily overridden at `docker run`            |
| `ENTRYPOINT`  | The executable the container always runs                      |
| `EXPOSE`      | Document the port the app listens on                          |
| `USER`        | The user the following instructions and the container run as  |
| `VOLUME`      | Declare a path that should be a mount point                   |
| `HEALTHCHECK` | How Docker decides the container is healthy                   |
| `LABEL`       | Image metadata                                                |
| `SHELL`       | Change the shell used by the shell form of `RUN`/`CMD`        |
| `STOPSIGNAL`  | The signal sent to stop the container                         |
| `ONBUILD`     | An instruction that runs when this image is used as a base    |

## 🏗 Base Image & Metadata

```dockerfile
# pin the base image — 'latest' makes builds irreproducible
FROM node:22-alpine

# name a stage so later stages can copy from it
FROM golang:1.23 AS build

# an ARG before the first FROM can parameterise the base image itself
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine

# metadata; the OCI keys are the conventional ones
LABEL org.opencontainers.image.source="https://github.com/acme/app"
LABEL org.opencontainers.image.description="Acme API"
```

## 📂 Files & Working Directory

```dockerfile
# always set an absolute working directory
WORKDIR /app

# copy from the build context
COPY package*.json ./
COPY . .

# copy and set ownership in one step, no extra layer for chown
COPY --chown=node:node . .

# copy with explicit permissions
COPY --chmod=755 entrypoint.sh /usr/local/bin/

# copy from another stage, or straight from another image
COPY --from=build /src/app /usr/local/bin/app
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf

# ADD unpacks archives and fetches URLs — prefer COPY unless you need that
ADD archive.tar.gz /opt/
ADD https://example.com/file.tar.gz /tmp/

# declare a mount point for data that should not live in the image
VOLUME ["/data"]
```

## ⚙️ Build Steps

```dockerfile
# shell form: runs through /bin/sh -c
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# exec form: no shell, so no globbing or variable expansion
RUN ["npm", "ci", "--omit=dev"]

# heredoc: a readable multi-line script (BuildKit)
RUN <<EOF
set -eux
apk add --no-cache curl
adduser -D appuser
EOF

# cache mount: keep the package cache between builds
RUN --mount=type=cache,target=/root/.npm npm ci

# secret mount: use a credential without baking it into a layer
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

# bind mount: read from the context without copying it in
RUN --mount=type=bind,source=package.json,target=package.json npm ci
```

## 🚀 Runtime Configuration

```dockerfile
# environment variables are visible to the running container
ENV NODE_ENV=production
ENV PATH="/app/bin:$PATH"

# document the port — this does not publish it, -p does
EXPOSE 3000

# drop root as early as you can
RUN adduser -D appuser
USER appuser

# tell Docker how to check the app is alive
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# the signal that stops the process cleanly
STOPSIGNAL SIGTERM

# the command the container runs
CMD ["node", "server.js"]
```

## ⚔️ CMD vs ENTRYPOINT

|                                | `CMD`                                           | `ENTRYPOINT`                             |
|--------------------------------|-------------------------------------------------|------------------------------------------|
| Purpose                        | Default arguments, or the whole default command | The executable the image is built around |
| `docker run <image> other-cmd` | Replaced entirely                               | Still runs; the argument is appended     |
| Override flag                  | —                                               | `--entrypoint`                           |
| Typical use                    | `CMD ["node", "server.js"]`                     | `ENTRYPOINT ["python", "app.py"]`        |

```dockerfile
# together: ENTRYPOINT is the binary, CMD holds the default arguments
ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8000"]

# docker run image                 → python app.py --port 8000
# docker run image --port 9000     → python app.py --port 9000
```

> ⚠️ Prefer the **exec form** (`["cmd", "arg"]`). The shell form wraps your process in `/bin/sh -c`, which swallows `SIGTERM` and turns graceful shutdown into a ten-second kill.

## 🧱 Multi-Stage Builds

Several `FROM` instructions in one file: build with a fat toolchain, ship only the artifact.

```dockerfile
# stage 1 — build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2 — the image that actually ships
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# a compiled binary on a near-empty base
FROM golang:1.23 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

```bash
# build only up to a named stage — handy for a test or lint stage
docker build --target build -t app:build .
```

## 📁 .dockerignore

Everything in the build context is sent to the daemon and busts the cache. Exclude what the build does not need:

```plaintext
.git
node_modules
dist
*.log
.env
Dockerfile
.dockerignore
```

## 🧠 Best Practices

- **Order by how often things change**: base image, then dependency manifests, then `npm ci`/`pip install`, then the source. A source edit should not reinstall dependencies.
- **Pin versions** — `node:22.11-alpine`, not `node:latest`.
- **One `RUN` per logical step**, chaining installs and cleanup in the same layer (`rm -rf /var/lib/apt/lists/*`), or the deleted files still weigh on the image.
- **Never bake secrets in.** A deleted file stays in the layer below; use `--mount=type=secret` or build arguments that never reach the final stage.
- **Run as a non-root user** and keep the final stage as small as you can (`alpine`, `distroless`, `scratch`).
- **Use `COPY`, not `ADD`,** unless you specifically want URL fetching or archive extraction.
- **Combine with `--platform`** for multi-arch: `docker buildx build --platform linux/amd64,linux/arm64`.

## 🛠 Building & Running

```bash
# build from the Dockerfile in this directory
docker build -t my-app .

# build without the cache
docker build --no-cache -t my-app .

# a Dockerfile somewhere else
docker build -f docker/Dockerfile.prod -t my-app .

# pass a build argument
docker build --build-arg NODE_VERSION=20 -t my-app .

# pass a secret (never becomes a layer)
docker build --secret id=npmrc,src=$HOME/.npmrc -t my-app .

# build for another architecture
docker buildx build --platform linux/arm64 -t my-app .

# inspect the layers of the result
docker history my-app

# run it
docker run -p 3000:3000 my-app
```

## 📄 Full Example

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine
LABEL org.opencontainers.image.source="https://github.com/acme/app"
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

## 📚 Resources

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Building best practices](https://docs.docker.com/build/building/best-practices/)
- [BuildKit mounts (cache, secret, bind)](https://docs.docker.com/build/cache/optimize/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
