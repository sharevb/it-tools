<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import YAML, { Scalar, YAMLSeq } from 'yaml';

const { t } = useI18n();

const RESOURCE_REGISTRY: Record<string, string> = {
  // core
  'pods': '',
  'services': '',
  'configmaps': '',
  'secrets': '',
  'endpoints': '',
  'nodes': '',
  'namespaces': '',

  // apps
  'deployments': 'apps',
  'daemonsets': 'apps',
  'statefulsets': 'apps',
  'replicasets': 'apps',

  // batch
  'jobs': 'batch',
  'cronjobs': 'batch',

  // networking
  'ingresses': 'networking.k8s.io',
  'networkpolicies': 'networking.k8s.io',

  // rbac
  'roles': 'rbac.authorization.k8s.io',
  'rolebindings': 'rbac.authorization.k8s.io',
  'clusterroles': 'rbac.authorization.k8s.io',
  'clusterrolebindings': 'rbac.authorization.k8s.io',

  // wildcard
  '*': '*',
};

const RESOURCE_OPTIONS = Object.entries(RESOURCE_REGISTRY).map(([res, grp]) => ({
  label: `${res} (${(grp || 'core')})`,
  value: res,
}));

const VERB_OPTIONS = [
  'get',
  'list',
  'watch',
  'create',
  'update',
  'patch',
  'delete',
  'deletecollection',
  '*',
].map(v => ({ label: v, value: v }));

const meta = reactive({
  namespace: 'default',
  roleName: 'example-role',
  clusterRole: false,
});

const rules = reactive<
  {
    resources: string[]
    apiGroups: string[]
    verbs: string[]
    resourceNames: string[]
  }[]
>([
  {
    resources: ['*'],
    apiGroups: ['*'],
    verbs: ['get', 'list'],
    resourceNames: [],
  },
]);

const subjects = reactive<
  {
    kind: 'User' | 'Group' | 'ServiceAccount'
    name: string
    namespace: string
  }[]
>([
  {
    kind: 'User',
    name: 'alice',
    namespace: '',
  },
]);

const subjectKinds = [
  { label: t('tools.k8s-rbac-generator.texts.label-user'), value: 'User' },
  { label: t('tools.k8s-rbac-generator.texts.label-group'), value: 'Group' },
  { label: t('tools.k8s-rbac-generator.texts.label-serviceaccount'), value: 'ServiceAccount' },
];

function addRule() {
  rules.push({
    resources: ['*'],
    apiGroups: ['*'],
    verbs: ['*'],
    resourceNames: [],
  });
}

function removeRule(i: number) {
  rules.splice(i, 1);
}

function removeIfNotLastOrIfLastLetOnlyTarget(arr: string[], target: string): string[] {
  if (arr.length === 0) {
    return arr;
  }

  const last = arr[arr.length - 1];

  // If the target is the last element, do nothing
  if (last === target) {
    return [target];
  }

  // Otherwise remove all occurrences of the target
  return arr.filter(item => item !== target);
}

function updateRule(ruleIndex: number) {
  const rule = rules[ruleIndex];
  const groups = new Set<string>();

  rule.resources = removeIfNotLastOrIfLastLetOnlyTarget(rule.resources, '*');

  for (const res of rule.resources) {
    const g = RESOURCE_REGISTRY[res];
    if (g !== undefined) {
      groups.add(g);
    }
  }

  rule.verbs = removeIfNotLastOrIfLastLetOnlyTarget(rule.verbs, '*');

  rule.apiGroups = Array.from(groups);
}

function addSubject() {
  subjects.push({
    kind: 'User',
    name: '',
    namespace: '',
  });
}

function removeSubject(i: number) {
  subjects.splice(i, 1);
}

function stringifyWithFlowStringArrays(
  obj: unknown,
  flowKeys: string[] = [],
): string {
  const doc = new YAML.Document(obj);

  YAML.visit(doc, {
    Pair(_, pair) {
      const { key, value: node } = pair;
      if (!key) {
        return;
      }

      if (flowKeys.includes(String(key)) && node instanceof YAMLSeq) {
        // Force flow style
        node.flow = true;

        // Convert every element to a QUOTE_DOUBLE
        for (let i = 0; i < node.items.length; i++) {
          const value = node.items[i];

          if (value instanceof Scalar) {
            value.type = 'QUOTE_DOUBLE';
          }
        }
      }
    },
  });

  return doc.toString();
}

const roleYaml = computed(() => {
  const kind = meta.clusterRole ? 'ClusterRole' : 'Role';

  const role = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind,
    metadata: {
      name: meta.roleName,
      ...(meta.clusterRole ? {} : { namespace: meta.namespace }),
    },
    rules: rules.map(r => ({
      apiGroups: r.apiGroups,
      resources: r.resources,
      ...(r.resourceNames.length ? { resourceNames: r.resourceNames } : {}),
      verbs: r.verbs,
    })),
  };

  return stringifyWithFlowStringArrays(role, ['apiGroups', 'verbs', 'resources']);
});

const bindingYaml = computed(() => {
  const kind = meta.clusterRole ? 'ClusterRoleBinding' : 'RoleBinding';

  const binding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind,
    metadata: {
      name: `${meta.roleName}-binding`,
      ...(meta.clusterRole ? {} : { namespace: meta.namespace }),
    },
    subjects: subjects.map(s => ({
      kind: s.kind,
      name: s.name,
      ...(s.kind === 'ServiceAccount' ? { namespace: s.namespace || meta.namespace } : {}),
    })),
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: meta.clusterRole ? 'ClusterRole' : 'Role',
      name: meta.roleName,
    },
  };

  return YAML.stringify(binding);
});
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="120px">
      <NFormItem :label="t('tools.k8s-rbac-generator.texts.label-role-name')">
        <NInput v-model:value="meta.roleName" />
      </NFormItem>

      <NFormItem :label="t('tools.k8s-rbac-generator.texts.label-role-type')">
        <NSwitch v-model:value="meta.clusterRole">
          <template #checked>
            {{ t('tools.k8s-rbac-generator.texts.tag-clusterrole-global') }}
          </template>
          <template #unchecked>
            {{ t('tools.k8s-rbac-generator.texts.tag-role-namespaced') }}
          </template>
        </NSwitch>
      </NFormItem>

      <NFormItem v-if="!meta.clusterRole" :label="t('tools.k8s-rbac-generator.texts.label-namespace')">
        <NInput v-model:value="meta.namespace" />
      </NFormItem>
    </NForm>

    <NCard :title="t('tools.k8s-rbac-generator.texts.title-rules')" size="small" segmented mb-1>
      <NSpace vertical>
        <NButton tertiary type="primary" @click="addRule">
          {{ t('tools.k8s-rbac-generator.texts.tag-add-rule') }}
        </NButton>

        <NCard
          v-for="(rule, idx) in rules"
          :key="idx"
          size="small"
          segmented
        >
          <NSpace vertical>
            <NForm label-placement="left" label-width="120px">
              <NFormItem :label="t('tools.k8s-rbac-generator.texts.label-resources')">
                <NSelect
                  v-model:value="rule.resources"
                  :options="RESOURCE_OPTIONS"
                  multiple
                  :placeholder="t('tools.k8s-rbac-generator.texts.placeholder-select-resources-supports')"
                  @update:value="() => updateRule(idx)"
                />
              </NFormItem>

              <NFormItem :label="t('tools.k8s-rbac-generator.texts.label-resource-names-optional')">
                <NDynamicInput
                  v-model:value="rule.resourceNames"
                  :placeholder="t('tools.k8s-rbac-generator.texts.placeholder-specific-resources-names')"
                />
              </NFormItem>

              <NFormItem :label="t('tools.k8s-rbac-generator.texts.label-verbs')">
                <NSelect
                  v-model:value="rule.verbs"
                  filterable
                  multiple
                  tag
                  :placeholder="t('tools.k8s-rbac-generator.texts.placeholder-select-verbs-supports')"
                  :options="VERB_OPTIONS"
                  @update:value="() => updateRule(idx)"
                />
              </NFormItem>
            </NForm>

            <NButton type="error" tertiary @click="removeRule(idx)">
              {{ t('tools.k8s-rbac-generator.texts.tag-remove-rule') }}
            </NButton>
          </NSpace>
        </NCard>
      </NSpace>
    </NCard>

    <NCard :title="t('tools.k8s-rbac-generator.texts.title-subjects')" size="small" segmented>
      <NSpace vertical>
        <NButton tertiary type="primary" @click="addSubject">
          {{ t('tools.k8s-rbac-generator.texts.tag-add-subject') }}
        </NButton>

        <NCard
          v-for="(sub, idx) in subjects"
          :key="idx"
          size="small"
          segmented
        >
          <NSpace vertical>
            <NForm label-placement="top">
              <NGrid :cols="3" :x-gap="16">
                <NGi>
                  <n-form-item :label="t('tools.k8s-rbac-generator.texts.label-kind')">
                    <n-select
                      v-model:value="sub.kind"
                      :options="subjectKinds"
                    />
                  </n-form-item>
                </NGi>

                <NGi>
                  <n-form-item :label="t('tools.k8s-rbac-generator.texts.label-name')">
                    <n-input v-model:value="sub.name" />
                  </n-form-item>
                </NGi>

                <NGi v-if="sub.kind === 'ServiceAccount'">
                  <n-form-item :label="t('tools.k8s-rbac-generator.texts.label-namespace')">
                    <n-input v-model:value="sub.namespace" />
                  </n-form-item>
                </NGi>
              </NGrid>
            </NForm>

            <NButton type="error" tertiary @click="removeSubject(idx)">
              {{ t('tools.k8s-rbac-generator.texts.tag-remove-subject') }}
            </NButton>
          </NSpace>
        </NCard>
      </NSpace>
    </NCard>

    <NCard :title="t('tools.k8s-rbac-generator.texts.title-output-yaml')">
      <NTabs type="segment">
        <NTabPane name="role" :tab="t('tools.k8s-rbac-generator.texts.tab-role-yaml')">
          <textarea-copyable :value="roleYaml" language="yaml" />
        </NTabPane>

        <NTabPane name="binding" :tab="t('tools.k8s-rbac-generator.texts.tab-rolebinding-yaml')">
          <textarea-copyable :value="bindingYaml" language="yaml" />
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>
