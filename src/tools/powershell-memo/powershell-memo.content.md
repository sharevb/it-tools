## Variables

| Syntax | Description |
|-------|-------------|
| `$var = "string"` | Assign variable |
| `[Type]$var="typedVar"` | Assign strong typed variable |
| `[ValidateRange(1,9)][int]$x=1` | Strong typed attribute‑controlled variable |
| `$a,$b,$c = 0` or `$a,$b = 'a','b'` | Assign multiple variables |
| `$a,$b = $b,$a` | Flip variables |
| *Scopes* | global, local, private, script |
| `$global:var = "var"` | Assign global scoped variable |

## Arrays

| Syntax | Description |
|--------|-------------|
| `"a","b","c"` | Array of strings |
| `@()` | Empty array |
| `1,(2,3),4` | Array within array |
| `,"hi"` | Array of one element |
| `$arr[5]` | Sixth element |
| `$arr[2..20]` | Elements 3–21 |
| `$arr[-1]` | Last element |
| `$arr[-3..-1]` | Last three elements |
| `$arr[1,4+6..9]` | Elements at positions 1,4,6–9 |
| `@(Get-Process)` | Force result to array |
| `$arr[($arr.length-1)..0]` | Reverse array |
| `$arr[1] += 200` | Add to existing item |
| `$b = $arr[0,1 + 3..6]` | New array from elements |
| `$z = $arrA + $arrB` | Combine arrays |

## Hash Tables (Associative Arrays)

| Syntax | Description |
|--------|-------------|
| `$hash = @{}` | Empty hash table |
| `@{foo=1; bar='value2'}` | Initialize hash |
| `[ordered]@{a=1; b=2; c=3}` | Ordered dictionary |
| `$hash.key1 = 1` | Assign value |
| `$hash.key1` | Get value |
| `$hash["key1"]` | Get value |
| `$hash.GetEnumerator \| sort Key` | Sort by key |
| `[pscustomobject]@{x=1;z="z"}` | Custom object |

## Strings

| Syntax | Description |
|--------|-------------|
| `"$var expand"` | Expand variables |
| `'$var no expand'` | No expansion |
| `@" ... "@` | Here‑string (double quotes allow expressions) |

## Comments & Escape Characters

| Syntax | Description |
|--------|-------------|
| `# Comment` | Comment |
| `<# comment #>` | Multiline comment |
| `"A '\"test`\""` | Escape `'` |
| `` `t `` | Tab |
| `` `n `` | New line |
| `` ` `` | Line continuation |

## Basics of Text & Files

| Command | Description |
|---------|-------------|
| `Get-Location` | Current directory |
| `Set-Location` | Change directory |
| `Get-Content` | Read file |
| `Add-Content` | Append |
| `Set-Content` | Overwrite |
| `Out-File` | Formatted output |
| `Out-Null` | Discard output |
| `Out-String` | Convert to string |
| `Copy-Item` | Copy |
| `Remove-Item` | Delete |
| `Move-Item` | Move |
| `Rename-Item` | Rename |
| `Set-Item` | Set file contents |
| `Clear-Item` | Clear file |
| `New-Item` | New file/dir |

## Flow Control

| Syntax | Description |
|--------|-------------|
| `If($x -eq 5){ } elseif($x -gt 5){ } else{ }` | If |
| `$x=1; while($x -lt 10){$x;$x++}` | While |
| `for($i=0; $i -lt 10; $i++){ $i }` | For |
| `foreach($file in dir C:\){$file.Name}` | Foreach |
| `1..10 \| foreach{$_}` | Foreach pipeline |
| `Switch -options (...) { Pattern { } Default { } }` | Switch |

## Operators

### Assignment, Logical, Comparison

| Syntax | Description |
|--------|-------------|
| `= += == *= /= %= ++ --` | Assignment |
| `-and -or -xor -not !` | Logical |
| `-eq -ne` | Equal / not equal |
| `-gt -ge` | Greater than / ≥ |
| `-lt -le` | Less than / ≤ |
| `-replace` | Replace text |
| `-match -notmatch` | Regex |
| `-like -notlike` | Wildcards |
| `-contains -notcontains` | Array contains |
| `-in -notin` | Reverse contains |

## Other Operators

| Syntax | Description |
|--------|-------------|
| `-split` | Split string |
| `-join` | Join strings |
| `..` | Range |
| `-is -isnot` | Type check |
| `-as` | Cast |
| `-f` | Format strings |
| `[type]` | Cast operator |
| `$( )` | Subexpression |
| `@()` | Array subexpression |
| `&` | Invocation |

## Objects

| Syntax | Description |
|--------|-------------|
| `(Get-Date).Date` | Date property |
| `Get-Date \| Get-Member` | List members |
| `[DateTime]::Now` | Static property |
| `"string".ToUpper()` | Method call |
| `[system.Net.Dns]::GetHostByAddress("127.0.0.1")` | Static method |
| `new-object -com excel.application` | Excel COM object |

## Filter, Sort, Group, Format

| Command | Description |
|---------|-------------|
| `dir C:\pub \| where LastWriteTime -gt (Get-Date).AddDays(-1)` | Files modified yesterday |
| `ps \| where { $_.path -like "C:\windows\system32*" -and $_.company -notlike "Microsoft*" }` | Filter processes |
| `ps Explorer \| select ProcessName -ExpandProperty Modules \| format-list` | Expand modules |
| `ps \| sort WorkingSet \| select -Last 5` | Top 5 memory |
| `"a","b","a" \| select -Unique` | Unique values |
| `Get-Service \| Group-Object Status` | Group by status |
| `dir \| Group-Object { $_.Length -gt 100KB }` | Group by size |
| `Get-Content pcs.txt \| Select-String "q-" \| sls "win7"` | Search text |
| `ps \| Format-Table Name,StartTime -AutoSize` | Format table |
| `ps \| Format-Table ProcessName, @{Label="Total Run Time"; Expression={(Get-Date)-$_.StartTime}}` | Custom column |
| `Get-EventLog -Log System \| select -First 5 \| ft -wrap` | First 5 events |
| `gi C:\Users \| fl *` | All properties |
| `"{0}``t{1}``n" -f $a,5` | Format operator |

## Common Commands

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

## Importing, Exporting, Converting

- `Export-Clixml`
- `Import-Clixml`
- `ConvertTo-Xml`
- `ConvertTo-Html`
- `Export-Csv`
- `Import-Csv`
- `ConvertTo-Csv`
- `ConvertFrom-Csv`

## Automatic Variables

| Variable | Description |
|----------|-------------|
| `$_` / `$PSItem` | Pipeline object |
| `$Args` | Script args |
| `$Error` | Errors |
| `$True` / `$False` | Boolean |
| `$null` | Null |
| `$profile` | Profile paths |

## PSDrives

| Drive | Description |
|-------|-------------|
| `Alias:` | Aliases |
| `Cert:` | Certificates |
| `Env:` | Environment variables |
| `Function:` | Functions |
| `HKLM:` | Registry (Local Machine) |
| `HKCU:` | Registry (Current User) |
| `Variable:` | Variables |
| `WSMan:` | WinRM |
| `AD:` | Active Directory |
| `Set-Location HKLM:` | Navigate registry |
| `gci variable:` | List variables |

## Regular Expressions

| Pattern | Meaning |
|---------|---------|
| `\w` | Word char `[a-zA-Z0-9]` |
| `\W` | Non‑word char |
| `\s` | Whitespace |
| `\S` | Non‑whitespace |
| `\d` / `\D` | Digit / non‑digit |
| `{n} {n,} {n,m}` | Quantifiers |
| More | Google .NET Regex |

