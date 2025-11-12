import yaml from 'yaml';

export function extractEnvFromCompose(yamlInput: string) {
  const doc = yaml.parse(yamlInput);
  const envLines: string[] = [];

  for (const [serviceName, service] of Object.entries(doc?.services || {})) {
    const env = (service as { environment: any }).environment;
    if (env === null) {
      continue;
    }

    const serviceVars: string[] = [];

    if (Array.isArray(env)) {
      for (const entry of env) {
        const [key, value = ''] = entry.split('=');
        serviceVars.push(`${key.trim()}=${value.trim()}`);
      }
    }
    else if (typeof env === 'object') {
      for (const [key, value] of Object.entries(env)) {
        serviceVars.push(`${key.trim()}=${(value ?? '').toString().trim()}`);
      }
    }

    if (serviceVars.length) {
      envLines.push(`# ${serviceName}`);
      envLines.push(...serviceVars);
      envLines.push(''); // Add spacing between services
    }
  }

  return envLines.join('\n');
}
