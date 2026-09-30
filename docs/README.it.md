## Cambiamento importante per l'immagine del contenitore

Poiché l'immagine di base ora è `nginx-unpriviledged`, il contenitore ascolterà sulla porta **8080** e non sulla 80. Quindi devi aggiornare il tuo mapping delle porte, cioè da `8080:80` a `8080:8080`.

Puoi sovrascrivere la porta di ascolto usando la variabile d'ambiente `PORT` (opzione docker `-e PORT=8888`).

## PR Benvenuti

Specialmente per miglioramenti dell'interfaccia utente e traduzione. E per qualsiasi altra cosa.

Vuoi supportare questo fork di IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS è raccomandato

Alcuni strumenti come la crittografia PGP si affidano all'API WebCrypto che è disponibile solo in HTTPS/SSL. Inoltre, se vuoi usare PWA, HTTPS è richiesto.

Quindi, anche nelle installazioni interne, dovresti abilitare HTTPS usando Let's Encrypt con DNS Challenge.

## Contributori

Un grande ringraziamento a tutte le persone che hanno già contribuito!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Sviluppo su Windows

Si consiglia l'uso di WSL2 per sviluppare usando VSCode su Windows. Lo sviluppo diretto è complicato (a causa di alcune dipendenze).

## Funzionalità aggiunte

- Quasi tutti i [PR di it-tools originali, 192 miei](https://github.com/CorentinTh/it-tools/pulls)
- 95% dei [problemi di it-tools originali](https://github.com/CorentinTh/it-tools/issues)
- Traduzione completa dell'interfaccia utente in molte lingue (tradotto da Google)
- Molti [nuovi strumenti](https://sharevb-it-tools.vercel.app/about)
- Molte correzioni di bug e miglioramenti
- Molte personalizzazioni (versione Docker)

## Immagini del contenitore

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Usa in file Docker Compose

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

## Filtra strumenti e aggiungi contenuto personalizzato alla home

Puoi aggiungere contenuto personalizzato alla pagina home montando un `home.custom.md` in `/usr/share/nginx/html`.

Puoi filtrare gli strumenti disponibili montando `tools-filter.json` in `/usr/share/nginx/html`.

## Contribuire

### Configurazione IDE consigliata

[VSCode](https://code.visualstudio.com/) con le seguenti estensioni:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (e disabilita Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Configurazione del progetto

```sh
pnpm install --ignore-scripts
```

### Compila e Hot-Reload per lo sviluppo

```sh
pnpm dev
```

### Controllo tipi, compilazione e minificazione per produzione

```sh
pnpm build
```

### Esegui test unitari con Vitest

```sh
pnpm test
```

### Lint con ESLint

```sh
pnpm lint
```

### Crea un nuovo strumento

Per creare un nuovo strumento, c'è uno script che genera il boilerplate. Esegui semplicemente:

```sh
pnpm run script:create:tool my-tool-name
```

## Licenza

Questo progetto è sotto [GNU GPLv3](LICENSE).
