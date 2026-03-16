## Ważna zmiana dla obrazu kontenera

Ponieważ obraz bazowy to teraz `nginx-unpriviledged`, kontener będzie nasłuchiwać na porcie **8080**, a nie 80. Dlatego musisz zaktualizować mapowanie portów, czyli z `8080:80` na `8080:8080`.

Możesz nadpisać port nasłuchiwania za pomocą zmiennej środowiskowej `PORT` (opcja docker `-e PORT=8888`).

## PR Mile widziane

Szczególnie mile widziane są poprawki interfejsu użytkownika i tłumaczenia. I wszystko inne.

Chcesz wesprzeć ten fork IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS jest zalecane

Niektóre narzędzia, takie jak szyfrowanie PGP, opierają się na WebCrypto API, które jest dostępne tylko w HTTPS/SSL. Ponadto, jeśli chcesz używać PWA, wymagane jest HTTPS.

Dlatego nawet w instalacjach wewnętrznych powinieneś włączyć HTTPS używając Let's Encrypt z DNS Challenge.

## Współtwórcy

Bardzo dziękujemy wszystkim osobom, które już przyczyniły się do projektu!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Programowanie pod Windows

Zaleca się użycie WSL2 do programowania z VSCode na Windowsie. Bezpośrednie programowanie jest trudne (ze względu na pewne zależności).

## Dodane funkcje

- Prawie wszystkie [PR oryginalnego it-tools, 192 moje](https://github.com/CorentinTh/it-tools/pulls)
- 95% [problemów oryginalnego it-tools](https://github.com/CorentinTh/it-tools/issues)
- Pełne tłumaczenie interfejsu użytkownika na wiele języków (tłumaczone przez Google)
- Wiele [nowych narzędzi](https://sharevb-it-tools.vercel.app/about)
- Wiele poprawek błędów i ulepszeń
- Wiele dostosowań (wersja Docker)

## Obrazy kontenerów

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Użycie w pliku Docker Compose

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

## Filtrowanie narzędzi i dodawanie własnej zawartości strony głównej

Możesz dodać własną zawartość do strony głównej, montując `home.custom.md` w `/usr/share/nginx/html`.

Możesz filtrować dostępne narzędzia, montując `tools-filter.json` w `/usr/share/nginx/html`.

## Współpraca

### Zalecana konfiguracja IDE

[VSCode](https://code.visualstudio.com/) z następującymi rozszerzeniami:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (i wyłącz Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Konfiguracja projektu

```sh
pnpm install --ignore-scripts
```

### Kompilacja i hot-reload dla rozwoju

```sh
pnpm dev
```

### Sprawdzanie typów, kompilacja i minifikacja dla produkcji

```sh
pnpm build
```

### Uruchomienie testów jednostkowych z Vitest

```sh
pnpm test
```

### Lintowanie z ESLint

```sh
pnpm lint
```

### Tworzenie nowego narzędzia

Aby utworzyć nowe narzędzie, istnieje skrypt generujący szablon. Po prostu uruchom:

```sh
pnpm run script:create:tool my-tool-name
```

## Licencja

Ten projekt jest objęty licencją [GNU GPLv3](LICENSE).
