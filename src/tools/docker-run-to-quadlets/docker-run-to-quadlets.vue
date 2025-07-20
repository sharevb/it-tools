<script setup lang="ts">
import PodletJS from 'podletjs';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const form = ref({
  runCommands: 'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
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
      quadlet: generator.dockerRunToQuadlet(form.value.runCommands.trim(), {
        unit: form.value.unit,
        service: form.value.service,
        install: form.value.install,
      }),
      errors: '',
    };
  }
  catch (e: any) {
    return { quadlet: '', errors: e.toString() };
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="form.runCommands"
      label="Your docker run command(s):"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      placeholder="Your docker run command(s) to convert..."
      rows="4"
      mb-2
    />

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

    <c-card v-if="conversionResult.quadlet" title="Converted Quadlet content">
      <input-copyable label="Typical storage location:" label-placement="left" value="/etc/containers/systemd/<name of your service>.container" />
      <TextareaCopyable :value="conversionResult.quadlet" language="ini" />
    </c-card>

    <c-alert v-if="conversionResult.errors" mt-1 text-center type="error">
      {{ conversionResult.errors }}
    </c-alert>
  </div>
</template>
