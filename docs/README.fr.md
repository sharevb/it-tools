## Changement important pour l'image du conteneur

Maintenant que l'image de base est `nginx-unpriviledged`, le conteneur écoute sur le port **8080** et non 80. Vous devez donc mettre à jour votre mapping de ports, c'est-à-dire de `8080:80` à `8080:8080`.

Vous pouvez remplacer le port d'écoute en utilisant la variable d'environnement `PORT` (option docker `-e PORT=8888`).

## PR Bienvenue

Surtout pour les améliorations de l'interface utilisateur et la traduction. Et pour tout autre chose.

Vous voulez soutenir ce fork d'IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS est recommandé

Certains outils comme le chiffrement PGP s'appuient sur l'API WebCrypto qui n'est disponible qu'en HTTPS/SSL. De plus, si vous voulez utiliser PWA, HTTPS est requis.

Donc, même sur les installations internes, vous devez activer HTTPS en utilisant Let's Encrypt avec DNS Challenge.

## Contributeurs

Un grand merci à toutes les personnes qui ont déjà contribué !

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Développement sous Windows

L'utilisation de WSL2 est recommandée pour développer avec VSCode sur Windows. Le développement direct est délicat (à cause de certaines dépendances).

## Fonctionnalités ajoutées

- Presque [tous les PR d'it-tools original, 192 des miens](https://github.com/CorentinTh/it-tools/pulls)
- 95% des [problèmes d'it-tools original](https://github.com/CorentinTh/it-tools/issues)
- Traduction complète de l'interface utilisateur dans de nombreuses langues (traduit par Google)
- De nombreux [nouveaux outils](https://sharevb-it-tools.vercel.app/about)
- De nombreuses corrections de bugs et améliorations
- De nombreuses personnalisations (version Docker)

## Images de conteneur

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Utiliser dans un fichier Docker Compose

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

## Filtrer les outils et ajouter du contenu personnalisé

Vous pouvez ajouter du contenu personnalisé sur la page d'accueil en montant un `home.custom.md` dans `/usr/share/nginx/html`.

Vous pouvez filtrer les outils disponibles en montant `tools-filter.json` dans `/usr/share/nginx/html`.

## Contribuer

### Configuration IDE recommandée

[VSCode](https://code.visualstudio.com/) avec les extensions suivantes :

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (et désactiver Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Configuration du projet

```sh
pnpm install --ignore-scripts
```

### Compiler et recharger à chaud pour le développement

```sh
pnpm dev
```

### Vérification des types, compilation et minification pour la production

```sh
pnpm build
```

### Exécuter les tests unitaires avec Vitest

```sh
pnpm test
```

### Lint avec ESLint

```sh
pnpm lint
```

### Créer un nouvel outil

Pour créer un nouvel outil, il existe un script qui génère le modèle. Il suffit d'exécuter :

```sh
pnpm run script:create:tool my-tool-name
```

## Licence

Ce projet est sous [GNU GPLv3](LICENSE).
