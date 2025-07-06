<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Sandybox from 'sandybox';
import { webcrack } from 'webcrack';

const { t } = useI18n();

const input = ref('');
const result = computedAsync(async () => {
  try {
    const inputValue = input.value;
    const sandbox = await Sandybox.create();
    const iframe = document.querySelector('.sandybox') as HTMLIFrameElement;
    iframe?.contentDocument?.head.insertAdjacentHTML(
      'afterbegin',
      '<meta http-equiv="Content-Security-Policy" content="default-src \'none\';">',
    );
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function evalCode(code: string) {
      const fn = await sandbox.addFunction(`() => ${code}`);
      return Promise.race([
        fn(),
        sleep(10_000).then(() => Promise.reject(new Error('Sandbox timeout'))),
      ]).finally(() => sandbox.removeFunction(fn));
    }

    return await webcrack(inputValue, { sandbox: evalCode });
  }
  catch (e: any) {
    return {
      code: `/*\n${e.toString()}\n*/`,
      bundle: '',
    };
  }
});
</script>

<template>
  <iframe class="sandybox" style="display:none" :title="t('tools.js-unobfuscator.texts.title-sandbox')" />
  <CInputText
    v-model:value="input"
    :placeholder="t('tools.js-unobfuscator.texts.placeholder-your-obfuscate-javascript-code')"
    :label="t('tools.js-unobfuscator.texts.label-obfuscate-javascript-code')"
    rows="20"
    autosize
    raw-text
    multiline
    monospace
  />

  <n-form-item :label="t('tools.js-unobfuscator.texts.label-deobfuscated-code')">
    <textarea-copyable :value="result?.code" language="javascript" />
  </n-form-item>
  <n-form-item :label="t('tools.js-unobfuscator.texts.label-bundle')">
    <textarea-copyable :value="result?.bundle" language="javascript" />
  </n-form-item>
</template>
