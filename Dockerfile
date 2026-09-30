# build stage
FROM --platform=$BUILDPLATFORM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV npm_config_registry=${NPM_REGISTRY}
ENV npm_config_fetch_retries=5
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_timeout=300000

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches patches
COPY stubs stubs
# Alpine already has Node 24. Keep devEngines but ignore onFail so pnpm does
# not fetch unofficial-builds musl binaries that this host cannot reach.
RUN npm install -g pnpm@12.6.0 \
    && printf 'registry=%s\nreplace-registry-host=always\n' "${npm_config_registry}" > .npmrc \
    && node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8')); if (p.devEngines && p.devEngines.runtime) { p.devEngines.runtime.onFail='ignore'; } if (p.devEngines && p.devEngines.packageManager) { p.devEngines.packageManager.onFail='ignore'; } fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n')" \
    && pnpm i --ignore-scripts --no-frozen-lockfile
COPY . .
# Deliberately no BASE_URL here: the bundle is built path-agnostic (relative asset URLs
# plus a `<base href="/">` in index.html) so that one image can be served from any
# subpath. The path is a runtime setting instead -- see the BASE_URL environment variable
# on the production stage below.
ARG VITE_AVAILABLE_LOCALES
ENV VITE_AVAILABLE_LOCALES=${VITE_AVAILABLE_LOCALES}
ARG VITE_LANGUAGE=en
ENV VITE_LANGUAGE=${VITE_LANGUAGE}
ENV VITE_VERCEL_ENV=production
# Call vite directly. `pnpm build` re-runs install (CI frozen-lockfile) and
# then tries to download unofficial-builds musl Node.
RUN ./node_modules/.bin/vite build

# production stage
FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:4714e0b1b2577eaa1a6131d07c958b67f0eb68e6d0521e90c6e5287db8cf0bc5 AS production-stage

LABEL maintainer="ShareVB <sharevb@gmail.com>" \
      org.opencontainers.image.authors="ShareVB <sharevb@gmail.com>"
LABEL org.opencontainers.image.source=github.com/sharevb/it-tools

ENV VITE_VERCEL_ENV=production
ENV VITE_LANGUAGE=en

# The path the app is served under. Override it at run time -- `docker run -e
# BASE_URL=/it-tools/`, `environment: BASE_URL: /it-tools/` in a compose file -- and nginx
# rewrites the `<base href>` in index.html on the way out; nothing is baked in. The build
# arg only moves the default, for anyone who prefers to ship an image that is preconfigured
# for a subpath. See docker-entrypoint.d/18-resolve-base-url.envsh and nginx.conf.
ARG BASE_URL=/
ENV BASE_URL=${BASE_URL}

# Base image already USER 101. Switch back to root so chown/chmod stick;
# COPY --chown is skipped on some builders and then HEADER_INJECT / VITE_LANGUAGE
# silently no-op at start-up (nginx cannot write the files).
USER root

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/ /docker-entrypoint.d/

# Only these two documents are rewritten at start-up. The rest of dist stays
# root-owned. Entrypoints overwrite in place (no mv) because the directory
# itself is not writable by nginx.
RUN chown nginx:nginx \
        /usr/share/nginx/html/index.html \
        /usr/share/nginx/html/runtime-config.js \
    && chmod 644 \
        /usr/share/nginx/html/index.html \
        /usr/share/nginx/html/runtime-config.js \
    && chmod 755 /docker-entrypoint.d/*.sh /docker-entrypoint.d/*.envsh \
    && grep -q 'HEADER_INJECT' /usr/share/nginx/html/index.html \
    && grep -q '__DEFAULT_LOCALE__' /usr/share/nginx/html/runtime-config.js

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
      > /etc/nginx/conf.d/default.conf \
    && chown nginx:nginx /etc/nginx/conf.d/default.conf \
    && chmod 644 /etc/nginx/conf.d/default.conf

EXPOSE $PORT

USER 101

CMD ["nginx", "-g", "daemon off;"]
