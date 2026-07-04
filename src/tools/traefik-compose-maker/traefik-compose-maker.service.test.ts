import { describe, expect, it } from 'vitest';
import type { TraefikComposeOptions } from './traefik-compose-maker.service';
import { generateCompose } from './traefik-compose-maker.service';

const defaultConfig: TraefikComposeOptions = {
  logDebug: false,
  certResolverName: 'letsencrypt',
  postmasterEmail: 'admin@example.com',
  letEncryptTest: false,
  dashboard: false,
  traefikDashboardHostName: '',
  dashboardUserAndPass: '',
  proxiedServiceName: 'webapp',
  proxiedServiceImage: 'nginx:latest',
  proxiedServiceLoadBalancePort: 8080,
  proxiedServiceHostName: 'example.com',
  loadBalance: false,
};

describe('generateCompose', () => {
  it('should generate compose YAML with default settings', () => {
    const result = generateCompose(defaultConfig);

    expect(result).toBe(`
version: \"3.3\"
services:
  traefik:
    image: \"traefik:v2.11\"
    container_name: \"traefik\"
    command:
      
      - \"--api=true\"
      - \"--providers.docker=true\"
      - \"--providers.docker.exposedbydefault=false\"
      - \"--entrypoints.web.address=:80\"
      - \"--entrypoints.websecure.address=:443\"
      - \"--certificatesresolvers.letsencrypt.acme.httpchallenge=true\"
      - \"--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web\"
      
      - \"--certificatesresolvers.letsencrypt.acme.email=admin@example.com\"
      - \"--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json\"
    labels:
      
    ports:
      - \"80:80\"
      - \"443:443\"
    volumes:
      - \"./letsencrypt:/letsencrypt\"
      - \"/var/run/docker.sock:/var/run/docker.sock:ro\"

  webapp:
    image: nginx:latest
    labels:
      - \"traefik.enable=true\"
      - \"traefik.http.middlewares.webapp-redirect.redirectscheme.scheme=https\"
      - \"traefik.http.middlewares.webapp-redirect.redirectscheme.permanent=true\"
      
      - \"traefik.http.routers.webapp.rule=Host(\`example.com\`)\"
      - \"traefik.http.routers.webapp.entrypoints=web\"
      - \"traefik.http.routers.webapp-secure.rule=Host(\`example.com\`)\"
      - \"traefik.http.routers.webapp-secure.entrypoints=websecure\"
      - \"traefik.http.routers.webapp-secure.tls=true\"
      - \"traefik.http.routers.webapp-secure.tls.certresolver=letsencrypt\"
      `);
  });

  it('should include debug logging when enabled', () => {
    const config: TraefikComposeOptions = {
      ...defaultConfig,
      logDebug: true,
    };

    const result = generateCompose(config);
    expect(result).toContain('--log.level=DEBUG');
  });

  it('should enable load balancing when configured', () => {
    const config: TraefikComposeOptions = {
      ...defaultConfig,
      loadBalance: true,
    };

    const result = generateCompose(config);
    expect(result).toContain(
      `traefik.http.services.webapp.loadbalancer.server.port=${config.proxiedServiceLoadBalancePort}`,
    );
  });
});
