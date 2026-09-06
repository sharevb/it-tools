export function extractPangolinLabelsFromCompose(compose: any) {
  const collected: Record<string, string> = {};

  for (const [_serviceName, svc] of Object.entries<any>(compose.services ?? {})) {
    const labels = svc.labels ?? [];

    if (Array.isArray(labels)) {
      for (const entry of labels) {
        if (typeof entry === 'string') {
          const i = entry.indexOf('=');
          if (i === -1) {
            continue;
          }
          const key = entry.slice(0, i);
          const value = entry.slice(i + 1);

          if (key.startsWith('pangolin.')) {
            collected[key] = value;
          }
        }
      }
    } else {
      for (const [key, value] of Object.entries(labels)) {
        if (key.startsWith('pangolin.')) {
          collected[key] = String(value);
        }
      }
    }
  }

  return collected;
}

export function pangolinLabelsToBlueprint(labels: Record<string, string>) {
  const resources: Record<string, any> = {};

  for (const [key, rawValue] of Object.entries(labels)) {
    if (!key.startsWith('pangolin.')) {
      continue;
    }

    const rest = key.slice('pangolin.'.length);
    const [resourceName, ...pathParts] = rest.split('.');
    const path = pathParts.join('.');

    if (!resources[resourceName]) {
      resources[resourceName] = {};
    }

    assignNested(resources[resourceName], path, coerce(rawValue));
  }

  return resources;
}

function assignNested(target: any, path: string, value: any) {
  if (!path) {
    return;
  }

  // Convert "a.b[0].c" → ["a", "b", "0", "c"]
  const segments = path.replace(/\]/g, '').split(/\.|\[/).filter(Boolean);

  let current = target;

  for (let i = 0; i < segments.length; i++) {
    const key = segments[i];
    const isLast = i === segments.length - 1;
    const next = segments[i + 1];

    if (isLast) {
      // Final assignment
      current[key] = value;
      return;
    }

    // Determine whether next segment is array index
    const shouldBeArray = /^\d+$/.test(next);

    // Create container if missing
    if (current[key] === undefined) {
      current[key] = shouldBeArray ? [] : {};
    }

    // If wrong type, fix it
    if (shouldBeArray && !Array.isArray(current[key])) {
      current[key] = [];
    } else if (!shouldBeArray && typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }
}

function coerce(value: string) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (!Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}

export function blueprintToLabels(resources: Record<string, any>, labelsType: 'array' | 'object') {
  const labels: Record<string, string> = {};

  for (const [resourceName, config] of Object.entries(resources)) {
    flatten(config, `pangolin.${resourceName}`, labels);
  }

  if (labelsType === 'object') {
    return labels;
  }

  return Object.entries(labels).map(([k, v]) => `${k}=${v}`);
}

function flatten(obj: any, prefix: string, out: Record<string, string>) {
  for (const [key, value] of Object.entries(obj)) {
    const path = `${prefix}.${key}`;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        flatten(item, `${path}[${i}]`, out);
      });
    } else if (value && typeof value === 'object') {
      flatten(value, path, out);
    } else {
      out[path] = String(value);
    }
  }
}
