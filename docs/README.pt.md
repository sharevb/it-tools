## Mudança importante para a imagem do conteneur

Como a imagem base agora é `nginx-unpriviledged`, o contêiner agora escutará na porta **8080** e não na 80. Portanto, você precisa atualizar seu mapeamento de portas, ou seja, de `8080:80` para `8080:8080`.

Você pode substituir a porta de escuta usando a variável de ambiente `PORT` (opção docker `-e PORT=8888`).

## PR Bem-vindo

Especialmente para melhorias de UI e tradução. E para qualquer outra coisa.

Quer apoiar este fork do IT Tools: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS é recomendado

Algumas ferramentas como criptografia PGP dependem da API WebCrypto que está disponível apenas em HTTPS/SSL. Além disso, se você quiser usar PWA, HTTPS é necessário.

Portanto, mesmo em instalações internas, você deve habilitar o HTTPS usando o Let's Encrypt com DNS Challenge.

## Contribuidores

Muito obrigado a todas as pessoas que já contribuíram!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Desenvolvimento no Windows

É recomendado usar WSL2 para desenvolver usando VSCode no Windows. O desenvolvimento direto é complicado (por causa de algumas dependências).

## Recursos adicionados

- Quase todos os [PRs do it-tools original, 192 meus](https://github.com/CorentinTh/it-tools/pulls)
- 95% dos [problemas do it-tools original](https://github.com/CorentinTh/it-tools/issues)
- Tradução completa da UI em muitos idiomas (traduzido pelo Google)
- Muitos [novos ferramentas](https://sharevb-it-tools.vercel.app/about)
- Muitas correções de bugs e melhorias
- Muitas personalizações (versão Docker)

## Imagens de contêiner

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Usar em arquivo Docker Compose

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

## Filtrar ferramentas e adicionar conteúdo personalizado na página inicial

Você pode adicionar conteúdo personalizado na página inicial montando um `home.custom.md` em `/usr/share/nginx/html`.

Você pode filtrar as ferramentas disponíveis montando `tools-filter.json` em `/usr/share/nginx/html`.

## Contribuir

### Configuração de IDE recomendada

[VSCode](https://code.visualstudio.com/) com as seguintes extensões:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (e desativar Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Configuração do projeto

```sh
pnpm install --ignore-scripts
```

### Compilar e Hot-Reload para Desenvolvimento

```sh
pnpm dev
```

### Verificação de tipos, compilar e minificar para Produção

```sh
pnpm build
```

### Executar testes unitários com Vitest

```sh
pnpm test
```

### Lint com ESLint

```sh
pnpm lint
```

### Criar uma nova ferramenta

Para criar uma nova ferramenta, existe um script que gera o modelo. Simplesmente execute:

```sh
pnpm run script:create:tool my-tool-name
```

## Licença

Este projeto está sob [GNU GPLv3](LICENSE).
