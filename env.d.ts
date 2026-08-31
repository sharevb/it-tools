/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  readonly VITE_LANGUAGE?: string;
  readonly VITE_AVAILABLE_LOCALES?: string;
  VITE_PLAUSIBLE_API_HOST: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  PACKAGE_VERSION: string;
  GIT_SHORT_SHA: string;
  PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __IT_TOOLS_CONFIG__?: {
    language?: string;
  };
}
