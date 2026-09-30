# freeload one-command installer (Windows): copies SKILL.md into known agent skills dirs.
$src = Join-Path $PSScriptRoot 'SKILL.md'
$targets = @(
  "$env:USERPROFILE\.config\opencode\skills\freeload\SKILL.md",
  "$env:USERPROFILE\.claude\skills\freeload\SKILL.md",
  "$env:USERPROFILE\.codex\skills\freeload\SKILL.md"
)
$installed = 0
foreach ($t in $targets) {
  $parent = Split-Path (Split-Path $t)
  if (Test-Path $parent) {
    New-Item -ItemType Directory -Path (Split-Path $t) -Force | Out-Null
    Copy-Item $src $t -Force
    Write-Output "installed: $t"
    $installed++
  }
}
if ($installed -eq 0) {
  Write-Output "no agent skills dir found; manual install: copy SKILL.md to your agent's skills/freeload/ directory"
}
node (Join-Path $PSScriptRoot 'bin\freeload.mjs') doctor
