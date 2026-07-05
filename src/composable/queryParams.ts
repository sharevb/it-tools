import { useRouteQuery } from '@vueuse/router';
import { type MaybeRef, computed } from 'vue';
import { type RemovableRef, type StorageLike, type UseStorageOptions, get, useStorage } from '@vueuse/core';
import { getCurrentInstance } from 'vue';

export { useQueryParam, useQueryParamOrStorage, useITStorage, getITToolsSetting };

const transformers = {
  number: {
    fromQuery: (value: string) => Number(value),
    toQuery: (value: number) => String(value),
  },
  string: {
    fromQuery: (value: string) => value,
    toQuery: (value: string) => value,
  },
  boolean: {
    fromQuery: (value: string) => value.toLowerCase() === 'true',
    toQuery: (value: boolean) => (value ? 'true' : 'false'),
  },
  object: {
    fromQuery: (value: string) => {
      return JSON.parse(value);
    },
    toQuery: (value: object) => JSON.stringify(value),
  },
};

function useQueryParam<T>({ tool, name, defaultValue }: { tool: string; name: string; defaultValue: T }): RemovableRef<T> {
  const type = typeof defaultValue;
  const transformer = transformers[type as keyof typeof transformers] ?? transformers.string;
  const defaultValueOrSetting = getITToolsSetting(`${tool}:${name}`, defaultValue);

  const proxy = useRouteQuery(name, transformer.toQuery(defaultValueOrSetting as never));

  return computed<T>({
    get() {
      return transformer.fromQuery(proxy.value) as unknown as T;
    },
    set(value) {
      proxy.value = transformer.toQuery(value as never);
    },
  });
}

function useQueryParamOrStorage<T>({ name, storageName, defaultValue }: { name: string; storageName: string; defaultValue: T }) {
  const type = typeof defaultValue;
  const transformer = transformers[type as keyof typeof transformers] ?? transformers.string;

  const defaultValueOrSetting = getITToolsSetting(`${storageName.split(':')[0]}:${name}`, defaultValue);

  const storageRef = useStorage(storageName, defaultValueOrSetting);
  const proxyDefaultValue = transformer.toQuery(defaultValueOrSetting as never);
  const proxy = useRouteQuery(name, proxyDefaultValue);

  const r = isRef(defaultValueOrSetting) ? defaultValueOrSetting as Ref<T> : ref(get(defaultValueOrSetting));

  watch(r,
    (value) => {
      proxy.value = transformer.toQuery(value as never);
      storageRef.value = value as never;
    },
    { deep: true });

  r.value = (proxy.value && proxy.value !== proxyDefaultValue
    ? transformer.fromQuery(proxy.value) as unknown as T
    : storageRef.value as T) as never;

  return r;
}

function useITStorage<T>(key: string, defaults: MaybeRef<T>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableRef<T> {
  const defaultValueOrSetting = getITToolsSetting(key, defaults);
  return useStorage<T>(key, defaultValueOrSetting, storage, options);
}

function getITToolsSetting<T>(key: string, defaultValue: MaybeRef<T>) {
  const itToolsSettings = useITToolsSettings();
  if (!itToolsSettings) {
    return defaultValue;
  }
  if (key.includes(':')) {
    const [tool, subkey] = key.split(':');
    return (itToolsSettings[tool] || {})[subkey] as T ?? defaultValue;
  }
  else {
    return (itToolsSettings)[key] as T ?? defaultValue;
  }
}

let itToolsSettings: Record<string, Record<string, any> | any>;
function useITToolsSettings(): Record<string, Record<string, any>> {
  if (!itToolsSettings) {
    const vm = getCurrentInstance();
    itToolsSettings = vm?.appContext.config.globalProperties.$itToolsSettings as Record<string, Record<string, any>>;
  }
  return itToolsSettings;
}
