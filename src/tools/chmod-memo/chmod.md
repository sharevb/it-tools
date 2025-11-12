The `chmod` command changes file and directory permissions in Unix/Linux.

## 🧑 User Classes

| Symbol | Meaning        |
|--------|----------------|
| `u`    | User (owner)   |
| `g`    | Group          |
| `o`    | Others         |
| `a`    | All (u+g+o)    |

## 🔐 Permission Types

| Symbol | Meaning  | Numeric |
|--------|----------|---------|
| `r`    | Read     | 4       |
| `w`    | Write    | 2       |
| `x`    | Execute  | 1       |

## 📝 Symbolic Mode

Use `+`, `-`, or `=` to modify permissions:

```bash
chmod u+x file      # Add execute to user
chmod go-w file     # Remove write from group and others
chmod a=r file      # Set read-only for all
```

## 🔢 Numeric (Octal) Mode

Combine values for user, group, and others:

| Mode | Permissions | Meaning       |
|------|-------------|---------------|
| 777  | rwxrwxrwx   | Full access   |
| 755  | rwxr-xr-x   | Common for scripts |
| 644  | rw-r--r--   | Common for text files |


```bash
chmod 755 script.sh
chmod 644 notes.txt
```

## 🧪 Special Permission Flags

These flags go beyond basic read/write/execute and control execution context and deletion behavior.

### 🔸 `setuid` (Set User ID on Execution)

- **Octal prefix**: `4`
- **Applies to**: Executable files
- **Effect**: When executed, the process runs with the file owner's privileges (not the user's).
- **Use case**: Programs like `passwd` need elevated privileges to modify system files.

```bash
chmod 4755 /usr/bin/somebinary
# -rwsr-xr-x → 's' replaces 'x' in user field
```

> ⚠️ Security risk if misused — avoid setting on scripts or user-controlled binaries.

### 🔸 `setgid` (Set Group ID)

- **Octal prefix**: `2`
- **Applies to**:
  - **Files**: Runs with the file group’s privileges.
  - **Directories**: New files inherit the directory’s group.
- **Use case**: Shared project folders where all files should belong to the same group.

```bash
chmod 2755 /shared/folder
# drwxr-sr-x → 's' in group field
```

> 📁 On directories, this ensures group consistency for collaborative environments.

### 🔸 `sticky` Bit

- **Octal prefix**: `1`
- **Applies to**: Directories only
- **Effect**: Only the file owner (or root) can delete or rename files inside.
- **Use case**: `/tmp` directory — prevents users from deleting each other’s files.

```bash
chmod 1777 /tmp
# drwxrwxrwt → 't' in others field
```

> 🧷 Think of it as a “delete lock” for shared spaces.

## 📂 Execute (`x`) Flag: Files vs Directories

| Context     | Effect of `x` Permission               |
|-------------|----------------------------------------|
| **File**    | Allows execution as a program/script   |
| **Directory** | Allows entering the directory (`cd`) and accessing contents by name |

### 🔍 Directory Access Matrix

| Permission | Can List (`ls`) | Can Enter (`cd`) | Can Access Files |
|------------|------------------|------------------|------------------|
| `r`        | ✅               | ❌               | ✅ (if name known) |
| `x`        | ❌               | ✅               | ✅ (if name known) |
| `r+x`      | ✅               | ✅               | ✅               |

> 🧠 Without `x` on a directory, you can't `cd` into it — even if you can list its contents.

## 🔍 Quick Reference

| Command             | Description                          |
|---------------------|--------------------------------------|
| `chmod +x file`     | Make file executable                 |
| `chmod -R 755 dir`  | Recursively set permissions          |
| `chmod u=rwx file`  | Set user to rwx only                 |
| `chmod a-x file`    | Remove execute from all              |

💡 Tip: Use `ls -l` to view current permissions.