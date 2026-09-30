## Cambio importante para la imagen del contenedor

Dado que la imagen base ahora es `nginx-unpriviledged`, el contenedor escuchará en el puerto **8080** y no en el 80. Por lo tanto, necesita actualizar su mapeo de puertos, es decir, de `8080:80` a `8080:8080`.

Puede sobrescribir el puerto de escucha usando la variable de entorno `PORT` (opción docker `-e PORT=8888`).

## PR Bienvenido

Especialmente para mejoras de UI y traducción. Y para cualquier otra cosa.

¿Quieres apoyar este fork de IT Tools?: [Buy me a coffee](https://www.buymeacoffee.com/sharevb)

## Se recomienda HTTPS

Algunas herramientas como el cifrado PGP dependen de la API WebCrypto que solo está disponible en HTTPS/SSL. También, si quieres usar PWA, se requiere HTTPS.

Entonces, incluso en instalaciones internas, deberías habilitar HTTPS usando Let's Encrypt con DNS Challenge.

## Contribuidores

¡Muchas gracias a todas las personas que ya han contribuido!

[![contributors](https://contrib.rocks/image?repo=sharevb/it-tools&refresh=1)](https://github.com/sharevb/it-tools/graphs/contributors)

## Desarrollo en Windows

Se recomienda usar WSL2 para desarrollar con VSCode en Windows. El desarrollo directo es complicado (debido a algunas dependencias).

## Funciones añadidas

- Casi todos los [PR de it-tools original, 192 míos](https://github.com/CorentinTh/it-tools/pulls)
- 95% de los [problemas de it-tools original](https://github.com/CorentinTh/it-tools/issues)
- Traducción completa de UI en muchos idiomas (traducido por Google)
- Muchos [nuevas herramientas](https://sharevb-it-tools.vercel.app/about)
- Muchas correcciones de errores y mejoras
- Muchas personalizaciones (versión Docker)

## Imágenes de contenedor

[GitHub Container Registry](https://github.com/sharevb/it-tools/pkgs/container/it-tools): `ghcr.io/sharevb/it-tools:latest`

[Docker Hub](https://hub.docker.com/r/sharevb/it-tools): `sharevb/it-tools:latest`

## Usar en archivo Docker Compose

```yml
services:
  it-tools:
    container_name: it-tools
    image: sharevb/it-tools:latest
    pulse_policy: always
    restart: unless-stopped
    ports:
      - 8080:8080
```

## Filtrar herramientas y agregar contenido personalizado en home

Puedes agregar contenido personalizado en la página de inicio montando un `home.custom.md` en `/usr/share/nginx/html`.

Puedes filtrar las herramientas disponibles montando `tools-filter.json` en `/usr/share/nginx/html`.

## Contribuir

### Configuración de IDE recomendada

[VSCode](https://code.visualstudio.com/) con las siguientes extensiones:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

### Configuración del proyecto

```sh
pnpm install --ignore-scripts
```

### Compilar y recargar en caliente para desarrollo

```sh
pnpm dev
```

### Verificación de tipos, compilar y minificar para producción

```sh
pnpm build
```

### Ejecutar pruebas unitarias con Vitest

```sh
pnpm test
```

### Lint con ESLint

```sh
pnpm lint
```

### Crear una nueva herramienta

Para crear una nueva herramienta, hay un script que genera la plantilla. Simplemente ejecuta:

```sh
pnpm run script:create:tool my-tool-name
```

## Licencia

Este proyecto está bajo [GNU GPLv3](LICENSE).
