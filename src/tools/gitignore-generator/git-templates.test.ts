import { describe, expect, it, vi } from 'vitest';
import { type GitTemplatesSnapshot, type GitTemplatesSource, loadTemplate, loadTemplateNames } from './git-templates';

const snapshot: GitTemplatesSnapshot = {
  repository: 'github/gitignore',
  ref: 'main',
  commit: 'abc123',
  date: '2026-10-02T20:59:38Z',
  templates: { Node: 'node_modules/\n', 'Global/macOS': '.DS_Store\n' },
};

function makeSource() {
  const loadSnapshot = vi.fn<() => Promise<GitTemplatesSnapshot>>(async () => snapshot);
  const source: GitTemplatesSource = {
    repository: 'github/gitignore',
    ref: 'main',
    extension: '.gitignore',
    loadSnapshot,
  };
  return { source, loadSnapshot };
}

type Fetch = (url: string) => Promise<Response>;

const okJson = (body: unknown) => async () => new Response(JSON.stringify(body));
const failing = async (): Promise<Response> => {
  throw new TypeError('Failed to fetch');
};

describe('git-templates', () => {
  describe('loadTemplateNames', () => {
    it('lists live templates without loading the snapshot when online', async () => {
      const { source, loadSnapshot } = makeSource();
      const fetchFn = vi.fn<Fetch>(
        okJson({ tree: [{ path: 'Node.gitignore' }, { path: 'README.md' }, { path: 'Global/Vim.gitignore' }] }),
      );

      expect(await loadTemplateNames(source, { offline: false, fetchFn })).to.deep.equal({
        names: ['Node', 'Global/Vim'],
      });
      expect(fetchFn).toHaveBeenCalledWith(
        'https://api.github.com/repos/github/gitignore/git/trees/main?recursive=true',
      );
      expect(loadSnapshot).not.toHaveBeenCalled();
    });

    it('uses the snapshot, without any request, when offline', async () => {
      const { source } = makeSource();
      const fetchFn = vi.fn<Fetch>(failing);

      expect(await loadTemplateNames(source, { offline: true, fetchFn })).to.deep.equal({
        names: ['Node', 'Global/macOS'],
        snapshot,
      });
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('falls back to the snapshot when the request fails or is rejected', async () => {
      const { source } = makeSource();

      expect((await loadTemplateNames(source, { offline: false, fetchFn: failing })).snapshot).to.equal(snapshot);
      const rateLimited = async () => new Response('{"message":"API rate limit exceeded"}', { status: 403 });
      expect((await loadTemplateNames(source, { offline: false, fetchFn: rateLimited })).snapshot).to.equal(snapshot);
    });
  });

  describe('loadTemplate', () => {
    it('fetches the live template when online', async () => {
      const { source } = makeSource();
      const fetchFn = vi.fn<Fetch>(async () => new Response('live\n'));

      expect(await loadTemplate(source, 'Node', { offline: false, fetchFn })).to.deep.equal({
        content: 'live\n',
        url: 'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore',
      });
    });

    it('reads the snapshot, pinned to its commit, when offline or when the fetch fails', async () => {
      const { source } = makeSource();
      const expected = {
        content: '.DS_Store\n',
        url: 'https://raw.githubusercontent.com/github/gitignore/abc123/Global/macOS.gitignore',
        snapshot,
      };
      const fetchFn = vi.fn<Fetch>(failing);

      expect(await loadTemplate(source, 'Global/macOS', { offline: true, fetchFn })).to.deep.equal(expected);
      expect(fetchFn).not.toHaveBeenCalled();
      expect(await loadTemplate(source, 'Global/macOS', { offline: false, fetchFn })).to.deep.equal(expected);
      const notFound = async () => new Response('404: Not Found', { status: 404 });
      expect(await loadTemplate(source, 'Global/macOS', { offline: false, fetchFn: notFound })).to.deep.equal(expected);
    });

    it('rethrows the live error when the snapshot does not have the template either', async () => {
      const { source } = makeSource();

      await expect(loadTemplate(source, 'Unknown', { offline: false, fetchFn: failing })).rejects.toThrow(
        'Failed to fetch',
      );
      await expect(loadTemplate(source, 'Unknown', { offline: true })).rejects.toThrow('Unknown template: Unknown');
    });
  });
});
