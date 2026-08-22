**jq** is a command-line JSON processor: it slices, filters, maps and transforms structured data the way `sed` and `awk` do for text. A jq program is a *filter* — it takes an input, and produces an output.

```bash
# pretty-print a file
jq . data.json

# read from a pipe
curl -s https://api.example.com/users | jq '.[] | .name'
```

## 📦 Installation

```bash
brew install jq          # macOS
apt install jq           # Debian, Ubuntu
dnf install jq           # Fedora, RHEL
choco install jq         # Windows
```

## 🚩 Command-Line Flags

| Flag                     | Description                                                      |
|--------------------------|------------------------------------------------------------------|
| `-r`, `--raw-output`     | Print strings without quotes — what you want for shell variables |
| `-c`, `--compact-output` | One compact line per result instead of pretty-printed JSON       |
| `-n`, `--null-input`     | Do not read input; build JSON from scratch                       |
| `-s`, `--slurp`          | Read the whole input into one array                              |
| `-e`, `--exit-status`    | Exit non-zero when the last output is `false` or `null`          |
| `-j`, `--join-output`    | Raw output with no newline between results                       |
| `--tab` / `--indent n`   | Indent with tabs, or with `n` spaces                             |
| `-S`, `--sort-keys`      | Sort object keys in the output                                   |
| `--arg name value`       | Pass a string into the program as `$name`                        |
| `--argjson name json`    | Pass parsed JSON in as `$name`                                   |
| `--slurpfile name f`     | Read a whole file into `$name` as an array                       |
| `--raw-input`, `-R`      | Treat each input line as a string instead of JSON                |

## 🧭 Core Syntax

| Filter       | Description                                                   |
|--------------|---------------------------------------------------------------|
| `.`          | The identity filter — the input, unchanged                    |
| `.foo`       | The value of field `foo`                                      |
| `.foo.bar`   | Nested field access                                           |
| `.foo?`      | Same, but stays quiet when the input is not an object         |
| `."odd key"` | A field whose name needs quoting                              |
| `.[]`        | Every element of an array (or every value of an object)       |
| `.[0]`       | One element by index (`-1` is the last)                       |
| `.[2:4]`     | A slice — see the table below                                 |
| `\|`         | Pipe: feed the result of the left filter into the right one   |
| `,`          | Run both filters on the same input, emit both results         |
| `()`         | Grouping                                                      |
| `//`         | Alternative: use the right side if the left is `false`/`null` |
| `?`          | Suppress errors from the preceding filter                     |

## 📇 Objects

| Task                        | Filter                                            |
|-----------------------------|---------------------------------------------------|
| List the keys               | `jq 'keys'` (`keys_unsorted` to keep order)       |
| Does a key exist?           | `jq 'has("foo")'`                                 |
| Pick a few fields           | `jq '{name, id}'`                                 |
| Rename while picking        | `jq '{title: .name, ref: .id}'`                   |
| Delete a key                | `jq 'del(.foo)'`                                  |
| Add 1 to every value        | `jq 'map_values(.+1)'`                            |
| Merge two objects           | `jq '.a * .b'` (deep) or `jq '.a + .b'` (shallow) |
| Object → array of pairs     | `jq 'to_entries'`                                 |
| Array of pairs → object     | `jq 'from_entries'`                               |
| Transform every entry       | `jq 'with_entries(.value += 1)'`                  |
| Build an object from values | `jq -n '{time: now, host: $ENV.HOSTNAME}'`        |

## 📚 Arrays

### Slicing and filtering

| Task                         | Filter                                                                                                             |
|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Every element                | `jq '.[]'`                                                                                                         |
| First / last                 | `jq '.[0]'` / `jq '.[-1]'`                                                                                         |
| Range, first three, last two | `jq '.[2:4]'`, `jq '.[:3]'`, `jq '.[-2:]'`                                                                         |
| Numbers above a threshold    | `jq 'map(select(. >= 2))'`                                                                                         |
| Objects matching a field     | `jq '.[] \| select(.id == "second")'`                                                                              |
| Several conditions           | `jq '.[] \| select(.age > 18 and .city == "Oslo")'`                                                                |
| By type                      | `jq '.[] \| numbers'` — also `strings`, `booleans`, `nulls`, `arrays`, `objects`, `iterables`, `scalars`, `values` |
| Test a string field          | `jq '.[] \| select(.name \| test("^a"; "i"))'`                                                                     |

### Mapping and transforming

| Task                       | Filter                                      |
|----------------------------|---------------------------------------------|
| Apply to every element     | `jq 'map(.+1)'`                             |
| Pull one field out of each | `jq 'map(.name)'` or `jq '.[].name'`        |
| Drop elements by index     | `jq 'del(.[1, 2])'`                         |
| Concatenate nested arrays  | `jq 'add'`                                  |
| Flatten                    | `jq 'flatten'` (`flatten(1)` for one level) |
| Sort                       | `jq 'sort'` / `jq 'sort_by(.foo)'`          |
| Group                      | `jq 'group_by(.foo)'`                       |
| Deduplicate                | `jq 'unique'` / `jq 'unique_by(.foo)'`      |
| Reverse                    | `jq 'reverse'`                              |
| Smallest / largest         | `jq 'min'`, `jq 'max_by(.price)'`           |
| Count                      | `jq 'length'`                               |
| Sum                        | `jq 'map(.amount) \| add'`                  |
| Any / all match            | `jq 'any(.active)'`, `jq 'all(.age > 18)'`  |
| A range of numbers         | `jq '[range(2;4)]'`                         |
| The type of each item      | `jq 'map(type)'`                            |

## 🔤 Strings & Formatting

| Task                      | Filter                                         |
|---------------------------|------------------------------------------------|
| Interpolate               | `jq -r '"\(.name) is \(.age)"'`                |
| Change case               | `jq 'ascii_downcase'` / `ascii_upcase`         |
| Split and join            | `jq 'split(",")'` / `jq 'join(", ")'`          |
| Trim a prefix or suffix   | `jq 'ltrimstr("v")'` / `rtrimstr(".json")`     |
| Match a regex             | `jq 'test("^http")'`                           |
| Replace                   | `jq 'sub("^v"; "")'` / `gsub("\\s+"; "-")`     |
| Capture named groups      | `jq 'capture("(?<host>[^:]+):(?<port>\\d+)")'` |
| CSV / TSV output          | `jq -r '.[] \| [.id, .name] \| @csv'`          |
| Escape for a URL or shell | `jq -r '@uri "?q=\(.term)"'`, `@sh`            |
| Base64                    | `jq -r '@base64'` / `jq -r '@base64d'`         |
| Object → JSON string      | `jq 'tojson'` (and `fromjson` back)            |

## 🔀 Conditionals & Errors

```bash
# if / then / else — 'end' is required
jq 'if .age >= 18 then "adult" else "minor" end'

# several branches
jq 'if .n > 100 then "big" elif .n > 10 then "medium" else "small" end'

# fall back when a value is missing or null
jq '.nickname // .name'

# keep going when a filter would fail
jq '.items[]? // empty'

# turn a failure into a value of your own
jq 'try (.a.b.c) catch "not found"'

# stop with a message
jq 'if .id == null then error("id is required") else . end'
```

## 🧮 Variables, Functions & Reduction

```bash
# bind a value to a variable
jq '.items[] as $item | $item.name'

# pass values in from the shell
jq --arg env prod '.deploys[] | select(.env == $env)'
jq --argjson min 10 '.[] | select(.count > $min)'

# define a reusable function
jq 'def is_active: .status == "active"; map(select(is_active))'

# accumulate a value
jq 'reduce .[] as $x (0; . + $x.amount)'

# keep the intermediate results too
jq '[foreach .[] as $x (0; . + $x; .)]'

# read the environment
jq -n 'env.HOME'
```

## 🛠 Everyday Recipes

```bash
# pretty-print, sorted, and back to a file
jq -S . data.json > sorted.json

# one field, unquoted, for use in a shell variable
version=$(jq -r .version package.json)

# every key of every object, deduplicated
jq -r '[.[] | keys[]] | unique[]' data.json

# turn an array of objects into a CSV with a header row
jq -r '(.[0] | keys_unsorted), (.[] | [.[]]) | @csv' data.json

# merge two JSON files
jq -s '.[0] * .[1]' a.json b.json

# read newline-delimited JSON (one object per line)
jq -c '.event' events.ndjson

# turn plain text lines into a JSON array
printf 'a\nb\n' | jq -R -s 'split("\n") | map(select(length > 0))'

# find the path to every occurrence of a key
jq -c 'paths(scalars) as $p | {path: $p, value: getpath($p)}' data.json

# rewrite every string in a document
jq 'walk(if type == "string" then ascii_downcase else . end)' data.json

# use the exit status in a script
jq -e '.errors | length == 0' report.json && echo "clean"
```

## 📚 Resources

- [Manual](https://jqlang.github.io/jq/manual/)
- [Try jq in the browser (jqplay)](https://jqplay.org)
- [Tutorial](https://jqlang.github.io/jq/tutorial/)
