## Belangrijke wijziging voor containerimage

Omdat het basisimage nu `nginx-unpriviledged` is, luistert de container op poort **8080** en niet 80. U moet dus uw poorttoewijzing bijwerken, namelijk van `8080:80` naar `8080:8080`.

U kunt de luisterpoort overschrijven met de omgevingsvariabele `PORT` (docker-optie `-e PORT=8888`).

## PR Welkom

Vooral voor UI-verbeteringen en vertaling. En voor alles anders.

Wilt u deze fork van IT Tools ondersteunen: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS aanbevolen

Sommige tools zoals PGP-codering zijn afhankelijk van de WebCrypto API die alleen beschikbaar is in HTTPS/SSL. Bovendien is HTTPS vereist als u PWA wilt gebruiken.

Dus zelfs bij interne installaties moet u HTTPS inschakelen met Let's Encrypt via DNS Challenge.

## Bijdragers

Veel dank aan alle mensen die al hebben bijgedragen!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Ontwikkeling onder Windows

Het gebruik van WSL2 wordt aanbevolen om te ontwikkelen met VSCode op Windows. Directe ontwikkeling is lastig (vanwege enkele afhankelijkheden).

## Toegevoegde functies

- Bijna alle [originele it-tools PR's, 192 van mij](https://github.com/CorentinTh/it-tools/pulls)
- 95% van de [originele it-tools problemen](https://github.com/CorentinTh/it-tools/issues)
- Volledige UI-vertaling in veel talen (Google Translated)
- Veel [nieuwe tools](https://sharevb-it-tools.vercel.app/about)
- Veel bugfixes en verbeteringen
- Veel aanpassingen (Docker-versie)

## Containerimages

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Gebruiken in Docker Compose-bestand

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

## Tools filteren en aangepaste startpagina-inhoud toevoegen

U kunt aangepaste inhoud toevoegen aan de startpagina door een `home.custom.md` te mounten in `/usr/share/nginx/html`.

U kunt beschikbare tools filteren door `tools-filter.json` te mounten in `/usr/share/nginx/html`.

## Bijdragen

### Aanbevolen IDE-configuratie

[VSCode](https://code.visualstudio.com/) met de volgende extensies:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (en Vetur uitschakelen)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Projectconfiguratie

```sh
pnpm install --ignore-scripts
```

### Compileren en Hot-Reload voor ontwikkeling

```sh
pnpm dev
```

### Type-check, compileren en minificeren voor productie

```sh
pnpm build
```

### Unit tests uitvoeren met Vitest

```sh
pnpm test
```

### Linten met ESLint

```sh
pnpm lint
```

### Een nieuwe tool maken

Om een nieuwe tool te maken, is er een script dat de boilerplate genereert. Voer gewoon uit:

```sh
pnpm run script:create:tool my-tool-name
```

## Licentie

Dit project is onder [GNU GPLv3](LICENSE).
