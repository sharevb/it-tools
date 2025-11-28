# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IT Tools Project Architecture

IT Tools is a modern, frontend-focused Progressive Web App (PWA) built with Vue.js 3. It provides a collection of independent developer tools within a single, cohesive interface. The architecture emphasizes modularity, scalability, and developer experience.

### Core Technologies
- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Framework**: Naive UI
- **Styling**: UnoCSS (utility-first CSS)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Testing**: Vitest (unit) & Playwright (E2E)
- **Internationalization**: Vue I18n

### Project Structure
The codebase follows a clear modular structure:
- `src/tools/`: Each subdirectory represents a self-contained tool with its Vue component and logic
- `src/ui/` & `src/components/`: Reusable UI components and custom design system
- `src/composables/`: Reusable Composition API functions
- `src/stores/`: Pinia stores for global state
- `src/router.ts`: Application routing
- `src/layouts/`: Page layouts

### Key Architectural Patterns
1. **Component-Based Architecture**: Built as a tree of Vue components
2. **Tool-Centric Modularity**: Independent tools allow easy development and maintenance
3. **Progressive Web App**: Supports offline access and installability
4. **Automatic Imports**: Uses `unplugin-auto-import` and `unplugin-vue-components` to reduce boilerplate
5. **WebAssembly Integration**: Uses WASM modules for performance-intensive tasks

### Development Commands
Based on the package.json, here are the key development commands:

```bash
# Install dependencies
pnpm install --ignore-scripts

# Development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test          # Unit tests
pnpm test:unit     # Unit tests specifically
pnpm test:e2e      # End-to-end tests

# Lint code
pnpm lint

# Type checking
pnpm typecheck

# Create a new tool (scaffolding)
pnpm run script:create:tool my-tool-name

# Preview built application
pnpm preview

# Run with coverage
pnpm coverage
```

### Build Configuration
The Vite configuration includes:
- PWA support with service worker
- Markdown support
- SVG loader
- Node polyfills
- WebAssembly support
- Custom base URL support
- Environment-specific optimizations

### Tool Architecture Example
The `base64-string-converter` tool demonstrates the typical tool structure:
- Uses composables for common functionality (copy, query params, storage)
- Implements both encoding and decoding functionality
- Includes validation and internationalization
- Uses custom UI components (`c-card`, `c-input-text`, `c-button`)
- Persists user preferences using `useITStorage`
- Maintains URL parameters with `useQueryParam`

## Container and Deployment

### Container Images
- GitHub Container Registry: `ghcr.io/sharevb/it-tools:latest`
- Docker Hub: `sharevb/it-tools:latest`

### Important Breaking Change
Since the base image is now `nginx-unprivileged`, the container listens on port **8080** instead of 80. Update port mappings from `8080:80` to `8080:8080`.

### Docker Compose Example
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

## Configuration Options

### Custom Content and Filtering
- Add custom content to Home page by mounting `home.custom.md` in `/usr/share/nginx/html`
- Filter available tools by mounting `tools-filter.json` in `/usr/share/nginx/html`

### Default Tool Parameters
Set default tool parameters by mounting `tools-setting.json` in `/usr/share/nginx/html`:
```json
{
  "regex-tester": {
    "multi": true,
    "regex": "some regex",
    "global": false
  }
}
```

### Custom Language and Subfolder Builds
- Build with custom default language: `docker build -t it-tools-fr --build-arg VITE_LANGUAGE=fr .`
- Build with custom subfolder: `docker build -t it-tools --build-arg BASE_URL="/my-folder/" .`

## Development Guidelines

### Creating New Tools
Use the scaffolding script to create new tools:
```bash
pnpm run script:create:tool my-tool-name
```

This creates a directory in `src/tools` with the correct files and imports in `src/tools/index.ts`.

### Testing
- Unit tests use Vitest with JSDOM environment
- E2E tests use Playwright
- Tests run with UTC timezone for consistency

### Internationalization
- Uses Vue I18n for translations
- Language files in `locales/` directory
- Tool-specific locales in `src/tools/*/locales`

This architecture results in a highly scalable application that can support a large collection of developer tools while maintaining performance and consistency.