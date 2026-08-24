# build stage
FROM --platform=$BUILDPLATFORM node:24-alpine AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches patches
COPY stubs stubs
RUN npm install -g pnpm@11 && pnpm i --ignore-scripts --frozen-lockfile
COPY . .
# Deliberately no BASE_URL here: the bundle is built path-agnostic (relative asset URLs
# plus a `<base href="/">` in index.html) so that one image can be served from any
# subpath. The path is a runtime setting instead -- see the BASE_URL environment variable
# on the production stage below.
ARG VITE_AVAILABLE_LOCALES
ENV VITE_AVAILABLE_LOCALES=${VITE_AVAILABLE_LOCALES}
ENV VITE_VERCEL_ENV=production
RUN pnpm build

# production stage
FROM nginxinc/nginx-unprivileged:stable-alpine AS production-stage

LABEL maintainer="ShareVB <sharevb@gmail.com>" \
      org.opencontainers.image.authors="ShareVB <sharevb@gmail.com>"
LABEL org.opencontainers.image.source=github.com/sharevb/it-tools

ENV VITE_VERCEL_ENV=production

# The path the app is served under. Override it at run time -- `docker run -e
# BASE_URL=/it-tools/`, `environment: BASE_URL: /it-tools/` in a compose file -- and nginx
# rewrites the `<base href>` in index.html on the way out; nothing is baked in. The build
# arg only moves the default, for anyone who prefers to ship an image that is preconfigured
# for a subpath. See docker-entrypoint.d/18-resolve-base-url.envsh and nginx.conf.
ARG BASE_URL=/
ENV BASE_URL=${BASE_URL}

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/ /docker-entrypoint.d/
ENV PORT=8080

# nginx defaults to `worker_processes auto`, which counts the host's cores and
# ignores the container's cpu limit. On a large host that is hundreds of
# workers in a small container: `docker run -m 192m` is enough to get the
# image OOM-killed on startup. Let the entrypoint size the pool from the cgroup
# cpu quota instead. Uncapped containers still get one worker per core.
ENV NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE=1

# Render the template once here as well. The entrypoint normally re-renders it
# at startup, so a custom $PORT keeps working, but it cannot do so on a
# read-only filesystem (see docker-entrypoint.d/19-skip-envsubst-if-readonly.envsh).
# Without this the image would fall back to the stock welcome config from the
# base image: no SPA fallback, so deep links 404 on refresh, and no COOP/COEP,
# so the WebAssembly-backed tools stop working.
# Sourcing the entrypoint's own resolver keeps the baked-in BASE_URL normalised and
# validated exactly the way a runtime one would be.
RUN . /docker-entrypoint.d/18-resolve-base-url.envsh \
    && envsubst '${PORT} ${BASE_URL} ${BASE_URL_REGEX} ${BASE_URL_NO_SLASH_REGEX}' \
      < /etc/nginx/templates/default.conf.template \
      > /etc/nginx/conf.d/default.conf

EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
