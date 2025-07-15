<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useThemeVars } from 'naive-ui';

import InputCopyable from '../../components/InputCopyable.vue';
import { computeChmodOctalRepresentation, computeChmodSymbolicRepresentation, computePermissionsFromChmodOctalRepresentation, computePermissionsFromChmodSymbolicRepresentation, computeUmaskRepresentation } from './chmod-calculator.service';

import type { Group, Scope } from './chmod-calculator.types';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const themeVars = useThemeVars();

const scopes: { scope: Scope; title: string }[] = [
  { scope: 'read', title: 'Read (4)' },
  { scope: 'write', title: 'Write (2)' },
  { scope: 'execute', title: 'Execute (1)' },
];
const groups: Group[] = ['owner', 'group', 'public'];

const permissions = ref({
  owner: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
  public: { read: false, write: false, execute: false },
  flags: { setuid: false, setgid: false, stickybit: false },
});

const octalPermissionsInput = ref('000');
const octalPermissionsInputValidation = useValidation({
  source: octalPermissionsInput,
  rules: [
    {
      message: t('tools.chmod-calculator.texts.message-invalid-octal-permission-string'),
      validator: (value) => {
        try {
          computePermissionsFromChmodOctalRepresentation(value.trim());
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
watch(
  octalPermissionsInput,
  (newPermissions) => {
    if (!octalPermissionsInputValidation.isValid) {
      return;
    }
    permissions.value = computePermissionsFromChmodOctalRepresentation(newPermissions.trim());
  },
);

const symbolicPermissionsInput = ref('---------');
const symbolicPermissionsInputValidation = useValidation({
  source: symbolicPermissionsInput,
  rules: [
    {
      message: t('tools.chmod-calculator.texts.message-invalid-symbolic-permission-string'),
      validator: (value) => {
        try {
          computePermissionsFromChmodSymbolicRepresentation(value.trim());
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
watch(
  symbolicPermissionsInput,
  (newPermissions) => {
    if (!symbolicPermissionsInputValidation.isValid) {
      return;
    }
    permissions.value = computePermissionsFromChmodSymbolicRepresentation(newPermissions.trim());
  },
);

const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value }));
const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value }));
const umask = computed(() => computeUmaskRepresentation({ permissions: permissions.value }));
</script>

<template>
  <div>
    <n-space justify="center">
      <c-input-text
        v-model:value="octalPermissionsInput"
        :placeholder="t('tools.chmod-calculator.texts.placeholder-put-your-octal-permissions-here')"
        :label="t('tools.chmod-calculator.texts.label-copy-your-octal-permissions')"
        :validation="octalPermissionsInputValidation"
        mb-2
      />

      <c-input-text
        v-model:value="symbolicPermissionsInput"
        :placeholder="t('tools.chmod-calculator.texts.placeholder-put-your-symbolic-permissions-here')"
        :label="t('tools.chmod-calculator.texts.label-copy-your-symbolic-permissions')"
        :validation="symbolicPermissionsInputValidation"
        mb-2
      />
    </n-space>

    <n-divider />

    <n-table :bordered="false" :bottom-bordered="false" single-column class="permission-table">
      <thead>
        <tr>
          <th class="text-center" scope="col" />
          <th class="text-center" scope="col">
            {{ t('tools.chmod-calculator.texts.tag-owner-u') }}
          </th>
          <th class="text-center" scope="col">
            {{ t('tools.chmod-calculator.texts.tag-group-g') }}
          </th>
          <th class="text-center" scope="col">
            {{ t('tools.chmod-calculator.texts.tag-public-o') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ scope, title } of scopes" :key="scope">
          <td class="line-header">
            {{ title }}
          </td>
          <td v-for="group of groups" :key="group" class="text-center">
            <!-- <n-switch v-model:value="permissions[group][scope]" /> -->
            <n-checkbox v-model:checked="permissions[group][scope]" size="large" />
          </td>
        </tr>
        <tr>
          <td class="line-header">
            {{ t('tools.chmod-calculator.texts.tag-flags') }}
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.setuid" size="large" />
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.setgid" size="large" />
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.stickybit" size="large" />
          </td>
        </tr>
      </tbody>
    </n-table>

    <div class="octal-result" mb-1>
      {{ octal }}
    </div>
    <div class="octal-result" mb-1>
      {{ symbolic }}
    </div>

    <c-card :title="t('tools.chmod-calculator.texts.title-chmod-command')" mb-1>
      <InputCopyable label-position="left" :value="`chmod ${octal} path`" readonly />
    </c-card>

    <c-card :title="t('tools.chmod-calculator.texts.title-umask')">
      <InputCopyable :label="t('tools.chmod-calculator.texts.label-octal')" label-position="left" label-width="100px" :value="umask.octal" readonly />
      <InputCopyable :label="t('tools.chmod-calculator.texts.label-symbolic')" label-position="left" label-width="100px" :value="umask.symbolic" readonly />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.octal-result {
  text-align: center;
  font-size: 50px;
  font-family: monospace;
  color: v-bind('themeVars.primaryColor');
  margin: 20px 0;
}
.permission-table {
  td,
  th {
    padding: 15px;

    @media screen and (max-width: 600px) {
      padding: 5px;
    }
  }
}
.line-header {
  font-weight: bold;
  text-align: right;
  max-width: 80px;
}
.text-center {
  text-align: center;
}
</style>
