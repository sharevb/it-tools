## Wichtige Änderung für das Container-Image

Da das Basis-Image jetzt `nginx-unpriviledged` ist, lauscht der Container auf Port **8080** und nicht auf 80. Sie müssen daher Ihre Port-Zuordnung aktualisieren, d.h. von `8080:80` zu `8080:8080`.

Sie können den lauschenden Port mit der Umgebungsvariable `PORT` überschreiben (Docker-Option `-e PORT=8888`).

## Pull-Request willkommen

Besonders für UI-Verbesserungen und Übersetzungen. Und für alles andere.

Sie möchten diesen Fork von IT Tools unterstützen: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS wird empfohlen

Einige Tools wie PGP-Verschlüsselung verlassen sich auf die WebCrypto-API, die nur in HTTPS/SSL verfügbar ist. Außerdem wird HTTPS benötigt, wenn Sie PWA verwenden möchten.

Sie sollten also auch bei internen Installationen HTTPS mit Let's Encrypt über DNS-Challenge aktivieren.

## Mitwirkende

Vielen Dank an alle, die bereits beigetragen haben!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Entwicklung unter Windows

Die Verwendung von WSL2 wird für die Entwicklung mit VSCode unter Windows empfohlen. Die direkte Entwicklung ist schwierig (wegen einiger Abhängigkeiten).

## Hinzugefügte Funktionen

- Fast alle [Original it-tools PRs, 192 von mir](https://github.com/CorentinTh/it-tools/pulls)
- 95% der [Original it-tools Issues](https://github.com/CorentinTh/it-tools/issues)
- Vollständige UI-Übersetzung in viele Sprachen (Google-übersetzt)
- Viele [neue Tools](https://sharevb-it-tools.vercel.app/about)
- Viele Fehlerkorrekturen und Verbesserungen
- Viele Anpassungen (Docker-Version)

## Container-Images

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## In Docker Compose verwenden

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

## Tools filtern und eigene Startseite hinzufügen

Sie können eigene Inhalte zur Startseite hinzufügen, indem Sie `home.custom.md` nach `/usr/share/nginx/html` einhängen.

Sie können verfügbare Tools filtern, indem Sie `tools-filter.json` nach `/usr/share/nginx/html` einhängen.

## Beitragen

### Empfohlene IDE-Einrichtung

[VSCode](https://code.visualstudio.com/) mit folgenden Erweiterungen:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (und Vetur deaktivieren)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Projekteinrichtung

```sh
pnpm install --ignore-scripts
```

### Kompilieren und Heißen Neustart für Entwicklung

```sh
pnpm dev
```

### Typprüfung, Kompilieren und Minifizieren für Produktion

```sh
pnpm build
```

### Unit-Tests mit Vitest ausführen

```sh
pnpm test
```

### Mit ESLint prüfen

```sh
pnpm lint
```

### Ein neues Tool erstellen

Um ein neues Tool zu erstellen, gibt es ein Skript, das die Vorlage generiert. Führen Sie einfach aus:

```sh
pnpm run script:create:tool my-tool-name
```

## Lizenz

Dieses Projekt ist unter [GNU GPLv3](LICENSE).
