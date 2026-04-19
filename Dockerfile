# build stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i --ignore-scripts --frozen-lockfile
COPY . .
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
ARG VITE_AVAILABLE_LOCALES
ENV VITE_AVAILABLE_LOCALES=${VITE_AVAILABLE_LOCALES}
ENV VITE_VERCEL_ENV=production
RUN pnpm build

# production stage
FROM nginxinc/nginx-unprivileged:stable-alpine AS production-stage

LABEL maintainer="ShareVB <sharevb@gmail.com>" \
      org.opencontainers.image.authors="ShareVB <sharevb@gmail.com>"

ENV VITE_VERCEL_ENV=production
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
