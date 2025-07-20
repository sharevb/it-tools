<script setup lang="ts">
import PodletJS from 'podletjs';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const form = ref({
  compose: `
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    environment:
      NODE_ENV: production
    depends_on:
      - db
      
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
`,
  unit: {
    description: 'My Application Stack',
    after: ['network-online.target'],
    wants: ['network-online.target'],
  },
  service: {
    restart: 'always',
  },
  install: {
    wantedBy: ['multi-user.target'],
  },
});

const restartOptions = [
  { label: 'no', value: 'no' },
  { label: 'always', value: 'always' },
  { label: 'on-failure', value: 'on-failure' },
];

const generator = new PodletJS();

const conversionResult = computed(() => {
  try {
    return {
      quadlets: generator.composeToQuadlet(form.value.compose.trim(), {
        unit: form.value.unit,
        service: form.value.service,
        install: form.value.install,
      }),
      errors: '',
    };
  }
  catch (e: any) {
    return { quadlets: [], errors: e.toString() };
  }
});

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label label="Paste your Docker Compose file content here:" mb-2>
      <div relative w-full>
        <c-monaco-editor
          v-model:value="form.compose"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <c-card title="Options">
      <n-form-item label="Description:" label-placement="left">
        <n-input v-model:value="form.unit.description" />
      </n-form-item>
      <n-form-item label="After Targets:" label-placement="left">
        <n-dynamic-tags v-model:value="form.unit.after" />
      </n-form-item>
      <n-form-item label="Wants Targets:" label-placement="left">
        <n-dynamic-tags v-model:value="form.unit.wants" />
      </n-form-item>
      <n-form-item label="Restart Policy:" label-placement="left">
        <n-select v-model:value="form.service.restart" :options="restartOptions" />
      </n-form-item>
      <n-form-item label="WantedBy:" label-placement="left">
        <n-dynamic-tags v-model:value="form.install.wantedBy" />
      </n-form-item>
    </c-card>

    <n-divider />

    <c-card v-for="({ filename, content }) in conversionResult.quadlets" :key="filename" :title="`Quadlet file: ${filename}`">
      <input-copyable label="Typical storage location:" label-placement="left" :value="`/etc/containers/systemd/${filename}`" />
      <TextareaCopyable :value="content" language="ini" :download-file-name="filename" />
    </c-card>

    <c-alert v-if="conversionResult.errors" mt-1 text-center type="error">
      {{ conversionResult.errors }}
    </c-alert>
  </div>
</template>
