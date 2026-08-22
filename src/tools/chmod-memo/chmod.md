**`chmod`** (*change mode*) sets who may read, write, and execute a file or directory on Unix-like systems. The mode can be written **symbolically** (`u+x`) or **numerically** (`755`) — both reach the same result.

```bash
chmod [options] <mode> <file>...
```

> 💡 Inspect before and after with `ls -l <file>`, or get the octal value directly with `stat -c '%a %n' <file>`.

## 🗂 Reading `ls -l` Output

```text
-  rwx  r-x  r--   →  754
│  │    │    │
│  │    │    └── others : r-- = 4
│  │    └─────── group  : r-x = 5
│  └──────────── user   : rwx = 7
└─────────────── type   : - file · d directory · l symlink · c/b device
```

## 🧑 User Classes (*who*)

| Symbol | Class  | Applies to                                      |
|--------|--------|-------------------------------------------------|
| `u`    | User   | The file's owner                                |
| `g`    | Group  | Members of the file's group                     |
| `o`    | Others | Everyone else                                   |
| `a`    | All    | `u`, `g` and `o` at once (implied when omitted) |

## 🔐 Permission Bits (*what*)

| Symbol | Permission | Octal | On a file           | On a directory                            |
|--------|------------|-------|---------------------|-------------------------------------------|
| `r`    | Read       | `4`   | Read the contents   | List entry names (`ls`)                   |
| `w`    | Write      | `2`   | Modify the contents | Create, rename and delete entries         |
| `x`    | Execute    | `1`   | Run as a program    | Enter it (`cd`) and reach entries by name |
| `-`    | None       | `0`   | —                   | —                                         |

## 📝 Symbolic Mode

| Operator | Effect                                                            |
|----------|-------------------------------------------------------------------|
| `+`      | Add the listed permissions, leave the rest untouched              |
| `-`      | Remove the listed permissions, leave the rest untouched           |
| `=`      | Set exactly these permissions, clearing the others for that class |

```bash
# add execute for the owner
chmod u+x <file>

# remove write from the group
chmod g-w <file>

# cut off group and others entirely
chmod go-rwx <file>

# everyone gets read only, nothing else
chmod a=r <file>

# several clauses, comma separated
chmod u=rwx,go=rx <file>

# 'a' is implied, then filtered by the umask
chmod +x <file>

# regular and special bits in one call
chmod u+x,g+s <file>

# copy the mode of another file
chmod --reference=<ref> <file>
```

> 💡 Use `X` (capital) instead of `x` to add execute **only** to directories and to files that already have an execute bit — the safe way to fix a tree: `chmod -R u=rwX,go=rX <dir>`.

## 🔢 Numeric (Octal) Mode

Each digit is the sum of `r` (4), `w` (2) and `x` (1):

| Octal | Sum   | Bits  |
|-------|-------|-------|
| `7`   | 4+2+1 | `rwx` |
| `6`   | 4+2   | `rw-` |
| `5`   | 4+1   | `r-x` |
| `4`   | 4     | `r--` |
| `3`   | 2+1   | `-wx` |
| `2`   | 2     | `-w-` |
| `1`   | 1     | `--x` |
| `0`   | 0     | `---` |

Three digits map to **user, group, others**. An optional fourth *leading* digit sets the special bits (`chmod 4755`, see below).

### Common modes

| Mode  | Symbolic    | Typical use                                                 |
|-------|-------------|-------------------------------------------------------------|
| `777` | `rwxrwxrwx` | Full access for everyone — ⚠️ almost never the right answer |
| `755` | `rwxr-xr-x` | Scripts, binaries and directories                           |
| `750` | `rwxr-x---` | Executable for the owner and their group only               |
| `700` | `rwx------` | Private directory (`~/.ssh`, `~/.gnupg`)                    |
| `664` | `rw-rw-r--` | Files shared read-write inside a group                      |
| `644` | `rw-r--r--` | Regular files, web assets, configs                          |
| `640` | `rw-r-----` | Config with secrets, readable by a service group            |
| `600` | `rw-------` | Private files (`~/.ssh/id_ed25519`, `.env`)                 |
| `400` | `r--------` | Read-only key material                                      |

```bash
chmod 755 script.sh

chmod 644 notes.txt

chmod 600 ~/.ssh/id_ed25519
```

## 🧪 Special Permission Bits

These go beyond read/write/execute and control the execution context and deletion rules.

| Bit      | Octal | Symbolic | Applies to               | Effect                                                               | Shown in `ls -l` as     |
|----------|-------|----------|--------------------------|----------------------------------------------------------------------|-------------------------|
| `setuid` | `4`   | `u+s`    | Executable files         | Runs with the **file owner's** privileges                            | `s` in the user field   |
| `setgid` | `2`   | `g+s`    | Executables, directories | Runs as the file's group / new entries inherit the directory's group | `s` in the group field  |
| `sticky` | `1`   | `+t`     | Directories              | Only the entry's owner (or root) may delete or rename it             | `t` in the others field |

```bash
# setuid → -rwsr-xr-x
chmod 4755 /usr/bin/somebinary

# setgid → drwxrwsr-x: one group for the whole tree
chmod 2775 /srv/shared

# sticky → drwxrwxrwt: a shared drop box, like /tmp
chmod 1777 /srv/tmp

# strip every special bit again
chmod u-s,g-s,o-t <file>
```

> ⚠️ `setuid` is a privilege-escalation vector — never set it on scripts or on binaries a user can replace. Linux ignores it on interpreted scripts anyway.
>
> ℹ️ A capital `S` or `T` in `ls -l` (`-rwSr--r--`) means the special bit is set while the matching `x` bit is **not** — usually a mistake.

## 📂 Directory Access Matrix

`x` on a directory means *traverse*, not *execute* — without it nothing below the directory can be reached, no matter how permissive the files themselves are.

| Mode  | List names (`ls`) | Details (`ls -l`, `stat`) | Enter (`cd`) | Open a known file | Create / delete entries |
|-------|-------------------|---------------------------|--------------|-------------------|-------------------------|
| `r--` | ✅                | ❌                        | ❌           | ❌                | ❌                      |
| `--x` | ❌                | ✅ (by exact name)        | ✅           | ✅                | ❌                      |
| `r-x` | ✅                | ✅                        | ✅           | ✅                | ❌                      |
| `rwx` | ✅                | ✅                        | ✅           | ✅                | ✅                      |
| `-w-` | ❌                | ❌                        | ❌           | ❌                | ❌ (write needs `x`)    |

## 🔁 Recursive & Selective Changes

```bash
# blunt: also marks every file executable
chmod -R 755 <dir>

# preferred: X only touches dirs + real executables
chmod -R u=rwX,go=rX <dir>

# directories only
find <dir> -type d -exec chmod 755 {} +

# files only
find <dir> -type f -exec chmod 644 {} +

# make every shell script executable
find <dir> -type f -name '*.sh' -exec chmod +x {} +
```

## ⚙️ Useful Options

| Option                      | Description                                                     |
|-----------------------------|-----------------------------------------------------------------|
| `-R`, `--recursive`         | Apply to directories and everything inside them                 |
| `-v`, `--verbose`           | Print a line for every file processed                           |
| `-c`, `--changes`           | Print a line only when a mode actually changed                  |
| `-f`, `--silent`, `--quiet` | Suppress most error messages                                    |
| `--reference=<file>`        | Reuse the mode of another file instead of spelling it out       |
| `--preserve-root`           | Refuse to run recursively on `/` — not the default, unlike `rm` |
| `-h` (BSD/macOS)            | Act on the symlink itself instead of its target                 |

## 🎭 `umask` — Default Permissions for New Files

New files start from `666` and new directories from `777`; the umask bits are removed from that base.

```bash
# show the current mask, e.g. 0022
umask

# show it symbolically, e.g. u=rwx,g=rx,o=rx
umask -S

# stricter default for this shell session
umask 027
```

| umask | New files | New directories |
|-------|-----------|-----------------|
| `022` | `644`     | `755`           |
| `002` | `664`     | `775`           |
| `027` | `640`     | `750`           |
| `077` | `600`     | `700`           |

> 💡 Put `umask 027` in `~/.bashrc` (or a systemd unit's `UMask=`) to make the default stick.

## 🚑 Common Recipes

| Goal                                | Command                                                                      |
|-------------------------------------|------------------------------------------------------------------------------|
| Make a script runnable              | `chmod +x deploy.sh`                                                         |
| Lock down an SSH key pair           | `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_* && chmod 644 ~/.ssh/*.pub`        |
| Serve web content read-only         | `chmod -R u=rwX,go=rX /var/www/site`                                         |
| Shared team directory (one group)   | `chmod 2775 /srv/shared`                                                     |
| Public scratch directory            | `chmod 1777 /srv/tmp`                                                        |
| Clone the mode of a known-good file | `chmod --reference=good.conf new.conf`                                       |
| Undo an accidental `chmod -R 777 .` | `find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +` |

## 🧰 Related Commands

| Command                           | Purpose                                                            |
|-----------------------------------|--------------------------------------------------------------------|
| `chown <user>:<group> <file>`     | Change the owner and/or group                                      |
| `chgrp <group> <file>`            | Change the group only                                              |
| `ls -l` / `ls -ld <dir>`          | Show permissions (`-d` for the directory itself, not its contents) |
| `stat -c '%a %A %U:%G %n' <file>` | Octal mode, symbolic mode, owner and group in one line             |
| `namei -l <path>`                 | Show the permissions of every component of a path                  |
| `getfacl` / `setfacl`             | Fine-grained ACLs when `u/g/o` is not expressive enough            |
| `id` / `groups`                   | Check which groups you actually belong to                          |

## ⚠️ Gotchas

- **`chmod 777` is not a fix.** It grants every local user write access; the real problem is almost always ownership (`chown`) or a missing `x` on a parent directory.
- **"Permission denied" on a file with `rw-`?** Every directory in the path needs `x`. Debug the whole chain with `namei -l /path/to/file`.
- **Interpreted scripts need `r` too** — the kernel hands the file to the interpreter, which has to read it.
- **Group changes need a new login** (or `newgrp <group>`) before the shell picks them up.
- **FAT/NTFS/exFAT mounts ignore `chmod`** — set permissions with the `umask=`, `fmask=` and `dmask=` mount options instead.
- **Removing `x` from a directory hides everything below it**, even world-readable files.

## 📚 Resources

- [GNU coreutils — `chmod` invocation](https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html)
- [GNU coreutils — file permissions](https://www.gnu.org/software/coreutils/manual/html_node/File-permissions.html)
- Man pages: `man 1 chmod` · `man 1 umask` · `man 1 chown` · `man 5 acl`
