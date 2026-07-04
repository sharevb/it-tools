<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import EmailBounceParse from 'email-bounce-parser-browser';

const { t } = useI18n();

const emailContent = ref('');

const parsedBounce = computed(() => {
  try {
    return { email: new EmailBounceParse().read(emailContent.value) };
  }
  catch (e: any) {
    return { parsingError: e.toString() };
  }
});
</script>

<template>
  <div>
    <c-card :title="t('tools.bounce-parser.texts.title-input')" mb-2>
      <c-input-text
        v-model:value="emailContent"
        :label="t('tools.bounce-parser.texts.label-bounce-email-textual-content')"
        multiline
        :placeholder="t('tools.bounce-parser.texts.placeholder-put-your-email-text-content-here')"
        rows="15"
        mb-2
      />
    </c-card>

    <c-card v-if="parsedBounce && emailContent" :title="t('tools.bounce-parser.texts.title-output')" mb-2>
      <n-p v-if="parsedBounce.email?.email?.error" style="color: green" mb-2>
        {{ t('tools.bounce-parser.texts.tag-this-mail-is-a-bounce-email') }}
      </n-p>
      <n-p v-if="!parsedBounce.email?.email?.error" style="color: red" mb-2>
        {{ t('tools.bounce-parser.texts.tag-this-mail-is-not-a-bounce-email') }}
      </n-p>
      <c-alert v-if="parsedBounce.parsingError" mb-2>
        {{ parsedBounce.parsingError }}
      </c-alert>
      <input-copyable v-if="parsedBounce.email?.data?.recipient" :label="t('tools.bounce-parser.texts.label-recipient')" :value="parsedBounce.email?.data?.recipient" mb-2 />
      <div v-if="parsedBounce.email?.email?.error">
        <c-card :title="t('tools.bounce-parser.texts.title-error')" mb-2>
          <input-copyable v-if="parsedBounce.email?.data?.command" :label="t('tools.bounce-parser.texts.label-command')" :value="parsedBounce.email?.data?.command" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.code?.basic || parsedBounce.email?.data?.error?.code?.enhanced" :label="t('tools.bounce-parser.texts.label-code')" :value="`${parsedBounce.email?.data?.error?.code?.basic}/${parsedBounce.email?.data?.error?.code?.enhanced}`" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.label" :label="t('tools.bounce-parser.texts.label-label')" :value="parsedBounce.email?.data?.error?.label" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.type" :label="t('tools.bounce-parser.texts.label-type')" :value="parsedBounce.email?.data?.error?.type" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.temporary" :label="t('tools.bounce-parser.texts.label-temporary')" :value="parsedBounce.email?.data?.error?.temporary" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.permanent" :label="t('tools.bounce-parser.texts.label-permanent')" :value="parsedBounce.email?.data?.error?.permanent" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.type" :label="t('tools.bounce-parser.texts.label-subtype')" :value="parsedBounce.email?.data?.error?.data?.type" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.blocked" :label="t('tools.bounce-parser.texts.label-blocked')" :value="parsedBounce.email?.data?.error?.data?.blocked" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.spam" :label="t('tools.bounce-parser.texts.label-spam')" :value="parsedBounce.email?.data?.error?.data?.spam" />
        </c-card>
        <c-card v-if="parsedBounce.email?.data?.server?.hostname || parsedBounce.email?.data?.server?.ip" :title="t('tools.bounce-parser.texts.title-server')" mb-2>
          <input-copyable v-if="parsedBounce.email?.data?.server?.hostname" :label="t('tools.bounce-parser.texts.label-host')" :value="parsedBounce.email?.data?.server?.hostname" />
          <input-copyable v-if="parsedBounce.email?.data?.server?.ip" :label="t('tools.bounce-parser.texts.label-ip')" :value="parsedBounce.email?.data?.server?.ip" />
          <input-copyable v-if="parsedBounce.email?.data?.server?.port" :label="t('tools.bounce-parser.texts.label-port')" :value="parsedBounce.email?.data?.server?.port" />
        </c-card>
        <c-card :title="t('tools.bounce-parser.texts.title-details')" mb-2>
          <textarea-copyable :value="JSON.stringify(parsedBounce.email?.data, null, 2)" />
        </c-card>
        <c-card :title="t('tools.bounce-parser.texts.title-raw-error')" mb-2>
          <textarea-copyable :value="parsedBounce.email?.email?.error" word-wrap />
        </c-card>
      </div>
    </c-card>
  </div>
</template>
