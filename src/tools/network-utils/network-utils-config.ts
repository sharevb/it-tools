import { getITToolsSetting, useITStorage } from '@/composable/queryParams';
import { ref } from 'vue';

export function useNetworkUtilsConfig({
  urlStorageKey,
  authStorageKey,
  defaultUrl = 'http://localhost:8000',
}: {
  urlStorageKey: string;
  authStorageKey: string;
  defaultUrl?: string;
}) {
  const fixedUrl = String(getITToolsSetting(urlStorageKey, '') || '').trim();
  const fixedAuth = String(getITToolsSetting(authStorageKey, '') || '').trim();
  const hasFixedConfig = Boolean(fixedUrl);

  return {
    serverHost: hasFixedConfig ? ref(fixedUrl) : useITStorage(urlStorageKey, defaultUrl),
    serverAuth: hasFixedConfig ? ref(fixedAuth) : useITStorage(authStorageKey, ''),
    hasFixedConfig,
  };
}
