**Git** is a distributed version control system: every clone is a full repository with its own history, branches and tags. This is a quick reference for the commands that come up daily — placeholders are written as `<file>`, `<branch>`, `<commit>` and `<url>`.

> 💡 Every command below has its own help (`git rebase --help`), and the destructive ones (`clean`, `push`, `rm`, `mv`) take `-n` / `--dry-run` to preview what would happen.

## ⚙️ Configuration

```bash
# identity used on every commit
git config --global user.name "<name>"
git config --global user.email "<email>"

# name of the branch created by git init
git config --global init.defaultBranch main

# editor for messages, rebases, ...
git config --global core.editor "code --wait"

# rebase instead of merging on pull
git config --global pull.rebase true

# plain 'git push' works on new branches
git config --global push.autoSetupRemote true

# every setting and the file it came from
git config --list --show-origin

# override for this repository only
git config --local user.email "<work-email>"
```

Handy aliases:

```bash
git config --global alias.st status

git config --global alias.co checkout

git config --global alias.lg "log --oneline --graph --decorate --all"

git config --global alias.last "log -1 --stat"
```

## 🚀 Get Started

```bash
# create a repository in the current directory
git init

# clone a remote repository
git clone <url>

# clone into a specific directory
git clone <url> <directory>

# clone and check out one branch
git clone --branch <branch> <url>

# shallow clone, latest commit only
git clone --depth 1 <url>

# clone including submodules
git clone --recurse-submodules <url>

# what is staged, changed, untracked
git status

# the same, in short format
git status -sb
```

## ➕ Staging

```bash
# stage a specific file
git add <file>

# stage everything under the current directory
git add .

# stage everything in the repository, deletions included
git add -A

# interactively stage individual hunks
git add -p <file>

# stage modifications and deletions, not new files
git add -u

# unstage, keep the changes in the working tree
git restore --staged <file>

# stop tracking a file, keep it on disk
git rm --cached <file>

# rename and stage in one step
git mv <old> <new>

# which .gitignore rule is hiding this file?
git check-ignore -v <file>
```

## ✅ Commit

```bash
# commit what is staged
git commit -m "<message>"

# stage tracked changes and commit
git commit -am "<message>"

# rewrite the last commit (message + content)
git commit --amend

# amend without changing the message
git commit --amend --no-edit

# fixup commit, squashed later by --autosquash
git commit --fixup <commit>

# add a Signed-off-by trailer
git commit -s -m "<message>"

# empty commit, e.g. to trigger CI
git commit --allow-empty -m "<message>"
```

> ⚠️ `--amend` rewrites history. Only amend commits that have not been pushed to a shared branch.

## 🌿 Branches

```bash
# list local branches
git branch

# local and remote-tracking branches
git branch -a

# last commit and upstream of each branch
git branch -vv

# switch to an existing branch
git switch <branch>

# create a branch and switch to it
git switch -c <branch>

# jump back to the previous branch
git switch -

# older equivalent of switch -c
git checkout -b <branch>

# branch off a specific commit or tag
git switch -c <branch> <commit>

# rename a branch
git branch -m <old> <new>

# delete a merged branch
git branch -d <branch>

# force-delete an unmerged branch
git branch -D <branch>

# branches already merged into HEAD (safe to delete)
git branch --merged
```

## 🔀 Merging & Rebasing

```bash
# merge a branch into the current one
git merge <branch>

# always create a merge commit
git merge --no-ff <branch>

# bring in the changes as one staged change set
git merge --squash <branch>

# bail out of a conflicted merge
git merge --abort

# replay the current branch on top of another
git rebase <branch>

# interactively squash, reword, drop, reorder commits
git rebase -i HEAD~5

# apply the --fixup commits automatically
git rebase -i --autosquash <base>

# resume after resolving conflicts
git rebase --continue

# drop the conflicting commit and continue
git rebase --skip

# return to the state before the rebase
git rebase --abort

# resolve conflicts with the configured merge tool
git mergetool
```

Resolving a conflict:

```bash
# 1. see which files conflict
git status

# 2. edit them and remove the <<<<<<< ======= >>>>>>> markers

# 3. mark each resolved file
git add <file>

# 4. resume (during a merge: git merge --continue)
git rebase --continue
```

> ⚠️ Rebasing rewrites commits. Never rebase a branch other people are already working on.

## 🌍 Remotes & Syncing

```bash
# list remotes and their URLs
git remote -v

# add a remote
git remote add origin <url>

# point a remote somewhere else
git remote set-url origin <url>

# rename a remote
git remote rename <old> <new>

# forget a remote
git remote remove <name>

# download objects and refs, change nothing
git fetch origin

# fetch everything, drop deleted remote branches
git fetch --all --prune

# fetch + merge (or rebase) the upstream branch
git pull

# replay local commits on top of the upstream
git pull --rebase

# push the current branch
git push

# push and set the upstream tracking branch
git push -u origin <branch>

# force-push, but refuse to clobber new commits
git push --force-with-lease

# delete a remote branch
git push origin --delete <branch>

# push all tags
git push origin --tags
```

> ⚠️ Prefer `--force-with-lease` over `--force`: it aborts if someone else pushed in the meantime.

## 📦 Stashing

```bash
# shelve tracked changes and clean the working tree
git stash

# include untracked files
git stash -u

# stash specific paths with a label
git stash push -m "<message>" <file>

# list every stash
git stash list

# show a stash as a patch
git stash show -p stash@{0}

# re-apply the newest stash and drop it
git stash pop

# re-apply a specific stash, keep it in the list
git stash apply stash@{2}

# create a branch from a stash and apply it
git stash branch <branch>

# delete one stash
git stash drop stash@{0}

# delete all stashes
git stash clear
```

## 🔍 Inspecting

```bash
# the whole history as a compact graph
git log --oneline --graph --decorate --all

# history of a file, with diffs
git log -p <file>

# history of a file, following renames
git log --follow <file>

# filter by date and author
git log --since="2 weeks ago" --author=<name>

# search commit messages
git log --grep="<pattern>"

# commits that added or removed a string
git log -S"<string>"

# commits in b that are not in a
git log <branch-a>..<branch-b>

# commit count per author
git shortlog -sn

# a single commit with its diff
git show <commit>

# working tree vs. index
git diff

# index vs. last commit
git diff --staged

# between two commits
git diff HEAD~1 HEAD

# changes since the branches diverged
git diff <branch-a>...<branch-b>

# summary of changed files
git diff --stat

# who last touched every line
git blame <file>

# blame a range of lines only
git blame -L 10,40 <file>

# search the tracked files
git grep "<pattern>"

# every position HEAD has had — your safety net
git reflog
```

## 🍒 Cherry-pick

```bash
# apply one commit onto the current branch
git cherry-pick <commit>

# apply a range of commits
git cherry-pick <commit-a>^..<commit-b>

# apply without committing
git cherry-pick -n <commit>

# after resolving conflicts
git cherry-pick --continue

# undo the whole cherry-pick
git cherry-pick --abort
```

## 🏷 Tags

```bash
# list tags
git tag

# list matching tags
git tag -l "v1.*"

# annotated tag on HEAD
git tag -a v1.0.0 -m "Release v1.0.0"

# tag an older commit
git tag -a v1.0.0 <commit>

# show a tag and its commit
git show v1.0.0

# push one tag
git push origin v1.0.0

# push all tags
git push origin --tags

# delete a local tag
git tag -d v1.0.0

# delete a remote tag
git push origin --delete v1.0.0

# closest tag to the current commit
git describe --tags
```

## 🧯 I've Made a Mistake

```bash
# fix the last commit message
git commit --amend

# undo the last commit, keep the changes unstaged
git reset HEAD~1

# undo the last n commits, keep the changes
git reset HEAD~<n>

# undo the last commit and throw the changes away
git reset --hard HEAD~1

# discard changes to one file
git restore <file>

# discard every uncommitted change
git restore .

# restore a file as it was at a commit
git restore --source=<commit> <file>

# undo a commit with a new commit (safe when shared)
git revert <commit>

# stage the revert without committing
git revert -n <commit>

# make the local branch match the remote (fetch first)
git reset --hard origin/<branch>

# find the lost commit...
git reflog

# bring a lost commit back on a new branch
git switch -c <branch> <commit>
```

`git reset` modes at a glance:

| Mode      | Moves `HEAD` | Index (staging) | Working tree | Use it to                                    |
|-----------|--------------|-----------------|--------------|----------------------------------------------|
| `--soft`  | ✅           | untouched       | untouched    | Recommit differently, keep everything staged |
| `--mixed` | ✅           | reset           | untouched    | Unstage but keep the edits (default)         |
| `--hard`  | ✅           | reset           | **reset**    | Throw the changes away entirely ⚠️           |

> 💡 Nothing committed is really lost for ~90 days: `git reflog` lists every commit `HEAD` pointed at, even on deleted branches.

## 🧹 Cleaning

```bash
# dry run: what would be removed
git clean -n

# remove untracked files and directories
git clean -fd

# also remove ignored files (build output, node_modules)
git clean -fdx

# compress and tidy the object database
git gc

# drop unreachable objects
git prune

# check the repository for corruption
git fsck
```

## 🐛 Debugging

```bash
# begin a binary search for a bad commit
git bisect start

# a commit that is broken (often HEAD)
git bisect bad <commit>

# a commit that was fine
git bisect good <commit>

# let a test script decide automatically
git bisect run <command>

# end the search and return to the original HEAD
git bisect reset

# follow lines moved from other files
git blame -C <file>
```

## 🧩 Submodules & Worktrees

```bash
# add a submodule
git submodule add <url> <path>

# check out every submodule
git submodule update --init --recursive

# update submodules to their latest commit
git submodule update --remote

# commit each submodule sits on
git submodule status

# check out a second branch side by side
git worktree add ../<dir> <branch>

# list linked working trees
git worktree list

# remove one again
git worktree remove ../<dir>
```

## 🧠 Miscellaneous

```bash
# rename the local default branch
git branch -m master main

# graph of merge commits only
git log --graph --merges

# export a snapshot without .git
git archive -o release.zip HEAD

# contributions per author
git shortlog -sn --no-merges

# full SHA of the current commit
git rev-parse HEAD

# name of the current branch
git rev-parse --abbrev-ref HEAD

# repository size on disk
git count-objects -vH

# enable background repacking (Git 2.30+)
git maintenance start
```

Update a feature branch with the latest mainline:

```bash
git switch <branch>
git fetch origin <main-branch>
git rebase origin/<main-branch>   # or: git merge origin/<main-branch>
```

## 📚 Resources

- [Official documentation](https://git-scm.com/docs)
- [Pro Git (free book)](https://git-scm.com/book)
- [Interactive branching tutorial](https://learngitbranching.js.org)
- [Dangit, Git!?!](https://dangitgit.com) — recovering from the classic mistakes
