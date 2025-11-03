<script setup lang="ts">
import { compare, hash } from 'bcryptjs';
import { useI18n } from 'vue-i18n';
import { useThemeVars } from 'naive-ui';
import { type BcryptFn, bcryptWithProgressUpdates } from './bcrypt.models';
import { useCopy } from '@/composable/copy';

const { t, locale } = useI18n();

const themeVars = useThemeVars();

interface ExecutionState<T> {
  result: T | null
  percentage: number
  error: string | null
  timeTakenMs: number | null
}

const blankState = () => ({ result: null, percentage: 0, error: null, timeTakenMs: null });

async function exec<Param, Result>(
  fn: BcryptFn<Param, Result>,
  args: [string | null, Param | null],
  signal: AbortSignal,
  state: ExecutionState<Result>,
) {
  const [arg0, arg1] = args;
  if (arg0 == null || arg1 == null) {
    return;
  }

  for await (const update of bcryptWithProgressUpdates(fn, [arg0, arg1], { signal, timeoutMs: 10_000 })) {
    switch (update.kind) {
      case 'progress': {
        state.percentage = Math.round(update.progress * 100);
        break;
      }
      case 'success': {
        state.result = update.value;
        state.timeTakenMs = update.timeTakenMs;
        break;
      }
      case 'error': {
        state.error = update.message;
        break;
      }
    }
  }
}

function initWatcher<Param, Result>(
  fn: BcryptFn<Param, Result>,
  inputs: [Ref<string | null>, Ref<Param | null>],
  state: Ref<ExecutionState<Result>>,
) {
  let controller = new AbortController();
  watch(inputs, (inputs) => {
    controller.abort();
    controller = new AbortController();
    state.value = blankState();
    exec(fn, inputs, controller.signal, state.value);
  });
}

const hashState = ref<ExecutionState<string>>(blankState());
const input = ref('');
const saltCount = ref(10);
initWatcher(hash, [input, saltCount], hashState);

const source = computed(() => hashState.value.result ?? '');
const { copy } = useCopy({ source, text: t('tools.bcrypt.texts.text-hashed-string-copied-to-the-clipboard') });

const compareState = ref<ExecutionState<boolean>>(blankState());
const compareString = ref('');
const compareHash = ref('');
initWatcher(compare, [compareString, compareHash], compareState);
</script>

<template>
  <c-card :title="t('tools.bcrypt.texts.title-hash')">
    <c-input-text
      v-model:value="input"
      :placeholder="t('tools.bcrypt.texts.placeholder-your-string-to-bcrypt')"
      raw-text
      :label="t('tools.bcrypt.texts.label-your-string')"
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item :label="t('tools.bcrypt.texts.label-salt-count')" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" :placeholder="t('tools.bcrypt.texts.placeholder-salt-rounds')" :max="20" :min="4" w-full />
    </n-form-item>

    <n-progress :percentage="hashState.percentage" :show-indicator="false" />
    <c-input-text
      :value="hashState.result ?? undefined"
      :placeholder="hashState.error ?? t('tools.bcrypt.texts.hashed-string')"
      readonly
      text-center
    />
    <div mt-1 h-3 op-60>
      {{ hashState.timeTakenMs == null ? '' : t('tools.bcrypt.texts.hashed-in-elapsed-period', {
        elapsedPeriod: new Intl.DurationFormat(locale, { style: "long" }).format({ milliseconds: hashState.timeTakenMs }),
      }) }}
    </div>

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        {{ t('tools.bcrypt.texts.tag-copy-hash') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.bcrypt.texts.title-compare-string-with-hash')">
    <n-form label-width="120">
      <n-form-item :label="t('tools.bcrypt.texts.label-your-string')" label-placement="left">
        <c-input-text v-model:value="compareString" :placeholder="t('tools.bcrypt.texts.placeholder-your-string-to-compare')" raw-text />
      </n-form-item>
      <n-form-item :label="t('tools.bcrypt.texts.label-your-hash')" label-placement="left">
        <c-input-text v-model:value="compareHash" :placeholder="t('tools.bcrypt.texts.placeholder-your-hash-to-compare')" raw-text />
      </n-form-item>

      <n-progress :percentage="compareState.percentage" :show-indicator="false" />
      <div>
        <c-input-text
          id="bcrypt-compare-result"
          :value="compareState.result == null ? undefined : compareState.result ? t('tools.bcrypt.texts.matched') : t('tools.bcrypt.texts.no-match')"
          :placeholder="compareState.error ?? t('tools.bcrypt.texts.comparison-result')"
          readonly
          text-center
          class="compare-result"
          :class="compareState.result == null ? undefined : compareState.result ? 'positive' : 'negative'"
        />
      </div>
      <div mb-1 mt-1 h-3 op-60>
        {{ compareState.timeTakenMs == null ? '' : t('tools.bcrypt.texts.compared-in-elapsed-period', {
          elapsedPeriod: new Intl.DurationFormat(locale, { style: 'long' }).format({ milliseconds: compareState.timeTakenMs }),
        }) }}
      </div>
    </n-form>
  </c-card>
</template>

<style lang="less">
.compare-result {
  &.negative {
    input#bcrypt-compare-result {
      color: v-bind('themeVars.errorColor');
    }
  }
  &.positive {
    input#bcrypt-compare-result {
      color: v-bind('themeVars.successColor');
    }
  }
}
</style>
