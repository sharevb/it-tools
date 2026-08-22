**Bash** is the default shell on most Linux systems and the language of most glue scripts. This sheet covers the interactive shortcuts, the syntax you forget between scripts, and the safety flags worth putting at the top of every file.

```bash
#!/usr/bin/env bash
set -euo pipefail
```

## ⌨️ Keyboard Shortcuts

| Keys                | Does                                             |
|---------------------|--------------------------------------------------|
| `Ctrl+A` / `Ctrl+E` | Jump to the start / end of the line              |
| `Ctrl+B` / `Ctrl+F` | Back / forward one character                     |
| `Alt+B` / `Alt+F`   | Back / forward one word                          |
| `Ctrl+U` / `Ctrl+K` | Cut to the start / end of the line               |
| `Ctrl+W`            | Cut the word before the cursor                   |
| `Alt+D`             | Cut the word after the cursor                    |
| `Ctrl+Y`            | Paste back what you last cut                     |
| `Ctrl+T` / `Alt+T`  | Swap the last two characters / words             |
| `Alt+.`             | Insert the last argument of the previous command |
| `Ctrl+L`            | Clear the screen                                 |
| `Ctrl+R`            | Search the history backwards                     |
| `Ctrl+G`            | Abort the history search                         |
| `Ctrl+C`            | Interrupt the running command                    |
| `Ctrl+D`            | End of input — logs out of an empty prompt       |
| `Ctrl+Z`            | Suspend the running command                      |
| `Ctrl+S` / `Ctrl+Q` | Freeze / resume terminal output                  |
| `Alt+U` / `Alt+L`   | Upper-case / lower-case to the end of the word   |

## 🕰 History

```bash
# the last few hundred commands
history

# run command number 42
!42

# run the last command again, or the last one starting with 'ssh'
!!
!ssh

# the last argument of the previous command — also Alt+.
!$

# every argument of the previous command
!*

# re-run the last command with a substitution
^old^new

# forget a command you would rather not keep
history -d 42

# do not record commands that start with a space, and drop duplicates
export HISTCONTROL=ignoreboth
export HISTSIZE=10000 HISTFILESIZE=20000
```

## 📁 Files & Directories

```bash
# list: long, human sizes, hidden files, newest last
ls -lhAtr

# tree view of a directory
tree -L 2

# copy, move, delete
cp -r src/ dest/
mv old new
rm -rf directory

# create nested directories in one go
mkdir -p project/{src,test,docs}

# symbolic and hard links
ln -s /path/to/target linkname
ln target hardlink

# where is a file, and what is it?
find . -name '*.log' -mtime -7
find . -type f -size +100M
locate nginx.conf
which python3
type -a ls
file archive.bin
stat report.pdf

# disk usage: this directory, and the filesystem
du -sh *
du -h --max-depth=1 | sort -h
df -h

# archives
tar czf backup.tar.gz directory/
tar xzf backup.tar.gz
zip -r archive.zip directory/
unzip archive.zip
```

## 🔎 Text & Search

```bash
# grep: recursive, line numbers, case-insensitive
grep -rni "pattern" .

# only the matching part, or only the file names
grep -o 'v[0-9.]*' file
grep -rl "TODO" src/

# invert, count, context
grep -v "debug" app.log
grep -c "error" app.log
grep -B2 -A2 "exception" app.log

# head, tail, follow
head -20 file
tail -f /var/log/syslog

# columns, sorting, counting
cut -d',' -f1,3 data.csv
sort -u names.txt
sort -k2 -n scores.txt
uniq -c sorted.txt
wc -l file

# the classic: what are the top ten IPs in this log?
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head

# replace across many files
sed -i 's/old/new/g' *.conf

# translate or delete characters
tr 'a-z' 'A-Z' < file
tr -d '\r' < dos.txt > unix.txt

# split a stream: to a file and onward down the pipe
command | tee output.log | grep error

# build command lines from input
find . -name '*.py' | xargs wc -l
find . -name '*.tmp' -print0 | xargs -0 rm
```

## 🖧 System & Network

```bash
# who and where am I
whoami; hostname; uname -a; uptime

# processes
ps aux | grep nginx
pgrep -a node
top
htop

# memory and load
free -h
vmstat 1 5

# what is listening, and what has this file open
ss -tulpn
lsof -i :8080
lsof /var/log/app.log

# connectivity
ping -c 4 example.com
traceroute example.com
dig example.com +short
ip addr show
curl -I https://example.com

# transfer files
scp file user@host:/path/
rsync -avz --progress src/ user@host:/dest/

# remote shell, with a tunnel
ssh user@host
ssh -L 8080:localhost:80 user@host

# services and logs (systemd)
systemctl status nginx
journalctl -u nginx -f --since "1 hour ago"
```

## 📦 Variables

```bash
# assignment: no spaces around the =
name="value"

# only for this one command
DEBUG=1 ./script.sh

# export to child processes
export PATH="$HOME/bin:$PATH"

# read input from the user
read -p "Name: " name
read -rs -p "Password: " pass

# command substitution
today=$(date +%F)

# arithmetic
count=$(( count + 1 ))
let "n = 5 * 3"

# read-only and integer variables
declare -r VERSION=1.0
declare -i counter=0
```

| Variable                         | Holds                                     |
|----------------------------------|-------------------------------------------|
| `$0`                             | The name of the script                    |
| `$1` … `$9`                      | Positional arguments                      |
| `$#`                             | How many arguments were passed            |
| `$@`                             | All arguments, each one quoted separately |
| `$*`                             | All arguments as a single word            |
| `$?`                             | Exit status of the last command           |
| `$$`                             | PID of the current shell                  |
| `$!`                             | PID of the last background job            |
| `$_`                             | Last argument of the previous command     |
| `$HOME` `$USER` `$PWD` `$OLDPWD` | The usual environment                     |
| `$RANDOM`                        | A random integer                          |
| `$LINENO`                        | The current line number — handy in traps  |

## 🔤 Parameter Expansion

| Expansion               | Result                                                                     |
|-------------------------|----------------------------------------------------------------------------|
| `${var:-default}`       | `default` when `var` is unset or empty                                     |
| `${var:=default}`       | The same, and assigns it                                                   |
| `${var:?message}`       | Abort with `message` when unset — great for required arguments             |
| `${var:+value}`         | `value` only when `var` **is** set                                         |
| `${#var}`               | The length of the value                                                    |
| `${var:offset:length}`  | A substring                                                                |
| `${var#pattern}`        | Strip the shortest match from the start                                    |
| `${var##pattern}`       | Strip the longest match from the start — `${path##*/}` is basename         |
| `${var%pattern}`        | Strip the shortest match from the end — `${file%.txt}` drops the extension |
| `${var%%pattern}`       | Strip the longest match from the end                                       |
| `${var/old/new}`        | Replace the first match                                                    |
| `${var//old/new}`       | Replace every match                                                        |
| `${var^^}` / `${var,,}` | Upper-case / lower-case the whole value                                    |

```bash
path="/var/log/app.log"
echo "${path##*/}"    # app.log
echo "${path%/*}"     # /var/log
echo "${path%.log}"   # /var/log/app
```

## 📚 Arrays

```bash
# indexed arrays
fruits=(apple banana cherry)
fruits[3]="date"

echo "${fruits[1]}"       # banana
echo "${fruits[@]}"       # every element
echo "${#fruits[@]}"      # how many elements
echo "${!fruits[@]}"      # the indexes
echo "${fruits[@]:1:2}"   # a slice

for fruit in "${fruits[@]}"; do
  echo "$fruit"
done

# associative arrays (bash 4+)
declare -A color
color[apple]="red"
color[banana]="yellow"

echo "${color[apple]}"
for key in "${!color[@]}"; do
  echo "$key is ${color[$key]}"
done
```

## 🧪 Tests & Conditions

Use `[[ ... ]]` in bash — it handles empty variables and patterns far better than the old `[ ... ]`.

| Files          | True when                                 |
|----------------|-------------------------------------------|
| `-e file`      | It exists                                 |
| `-f file`      | It exists and is a regular file           |
| `-d file`      | It exists and is a directory              |
| `-L file`      | It is a symbolic link                     |
| `-s file`      | It exists and is not empty                |
| `-r` `-w` `-x` | You can read / write / execute it         |
| `-O file`      | You own it                                |
| `f1 -nt f2`    | `f1` is newer than `f2` (`-ot` for older) |

| Strings        | True when                                     |
|----------------|-----------------------------------------------|
| `-z "$s"`      | The string is empty                           |
| `-n "$s"`      | The string is not empty                       |
| `"$a" == "$b"` | They are equal (`=` also works)               |
| `"$a" != "$b"` | They differ                                   |
| `"$a" < "$b"`  | Sorts before, in the current locale           |
| `"$s" == pre*` | Glob match — unquoted right-hand side         |
| `"$s" =~ ^re$` | Regex match, captures land in `$BASH_REMATCH` |

| Numbers | Meaning               |
|---------|-----------------------|
| `-eq`   | Equal                 |
| `-ne`   | Not equal             |
| `-lt`   | Less than             |
| `-le`   | Less than or equal    |
| `-gt`   | Greater than          |
| `-ge`   | Greater than or equal |

```bash
if [[ -f "$config" && -r "$config" ]]; then
  echo "readable"
elif [[ -d "$config" ]]; then
  echo "that is a directory"
else
  echo "missing"
fi

# arithmetic comparison reads more naturally in (( ))
if (( count > 10 )); then echo "plenty"; fi
```

## 🔀 Flow Control

```bash
# for over a list, a glob, or a range
for name in alice bob; do echo "$name"; done
for f in *.log; do gzip "$f"; done
for i in {1..10}; do echo "$i"; done
for (( i = 0; i < 10; i++ )); do echo "$i"; done

# while and until
while read -r line; do echo "$line"; done < input.txt
until ping -c1 host &>/dev/null; do sleep 5; done

# case
case "$1" in
  start)   echo "starting" ;;
  stop)    echo "stopping" ;;
  restart) echo "restarting" ;;
  *)       echo "usage: $0 {start|stop|restart}"; exit 1 ;;
esac

# select builds a numbered menu
select choice in build test deploy; do
  echo "you picked $choice"
  break
done

# loop control
continue   # skip to the next iteration
break      # leave the loop
```

## 🧰 Functions

```bash
greet() {
  local name="${1:?name required}"
  local greeting="${2:-Hello}"
  echo "$greeting, $name!"
  return 0
}

greet "World"
greet "World" "Good morning"

# capture the output, and check the status
message=$(greet "World")
if ! greet; then echo "greet failed"; fi

# make a function available to subshells
export -f greet
```

## ➡️ Redirection

| Syntax             | Does                                       |
|--------------------|--------------------------------------------|
| `> file`           | Send stdout to a file, replacing it        |
| `>> file`          | Append stdout to a file                    |
| `2> file`          | Send stderr to a file                      |
| `2>&1`             | Send stderr wherever stdout is going       |
| `&> file`          | Send both to a file (bash)                 |
| `> file 2>&1`      | The portable form of the same              |
| `< file`           | Read stdin from a file                     |
| `<<EOF … EOF`      | Here-document                              |
| `<<-EOF … EOF`     | Here-document, leading tabs stripped       |
| `<<< "string"`     | Here-string                                |
| `\|`               | Pipe stdout into the next command          |
| `\|&`              | Pipe stdout **and** stderr                 |
| `> /dev/null 2>&1` | Discard everything                         |
| `<(command)`       | Process substitution — a command as a file |
| `tee file`         | Write to a file and pass the stream on     |

```bash
# a heredoc, expanded
cat <<EOF > config.ini
host=$HOSTNAME
port=8080
EOF

# a heredoc, literal (quoted delimiter)
cat <<'EOF' > script.sh
echo "$HOME is not expanded here"
EOF

# compare the output of two commands without temporary files
diff <(sort a.txt) <(sort b.txt)
```

## ⚙️ Jobs & Processes

```bash
# run in the background, and list the jobs
long_task &
jobs

# bring back to the foreground, or resume in the background
fg %1
bg %1

# Ctrl+Z suspends the foreground job

# survive logout
nohup ./script.sh > out.log 2>&1 &
disown -h %1

# wait for background jobs
wait
wait $!

# signals
kill 1234
kill -9 1234
kill -TERM %1
pkill -f "node server.js"

# give a command a deadline
timeout 30s ./slow_task.sh

# clean up on exit, whatever happens
trap 'rm -f "$tmpfile"' EXIT
trap 'echo interrupted; exit 130' INT TERM
```

## 🛡 Safe Scripting

```bash
#!/usr/bin/env bash
# -e  exit on any failing command
# -u  treat unset variables as an error
# -o pipefail  a pipeline fails if any stage fails
set -euo pipefail

# make word splitting predictable
IFS=$'\n\t'

# always quote expansions
cp "$src" "$dest"

# check the syntax without running anything
bash -n script.sh

# trace every command as it runs
bash -x script.sh
set -x; risky_command; set +x

# a more informative trace prefix
export PS4='+ ${BASH_SOURCE}:${LINENO}: '

# report where a script died
trap 'echo "failed at line $LINENO with status $?" >&2' ERR

# and lint it before it reaches anyone else
shellcheck script.sh
```

> ⚠️ `set -e` has surprising corners: it does not fire inside `if`, `&&`, `||` or command substitutions used in assignments. It is a seatbelt, not autopilot — still check what matters explicitly.

## 🎨 Colours

Escape sequences take the form `\033[<style>;<colour>m`, and `\033[0m` resets. `\e` and `\x1B` are the same character as `\033`.

| Colour  | Foreground | Bright | Background |
|---------|------------|--------|------------|
| Black   | `30`       | `90`   | `40`       |
| Red     | `31`       | `91`   | `41`       |
| Green   | `32`       | `92`   | `42`       |
| Yellow  | `33`       | `93`   | `43`       |
| Blue    | `34`       | `94`   | `44`       |
| Magenta | `35`       | `95`   | `45`       |
| Cyan    | `36`       | `96`   | `46`       |
| White   | `37`       | `97`   | `47`       |

| Style | Code | Style     | Code |
|-------|------|-----------|------|
| Reset | `0`  | Underline | `4`  |
| Bold  | `1`  | Blink     | `5`  |
| Dim   | `2`  | Reverse   | `7`  |

```bash
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
RESET='\033[0m'

echo -e "${GREEN}ok${RESET} — ${RED}${BOLD}failed${RESET}"

# only colourise when stdout is a terminal
if [[ -t 1 ]]; then RED='\033[0;31m'; RESET='\033[0m'; else RED=''; RESET=''; fi
```

## 💡 Tips

```bash
# aliases and functions belong in ~/.bashrc
alias ll='ls -lhA'
alias gs='git status -sb'
mkcd() { mkdir -p "$1" && cd "$1"; }

# reload the config after editing it
source ~/.bashrc

# brace expansion saves a lot of typing
cp config.yaml{,.bak}
mkdir -p src/{components,utils,tests}

# repeat the previous command as root
sudo !!

# go back to the previous directory
cd -

# run something regardless of the current directory
(cd /tmp && ./task.sh)

# time a command, and keep a transcript of a session
time ./build.sh
script session.log
```

## 📚 Resources

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/bash.html)
- [ShellCheck — lints your scripts](https://www.shellcheck.net/)
- [Bash Pitfalls](https://mywiki.wooledge.org/BashPitfalls)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [explainshell — break down any command line](https://explainshell.com/)
