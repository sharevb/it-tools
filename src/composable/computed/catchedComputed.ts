import { type Ref, ref, watchEffect } from 'vue';

export { computedCatch, computedCatchAsync };

function computedCatch<T, D>(
  getter: () => T,
  { defaultValue }: { defaultValue: D; defaultErrorMessage?: string },
): [Ref<T | D>, Ref<string | undefined>];
function computedCatch<T, D>(
  getter: () => T,
  { defaultValue, defaultErrorMessage = 'Unknown error' }: { defaultValue?: D; defaultErrorMessage?: string } = {},
) {
  const error = ref<string | undefined>();
  const value = ref<T | D | undefined>();

  watchEffect(() => {
    try {
      error.value = undefined;
      value.value = getter();
    } catch (err) {
      error.value = err instanceof Error ? err.message : err?.toString() ?? defaultErrorMessage;
      value.value = defaultValue;
    }
  });

  return [value, error] as const;
}

function computedCatchAsync<T, D>(
  getterAsync: () => Promise<T>,
  { defaultValue }: { defaultValue: D; defaultErrorMessage?: string },
): [Ref<T | D>, Ref<string | undefined>];
function computedCatchAsync<T, D>(
  getterAsync: () => Promise<T>,
  { defaultValue, defaultErrorMessage = 'Unknown error' }: { defaultValue?: D; defaultErrorMessage?: string } = {},
) {
  const error = ref<string | undefined>();
  const value = ref<T | D | undefined>();
  let currentRequestId = 0;

  watchEffect(async () => {
    const requestId = ++currentRequestId;

    try {
      error.value = undefined;
      const result = await getterAsync();

      // Only update value if this is still the latest request
      if (requestId === currentRequestId) {
        value.value = result;
      }
    } catch (err) {
      // Only update error if this is still the latest request
      if (requestId === currentRequestId) {
        error.value = err instanceof Error ? err.message : err?.toString() ?? defaultErrorMessage;
        value.value = defaultValue;
      }
    }
  });

  return [value, error] as const;
}
