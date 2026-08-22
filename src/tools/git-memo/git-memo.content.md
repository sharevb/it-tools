**Git** is a distributed version control system: every clone is a full repository with its own history, branches and tags. This is a quick reference for the commands that come up daily — placeholders are written as `<file>`, `<branch>`, `<commit>` and `<url>`.

> 💡 Every command below has its own help (`git rebase --help`), and the destructive ones (`clean`, `push`, `rm`, `mv`) take `-n` / `--dry-run` to preview what would happen.

## ⚙️ Configuration

```bash
git config --global user.name "<name>"         # identity used on every commit
git config --global user.email "<email>"
git config --global init.defaultBranch main    # name of the branch created by git init
git config --global core.editor "code --wait"  # editor for messages, rebases, ...
git config --global pull.rebase true           # rebase instead of merging on pull
git config --global push.autoSetupRemote true  # plain 'git push' works on new branches
git config --list --show-origin                # every setting and the file it came from
git config --local user.email "<work-email>"   # override for this repository only
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
git init                              # create a repository in the current directory
git clone <url>                       # clone a remote repository
git clone <url> <directory>           # ...into a specific directory
git clone --branch <branch> <url>     # clone and check out one branch
git clone --depth 1 <url>             # shallow clone, latest commit only
git clone --recurse-submodules <url>  # clone including submodules
git status                            # what is staged, changed, untracked
git status -sb                        # the same, in short format
```

## ➕ Staging

```bash
git add <file>               # stage a specific file
git add .                    # stage everything under the current directory
git add -A                   # stage everything in the repository, deletions included
git add -p <file>            # interactively stage individual hunks
git add -u                   # stage modifications and deletions, not new files
git restore --staged <file>  # unstage, keep the changes in the working tree
git rm --cached <file>       # stop tracking a file, keep it on disk
git mv <old> <new>           # rename and stage in one step
git check-ignore -v <file>   # which .gitignore rule is hiding this file?
```

## ✅ Commit

```bash
git commit -m "<message>"                # commit what is staged
git commit -am "<message>"               # stage tracked changes and commit
git commit --amend                       # rewrite the last commit (message + content)
git commit --amend --no-edit             # ...keeping the existing message
git commit --fixup <commit>              # fixup commit, squashed later by --autosquash
git commit -s -m "<message>"             # add a Signed-off-by trailer
git commit --allow-empty -m "<message>"  # empty commit, e.g. to trigger CI
```

> ⚠️ `--amend` rewrites history. Only amend commits that have not been pushed to a shared branch.

## 🌿 Branches

```bash
git branch                       # list local branches
git branch -a                    # local and remote-tracking branches
git branch -vv                   # last commit and upstream of each branch
git switch <branch>              # switch to an existing branch
git switch -c <branch>           # create a branch and switch to it
git switch -                     # jump back to the previous branch
git checkout -b <branch>         # older equivalent of switch -c
git switch -c <branch> <commit>  # branch off a specific commit or tag
git branch -m <old> <new>        # rename a branch
git branch -d <branch>           # delete a merged branch
git branch -D <branch>           # force-delete an unmerged branch
git branch --merged              # branches already merged into HEAD (safe to delete)
```

## 🔀 Merging & Rebasing

```bash
git merge <branch>                 # merge a branch into the current one
git merge --no-ff <branch>         # always create a merge commit
git merge --squash <branch>        # bring in the changes as one staged change set
git merge --abort                  # bail out of a conflicted merge
git rebase <branch>                # replay the current branch on top of another
git rebase -i HEAD~5               # interactively squash, reword, drop, reorder commits
git rebase -i --autosquash <base>  # apply the --fixup commits automatically
git rebase --continue              # resume after resolving conflicts
git rebase --skip                  # drop the conflicting commit and continue
git rebase --abort                 # return to the state before the rebase
git mergetool                      # resolve conflicts with the configured merge tool
```

Resolving a conflict:

```bash
git status             # list the conflicting files
# edit the files, remove the <<<<<<< ======= >>>>>>> markers
git add <file>         # mark the conflict as resolved
git rebase --continue  # or: git merge --continue
```

> ⚠️ Rebasing rewrites commits. Never rebase a branch other people are already working on.

## 🌍 Remotes & Syncing

```bash
git remote -v                      # list remotes and their URLs
git remote add origin <url>        # add a remote
git remote set-url origin <url>    # point a remote somewhere else
git remote rename <old> <new>      # rename a remote
git remote remove <name>           # forget a remote
git fetch origin                   # download objects and refs, change nothing
git fetch --all --prune            # fetch everything, drop deleted remote branches
git pull                           # fetch + merge (or rebase) the upstream branch
git pull --rebase                  # replay local commits on top of the upstream
git push                           # push the current branch
git push -u origin <branch>        # push and set the upstream tracking branch
git push --force-with-lease        # force-push, but refuse to clobber new commits
git push origin --delete <branch>  # delete a remote branch
git push origin --tags             # push all tags
```

> ⚠️ Prefer `--force-with-lease` over `--force`: it aborts if someone else pushed in the meantime.

## 📦 Stashing

```bash
git stash                             # shelve tracked changes and clean the working tree
git stash -u                          # include untracked files
git stash push -m "<message>" <file>  # stash specific paths with a label
git stash list                        # list every stash
git stash show -p stash@{0}           # show a stash as a patch
git stash pop                         # re-apply the newest stash and drop it
git stash apply stash@{2}             # re-apply a specific stash, keep it in the list
git stash branch <branch>             # create a branch from a stash and apply it
git stash drop stash@{0}              # delete one stash
git stash clear                       # delete all stashes
```

## 🔍 Inspecting

```bash
git log --oneline --graph --decorate --all     # the whole history as a compact graph
git log -p <file>                              # history of a file, with diffs
git log --follow <file>                        # ...across renames
git log --since="2 weeks ago" --author=<name>  # filter by date and author
git log --grep="<pattern>"                     # search commit messages
git log -S"<string>"                           # commits that added or removed a string
git log <branch-a>..<branch-b>                 # commits in b that are not in a
git shortlog -sn                               # commit count per author
git show <commit>                              # a single commit with its diff
git diff                                       # working tree vs. index
git diff --staged                              # index vs. last commit
git diff HEAD~1 HEAD                           # between two commits
git diff <branch-a>...<branch-b>               # changes since the branches diverged
git diff --stat                                # summary of changed files
git blame <file>                               # who last touched every line
git blame -L 10,40 <file>                      # ...for a range of lines
git grep "<pattern>"                           # search the tracked files
git reflog                                     # every position HEAD has had — your safety net
```

## 🍒 Cherry-pick

```bash
git cherry-pick <commit>                 # apply one commit onto the current branch
git cherry-pick <commit-a>^..<commit-b>  # apply a range of commits
git cherry-pick -n <commit>              # apply without committing
git cherry-pick --continue               # after resolving conflicts
git cherry-pick --abort                  # undo the whole cherry-pick
```

## 🏷 Tags

```bash
git tag                                # list tags
git tag -l "v1.*"                      # list matching tags
git tag -a v1.0.0 -m "Release v1.0.0"  # annotated tag on HEAD
git tag -a v1.0.0 <commit>             # tag an older commit
git show v1.0.0                        # show a tag and its commit
git push origin v1.0.0                 # push one tag
git push origin --tags                 # push all tags
git tag -d v1.0.0                      # delete a local tag
git push origin --delete v1.0.0        # delete a remote tag
git describe --tags                    # closest tag to the current commit
```

## 🧯 I've Made a Mistake

```bash
git commit --amend                    # fix the last commit message
git reset HEAD~1                      # undo the last commit, keep the changes unstaged
git reset HEAD~<n>                    # undo the last n commits, keep the changes
git reset --hard HEAD~1               # undo the last commit and throw the changes away
git restore <file>                    # discard changes to one file
git restore .                         # discard every uncommitted change
git restore --source=<commit> <file>  # restore a file as it was at a commit
git revert <commit>                   # undo a commit with a new commit (safe when shared)
git revert -n <commit>                # stage the revert without committing
git reset --hard origin/<branch>      # make the local branch match the remote (fetch first)
git reflog                            # find the lost commit...
git switch -c <branch> <commit>       # ...and bring it back on a new branch
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
git clean -n    # dry run: what would be removed
git clean -fd   # remove untracked files and directories
git clean -fdx  # ...including ignored files (build output, node_modules)
git gc          # compress and tidy the object database
git prune       # drop unreachable objects
git fsck        # check the repository for corruption
```

## 🐛 Debugging

```bash
git bisect start          # begin a binary search for a bad commit
git bisect bad <commit>   # a commit that is broken (often HEAD)
git bisect good <commit>  # a commit that was fine
git bisect run <command>  # let a test script decide automatically
git bisect reset          # end the search and return to the original HEAD
git blame -C <file>       # follow lines moved from other files
```

## 🧩 Submodules & Worktrees

```bash
git submodule add <url> <path>           # add a submodule
git submodule update --init --recursive  # check out every submodule
git submodule update --remote            # update submodules to their latest commit
git submodule status                     # commit each submodule sits on
git worktree add ../<dir> <branch>       # check out a second branch side by side
git worktree list                        # list linked working trees
git worktree remove ../<dir>             # remove one again
```

## 🧠 Miscellaneous

```bash
git branch -m master main        # rename the local default branch
git log --graph --merges         # graph of merge commits only
git archive -o release.zip HEAD  # export a snapshot without .git
git shortlog -sn --no-merges     # contributions per author
git rev-parse HEAD               # full SHA of the current commit
git rev-parse --abbrev-ref HEAD  # name of the current branch
git count-objects -vH            # repository size on disk
git maintenance start            # enable background repacking (Git 2.30+)
```

Update a feature branch with the latest mainline:

```bash
git switch <branch>
git fetch origin <main-branch>
git rebase origin/<main-branch>  # or: git merge origin/<main-branch>
```

## 📚 Resources

- [Official documentation](https://git-scm.com/docs)
- [Pro Git (free book)](https://git-scm.com/book)
- [Interactive branching tutorial](https://learngitbranching.js.org)
- [Dangit, Git!?!](https://dangitgit.com) — recovering from the classic mistakes
