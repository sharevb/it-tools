## Важлива зміна для образу контейнера

Оскільки базовий образ тепер `nginx-unpriviledged`, контейнер прослуховуватиме порт **8080**, а не 80. Тому вам потрібно оновити зіставлення портів, тобто з `8080:80` на `8080:8080`.

Ви можете перевизначити порт прослуховування за допомогою змінної середовища `PORT` (опція docker `-e PORT=8888`).

## PR Вітаються

Особливо вітаються покращення інтерфейсу користувача та переклади. І все інше.

Хочете підтримати цей форк IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## Рекомендовано HTTPS

Деякі інструменти, такі як шифрування PGP, покладаються на WebCrypto API, який доступний лише в HTTPS/SSL. Крім того, якщо ви хочете використовувати PWA, потрібен HTTPS.

Тому навіть у внутрішніх установках слід увімкнути HTTPS за допомогою Let's Encrypt з DNS Challenge.

## Учасники

Величезна подяка всім, хто вже зробив внесок!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Розробка в Windows

Рекомендовано використовувати WSL2 для розробки з VSCode в Windows. Пряма розробка ускладнена (через деякі залежності).

## Додані функції

- Майже всі PR оригінального it-tools, 192 мої
- 95% проблем оригінального it-tools
- Повний переклад інтерфейсу користувача на багато мов (перекладено Google)
- Багато [нових інструментів](https://sharevb-it-tools.vercel.app/about)
- Багато виправлень помилок та покращень
- Багато налаштувань (версія Docker)

## Образы контейнерів

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest')

## Використання у файлі Docker Compose

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

## Фільтрація інструментів та додавання власного вмісту на домашню сторінку

Ви можете додати власний вміст на домашню сторінку, змонтувавши `home.custom.md` в `/usr/share/nginx/html`.

Ви можете фільтрувати доступні інструменти, змонтувавши `tools-filter.json` в `/usr/share/nginx/html`.

## Внесок

### Рекомендована налаштування IDE

[VSCode](https://code.visualstudio.com/) з наступними розширеннями:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (і вимкнути Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Налаштування проекту

```sh
pnpm install --ignore-scripts
```

### Компіляція та гаряче перезавантаження для розробки

```sh
pnpm dev
```

### Перевірка типів, компіляція та мініфікація для продакшену

```sh
pnpm build
```

### Запуск юніт-тестів з Vitest

```sh
pnpm test
```

### Лінтинг з ESLint

```sh
pnpm lint
```

### Створення нового інструменту

Для створення нового інструменту є скрипт, який генерує шаблон. Просто виконайте:

```sh
pnpm run script:create:tool my-tool-name
```

## Ліцензія

Цей проект ліцензовано за [GNU GPLv3](LICENSE).
