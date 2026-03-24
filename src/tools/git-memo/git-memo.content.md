## Configuration

Set the global config
```shell
git config --global user.name "[name]"
git config --global user.email "[email]"
```

## Get started

Create a git repository
```shell
git init
```

Pull a git repository
```shell
git pull [url]
```

Clone an existing git repository
```shell
git clone [url]
```

## Staging

Stage specific files
```shell
git add [file]
```

Stage all changes
```shell
git add .
```

Interactively stage parts of a file (hunks)
```shell
git add -p [file]
```

Unstage a file but keep changes
```shell
git restore --staged [file]
```

## Commit

Commit all tracked changes
```shell
git commit -am "[commit message]"
```

Add new modifications to the last commit
```shell
git commit --amend --no-edit
```

## Branches

Lists all local branches in your repository (use -a for local and remote branches)
```shell
git branch
```

Switch to an existing branch
```shell
git switch [branch name]
```

Create a new branch
```shell
git checkout -b [branch name]
```

## Stashing

Save uncommitted changes for later
```shell
git stash
```

List all stashes
```shell
git stash list
```

Apply most recent stash and remove it from the list
```shell
git stash pop
```

Apply a specific stash without removing it
```shell
git stash apply stash@{2}
```

## Inspecting

Show changes between working directory and staging
```shell
git diff
```

Show changes between staging and last commit
```shell
git diff --staged
```

Show commit history for a specific file
```shell
git log --follow [file]
```

Show who changed each line in a file
```shell
git blame [file]
```

## Remote

Add a remote repository
```shell
git remote add origin [url]
```

List remote repositories
```shell
git remote -v
```

Push a branch and set upstream tracking
```shell
git push -u origin [branch-name]
```

Delete a remote branch
```shell
git push origin --delete [branch-name]
```

## Tags

Create a tagged release
```shell
git tag -a v1.0.0 -m "Release v1.0.0"
```

Push tags to remote
```shell
git push origin --tags
```

## I've made a mistake

Change last commit message
```shell
git commit --amend
```

Undo most recent commit and keep changes
```shell
git reset HEAD~1
```

Undo the `N` most recent commit and keep changes
```shell
git reset HEAD~N
```

Undo most recent commit and get rid of changes
```shell
git reset HEAD~1 --hard
```

Reset branch to remote state
```shell
git fetch origin
git reset --hard origin/[branch-name]
```

Revert a commit by creating a new undo commit (safe for shared branches)
```shell
git revert [commit-hash]
```

Discard all uncommitted changes in working directory
```shell
git restore .
```

Recover a deleted branch or lost commit
```shell
git reflog
git checkout -b [branch-name] [commit-hash]
```

## Cherry-pick

Apply a specific commit from another branch
```shell
git cherry-pick [commit-hash]
```

## Cleaning

Remove untracked files (dry run first)
```shell
git clean -n
```

Remove untracked files and directories
```shell
git clean -fd
```

## Miscellaneous

Renaming the local master branch to main
```shell
git branch -m master main
```

Checking log graph
```shell
git log --graph
```

Checking log graph (merges only)
```shell
git log --graph --merges
```

Tracking down a bad commit using binary search
```shell
git bisect start
git bisect good 13c988d4f15e06bcdd0b0af290086a3079cdadb0
git bisect bad ca82a6dff817ec66f44342007202690a93763949
```

Pulling new changes into current branch from mainline
```shell
git checkout [branch-name]
git fetch origin [master-branch-name]
git rebase origin/[master-branch-name]
```
