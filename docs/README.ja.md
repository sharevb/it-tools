## コンテナイメージの変更点

ベースイメージが`nginx-unpriviledged`になったため、コンテナは80番ではなく**8080**番ポートでListenします。ポートマッピングを`8080:80`から`8080:8080`に更新する必要があります。

環境変数`PORT`でリスニングポートを上書きできます（Dockerオプション `-e PORT=8888`）。

## プルリクエスト歓迎

UIの改善や翻訳、特にその他の貢献大歓迎です。

このIT Toolsのフォークを支持してください： [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS推奨

PGP暗号化などの一部ツールは、HTTPS/SSLでのみ利用可能なWebCrypto APIに依存しています。また、PWAを使用する場合もHTTPSが必要です。

したがって、内部インストールでもLet's EncryptのDNS Challengeを使用してHTTPSを有効にしてください。

## コントリビューター

すでに貢献していただいたすべての方に感謝いたします！

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Windowsでの開発

VSCodeを使用してWindowsで開発するにはWSL2を使用することを推奨します。直接の開発は一部の依存関係のため困難です。

## 追加された機能

- 元のit-toolsのほぼすべてのPR（私のものは192個）
- 元のit-toolsの問題の95%
- 多くの言語での完全なUI翻訳（Google翻訳）
- 多くの[new tools](https://sharevb-it-tools.vercel.app/about)
- 多くのバグ修正と機能強化
- 多くのカスタマイズ（Dockerバージョン）

## コンテナイメージ

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Docker Composeファイルでの使用

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

## ツールのフィルタリングとカスタムホームコンテンツの追加

`home.custom.md`を`/usr/share/nginx/html`にマウントして、首页にカスタムコンテンツを追加できます。

`tools-filter.json`を`/usr/share/nginx/html`にマウントして、利用可能なツールをフィルタリングできます。

## コントリビューション

### 推奨IDEセットアップ

[VSCode](https://code.visualstudio.com/) 以下の拡張機能付き：

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Veturは無効化）
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### プロジェクトセットアップ

```sh
pnpm install --ignore-scripts
```

### 開発用のコンパイルとホットリロード

```sh
pnpm dev
```

### 本番ビルドの型チェック、コンパイル、圧縮

```sh
pnpm build
```

### Vitestでのユニットテスト実行

```sh
pnpm test
```

### ESLintでリント

```sh
pnpm lint
```

### 新しいツールの作成

新しいツールを作成するには、ボイラープレートを生成するスクリプトがあります。単純に実行：

```sh
pnpm run script:create:tool my-tool-name
```

## ライセンス

このプロジェクトは[GNU GPLv3](LICENSE)の下にあります。
