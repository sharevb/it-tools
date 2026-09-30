## Важное изменение для образа контейнера

Поскольку базовый образ теперь `nginx-unpriviledged`, контейнер будет прослушивать порт **8080**, а не 80. Поэтому вам нужно обновить сопоставление портов, то есть с `8080:80` на `8080:8080`.

Вы можете переопределить прослушиваемый порт с помощью переменной окружения `PORT` (опция docker `-e PORT=8888`).

## Pull Request Приветствуются

Особенно приветствуются улучшения пользовательского интерфейса и переводы. И все остальное.

Хотите поддержать этот форк IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## Рекомендуется HTTPS

Некоторые инструменты, такие как шифрование PGP, полагаются на WebCrypto API, который доступен только в HTTPS/SSL. Кроме того, если вы хотите использовать PWA, требуется HTTPS.

Поэтому даже во внутренних установках следует включить HTTPS с помощью Let's Encrypt с DNS Challenge.

## Участники

Большое спасибо всем, кто уже внес свой вклад!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Разработка в Windows

Рекомендуется использовать WSL2 для разработки с VSCode в Windows. Прямая разработка затруднена (из-за некоторых зависимостей).

## Добавленные функции

- Почти все [PR оригинального it-tools, 192 моих](https://github.com/CorentinTh/it-tools/pulls)
- 95% [проблем оригинального it-tools](https://github.com/CorentinTh/it-tools/issues)
- Полный перевод пользовательского интерфейса на многие языки (переведено Google)
- Много [новых инструментов](https://sharevb-it-tools.vercel.app/about)
- Много исправлений ошибок и улучшений
- Много настроек (версия Docker)

## Образы контейнеров

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Использование в файле Docker Compose

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

## Фильтрация инструментов и добавление пользовательского контента на главную страницу

Вы можете добавить пользовательский контент на главную страницу, смонтировав `home.custom.md` в `/usr/share/nginx/html`.

Вы можете фильтровать доступные инструменты, смонтировав `tools-filter.json` в `/usr/share/nginx/html`.

## Вклад

### Рекомендуемая настройка IDE

[VSCode](https://code.visualstudio.com/) со следующими расширениями:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (и отключить Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Настройка проекта

```sh
pnpm install --ignore-scripts
```

### Компиляция и горячая перезагрузка для разработки

```sh
pnpm dev
```

### Проверка типов, компиляция и минификация для продакшена

```sh
pnpm build
```

### Запуск юнит-тестов с Vitest

```sh
pnpm test
```

### Линтинг с ESLint

```sh
pnpm lint
```

### Создание нового инструмента

Для создания нового инструмента есть скрипт, который генерирует шаблон. Просто выполните:

```sh
pnpm run script:create:tool my-tool-name
```

## Лицензия

Этот проект находится под [GNU GPLv3](LICENSE).
