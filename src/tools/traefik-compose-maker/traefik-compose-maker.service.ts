export interface TraefikComposeOptions {
  logDebug: boolean
  certResolverName: string
  postmasterEmail: string
  letEncryptTest: boolean
  dashboard: boolean
  traefikDashboardHostName: string
  dashboardUserAndPass: string
  proxiedServiceName: string
  proxiedServiceImage: string
  proxiedServiceLoadBalancePort: number
  proxiedServiceHostName: string
  loadBalance: boolean
}

/**
 * Generates Docker Compose configuration based on form input.
 * @param config Configuration object
 * @returns Docker Compose YAML string
 */
export function generateCompose(config: TraefikComposeOptions): string {
  if (config.proxiedServiceName === ''
    || config.proxiedServiceImage === ''
    || config.proxiedServiceHostName === '') {
    return '';
  }

  return `
version: "3.3"
services:
  traefik:
    image: "traefik:v2.11"
    container_name: "traefik"
    command:
      ${config.logDebug ? '- "--log.level=DEBUG"' : ''}
      - "--api=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.${config.certResolverName}.acme.httpchallenge=true"
      - "--certificatesresolvers.${config.certResolverName}.acme.httpchallenge.entrypoint=web"
      ${config.letEncryptTest ? `- "--certificatesresolvers.${config.certResolverName}.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory"` : ''}
      - "--certificatesresolvers.${config.certResolverName}.acme.email=${config.postmasterEmail}"
      - "--certificatesresolvers.${config.certResolverName}.acme.storage=/letsencrypt/acme.json"
    labels:
      ${config.dashboard
? `
      - "traefik.http.routers.dashboard.rule=Host(\`${config.traefikDashboardHostName}\`) && (PathPrefix('/api') || PathPrefix('/dashboard'))"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=${config.dashboardUserAndPass}"
      `
: ''}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"

  ${config.proxiedServiceName}:
    image: ${config.proxiedServiceImage}
    labels:
      - "traefik.enable=true"
      - "traefik.http.middlewares.${config.proxiedServiceName}-redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.${config.proxiedServiceName}-redirect.redirectscheme.permanent=true"
      ${config.loadBalance ? `- "traefik.http.services.${config.proxiedServiceName}.loadbalancer.server.port=${config.proxiedServiceLoadBalancePort}"` : ''}
      - "traefik.http.routers.${config.proxiedServiceName}.rule=Host(\`${config.proxiedServiceHostName}\`)"
      - "traefik.http.routers.${config.proxiedServiceName}.entrypoints=web"
      - "traefik.http.routers.${config.proxiedServiceName}-secure.rule=Host(\`${config.proxiedServiceHostName}\`)"
      - "traefik.http.routers.${config.proxiedServiceName}-secure.entrypoints=websecure"
      - "traefik.http.routers.${config.proxiedServiceName}-secure.tls=true"
      - "traefik.http.routers.${config.proxiedServiceName}-secure.tls.certresolver=${config.certResolverName}"
      `;
}
