**PowerShell** is a shell and scripting language built on .NET. Unlike POSIX shells it passes **objects** down the pipeline rather than text, so `Get-Process | Sort-Object CPU` sorts real numbers instead of parsing columns.

> ℹ️ **PowerShell 7+** (`pwsh`) is cross-platform and current; **Windows PowerShell 5.1** (`powershell.exe`) ships with Windows and is in maintenance. Check with `$PSVersionTable`.

## 🔎 Finding Your Way

```powershell
# what commands exist for a noun?
Get-Command *service*
Get-Command -Module Microsoft.PowerShell.Management

# help, with the part everyone actually wants
Get-Help Get-ChildItem -Examples
Get-Help Get-ChildItem -Full
Update-Help

# what properties and methods does this object have?
Get-Process | Get-Member

# what did that command actually return?
Get-Process | Select-Object -First 1 | Format-List *
```

## 📦 Variables

| Syntax                          | Description                                   |
|---------------------------------|-----------------------------------------------|
| `$var = "string"`               | Assign a variable                             |
| `[int]$var = 5`                 | Strongly typed variable                       |
| `[ValidateRange(1,9)][int]$x=1` | Typed and constrained                         |
| `$a, $b = 'a', 'b'`             | Assign several at once                        |
| `$a, $b = $b, $a`               | Swap two values                               |
| `$global:var = "v"`             | Scope: `global`, `script`, `local`, `private` |
| `${my var}`                     | A name containing spaces or punctuation       |
| `$env:PATH`                     | An environment variable                       |
| `Remove-Variable x`             | Delete a variable                             |

## 📚 Arrays

| Syntax                                                  | Description                                       |
|---------------------------------------------------------|---------------------------------------------------|
| `"a","b","c"`                                           | Array of strings                                  |
| `@()`                                                   | Empty array                                       |
| `,"hi"`                                                 | Array of exactly one element                      |
| `1,(2,3),4`                                             | Nested array                                      |
| `$arr[5]`                                               | Sixth element (0-based)                           |
| `$arr[2..20]`                                           | A range of elements                               |
| `$arr[-1]`                                              | The last element                                  |
| `$arr[-3..-1]`                                          | The last three                                    |
| `$arr[1,4+6..9]`                                        | Positions 1, 4 and 6–9                            |
| `$arr[($arr.length-1)..0]`                              | Reversed                                          |
| `@(Get-Process)`                                        | Force a single result into an array               |
| `$z = $arrA + $arrB`                                    | Concatenate                                       |
| `$list = [System.Collections.Generic.List[int]]::new()` | A growable list — much faster than `+=` in a loop |

## 🗂 Hash Tables

| Syntax                                     | Description                |
|--------------------------------------------|----------------------------|
| `$hash = @{}`                              | Empty hash table           |
| `@{foo=1; bar='two'}`                      | Initialise with values     |
| `[ordered]@{a=1; b=2}`                     | Keeps insertion order      |
| `$hash.key1` / `$hash["key1"]`             | Read a value               |
| `$hash.key1 = 1`                           | Write a value              |
| `$hash.Remove("key1")`                     | Delete a key               |
| `$hash.ContainsKey("key1")`                | Test for a key             |
| `$hash.GetEnumerator() \| Sort-Object Key` | Iterate in key order       |
| `[pscustomobject]@{x=1; z="z"}`            | Turn a hash into an object |

## 🔤 Strings

| Syntax                           | Description                                           |
|----------------------------------|-------------------------------------------------------|
| `"$var expands"`                 | Double quotes interpolate                             |
| `'$var does not'`                | Single quotes are literal                             |
| `"Total: $($items.Count)"`       | `$( )` evaluates an expression inside a string        |
| `"{0} of {1}" -f $a, $b`         | The format operator                                   |
| `` "col1`tcol2`n" ``             | `` `t `` tab, `` `n `` newline, `` `` ` `` `` escapes |
| `@"…"@` / `@'…'@`                | Here-string, expanding / literal                      |
| `"abc".ToUpper()`                | .NET methods work on strings                          |
| `$s -split ','` / `$a -join ','` | Split and join                                        |
| `$s.Trim()` / `.PadLeft(5)`      | Trim and pad                                          |
| `$s -replace 'a','b'`            | Regex replace                                         |

## 💬 Comments & Escaping

```powershell
# a single-line comment

<#
  a block comment, also used for help text
#>

# the backtick is the escape character
Write-Output "He said `"hi`""
Write-Output "line one`nline two"

# and the line-continuation character
Get-ChildItem -Path C:\ `
              -Recurse `
              -Filter *.log
```

## 📁 Files & Paths

| Command                                                   | Does                                  |
|-----------------------------------------------------------|---------------------------------------|
| `Get-Location` (`pwd`)                                    | Current directory                     |
| `Set-Location` (`cd`)                                     | Change directory                      |
| `Get-ChildItem` (`ls`, `dir`)                             | List a directory                      |
| `Get-Content` (`cat`)                                     | Read a file                           |
| `Set-Content` / `Add-Content`                             | Overwrite / append                    |
| `Out-File` / `Out-Null` / `Out-String`                    | Write to a file / discard / stringify |
| `New-Item -ItemType Directory`                            | Create a file or folder               |
| `Copy-Item` / `Move-Item` / `Rename-Item` / `Remove-Item` | Copy, move, rename, delete            |
| `Test-Path`                                               | Does it exist?                        |
| `Split-Path -Parent`                                      | The directory part of a path          |
| `Join-Path a b`                                           | Build a path portably                 |
| `Resolve-Path`                                            | Expand to a full path                 |
| `Get-FileHash file.zip`                                   | Checksum a file                       |

```powershell
# read a large file line by line without loading it all
Get-Content big.log -ReadCount 1000 | ForEach-Object { $_ }

# tail -f
Get-Content app.log -Wait -Tail 20

# every .log modified in the last day
Get-ChildItem C:\logs -Recurse -Filter *.log |
  Where-Object LastWriteTime -gt (Get-Date).AddDays(-1)
```

## 🔀 Flow Control

```powershell
if ($x -eq 5) { "five" } elseif ($x -gt 5) { "more" } else { "less" }

while ($x -lt 10) { $x; $x++ }

do { $x++ } while ($x -lt 10)

for ($i = 0; $i -lt 10; $i++) { $i }

foreach ($file in Get-ChildItem C:\) { $file.Name }

1..10 | ForEach-Object { $_ * 2 }

# parallel, PowerShell 7+
1..10 | ForEach-Object -Parallel { Start-Sleep 1; $_ } -ThrottleLimit 5

switch ($value) {
  'a'       { 'letter a'; break }
  { $_ -gt 10 } { 'big' }
  default   { 'something else' }
}
```

## ⚖️ Operators

| Operator                       | Meaning                                 |
|--------------------------------|-----------------------------------------|
| `= += -= *= /= %= ++ --`       | Assignment                              |
| `-eq` / `-ne`                  | Equal / not equal                       |
| `-gt` `-ge` `-lt` `-le`        | Numeric comparison                      |
| `-and` `-or` `-xor` `-not` `!` | Logical                                 |
| `-like` / `-notlike`           | Wildcard match (`*`, `?`)               |
| `-match` / `-notmatch`         | Regex match — fills `$Matches`          |
| `-replace 'a','b'`             | Regex replace                           |
| `-contains` / `-in`            | Array membership, either way round      |
| `-split` / `-join`             | Split a string / join an array          |
| `-is` / `-isnot` / `-as`       | Type test and conversion                |
| `-f`                           | Format a string                         |
| `..`                           | Range                                   |
| `$( )` / `@( )`                | Sub-expression / array sub-expression   |
| `&` / `.`                      | Invoke a command / dot-source a script  |
| `??` / `??=`                   | Null-coalescing (PowerShell 7+)         |
| `?.` / `?[ ]`                  | Null-conditional access (PowerShell 7+) |

> ⚠️ Comparisons are **case-insensitive** by default. Use `-ceq`, `-clike`, `-cmatch` when case matters.

## 🧱 Objects & the Pipeline

```powershell
# properties and methods
(Get-Date).Date
(Get-Date).AddDays(-7)
"string".ToUpper()

# static members
[DateTime]::Now
[Math]::Round(3.14159, 2)
[System.Net.Dns]::GetHostByAddress("127.0.0.1")

# build your own objects
[pscustomobject]@{ Name = 'web01'; Status = 'up' }

# add a calculated property
Get-Process | Select-Object Name, @{ Name = 'MB'; Expression = { [math]::Round($_.WorkingSet / 1MB, 1) } }
```

## 🔍 Filter, Sort, Group, Format

| Example                                                   | Does                      |
|-----------------------------------------------------------|---------------------------|
| `Get-Process \| Where-Object CPU -gt 100`                 | Filter (simple syntax)    |
| `Get-Process \| Where-Object { $_.Name -like "chrome*" }` | Filter (script block)     |
| `Get-Process \| Sort-Object WorkingSet -Descending`       | Sort                      |
| `Get-Process \| Select-Object -First 5`                   | Take the first few        |
| `"a","b","a" \| Select-Object -Unique`                    | Deduplicate               |
| `Get-Service \| Group-Object Status`                      | Group                     |
| `Get-Process \| Measure-Object WorkingSet -Sum -Average`  | Aggregate                 |
| `Get-Process \| Select-Object -ExpandProperty Modules`    | Flatten a nested property |
| `Get-Process \| Format-Table Name, Id -AutoSize`          | Table output              |
| `Get-Item C:\ \| Format-List *`                           | Every property            |
| `Get-Content log.txt \| Select-String "error"`            | grep                      |
| `Compare-Object $a $b`                                    | Diff two collections      |

> 💡 `Format-*` is always the **last** step — its output is display text, not objects, so nothing downstream can filter it.

## 🧰 Functions & Scripts

```powershell
function Get-Square {
  param(
    [Parameter(Mandatory)][int]$Number,
    [switch]$Verbose
  )
  $Number * $Number
}

Get-Square -Number 7

# an advanced function: pipeline input, -WhatIf, -Verbose for free
function Remove-OldLog {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(ValueFromPipeline)][string]$Path,
    [int]$Days = 30
  )
  process {
    if ($PSCmdlet.ShouldProcess($Path, "delete")) {
      Remove-Item $Path
    }
  }
}
```

## 🚨 Error Handling

```powershell
try {
  Get-Content missing.txt -ErrorAction Stop
}
catch [System.IO.FileNotFoundException] {
  Write-Warning "no such file"
}
catch {
  Write-Error "unexpected: $($_.Exception.Message)"
}
finally {
  "always runs"
}

# make non-terminating errors terminate, so catch can see them
Get-Item missing -ErrorAction Stop

# per-session default
$ErrorActionPreference = 'Stop'

# the most recent error, and the exit code of the last native command
$Error[0]
$LASTEXITCODE
$?
```

## 🌐 Web & Data

```powershell
# REST calls, parsed into objects
$data = Invoke-RestMethod https://api.github.com/repos/vuejs/core
$data.stargazers_count

# with headers and a JSON body
Invoke-RestMethod -Uri $url -Method Post `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType 'application/json' `
  -Body (@{ name = 'demo' } | ConvertTo-Json)

# the raw response, for scraping or downloads
Invoke-WebRequest $url -OutFile page.html

# convert between formats
Get-Process | Select-Object Name, Id | ConvertTo-Json
Get-Content data.json | ConvertFrom-Json
Import-Csv users.csv | Where-Object Dept -eq 'IT' | Export-Csv it.csv -NoTypeInformation
Export-Clixml / Import-Clixml   # round-trips real objects
```

## 🖥 System Administration

```powershell
# processes
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Stop-Process -Name notepad -Force

# services
Get-Service | Where-Object Status -eq 'Running'
Restart-Service -Name Spooler
Set-Service -Name Spooler -StartupType Manual

# background jobs
$job = Start-Job { Start-Sleep 10; "done" }
Receive-Job $job -Wait

# scheduled tasks, event logs, system info
Get-ScheduledTask
Get-WinEvent -LogName System -MaxEvents 20
Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, FreeSpace
Test-Connection example.com -Count 2
```

## 🔗 Remoting

```powershell
# one command on many machines
Invoke-Command -ComputerName web01, web02 -ScriptBlock { Get-Service Spooler }

# an interactive session
Enter-PSSession -ComputerName web01
Exit-PSSession

# a reusable session
$s = New-PSSession -ComputerName web01 -Credential (Get-Credential)
Invoke-Command -Session $s { hostname }
Remove-PSSession $s
```

## 📦 Modules & Execution Policy

```powershell
# find, install, load
Find-Module Pester
Install-Module Pester -Scope CurrentUser
Import-Module Pester
Get-Module -ListAvailable

# where does PowerShell look for modules?
$env:PSModulePath -split [IO.Path]::PathSeparator

# scripts refuse to run? check and relax the policy
Get-ExecutionPolicy -List
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# your profile script
notepad $PROFILE
```

## 🧾 Automatic Variables

| Variable                 | Holds                                     |
|--------------------------|-------------------------------------------|
| `$_` / `$PSItem`         | The current pipeline object               |
| `$Args`                  | Unbound arguments to a script or function |
| `$Error`                 | The error history, newest first           |
| `$Matches`               | Capture groups from the last `-match`     |
| `$PSVersionTable`        | Version and edition information           |
| `$PWD` / `$HOME`         | Current directory / home directory        |
| `$PSScriptRoot`          | The folder the running script lives in    |
| `$LASTEXITCODE`          | Exit code of the last native command      |
| `$?`                     | Did the last command succeed?             |
| `$true` `$false` `$null` | Constants                                 |
| `$PROFILE`               | Path to your profile script               |

## 💾 PSDrives

| Drive             | Contents              |
|-------------------|-----------------------|
| `Env:`            | Environment variables |
| `Alias:`          | Command aliases       |
| `Function:`       | Defined functions     |
| `Variable:`       | Variables             |
| `Cert:`           | Certificate stores    |
| `HKLM:` / `HKCU:` | The registry          |
| `WSMan:`          | WinRM configuration   |

```powershell
Set-Location HKLM:\SOFTWARE
Get-ChildItem Env: | Sort-Object Name
Get-ChildItem Variable:
```

## ⌨️ Aliases Worth Knowing

| Alias              | Real command    | Alias       | Real command                   |
|--------------------|-----------------|-------------|--------------------------------|
| `ls`, `dir`, `gci` | `Get-ChildItem` | `%`         | `ForEach-Object`               |
| `cat`, `gc`        | `Get-Content`   | `?`         | `Where-Object`                 |
| `cd`, `sl`         | `Set-Location`  | `select`    | `Select-Object`                |
| `cp`, `copy`       | `Copy-Item`     | `sort`      | `Sort-Object`                  |
| `rm`, `del`        | `Remove-Item`   | `ft` / `fl` | `Format-Table` / `Format-List` |
| `ps`, `gps`        | `Get-Process`   | `sls`       | `Select-String`                |
| `kill`             | `Stop-Process`  | `gm`        | `Get-Member`                   |

> ⚠️ Aliases are for the console, not for scripts — write the full cmdlet name in anything you commit.

## 🔣 Regular Expressions

| Pattern              | Matches                     |
|----------------------|-----------------------------|
| `\w` / `\W`          | Word character / non-word   |
| `\s` / `\S`          | Whitespace / non-whitespace |
| `\d` / `\D`          | Digit / non-digit           |
| `{n}` `{n,}` `{n,m}` | Quantifiers                 |
| `^` / `$`            | Start / end of the string   |
| `(?<name>…)`         | Named capture group         |

```powershell
# -match fills $Matches
if ("build-1234" -match '(?<name>\w+)-(?<id>\d+)') { $Matches.id }

# extract every match from a file
Select-String -Path app.log -Pattern '\b\d{1,3}(\.\d{1,3}){3}\b' -AllMatches |
  ForEach-Object { $_.Matches.Value } | Sort-Object -Unique
```

PowerShell uses the .NET regex engine — see [.NET regular expressions](https://learn.microsoft.com/dotnet/standard/base-types/regular-expressions).

## 📚 Resources

- [PowerShell documentation](https://learn.microsoft.com/powershell/)
- [Cmdlet reference](https://learn.microsoft.com/powershell/module/)
- [PowerShell Gallery](https://www.powershellgallery.com/)
- [Style guide (community)](https://poshcode.gitbook.io/powershell-practice-and-style/)
