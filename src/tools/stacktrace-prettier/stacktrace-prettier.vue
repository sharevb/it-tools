<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSStack from 'jsstack.js';
import JavaStack from 'javastack.js';
import PythonStack from 'pythonstack.js';
import NetStack from 'netstack.js';
import domtoimage from 'dom-to-image-more';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useStyleStore } from '@/stores/style.store';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const styleStore = useStyleStore();

const stackType = useQueryParamOrStorage<'net' | 'js' | 'java' | 'python'>({ name: 'type', storageName: 'stackfmt:type', defaultValue: 'net' });
const stackTrace = ref('');
const formatedStackTrace = ref<HTMLElement>();

const stackTraceText = ref('');
watchEffect(() => {
  if (!formatedStackTrace.value) {
    return;
  }
  let cleanedStackTrace;
  try {
    cleanedStackTrace = JSON.parse(stackTrace.value);
  }
  catch (_) {
    cleanedStackTrace = stackTrace.value.replace(/(\\r)?\\n/g, '\n').replace(/(?:^['"])|(?:['"]$)/, '');
  };
  try {
    if (stackType.value === 'js') {
      formatedStackTrace.value.textContent = cleanedStackTrace;
      JSStack('.stacktrace');
    }
    else if (stackType.value === 'java') {
      formatedStackTrace.value.textContent = cleanedStackTrace;
      JavaStack('.stacktrace', { prettyprint: true });
    }
    else if (stackType.value === 'python') {
      formatedStackTrace.value.textContent = cleanedStackTrace;
      PythonStack('.stacktrace', { prettyprint: true });
    }
    else if (stackType.value === 'net') {
      formatedStackTrace.value.innerText = cleanedStackTrace;
      const _ = new NetStack(formatedStackTrace.value, { prettyprint: true });
    }
    stackTraceText.value = formatedStackTrace.value.innerText;
  }
  catch {}
});

const stackTraceMarkdown = computed(() => {
  let lang;
  if (stackType.value === 'net') {
    lang = 'csharp';
  }
  else if (stackType.value === 'js') {
    lang = 'javascript';
  }
  else if (stackType.value === 'java') {
    lang = 'java';
  }
  else if (stackType.value === 'python') {
    lang = 'python';
  }
  return `\`\`\`${lang}\n${formatedStackTrace.value?.innerText}\n\`\`\``;
});

const { copy: copyText } = useCopy({ source: stackTraceText, text: t('tools.stacktrace-prettier.texts.text-formatted-stacktrace-copied-to-the-clipboard') });
const { copy: copyMarkdown } = useCopy({ source: stackTraceMarkdown, text: t('tools.stacktrace-prettier.texts.text-markdown-formatted-stacktrace-copied-to-the-clipboard') });

async function downloadAsPNG() {
  const dataUrl = await domtoimage.toPng(formatedStackTrace.value, { bgcolor: styleStore.isDarkTheme ? '#333' : '#fff' });
  const link = document.createElement('a');
  link.download = 'stacktrace.png';
  link.href = dataUrl;
  link.click();
}

const wrap = ref(true);
</script>

<template>
  <div>
    <n-radio-group v-model:value="stackType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="net"
          :label="t('tools.stacktrace-prettier.texts.label-net')"
        />
        <n-radio
          value="js"
          :label="t('tools.stacktrace-prettier.texts.label-javascript')"
        />
        <n-radio
          value="python"
          :label="t('tools.stacktrace-prettier.texts.label-python')"
        />
        <n-radio
          value="java"
          :label="t('tools.stacktrace-prettier.texts.label-java')"
        />
      </n-space>
    </n-radio-group>

    <div mb-2 flex justify-center>
      <n-checkbox v-model:checked="wrap">
        {{ t('tools.stacktrace-prettier.texts.tag-wrap-lines') }}
      </n-checkbox>
    </div>
    <c-input-text
      v-model:value="stackTrace"
      :label="t('tools.stacktrace-prettier.texts.label-stacktrace')"
      :placeholder="t('tools.stacktrace-prettier.texts.placeholder-paste-your-stacktrace-here')"
      multiline
      rows="5"
    />

    <n-divider />

    <pre ref="formatedStackTrace" class="stacktrace" :style="{ padding: '20px', whiteSpace: wrap ? 'pre-wrap' : 'pre', overflowX: 'auto', wordBreak: 'break-all' }" />

    <div v-if="stackTraceText" flex justify-center gap-1>
      <c-button @click="copyText()">
        {{ t('tools.stacktrace-prettier.texts.tag-copy-formatted-text') }}
      </c-button>
      <c-button @click="copyMarkdown()">
        {{ t('tools.stacktrace-prettier.texts.tag-copy-formatted-markdown') }}
      </c-button>
      <c-button @click="downloadAsPNG()">
        {{ t('tools.stacktrace-prettier.texts.tag-download-as-png') }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.stacktrace) {
pre, code {background-color:#333 !important; color: #fff !important;}
.st-type {color: #0a8472; font-weight: bolder;}
.st-method {color: #70c9ba; font-weight: bolder;}
.st-frame-params {color: #ffffff; font-weight: normal;}
.st-param-type {color: #0a8472;}
.st-param-name {color: #ffffff;}
.st-file {color:#f8b068;}
.st-line {color:#ff4f68;}
.st-methodName {color: #70c9ba;font-weight: bolder;}
.st-column {color: #f8b068;}
.st-lineNumber {color: #ff4f68;}
.st-fileName {color: #85dbff;}
.st-intro {color: #0044dd;}
.st-exception {color: #e40000;}
}
</style>
