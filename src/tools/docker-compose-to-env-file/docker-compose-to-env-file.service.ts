import yaml from 'yaml';

export function extractEnvFromCompose(yamlInput: string) {
  if (!yamlInput?.trim()) {
    return { dotenv: '', updatedCompose: '' };
  }
  const doc = yaml.parse(yamlInput);
  const envLines: string[] = [];

  for (const [serviceName, service] of Object.entries(doc?.services || {})) {
    const env = (service as { environment: any }).environment;
    if (env === null) {
      continue;
    }

    const serviceVars: string[] = [];
    const serviceReplacementVars: string[] = [];

    if (Array.isArray(env)) {
      for (const entry of env) {
        const [key, value = ''] = entry.split('=');
        if (value?.trim().match(/^\$\{.*?\}$/)) {
          serviceReplacementVars.push(entry);
          continue;
        }
        serviceVars.push(`${key.trim()}=${value.trim()}`);
        serviceReplacementVars.push(`${key.trim()}=\$\{${key.trim()}\}`);
      }
    } else if (typeof env === 'object') {
      for (const [key, value] of Object.entries(env)) {
        if (
          value
            ?.toString()
            .trim()
            .match(/^\$\{.*?\}$/)
        ) {
          serviceReplacementVars.push(`${key.trim()}=${(value ?? '').toString().trim()}`);
          continue;
        }
        serviceVars.push(`${key.trim()}=${(value ?? '').toString().trim()}`);
        serviceReplacementVars.push(`${key.trim()}=\$\{${key.trim()}\}`);
      }
    }

    if (serviceVars.length) {
      (service as { environment: any }).environment = serviceReplacementVars;

      envLines.push(`# ${serviceName}`);
      envLines.push(...serviceVars);
      envLines.push(''); // Add spacing between services
    }
  }

  return { dotenv: envLines.join('\n'), updatedCompose: yaml.stringify(doc) };
}
