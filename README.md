## BREAKING CHANGE for Docker Image

Since *Docker base image* is now `nginx-unpriviledged`, docker image now listen to **8080** and no more 80. So you need to update your port mapping, ie from `8080:80` to `8080:8080`.

Docker image listen to IPv6, so it needs to be enabled: https://serverfault.com/questions/1147296/how-to-enable-ipv6-on-ubuntu-20-04. Alternatively, you can mount your own `nginx.conf` own using docker option `-v "./nginx.conf:/etc/nginx/conf.d/nginx.conf"` (with `listen [::]:8080;` removed)

## PR Welcome

Especially for UI improvements and translation. And for anything else.

## HTTPS is recommanded

Some tools like PGP encryption rely on WebCrypto API that is only available in HTTPS/SSL. Also, if you want to use PWA, HTTPS is required.

So even on internal installations, you can enable HTTPS using Let's Encrypt using DNS Challenge

Some docs about DNS Challenge:
- https://medium.com/@life-is-short-so-enjoy-it/homelab-nginx-proxy-manager-setup-ssl-certificate-with-domain-name-in-cloudflare-dns-732af64ddc0b
- https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/
- https://medium.com/@svenvanginkel/traefik-letsencrypt-dns01-challenge-with-ovhcloud-52f2a2c6d08a

Related doc for CyberPanel: https://community.cyberpanel.net/t/reverse-proxy-traffic-to-docker-container-on-cyberpanel/30644

### Check out these change here: <https://sharevb-it-tools.vercel.app/> or <https://sharevb.github.io/it-tools/>

You can use my image in your docker-compose file if you want an update to date version of it-tools (with my PR and some of others) until the main branch has been updated.

- github action triggers on every push to this branch - [view package here](https://github.com/sharevb/it-tools/pkgs/container/it-tools)

(Thanks to [gitmotion](https://github.com/gitmotion/it-tools) for this model of README fork)

## Contributors

Big thanks to all the people who have already contributed!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Development under Windows

Use of WSL2 is recommanded to develop using VSCode on Windows. Direct development is tricky (because of some dependencies)

## Added features

Almost [all tools PR of it-tools](https://github.com/sharevb/it-tools/pulls).

## Docker images

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Use in Docker Compose file

```yml
services:
  it-tools:
    container_name: it-tools
    image: sharevb/it-tools:latest
    pull_policy: always
    restart: unless-stopped
    ports:
      - 8080:8080
```

## Filter tools and add home custom content

You can add custom content in Home page by mounting a `home.custom.md` in `/usr/share/nginx/html`.

You can filter available tools by mounting `tools-filter.json` in `/usr/share/nginx/html`. It can contains the following filtering regex:
```json
{
  "excludeCategoryFilterRegex": "",
  "includeCategoryFilterRegex": "",
  "excludeToolsFilterRegex": "",
  "includeToolsFilterRegex": ""
}
```
Category matches on category (English) names ; Tools matches on tools path/url.

See (docker-tools-filter-and-home-content)[https://github.com/sharevb/it-tools]

## Setting default tools parameters / default UI language at runtime

You can set default tools parameters by mounting a `tools-setting.json` in `/usr/share/nginx/html`.

It is a two level json, first level for `tool name`, second level for `parameter name`:
```json
{
  "regex-tester": {
    "multi": true,
    "regex": "some regex",
    "global": false
  }
}
```

You can find `tool name` and `parameter name` in the tools source code `src/tools` subfolder :
- for pattern like `const global = useQueryParamOrStorage({ storageName: 'regex-tester:g', name: 'global', defaultValue: true });`:
```json
{
  "regex-tester": {
    "global": false
  }
}
```
- for pattern like `const value = useQueryParam({ tool: 'barcode-gen', name: 'text', defaultValue: '123456789' });`:
```json
{
  "barcode-gen": {
    "text": "4356"
  }
}
```
- for pattern like `const width = useITStorage('ascii-text-drawer:width', 80);`:
```json
{
  "ascii-text-drawer": {
    "width": 80
  }
}
```

To define default UI language, add a `default_locale` key to json:
```json
{
  "default_locale": "fr"
}
```

## To build using a custom default language:

```
docker build -t it-tools-fr --build-arg VITE_LANGUAGE=fr .
docker run -d --name it-tools-fr --restart unless-stopped -p 8080:8080 it-tools-fr
```

## Build docker image for a custom subfolder

According to https://github.com/sharevb/it-tools/pull/461#issuecomment-1602506049 and https://github.com/CorentinTh/it-tools/pull/461:
```
docker build -t it-tools  --build-arg BASE_URL="/my-folder/" .
docker run -d --name it-tools --restart unless-stopped -p 8080:8080 it-tools
```

Then if you go to `http://localhost:8080` you'll get a blank page, but opening the DevTools (& refreshing) you'll notice in the Network tab that the app is trying to fetch assets from `/my-folder/...`

So you would need to put another server in front of it, like [Nginx Proxy Manager](https://nginxproxymanager.com/), [Traefik](https://traefik.io/traefik/), [caddy](https://caddyserver.com/) etc. Then setup a reverse proxy pass using `/my-folder`

## Docker compose for hosting in a `/it-tools/` subfolder

For `/it-tools/` subfolder, you can use `baseurl-it-tools` tag.

See [sample of docker-compose.yml and nginx.conf](https://github.com/sharevb/it-tools/docker-subfolder-sample), this docker image needs to have another reverse proxy in front of it, like [Nginx Proxy Manager](https://nginxproxymanager.com/), [Traefik](https://traefik.io/traefik/), [caddy](https://caddyserver.com/) etc. 

Setup a reverse proxy pass using `/it-tools/`. And you should be able to access it-tools in `/it-tools/` of your server.

To run the sample:

```bash
git clone https://github.com/sharevb/it-tools
cd it-tools/docker-subfolder-sample/
docker compose up
```

Then navigate to http://localhost:8080/it-tools/

## To build using a custom folder:

1. `BASE_URL="/it-tools/" pnpm build`
2. Rename the generated `dist` folder to `it-tools` and serve on `https://your-domain.com/it-tools`

## To build for GitHub Pages:

1. Enable GitHub Pages build and deployment option in your fork, under **Settings** > **Pages** and select **GitHub Actions** as the source
2. Add the following GitHub action to your repo: https://github.com/sharevb/it-tools/.github/workflows/sharevb-github-pages-publish.yml

## To add authentication

Assuming you're already hosting it-tools behind a reverse proxy, you can configure forward-auth and enforce authentication from the reverse proxy

* [Official guides](https://docs.goauthentik.io/docs/add-secure-apps/providers/proxy/server_nginx) with nginx. Guides with other reverse proxy setups are available
* [Step-by-step setup guide with nginx-proxy-manager](https://geekscircuit.com/set-up-authentik-sso-with-nginx-proxy-manager/)

(thanks @jogerj)

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

with the following settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Create a new tool

To create a new tool, there is a script that generate the boilerplate of the new tool, simply run:

```sh
pnpm run script:create:tool my-tool-name
```

It will create a directory in `src/tools` with the correct files, and a the import in `src/tools/index.ts`. You will just need to add the imported tool in the proper category and develop the tool.

## Installation methods

Local installation required installing first: `python3 make g++`

| Docker Image                            | Local Installation                                                                                                          |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| GitHub Container Registry: <span title="triple click me!">`ghcr.io/sharevb/it-tools:latest`</span><br/>Docker Hub: <span title="triple click me!">`sharevb/it-tools:latest`</span> | <span title="triple click me!">`sudo apt-get install python3 make g++ && git clone -b chore/all-my-stuffs https://github.com/sharevb/it-tools.git && cd it-tools/ && pnpm i && pnpm dev`</span> |
| replace your current image with this image | copy & paste oneliner (from github repo) |
| You may need to clear cache and hard reload to get new features loading | Installing packages for the first time may take some time; please wait until it finishes |

<picture>
    <source srcset="./.github/logo-dark.png" media="(prefers-color-scheme: light)">
    <source srcset="./.github/logo-white.png" media="(prefers-color-scheme: dark)">
    <img src="./.github/logo-dark.png" alt="logo">
</picture>

<details>

Useful tools for developer and people working in IT. [Have a look !](https://sharevb-it-tools.vercel.app).

## Functionalities and roadmap

Please check the [issues](https://github.com/sharevb/it-tools/issues) to see if some feature listed to be implemented.

You have an idea of a tool? Submit a [feature request](https://github.com/sharevb/it-tools/issues/new/choose)!

## Self host

Self host solutions for your homelab

**From docker hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:8080 corentinth/it-tools:latest
```

**From github packages:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:8080 ghcr.io/corentinth/it-tools:latest
```

**Other solutions:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)
- [YunoHost](https://apps.yunohost.org/app/it-tools)


## Contributors

Big thanks to all the people who have already contributed!

[![contributors](https://contrib.rocks/image?repo=corentinth/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Credits

Coded with ❤️ by [Corentin Thomasset](https://corentin.tech?utm_source=it-tools&utm_medium=readme).

This project is continuously deployed using [vercel.com](https://vercel.com).

Contributor graph is generated using [contrib.rocks](https://contrib.rocks/preview?repo=corentinth/it-tools).

<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=345793&theme=light" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=345793&theme=light&period=daily" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## License

This project is under the [GNU GPLv3](LICENSE).

</details>
