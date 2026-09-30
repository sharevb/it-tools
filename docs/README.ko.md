## 컨테이너 이미지의 중요한 변경

기본 이미지가 `nginx-unpriviledged`가 되었으므로 컨테이너는 80이 아닌 **8080** 포트에서 수신합니다. 因此，您需要更新端口映射，即从 `8080:80` 改为 `8080:8080`。您可以使用环境变量 `PORT` 覆盖侦听端口（docker 选项 `-e PORT=8888`）。

## PR 환영

특히 UI 개선 및 번역에 환영합니다. 그리고 다른 모든 것에도 환영합니다.

이 IT Tools 포크를 지원하고 싶으신가요: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS 권장

PGP 암호화와 같은 일부 도구는 HTTPS/SSL에서만 사용 가능한 WebCrypto API에 의존합니다. 또한 PWA를 사용하려면 HTTPS가 필요합니다.

따라서 내부 설치에서도 DNS 챌린지를 사용하여 Let's Encrypt로 HTTPS를 활성화해야 합니다.

## 기여자

이미 기여해 주신 모든 분들께 감사드립니다!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Windows에서의 개발

VSCode를 사용하여 Windows에서 개발하려면 WSL2 사용을 권장합니다. 직접 개발은 일부 종속성으로 인해 까다로울 수 있습니다.

## 추가된 기능

- 원래 it-tools의 거의 모든 PR, 192개는 제 것입니다
- 원래 it-tools 이슈의 95%
- 많은 언어의 전체 UI 번역 (Google 번역)
- 많은 [새 도구](https://sharevb-it-tools.vercel.app/about)
- 많은 버그 수정 및 개선
- 많은 사용자 정의 (Docker 버전)

## 컨테이너 이미지

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Docker Compose 파일에서 사용

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

## 도구 필터링 및 사용자 정의 홈 콘텐츠 추가

`home.custom.md`를 `/usr/share/nginx/html`에 마운트하여 홈 페이지에 사용자 정의 콘텐츠를 추가할 수 있습니다.

`tools-filter.json`을 `/usr/share/nginx/html`에 마운트하여 사용 가능한 도구를 필터링할 수 있습니다.

## 기여

### 권장 IDE 설정

다음 확장이 있는 [VSCode](https://code.visualstudio.com/):

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur 비활성화)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### 프로젝트 설정

```sh
pnpm install --ignore-scripts
```

### 개발을 위한 컴파일 및 핫 리로드

```sh
pnpm dev
```

### 프로덕션을 위한 타입 체크, 컴파일 및 축소

```sh
pnpm build
```

### Vitest로 단위 테스트 실행

```sh
pnpm test
```

### ESLint로 린트

```sh
pnpm lint
```

### 새 도구 만들기

새 도구를 만들려면 보일러플레이트를 생성하는 스크립트가 있습니다. 다음과 같이 실행하세요:

```sh
pnpm run script:create:tool my-tool-name
```

## 라이선스

이 프로젝트는 [GNU GPLv3](LICENSE) 하에 있습니다.
