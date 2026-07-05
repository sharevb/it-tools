import { describe, expect, it } from 'vitest';
import yaml from 'yaml';
import { blueprintToLabels, extractPangolinLabelsFromCompose, pangolinLabelsToBlueprint } from './docker-pangolin-labels.service';

const composeYml = `
services:
  newt:
    image: fosrl/newt
    container_name: newt
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PANGOLIN_ENDPOINT=https://app.pangolin.net
      - NEWT_ID=h1rbsgku89wf9z3
      - NEWT_SECRET=z7g54mbcwkglpx1aau9gb8mzcccoof2fdbs97keoakg2pp5z
      - DOCKER_SOCKET=/var/run/docker.sock

  nginx1:
    image: nginxdemos/hello
    container_name: nginx1
    labels:
      # Public Resource Configuration
      - pangolin.public-resources.nginx.name=nginx
      - pangolin.public-resources.nginx.full-domain=nginx.fosrl.io
      - pangolin.public-resources.nginx.protocol=http
      - pangolin.public-resources.nginx.headers[0].name=X-Example-Header
      - pangolin.public-resources.nginx.headers[0].value=example-value
      # Target Configuration - the port and hostname will be auto-detected
      - pangolin.public-resources.nginx.targets[0].method=http
      - pangolin.public-resources.nginx.targets[0].path=/path
      - pangolin.public-resources.nginx.targets[0].path-match=prefix

  nginx2:
    image: nginxdemos/hello
    container_name: nginx2
    labels:
      # Additional target for the same resource where the port and hostname are explicit
      pangolin.public-resources.nginx.targets[1].method: http
      pangolin.public-resources.nginx.targets[1].hostname: nginx2
      pangolin.public-resources.nginx.targets[1].port: 80

networks:
  default:
    name: pangolin_default`;

describe('Pangolin Compose Extraction', () => {
  it('extracts Pangolin labels from full compose', () => {
    const compose = yaml.parse(composeYml);
    const labels = extractPangolinLabelsFromCompose(compose);

    expect(labels).to.deep.eq({
      'pangolin.public-resources.nginx.full-domain': 'nginx.fosrl.io',
      'pangolin.public-resources.nginx.headers[0].name': 'X-Example-Header',
      'pangolin.public-resources.nginx.headers[0].value': 'example-value',
      'pangolin.public-resources.nginx.name': 'nginx',
      'pangolin.public-resources.nginx.protocol': 'http',
      'pangolin.public-resources.nginx.targets[0].method': 'http',
      'pangolin.public-resources.nginx.targets[0].path': '/path',
      'pangolin.public-resources.nginx.targets[0].path-match': 'prefix',
      'pangolin.public-resources.nginx.targets[1].hostname': 'nginx2',
      'pangolin.public-resources.nginx.targets[1].method': 'http',
      'pangolin.public-resources.nginx.targets[1].port': '80',
    });
  });

  it('parses extracted labels into blueprint', () => {
    const compose = yaml.parse(composeYml);
    const labels = extractPangolinLabelsFromCompose(compose);
    const blueprint = pangolinLabelsToBlueprint(labels);

    expect(blueprint).to.deep.eq({
      'public-resources': {
        nginx: {
          'full-domain': 'nginx.fosrl.io',
          'headers': [
            {
              name: 'X-Example-Header',
              value: 'example-value',
            },
          ],
          'name': 'nginx',
          'protocol': 'http',
          'targets': [
            {
              'method': 'http',
              'path': '/path',
              'path-match': 'prefix',
            },
            {
              hostname: 'nginx2',
              method: 'http',
              port: 80,
            },
          ],
        },
      },
    });
  });
});

// ---------------------------------------------------------
// Forward Mapping Tests
// ---------------------------------------------------------

const blueprintYml = `
public-resources:
  resource-nice-id-uno:
    name: this is a http resource
    protocol: http
    full-domain: uno.example.com
    host-header: example.com
    tls-server-name: example.com
    headers:
      - name: X-Example-Header
        value: example-value
      - name: X-Another-Header
        value: another-value
    rules:
      - action: allow
        match: ip
        value: 1.1.1.1
        priority: 1
      - action: deny
        match: cidr
        value: 2.2.2.2/32
        priority: 2
      - action: allow
        match: asn
        value: AS13335
        priority: 3
      - action: pass
        match: path
        value: /admin
    targets:
    - site: lively-yosemite-toad
      hostname: localhost
      method: http
      port: 8000
    - site: slim-alpine-chipmunk
      hostname: localhost
      path: /admin
      path-match: exact
      method: https
      port: 8001
  resource-nice-id-dos:
    name: this is a raw resource
    protocol: tcp
    proxy-port: 3000
    targets:
    - site: lively-yosemite-toad
      hostname: localhost
      port: 3000`;

describe('Forward Mapping (blueprint → labels)', () => {
  it('blueprintToLabels should produce array', () => {
    expect(blueprintToLabels(yaml.parse(blueprintYml), 'array')).to.deep.eq([
      'pangolin.public-resources.resource-nice-id-uno.name=this is a http resource',
      'pangolin.public-resources.resource-nice-id-uno.protocol=http',
      'pangolin.public-resources.resource-nice-id-uno.full-domain=uno.example.com',
      'pangolin.public-resources.resource-nice-id-uno.host-header=example.com',
      'pangolin.public-resources.resource-nice-id-uno.tls-server-name=example.com',
      'pangolin.public-resources.resource-nice-id-uno.headers[0].name=X-Example-Header',
      'pangolin.public-resources.resource-nice-id-uno.headers[0].value=example-value',
      'pangolin.public-resources.resource-nice-id-uno.headers[1].name=X-Another-Header',
      'pangolin.public-resources.resource-nice-id-uno.headers[1].value=another-value',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].action=allow',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].match=ip',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].value=1.1.1.1',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].priority=1',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].action=deny',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].match=cidr',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].value=2.2.2.2/32',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].priority=2',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].action=allow',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].match=asn',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].value=AS13335',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].priority=3',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].action=pass',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].match=path',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].value=/admin',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].site=lively-yosemite-toad',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].hostname=localhost',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].method=http',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].port=8000',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].site=slim-alpine-chipmunk',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].hostname=localhost',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].path=/admin',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].path-match=exact',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].method=https',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].port=8001',
      'pangolin.public-resources.resource-nice-id-dos.name=this is a raw resource',
      'pangolin.public-resources.resource-nice-id-dos.protocol=tcp',
      'pangolin.public-resources.resource-nice-id-dos.proxy-port=3000',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].site=lively-yosemite-toad',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].hostname=localhost',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].port=3000',
    ]);
  });
  it('blueprintToLabels should produce object', () => {
    expect(blueprintToLabels(yaml.parse(blueprintYml), 'object')).to.deep.eq({
      'pangolin.public-resources.resource-nice-id-dos.name': 'this is a raw resource',
      'pangolin.public-resources.resource-nice-id-dos.protocol': 'tcp',
      'pangolin.public-resources.resource-nice-id-dos.proxy-port': '3000',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].hostname': 'localhost',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].port': '3000',
      'pangolin.public-resources.resource-nice-id-dos.targets[0].site': 'lively-yosemite-toad',
      'pangolin.public-resources.resource-nice-id-uno.full-domain': 'uno.example.com',
      'pangolin.public-resources.resource-nice-id-uno.headers[0].name': 'X-Example-Header',
      'pangolin.public-resources.resource-nice-id-uno.headers[0].value': 'example-value',
      'pangolin.public-resources.resource-nice-id-uno.headers[1].name': 'X-Another-Header',
      'pangolin.public-resources.resource-nice-id-uno.headers[1].value': 'another-value',
      'pangolin.public-resources.resource-nice-id-uno.host-header': 'example.com',
      'pangolin.public-resources.resource-nice-id-uno.name': 'this is a http resource',
      'pangolin.public-resources.resource-nice-id-uno.protocol': 'http',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].action': 'allow',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].match': 'ip',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].priority': '1',
      'pangolin.public-resources.resource-nice-id-uno.rules[0].value': '1.1.1.1',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].action': 'deny',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].match': 'cidr',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].priority': '2',
      'pangolin.public-resources.resource-nice-id-uno.rules[1].value': '2.2.2.2/32',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].action': 'allow',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].match': 'asn',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].priority': '3',
      'pangolin.public-resources.resource-nice-id-uno.rules[2].value': 'AS13335',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].action': 'pass',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].match': 'path',
      'pangolin.public-resources.resource-nice-id-uno.rules[3].value': '/admin',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].hostname': 'localhost',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].method': 'http',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].port': '8000',
      'pangolin.public-resources.resource-nice-id-uno.targets[0].site': 'lively-yosemite-toad',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].hostname': 'localhost',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].method': 'https',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].path': '/admin',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].path-match': 'exact',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].port': '8001',
      'pangolin.public-resources.resource-nice-id-uno.targets[1].site': 'slim-alpine-chipmunk',
      'pangolin.public-resources.resource-nice-id-uno.tls-server-name': 'example.com',
    });
  });
});
