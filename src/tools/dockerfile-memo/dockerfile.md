A **Dockerfile** is a script composed of instructions to build a Docker image. Each instruction creates a layer in the image.

## 📦 Basic Structure

```Dockerfile
# Comment
INSTRUCTION arguments
```

## 🚀 Core Instructions

### `FROM`
Specifies the base image.

```Dockerfile
FROM ubuntu:20.04
FROM node:22-alpine
```

### `LABEL`
Adds metadata to the image.

```Dockerfile
LABEL maintainer="you@example.com"
LABEL version="1.0" description="My App"
```

### `ENV`
Sets environment variables.

```Dockerfile
ENV NODE_ENV=production
ENV PATH="/app/bin:$PATH"
```

### `RUN`
Executes commands in a shell during build.

```Dockerfile
RUN apt-get update && apt-get install -y curl
RUN npm install
```

Use `RUN ["executable", "param1", "param2"]` for JSON array form.

### `COPY`
Copies files from host to image.

```Dockerfile
COPY . /app
COPY config.json /app/config.json
```

### `ADD`
Similar to `COPY`, but supports remote URLs and auto-extracts archives.

```Dockerfile
ADD https://example.com/file.tar.gz /app/
ADD archive.zip /app/
```

### `CMD`
Sets default command to run when container starts.

```Dockerfile
CMD ["node", "server.js"]     # Preferred exec form
CMD node server.js            # Shell form
```

Only one `CMD` allowed; later ones override earlier.

### `ENTRYPOINT`
Configures a container to run as an executable.

```Dockerfile
ENTRYPOINT ["python", "app.py"]
```

Use with `CMD` to pass default arguments.

### `WORKDIR`
Sets the working directory for subsequent instructions.

```Dockerfile
WORKDIR /app
```

### `EXPOSE`
Documents the port the container listens on.

```Dockerfile
EXPOSE 80
EXPOSE 443
```

Note: This does not publish the port.

### `VOLUME`
Creates a mount point for persistent or shared data.

```Dockerfile
VOLUME ["/data"]
```

### `USER`
Sets the user to run subsequent instructions.

```Dockerfile
USER appuser
```

### `ARG`
Defines build-time variables.

```Dockerfile
ARG VERSION=1.0
RUN echo $VERSION
```

Use `--build-arg VERSION=2.0` during `docker build`.

### `ONBUILD`
Triggers instructions when the image is used as a base.

```Dockerfile
ONBUILD COPY . /app
```

## 🧠 Best Practices

- Use minimal base images (e.g., `alpine`) for smaller size.
- Combine `RUN` commands to reduce layers.
- Use `.dockerignore` to exclude unnecessary files.
- Prefer `COPY` over `ADD` unless you need archive extraction.
- Use `ENTRYPOINT` for fixed commands and `CMD` for arguments.
- Avoid hardcoding secrets or credentials.

## 🧪 Example Dockerfile

```Dockerfile
FROM node:22-alpine

LABEL maintainer="guillaume@example.com"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]
```

## 🛠️ Build & Run

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
```

## 📁 .dockerignore Example

```plaintext
node_modules
*.log
Dockerfile
.git
```

## 🏗️ Multistage Builds

**Multistage builds** allow you to use multiple `FROM` statements in one Dockerfile to optimize image size and separate build dependencies from runtime.

### 🎯 Why Use Multistage Builds?

- Reduce final image size by excluding build tools and intermediate files.
- Improve security by minimizing attack surface.
- Keep Dockerfiles clean and maintainable.

### 🧱 Basic Syntax

```Dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 🏷️ Named Stages

You can name each stage using `AS <name>` and reference it later with `--from=<name>`.

```Dockerfile
FROM golang:1.21 AS build
WORKDIR /src
COPY . .
RUN go build -o myapp

FROM alpine:latest
COPY --from=build /src/myapp /usr/local/bin/myapp
ENTRYPOINT ["myapp"]
```

### 📦 Copying Artifacts

Use `COPY --from=<stage>` to copy files from one stage to another.

```Dockerfile
COPY --from=builder /app/output /app/output
```

You can copy:
- Files
- Directories
- Binaries
- Configs

### 🧼 Clean Final Image

Multistage builds help you avoid bloated images:

```Dockerfile
# Without multistage: includes compilers, source code, etc.
# With multistage: only includes runtime essentials
```

### 🧪 Real-World Example: React App

```Dockerfile
# Build stage
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```