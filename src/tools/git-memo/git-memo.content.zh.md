## 配置

设置全局配置
```shell
git config --global user.name "[name]"
git config --global user.email "[email]"
```

## 入门

创建 git 仓库
```shell
git init
```

拉取 git 仓库
```shell
git pull [url]
```

克隆现有 git 仓库
```shell
git clone [url]
```

## 暂存

暂存指定文件
```shell
git add [file]
```

暂存所有更改
```shell
git add .
```

交互式暂存文件的部分内容（代码块）
```shell
git add -p [file]
```

取消暂存文件但保留更改
```shell
git restore --staged [file]
```

## 提交

提交所有已跟踪的更改
```shell
git commit -am "[commit message]"
```

将新修改追加到上一次提交
```shell
git commit --amend --no-edit
```

## 分支

列出仓库中所有本地分支（使用 -a 可查看本地和远程分支）
```shell
git branch
```

切换到已有分支
```shell
git switch [branch name]
```

创建新分支
```shell
git checkout -b [branch name]
```

## 储藏

保存未提交的更改以备后用
```shell
git stash
```

列出所有储藏
```shell
git stash list
```

应用最近的储藏并将其从列表中移除
```shell
git stash pop
```

应用指定储藏但不移除
```shell
git stash apply stash@{2}
```

## 检查

显示工作目录与暂存区之间的差异
```shell
git diff
```

显示暂存区与上次提交之间的差异
```shell
git diff --staged
```

显示指定文件的提交历史
```shell
git log --follow [file]
```

显示文件中每一行的修改者
```shell
git blame [file]
```

## 远程

添加远程仓库
```shell
git remote add origin [url]
```

列出远程仓库
```shell
git remote -v
```

推送分支并设置上游跟踪
```shell
git push -u origin [branch-name]
```

删除远程分支
```shell
git push origin --delete [branch-name]
```

## 标签

创建带标签的发布版本
```shell
git tag -a v1.0.0 -m "Release v1.0.0"
```

推送标签到远程
```shell
git push origin --tags
```

## 我搞砸了

修改上次提交信息
```shell
git commit --amend
```

撤销最近一次提交并保留更改
```shell
git reset HEAD~1
```

撤销最近 `N` 次提交并保留更改
```shell
git reset HEAD~N
```

撤销最近一次提交并丢弃更改
```shell
git reset HEAD~1 --hard
```

将分支重置为远程状态
```shell
git fetch origin
git reset --hard origin/[branch-name]
```

通过创建新的反向提交来还原某次提交（适用于共享分支）
```shell
git revert [commit-hash]
```

丢弃工作目录中所有未提交的更改
```shell
git restore .
```

恢复已删除的分支或丢失的提交
```shell
git reflog
git checkout -b [branch-name] [commit-hash]
```

## 拣选

从其他分支应用指定提交
```shell
git cherry-pick [commit-hash]
```

## 清理

删除未跟踪文件（先预览）
```shell
git clean -n
```

删除未跟踪文件和目录
```shell
git clean -fd
```

## 其他

将本地 master 分支重命名为 main
```shell
git branch -m master main
```

查看日志图
```shell
git log --graph
```

查看日志图（仅合并提交）
```shell
git log --graph --merges
```

使用二分查找定位问题提交
```shell
git bisect start
git bisect good 13c988d4f15e06bcdd0b0af290086a3079cdadb0
git bisect bad ca82a6dff817ec66f44342007202690a93763949
```

从主分支拉取新更改到当前分支
```shell
git checkout [branch-name]
git fetch origin [master-branch-name]
git rebase origin/[master-branch-name]
```
