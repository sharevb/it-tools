## Thay đổi quan trọng cho hình ảnh container

Vì hình ảnh cơ sở bây giờ là `nginx-unpriviledged`, container sẽ lắng nghe trên cổng **8080** chứ không phải 80. Vì vậy, bạn cần cập nhật ánh xạ cổng của mình, tức là từ `8080:80` thành `8080:8080`.

Bạn có thể ghi đè cổng lắng nghe bằng biến môi trường `PORT` (tùy chọn docker `-e PORT=8888`).

## PR được chào đón

Đặc biệt cho cải tiến giao diện người dùng và bản dịch. Và cho bất kỳ điều gì khác.

Muốn hỗ trợ fork IT Tools này: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## HTTPS được khuyến nghị

Một số công cụ như mã hóa PGP dựa trên API WebCrypto chỉ có sẵn trong HTTPS/SSL. Ngoài ra, nếu bạn muốn sử dụng PWA, HTTPS là bắt buộc.

Vì vậy, ngay cả trên các cài đặt nội bộ, bạn nên bật HTTPS bằng Let's Encrypt sử dụng DNS Challenge.

## Đóng góp

Cảm ơn tất cả những người đã đóng góp!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Phát triển trên Windows

Nên sử dụng WSL2 để phát triển bằng VSCode trên Windows. Phát triển trực tiếp khó khăn (vì một số phụ thuộc).

## Tính năng được thêm

- Hầu hết [PR của it-tools gốc, 192 của tôi](https://github.com/CorentinTh/it-tools/pulls)
- 95% [vấn đề của it-tools gốc](https://github.com/CorentinTh/it-tools/issues)
- Dịch giao diện người dùng đầy đủ sang nhiều ngôn ngữ (dịch bởi Google)
- Nhiều [công cụ mới](https://sharevb-it-tools.vercel.app/about)
- Nhiều sửa lỗi và cải tiến
- Nhiều tùy chỉnh (phiên bản Docker)

## Hình ảnh container

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Sử dụng trong tệp Docker Compose

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

## Lọc công cụ và thêm nội dung tùy chỉnh vào trang chủ

Bạn có thể thêm nội dung tùy chỉnh vào trang chủ bằng cách gắn `home.custom.md` vào `/usr/share/nginx/html`.

Bạn có thể lọc các công cụ có sẵn bằng cách gắn `tools-filter.json` vào `/usr/share/nginx/html`.

## Đóng góp

### Thiết lập IDE được khuyến nghị

[VSCode](https://code.visualstudio.com/) với các tiện ích mở rộng sau:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (và tắt Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Thiết lập dự án

```sh
pnpm install --ignore-scripts
```

### Biên dịch và Hot-Reload để phát triển

```sh
pnpm dev
```

### Kiểm tra loại, biên dịch và minify cho sản xuất

```sh
pnpm build
```

### Chạy kiểm thử đơn vị với Vitest

```sh
pnpm test
```

### Lint với ESLint

```sh
pnpm lint
```

### Tạo công cụ mới

Để tạo công cụ mới, có một tập lệnh tạo mẫu. Chỉ cần chạy:

```sh
pnpm run script:create:tool my-tool-name
```

## Giấy phép

Dự án này được cấp phép theo [GNU GPLv3](LICENSE).
