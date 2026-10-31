<#
.SYNOPSIS
Copies the studio's skills to the user-level Claude folder.

.DESCRIPTION
The repo is the source of truth for skills. This copies each
.claude/skills/<name>/SKILL.md to ~/.claude/skills/<name>/SKILL.md so Claude
Code can use them in every project, then confirms every copy matches the
source by hash.

Nothing is deleted. Skills that exist only at user level are reported, never
removed.

.PARAMETER Check
Report what would change without writing anything. Exits 1 if any copy is
missing or out of date, so it can be used as a check.

.EXAMPLE
powershell -File scripts/sync-skills.ps1

.EXAMPLE
powershell -File scripts/sync-skills.ps1 -Check
#>
[CmdletBinding()]
param(
    [switch]$Check
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot '.claude\skills'
$destRoot = Join-Path $env:USERPROFILE '.claude\skills'

if (-not (Test-Path $sourceRoot)) {
    throw "No skills folder at $sourceRoot"
}

$skills = @(Get-ChildItem $sourceRoot -Directory | Where-Object {
    Test-Path (Join-Path $_.FullName 'SKILL.md')
})

if ($skills.Count -eq 0) {
    throw "No skills with a SKILL.md under $sourceRoot"
}

if (-not $Check -and -not (Test-Path $destRoot)) {
    New-Item -ItemType Directory -Force -Path $destRoot | Out-Null
}

$copied = 0
$same = 0
$stale = 0

foreach ($skill in $skills) {
    $from = Join-Path $skill.FullName 'SKILL.md'
    $toDir = Join-Path $destRoot $skill.Name
    $to = Join-Path $toDir 'SKILL.md'

    $sourceHash = (Get-FileHash -LiteralPath $from -Algorithm SHA256).Hash
    $destHash = $null
    if (Test-Path $to) {
        $destHash = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
    }

    if ($destHash -eq $sourceHash) {
        $same++
        Write-Output ("  same      " + $skill.Name)
        continue
    }

    if ($Check) {
        $stale++
        if ($null -eq $destHash) {
            Write-Output ("  missing   " + $skill.Name)
        } else {
            Write-Output ("  stale     " + $skill.Name)
        }
        continue
    }

    New-Item -ItemType Directory -Force -Path $toDir | Out-Null
    Copy-Item -LiteralPath $from -Destination $to -Force

    $newHash = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
    if ($newHash -ne $sourceHash) {
        throw "Copy of $($skill.Name) does not match the source after copying"
    }

    $copied++
    Write-Output ("  copied    " + $skill.Name)
}

# Report only. Deleting from the user folder is your call, not this script's.
if (Test-Path $destRoot) {
    $extras = @(Get-ChildItem $destRoot -Directory | Where-Object {
        -not (Test-Path (Join-Path $sourceRoot $_.Name))
    })
    if ($extras.Count -gt 0) {
        Write-Output ''
        Write-Output 'Only at user level, left alone:'
        foreach ($extra in $extras) {
            Write-Output ('  ' + $extra.Name)
        }
    }
}

Write-Output ''
if ($Check) {
    if ($stale -gt 0) {
        Write-Output ("$stale of $($skills.Count) skill(s) out of sync.")
        exit 1
    }
    Write-Output ("All $($skills.Count) skill(s) in sync.")
    exit 0
}

Write-Output ("$copied copied, $same already in sync.")
