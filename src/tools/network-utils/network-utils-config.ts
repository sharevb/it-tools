import { getITToolsSetting, useITStorage } from '@/composable/queryParams';
import { ref } from 'vue';

export function useNetworkUtilsConfig({ toolKey, urlStorageKey, authStorageKey }: { toolKey: string; urlStorageKey: string; authStorageKey: string }) {
  const fixedUrl = String(getITToolsSetting(`${toolKey}:url`, '') || '').trim();
  const fixedAuth = String(getITToolsSetting(`${toolKey}:auth`, '') || '').trim();
  const hasFixedConfig = Boolean(fixedUrl);

  return {
    serverHost: hasFixedConfig
      ? ref(fixedUrl)
      : useITStorage(urlStorageKey, 'http://localhost:8000'),
    serverAuth: hasFixedConfig
      ? ref(fixedAuth)
      : useITStorage(authStorageKey, ''),
    hasFixedConfig,
  };
}
