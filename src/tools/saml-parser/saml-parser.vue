<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { ref } from 'vue';
import saml from '@boxyhq/saml20';
import { inflate } from 'pako';
import { Base64 } from 'js-base64';

const input = ref('');
const thumbprint = ref('');
const publicKey = ref('');
const audience = ref('');
const bypassExpiration = ref(false);

const parsingResult = ref<{
  type: 'assertion'
  raw: string
  profile: {
    claims?: any[]
    audience?: string
    issuer?: string
    assertionId?: string
    sessionIndex?: string
    notBefore?: string
    notOnOrAfter?: string
  }
  validation: { ok: boolean; error?: string | null }
} | null>();

const error = ref<string | null>(null);
const loading = ref(false);

function isBase64(str: string) {
  try {
    Base64.decode(str.trim());
    return true;
  }
  catch {
    return false;
  }
}

function inflateBase64(str: string) {
  const bytes = Base64.toUint8Array(str.trim());
  return new TextDecoder().decode(inflate(bytes, { raw: true }));
}

function looksLikeXml(str: string) {
  return str.trim().startsWith('<');
}

async function validate(rawAssertion: string) {
  const options: any = {
    audience: audience.value || undefined,
    bypassExpiration: bypassExpiration.value || undefined,
  };
  if (thumbprint.value) {
    options.thumbprint = thumbprint.value;
  }
  if (publicKey.value) {
    options.publicKey = publicKey.value;
  }

  try {
    const profile = await saml.validate(rawAssertion, options);
    return { ok: true, profile, error: null };
  }
  catch (e: any) {
    return { ok: false, profile: e.profile ?? null, error: String(e) };
  }
}

async function detect() {
  error.value = null;
  loading.value = true;
  parsingResult.value = null;

  try {
    const raw = input.value.trim();
    if (!raw) {
      error.value = 'Input is empty.';
      return;
    }

    let xml = raw;

    if (isBase64(raw)) {
      xml = Base64.decode(raw);
      if (!looksLikeXml(xml)) {
        try {
          xml = inflateBase64(raw);
        }
        catch {
          error.value = 'Input is not valid Base64 or DEFLATE or XML.';
          return;
        }
      }
    }
    else {
      error.value = 'Input is not valid Base64 or DEFLATE or XML.';
      return;
    }

    const parsedProfile = await saml.parse(xml);
    const validationResult = await validate(xml);

    parsingResult.value = {
      type: 'assertion',
      raw: xml,
      profile: validationResult.profile ?? parsedProfile,
      validation: { ok: validationResult.ok, error: validationResult.error ?? null },
    };
  }
  catch (e: any) {
    error.value = 'Failed to parse SAML assertion.';
  }
  finally {
    loading.value = false;
  }
}

const profile = computed(() => parsingResult.value?.profile);
const claims = computed(() => Object.entries(profile.value?.claims || []).map(([name, value]) => ({ name, value })));
const validation = computed(() => parsingResult.value?.validation || { ok: false, error: null });

const signatureStatus = computed(() => {
  if (validation.value.ok) {
    return 'Signature & assertion valid';
  }
  if (validation.value.error) {
    return `Validation failed: ${validation.value.error}`;
  }
  return 'Not validated (no key / thumbprint)';
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :label="t('tools.saml-parser.texts.label-saml-assertion-base64-deflate-or-xml')"
      multiline
      rows="8"
      :placeholder="t('tools.saml-parser.texts.placeholder-paste-saml-assertion-base64-deflate-or-xml')"
      mb-2
    />

    <n-card size="small" :title="t('tools.saml-parser.texts.title-validation-options')" mb-2>
      <c-input-text
        v-model:value="thumbprint"
        :label="t('tools.saml-parser.texts.label-thumbprint')"
        label-position="left"
        label-width="100px"
        :placeholder="t('tools.saml-parser.texts.placeholder-thumbprint-optional')"
        mb-1
      />
      <c-input-text
        v-model:value="publicKey"
        :label="t('tools.saml-parser.texts.label-public-key')"
        label-position="left"
        label-width="100px"
        multiline
        rows="3"
        :placeholder="t('tools.saml-parser.texts.placeholder-public-key-optional')"
        mb-1
      />
      <c-input-text
        v-model:value="audience"
        :label="t('tools.saml-parser.texts.label-audience')"
        label-position="left"
        label-width="100px"
        :placeholder="t('tools.saml-parser.texts.placeholder-audience-optional')"
        mb-1
      />
      <n-space justify="center">
        <n-switch v-model:value="bypassExpiration">
          <template #checked>{{ t('tools.saml-parser.texts.tag-bypass-expiration') }}</template>
          <template #unchecked>{{ t('tools.saml-parser.texts.tag-don-t-bypass-expiration') }}</template>
        </n-switch>
      </n-space>
    </n-card>

    <n-space justify="center">
      <n-button type="primary" :loading="loading" @click="detect">{{ t('tools.saml-parser.texts.tag-detect-parse-and-validate') }}</n-button>
    </n-space>

    <n-alert v-if="error" type="error" show-icon mb-2 mt-2>
      {{ error }}
    </n-alert>

    <c-card v-if="!error && !loading && parsingResult?.raw" :title="t('tools.saml-parser.texts.title-parsed-saml-assertion')" mt-2>
      <input-copyable
        :label="t('tools.saml-parser.texts.label-issuer')"
        label-width="100px"
        label-position="left"
        :value="profile?.issuer || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-assertion-id')"
        label-width="100px"
        label-position="left"
        :value="profile?.assertionId || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-session-index')"
        label-width="100px"
        label-position="left"
        :value="profile?.sessionIndex || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-notbefore')"
        label-width="100px"
        label-position="left"
        :value="profile?.notBefore || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-notonorafter')"
        label-width="100px"
        label-position="left"
        :value="profile?.notOnOrAfter || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-audience')"
        label-width="100px"
        label-position="left"
        :value="profile?.audience || ''"
        mb-1
      />

      <input-copyable
        :label="t('tools.saml-parser.texts.label-signature-validation-status')"
        label-position="left"
        :value="signatureStatus"
        mb-1
      />

      <c-alert v-if="!parsingResult.validation?.ok && parsingResult.validation?.error" type="error" show-icon>
        {{ parsingResult.validation.error }}
      </c-alert>

      <c-card v-if="claims.length > 0" size="small" :title="t('tools.saml-parser.texts.title-claims')" mb-1>
        <n-data-table
          :columns="[
            { title: 'Claim', key: 'claim' },
            { title: 'Value', key: 'value' },
          ]"
          :data="claims.map((c) => ({ claim: c.name, value: c.value }))"
          size="small"
          striped
        />
      </c-card>

      <c-card :title="t('tools.saml-parser.texts.title-raw-assertion')" mt-2>
        <CodeBlockCopyable
          :value="JSON.stringify(parsingResult.profile, null, 2)"
          language="json"
          mb-2
        />

        <CodeBlockCopyable
          :value="parsingResult?.raw"
          language="xml"
        />
      </c-card>
    </c-card>
  </div>
</template>
