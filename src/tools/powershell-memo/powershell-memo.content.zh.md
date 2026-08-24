## 变量

| 语法 | 描述 |
|-------|-------------|
| `$var = "string"` | 变量赋值 |
| `[Type]$var="typedVar"` | 强类型变量赋值 |
| `[ValidateRange(1,9)][int]$x=1` | 强类型属性控制变量 |
| `$a,$b,$c = 0` 或 `$a,$b = 'a','b'` | 多变量赋值 |
| `$a,$b = $b,$a` | 交换变量 |
| *作用域* | global, local, private, script |
| `$global:var = "var"` | 赋值全局作用域变量 |

## 数组

| 语法 | 描述 |
|--------|-------------|
| `"a","b","c"` | 字符串数组 |
| `@()` | 空数组 |
| `1,(2,3),4` | 嵌套数组 |
| `,"hi"` | 单元素数组 |
| `$arr[5]` | 第六个元素 |
| `$arr[2..20]` | 第 3–21 个元素 |
| `$arr[-1]` | 最后一个元素 |
| `$arr[-3..-1]` | 最后三个元素 |
| `$arr[1,4+6..9]` | 位置 1、4、6–9 的元素 |
| `@(Get-Process)` | 强制结果为数组 |
| `$arr[($arr.length-1)..0]` | 反转数组 |
| `$arr[1] += 200` | 添加到现有元素 |
| `$b = $arr[0,1 + 3..6]` | 从元素构建新数组 |
| `$z = $arrA + $arrB` | 合并数组 |

## 哈希表（关联数组）

| 语法 | 描述 |
|--------|-------------|
| `$hash = @{}` | 空哈希表 |
| `@{foo=1; bar='value2'}` | 初始化哈希表 |
| `[ordered]@{a=1; b=2; c=3}` | 有序字典 |
| `$hash.key1 = 1` | 赋值 |
| `$hash.key1` | 获取值 |
| `$hash["key1"]` | 获取值 |
| `$hash.GetEnumerator \| sort Key` | 按键排序 |
| `[pscustomobject]@{x=1;z="z"}` | 自定义对象 |

## 字符串

| 语法 | 描述 |
|--------|-------------|
| `"$var expand"` | 变量展开 |
| `'$var no expand'` | 不展开变量 |
| `@" ... "@` | Here‑string（双引号允许表达式） |

## 注释与转义字符

| 语法 | 描述 |
|--------|-------------|
| `# Comment` | 注释 |
| `<# comment #>` | 多行注释 |
| `"A '\"test`\""` | 转义 `'` |
| `` `t `` | 制表符 |
| `` `n `` | 换行 |
| `` ` `` | 续行符 |

## 文本与文件基础

| 命令 | 描述 |
|---------|-------------|
| `Get-Location` | 当前目录 |
| `Set-Location` | 切换目录 |
| `Get-Content` | 读取文件 |
| `Add-Content` | 追加内容 |
| `Set-Content` | 覆写内容 |
| `Out-File` | 格式化输出 |
| `Out-Null` | 丢弃输出 |
| `Out-String` | 转换为字符串 |
| `Copy-Item` | 复制 |
| `Remove-Item` | 删除 |
| `Move-Item` | 移动 |
| `Rename-Item` | 重命名 |
| `Set-Item` | 设置文件内容 |
| `Clear-Item` | 清空文件 |
| `New-Item` | 新建文件/目录 |

## 流程控制

| 语法 | 描述 |
|--------|-------------|
| `If($x -eq 5){ } elseif($x -gt 5){ } else{ }` | If 条件 |
| `$x=1; while($x -lt 10){$x;$x++}` | While 循环 |
| `for($i=0; $i -lt 10; $i++){ $i }` | For 循环 |
| `foreach($file in dir C:\){$file.Name}` | Foreach 循环 |
| `1..10 \| foreach{$_}` | Foreach 管道 |
| `Switch -options (...) { Pattern { } Default { } }` | Switch 条件 |

## 运算符

### 赋值、逻辑、比较

| 语法 | 描述 |
|--------|-------------|
| `= += == *= /= %= ++ --` | 赋值 |
| `-and -or -xor -not !` | 逻辑 |
| `-eq -ne` | 等于 / 不等于 |
| `-gt -ge` | 大于 / ≥ |
| `-lt -le` | 小于 / ≤ |
| `-replace` | 替换文本 |
| `-match -notmatch` | 正则 |
| `-like -notlike` | 通配符 |
| `-contains -notcontains` | 数组包含 |
| `-in -notin` | 反向包含 |

## 其他运算符

| 语法 | 描述 |
|--------|-------------|
| `-split` | 分割字符串 |
| `-join` | 拼接字符串 |
| `..` | 范围 |
| `-is -isnot` | 类型检查 |
| `-as` | 类型转换 |
| `-f` | 格式化字符串 |
| `[type]` | 类型转换运算符 |
| `$( )` | 子表达式 |
| `@()` | 数组子表达式 |
| `&` | 调用 |

## 对象

| 语法 | 描述 |
|--------|-------------|
| `(Get-Date).Date` | 日期属性 |
| `Get-Date \| Get-Member` | 列出成员 |
| `[DateTime]::Now` | 静态属性 |
| `"string".ToUpper()` | 方法调用 |
| `[system.Net.Dns]::GetHostByAddress("127.0.0.1")` | 静态方法 |
| `new-object -com excel.application` | Excel COM 对象 |

## 过滤、排序、分组、格式化

| 命令 | 描述 |
|---------|-------------|
| `dir C:\pub \| where LastWriteTime -gt (Get-Date).AddDays(-1)` | 昨天修改的文件 |
| `ps \| where { $_.path -like "C:\windows\system32*" -and $_.company -notlike "Microsoft*" }` | 过滤进程 |
| `ps Explorer \| select ProcessName -ExpandProperty Modules \| format-list` | 展开模块 |
| `ps \| sort WorkingSet \| select -Last 5` | 内存使用前 5 |
| `"a","b","a" \| select -Unique` | 去重 |
| `Get-Service \| Group-Object Status` | 按状态分组 |
| `dir \| Group-Object { $_.Length -gt 100KB }` | 按大小分组 |
| `Get-Content pcs.txt \| Select-String "q-" \| sls "win7"` | 搜索文本 |
| `ps \| Format-Table Name,StartTime -AutoSize` | 格式化表格 |
| `ps \| Format-Table ProcessName, @{Label="Total Run Time"; Expression={(Get-Date)-$_.StartTime}}` | 自定义列 |
| `Get-EventLog -Log System \| select -First 5 \| ft -wrap` | 前 5 条事件 |
| `gi C:\Users \| fl *` | 所有属性 |
| `"{0}``t{1}``n" -f $a,5` | 格式化运算符 |

## 常用命令

- `Get-EventLog`
- `Get-WinEvent`
- `Get-CimInstance`
- `Get-Date`
- `Start-Sleep`
- `Compare-Object`
- `Start-Job`
- `Get-Credential`
- `Test-Connection`
- `New-PSSession`
- `Test-Path`
- `Split-Path`

## 导入、导出、转换

- `Export-Clixml`
- `Import-Clixml`
- `ConvertTo-Xml`
- `ConvertTo-Html`
- `Export-Csv`
- `Import-Csv`
- `ConvertTo-Csv`
- `ConvertFrom-Csv`

## 自动变量

| 变量 | 描述 |
|----------|-------------|
| `$_` / `$PSItem` | 管道对象 |
| `$Args` | 脚本参数 |
| `$Error` | 错误 |
| `$True` / `$False` | 布尔值 |
| `$null` | 空值 |
| `$profile` | 配置文件路径 |

## PSDrives

| 驱动器 | 描述 |
|-------|-------------|
| `Alias:` | 别名 |
| `Cert:` | 证书 |
| `Env:` | 环境变量 |
| `Function:` | 函数 |
| `HKLM:` | 注册表（本地计算机） |
| `HKCU:` | 注册表（当前用户） |
| `Variable:` | 变量 |
| `WSMan:` | WinRM |
| `AD:` | Active Directory |
| `Set-Location HKLM:` | 导航到注册表 |
| `gci variable:` | 列出变量 |

## 正则表达式

| 模式 | 含义 |
|---------|---------|
| `\w` | 单词字符 `[a-zA-Z0-9]` |
| `\W` | 非单词字符 |
| `\s` | 空白字符 |
| `\S` | 非空白字符 |
| `\d` / `\D` | 数字 / 非数字 |
| `{n} {n,} {n,m}` | 量词 |
| 更多 | 搜索 .NET Regex |