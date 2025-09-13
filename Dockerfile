# build stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile
COPY . .
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
ENV VITE_VERCEL_ENV production
RUN pnpm build

# production stage
FROM nginxinc/nginx-unprivileged:stable-alpine AS production-stage
ENV VITE_VERCEL_ENV production
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
