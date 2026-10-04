// Downloads every template of github/gitignore and alexkaratarakis/gitattributes into JSON snapshots that the
// gitignore and gitattributes generators fall back to when offline or when GitHub can't be reached.
// Usage: pnpm script:update:git-templates (set GITHUB_TOKEN to avoid the unauthenticated API rate limit)
import fs from 'node:fs/promises';

const sources = [
  {
    repository: 'github/gitignore',
    ref: 'main',
    extension: '.gitignore',
    output: 'src/tools/gitignore-generator/gitignore-templates.json',
  },
  {
    repository: 'alexkaratarakis/gitattributes',
    ref: 'master',
    extension: '.gitattributes',
    output: 'src/tools/gitattributes-generator/gitattributes-templates.json',
  },
];

const CONCURRENCY = 8;

const apiHeaders = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function fetchOk(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${response.statusText}`);
  }
  return response;
}

async function snapshot({ repository, ref, extension, output }) {
  const commit = await (
    await fetchOk(`https://api.github.com/repos/${repository}/commits/${ref}`, { headers: apiHeaders })
  ).json();
  const tree = await (
    await fetchOk(`https://api.github.com/repos/${repository}/git/trees/${commit.sha}?recursive=true`, {
      headers: apiHeaders,
    })
  ).json();
  if (tree.truncated) {
    throw new Error(`${repository}: tree listing is truncated`);
  }

  // Same name derivation as the tools: the path without its extension, skipping a bare root dotfile
  const names = tree.tree
    .filter(({ type, path }) => type === 'blob' && path.endsWith(extension))
    .map(({ path }) => path.slice(0, -extension.length))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const templates = {};
  for (let i = 0; i < names.length; i += CONCURRENCY) {
    const batch = names.slice(i, i + CONCURRENCY);
    const contents = await Promise.all(
      batch.map(async (name) =>
        (await fetchOk(`https://raw.githubusercontent.com/${repository}/${commit.sha}/${name}${extension}`)).text(),
      ),
    );
    batch.forEach((name, index) => (templates[name] = contents[index]));
  }

  const data = { repository, ref, commit: commit.sha, date: commit.commit.committer.date, templates };
  await fs.writeFile(output, `${JSON.stringify(data, null, 2)}\n`);
  const size = (await fs.stat(output)).size;
  console.log(`${output}: ${names.length} templates from ${repository}@${commit.sha.slice(0, 7)} (${size} bytes)`);
}

for (const source of sources) {
  await snapshot(source);
}
