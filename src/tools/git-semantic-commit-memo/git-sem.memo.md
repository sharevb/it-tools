**Conventional Commits** is a convention for commit messages that both humans and tools can read: the type tells you what kind of change it is, and release tooling turns that into version numbers and changelogs automatically.

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

```text
feat(auth): add OAuth2 login
```

## 🏷 Types

| Type       | Use it for                                              | Release effect |
|------------|---------------------------------------------------------|----------------|
| `feat`     | A new feature for the user                              | Minor          |
| `fix`      | A bug fix for the user                                  | Patch          |
| `docs`     | Documentation only                                      | None           |
| `style`    | Formatting, whitespace, semicolons — no logic change    | None           |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None           |
| `perf`     | A change that improves performance                      | Patch          |
| `test`     | Adding or correcting tests                              | None           |
| `build`    | Build system or dependencies                            | None           |
| `ci`       | CI configuration and scripts                            | None           |
| `chore`    | Maintenance that does not touch src or tests            | None           |
| `revert`   | Reverting an earlier commit                             | Depends        |

> 💡 Any type with a `!` or a `BREAKING CHANGE:` footer triggers a **major** release, `feat` included.

## 🎯 Scope

The scope is an optional noun in parentheses naming the part of the codebase affected. Keep the list short and consistent — package names, modules, or layers.

```text
feat(auth): add OAuth2 integration
fix(api): resolve timeout on slow upstreams
docs(readme): update the installation steps
refactor(parser)!: drop support for the legacy format
```

## ✍️ Description

| Rule                           | ✅ Good                     | ❌ Avoid                         |
|--------------------------------|-----------------------------|----------------------------------|
| Imperative mood                | `add user export`           | `added user export`              |
| Lower case, no trailing period | `fix flaky login test`      | `Fix flaky login test.`          |
| Say what changed, not where    | `fix off-by-one in paging`  | `fix bug in file`                |
| Around 50 characters           | `feat(api): add rate limit` | a full sentence with sub-clauses |

## 📝 Body & Footers

The body explains **why**, not how — the diff already shows how. Separate it from the description with a blank line and wrap at ~72 characters.

Footers come last, one per line:

| Footer                         | Meaning                                       |
|--------------------------------|-----------------------------------------------|
| `BREAKING CHANGE: <what>`      | Incompatible change, forces a major release   |
| `Closes #123` / `Fixes #456`   | Closes the issue when merged (GitHub, GitLab) |
| `Refs #789`                    | Related, but does not close it                |
| `Co-authored-by: Name <email>` | Credits a second author                       |
| `Reviewed-by: Name <email>`    | Records the reviewer                          |

## 💥 Breaking Changes

Two ways to mark one — the `!` is visible in `git log --oneline`, the footer explains the migration. Use both.

```text
feat(api)!: require an email address when shipping

BREAKING CHANGE: POST /orders now rejects requests without a customer
email. Add the field before upgrading; see docs/migrations/2026-08.md.
```

## 📄 Examples

```text
feat: add user authentication
```

```text
fix(parser): handle a trailing comma in JSON input
```

```text
feat: add email notifications

Users can now receive email notifications for account changes,
security alerts and system updates. Delivery is queued so a slow
SMTP server never blocks the request.
```

```text
fix: prevent racing of requests

Introduce a request id and a reference to the latest request.
Dismiss incoming responses other than from the latest request.

Closes #123
```

```text
feat(cart): add the ability to remove items

Users can remove items from the cart instead of starting over,
which was the most common complaint in support tickets.

Closes #456
Co-authored-by: Jane Doe <jane@example.com>
```

## 🔢 Versioning

Release tooling maps the history since the last tag onto a semantic version:

| Commits since the last release | New version from `1.4.2` |
|--------------------------------|--------------------------|
| Only `docs`, `chore`, `style`… | no release               |
| At least one `fix` or `perf`   | `1.4.3`                  |
| At least one `feat`            | `1.5.0`                  |
| Any `!` or `BREAKING CHANGE:`  | `2.0.0`                  |

## 🛠 Tooling

### Commitizen — a prompt instead of a blank editor

```bash
npm install -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# then commit with
git cz
```

### commitlint — reject messages that do not follow the convention

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

### husky — run commitlint from a git hook

```bash
npm install --save-dev husky
npx husky init

# husky v9+: write the hook file yourself
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

### Releases & changelogs

```bash
# decide the version, tag, and publish from the commit history
npm install --save-dev semantic-release

# or just generate the changelog
npx conventional-changelog-cli -p angular -i CHANGELOG.md -s

# a fast, language-agnostic alternative
git cliff --tag v1.5.0 --output CHANGELOG.md
```

## ✅ Habits That Keep It Useful

- One logical change per commit — if the description needs an "and", split it.
- Write the message for the person bisecting in six months, not for the linter.
- Keep the scope vocabulary small and documented in `CONTRIBUTING.md`.
- Never invent types the tooling does not know; `config` or `wip` silently drop out of the changelog.
- Squash-merging? The **PR title** becomes the commit message, so lint that too.

## 📚 Resources

- [Conventional Commits specification](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)
- [semantic-release](https://semantic-release.gitbook.io/)
- [Semantic Versioning](https://semver.org/)
