# 🧾 `sed` 命令速查表（流编辑器）

`sed` 是一款强大的 Unix 工具，用于通过**流编辑**来解析和转换文本。

## 📌 基本语法

```bash
sed [OPTIONS] 'script' [file...]
```

- `'script'`：一个或多个编辑命令。
- `[file]`：输入文件。如果省略，`sed` 从标准输入读取。

## ⚙️ 常用选项

| 选项 | 描述 |
|--------|-------------|
| `-n`   | 禁止自动输出模式空间。使用 `p` 显式打印。 |
| `-e`   | 添加多个编辑命令。 |
| `-i`   | 原地编辑文件（可选备份：`-i.bak`）。 |
| `-f`   | 从文件读取命令。 |

## ✂️ 基本命令

| 命令 | 描述 |
|---------|-------------|
| `p`     | 打印当前模式空间。 |
| `d`     | 删除当前模式空间。 |
| `s`     | 使用正则替换文本。 |
| `q`     | 处理第一个匹配后退出。 |
| `a`     | 在当前行后追加文本。 |
| `i`     | 在当前行前插入文本。 |
| `c`     | 用新文本替换行。 |
| `y`     | 转换字符（类似 `tr`）。 |

## 🔍 替换语法

```bash
sed 's/pattern/replacement/flags' file
```

### 标志

| 标志 | 描述 |
|------|-------------|
| `g`  | 全局替换（行内所有匹配项）。 |
| `i`  | 不区分大小写匹配。 |
| `p`  | 如果发生替换则打印该行。 |
| `n`  | 仅替换第 n 个匹配项。 |

### 示例

```bash
sed 's/foo/bar/' file       # 将第一个 'foo' 替换为 'bar'
sed 's/foo/bar/g' file      # 将所有 'foo' 替换为 'bar'
sed 's/foo/bar/2' file      # 仅替换第二个 'foo'
sed 's/foo/bar/ip' file     # 不区分大小写 + 打印
```

## 🗑️ 使用 `sed` 删除

`sed` 可以根据行号、模式或范围删除行。

### 🔢 按行号删除

```bash
sed '2d' file             # 删除第 2 行
sed '5,10d' file          # 删除第 5 到 10 行
```

### 🔍 按模式删除

```bash
sed '/error/d' file       # 删除包含 'error' 的行
sed '/^$/d' file           # 删除空行
sed '/^#/d' file           # 删除注释行（以 # 开头）
```

### 🧮 按范围和模式删除

```bash
sed '1,/pattern/d' file   # 从第 1 行删除到第一个匹配 'pattern' 的行
sed '/start/,/end/d' file # 删除 'start' 和 'end' 之间的行（包含边界）
```

### 🧠 条件删除

```bash
sed -n '/pattern/!p' file # 仅打印不匹配 'pattern' 的行
```

### 🧹 删除最后一行

```bash
sed '$d' file             # 删除最后一行
```

## 📍 行寻址

### 行号

```bash
sed '2d' file            # 删除第 2 行
sed '3,5p' file          # 打印第 3 到 5 行
```

### 模式

```bash
sed '/error/d' file      # 删除包含 'error' 的行
sed '/^#/d' file         # 删除注释行
```

### 组合

```bash
sed '1,/pattern/d' file  # 从第 1 行删除到第一个匹配 'pattern' 的行
```

## 🧪 高级替换

### 使用捕获组

```bash
sed 's/\(foo\)bar/\1baz/' file
```

- `\(...\)` 捕获一个分组。
- `\1`、`\2` 等引用捕获的分组。

### 转义特殊字符

```bash
sed 's/\/usr\/bin/\/usr\/local\/bin/' file
```

或使用其他分隔符：

```bash
sed 's|/usr/bin|/usr/local/bin|' file
```

## 🧨 原地编辑

```bash
sed -i 's/foo/bar/g' file           # 直接编辑文件
sed -i.bak 's/foo/bar/g' file       # 将原文件备份为 file.bak
```

## 📂 多命令

### 内联方式

```bash
sed -e 's/foo/bar/' -e '/baz/d' file
```

### 块语法

```bash
sed '
s/foo/bar/
s/baz/qux/
' file
```

## 🧵 追加、插入、替换

```bash
sed '/pattern/a\Text to append' file
sed '/pattern/i\Text to insert' file
sed '/pattern/c\New line content' file
```

## 🔄 字符转换

```bash
sed 'y/abc/ABC/' file     # a→A, b→B, c→C
```

## 🧠 实用技巧

### 删除空行

```bash
sed '/^$/d' file
```

### 删除行首/行尾空白

```bash
sed 's/^[ \t]*//' file     # 删除行首空白
sed 's/[ \t]*$//' file     # 删除行尾空白
```

### 将制表符替换为空格

```bash
sed 's/\t/    /g' file
```

### 行号编号

```bash
sed = file | sed 'N;s/\n/\t/'
```

## 📚 资源

- `man sed`
- GNU sed 手册：[https://www.gnu.org/software/sed/manual/sed.html](https://www.gnu.org/software/sed/manual/sed.html)