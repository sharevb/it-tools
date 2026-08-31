## Konteyner Görüntüsü için Önemli Değişiklik

Artık temel görüntü `nginx-unpriviledged` olduğundan, konteyner 80 yerine **8080** numaralı portu dinleyecektir. Bu nedenle port eşleştirmenizi güncellemeniz gerekir, yani `8080:80`'den `8080:8080`'e.

Dinleme portunu `ORTAM` değişkenini kullanarak geçersiz kılabilirsiniz (docker seçeneği `-e PORT=8888`).

## PR Hoş Geldin

Özellikle UI iyileştirmeleri ve çeviri için. Ve diğer her şey için.

Bu IT Tools fork'unu desteklemek ister misiniz: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS Önerilir

PGP şifreleme gibi bazı araçlar, yalnızca HTTPS/SSL'de mevcut olan WebCrypto API'sine dayanır. Ayrıca, PWA kullanmak istiyorsanız HTTPS gereklidir.

Bu nedenle, dahili kurulumlarda bile DNS Challenge ile Let's Encrypt kullanarak HTTPS'i etkinleştirmelisiniz.

## Katkıda Bulunanlar

Zaten katkıda bulunan tüm insanlara çok teşekkürler!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Windows'ta Geliştirme

VSCode kullanarak Windows'ta geliştirmek için WSL2 kullanılması önerilir. Doğrudan geliştirme zordur (bazı bağımlılıklar nedeniyle).

## Eklenen Özellikler

- Orijinal it-tools'un neredeyse tüm PR'ları, 192'si benim
- Orijinal it-tools sorunlarının %95'i
- Birçok dilde tam UI çevirisi (Google Çeviri tarafından)
- Birçok [yeni araç](https://sharevb-it-tools.vercel.app/about)
- Birçok hata düzeltmesi ve iyileştirme
- Birçok özelleştirme (Docker sürümü)

## Konteyner Görüntüleri

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Docker Compose Dosyasında Kullanım

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

## Araçları Filtreleme ve Özel Ana Sayfa İçeriği Ekleme

Ana sayfaya özel içerik eklemek için `/usr/share/nginx/html` konumuna `home.custom.md` bağlayabilirsiniz.

Kullanılabilir araçları filtrelemek için `/usr/share/nginx/html` konumuna `tools-filter.json` bağlayabilirsiniz.

## Katkı

### Önerilen IDE Kurulumu

Aşağıdaki uzantılara sahip [VSCode](https://code.visualstudio.com/):

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (ve Vetur'u devre dışı bırak)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Proje Kurulumu

```sh
pnpm install --ignore-scripts
```

### Geliştirme için Derleme ve Hot-Reload

```sh
pnpm dev
```

### Üretim için Tür Kontrolü, Derleme ve Minify

```sh
pnpm build
```

### Vitest ile Birim Testlerini Çalıştırma

```sh
pnpm test
```

### ESLint ile Lint

```sh
pnpm lint
```

### Yeni Araç Oluşturma

Yeni bir araç oluşturmak için şablonu oluşturan bir komut dosyası vardır. Şunu çalıştırın:

```sh
pnpm run script:create:tool my-tool-name
```

## Lisans

Bu proje [GNU GPLv3](LICENSE) altında lisanslıdır.
