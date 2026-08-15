import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';
import { tools, toolsByCategory } from './index';

const declaredDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
} as Record<string, string>;

describe('tools metadata', () => {
  it('registers the tools of every category', () => {
    expect(toolsByCategory.length).toBeGreaterThan(0);
    expect(tools.length).toBeGreaterThan(0);
  });

  describe('npmPackages', () => {
    // The tool pages advertise the libraries they are built on. A dependency that gets replaced has
    // to be renamed here too, otherwise the ui links to a package the app no longer uses.
    const declarations = tools.flatMap(tool =>
      (tool.npmPackages ?? []).map(npmPackage => ({ tool: tool.name, npmPackage })),
    );

    it('only references packages the app actually depends on', () => {
      const unknown = declarations
        .filter(({ npmPackage }) => !npmPackage.includes('://'))
        .filter(({ npmPackage }) => declaredDependencies[npmPackage] === undefined);

      expect(unknown).toEqual([]);
    });

    it('does not reference the packages that were replaced', () => {
      const replaced = [
        'crypto-js',
        '@types/crypto-js',
        'plausible-tracker',
        'svg2png-wasm',
        '@types/bcryptjs',
        '@types/uuid',
      ];

      expect(declarations.filter(({ npmPackage }) => replaced.includes(npmPackage))).toEqual([]);
    });
  });
});
