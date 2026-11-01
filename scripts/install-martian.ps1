param(
  [string]$ZipPath = ".\martian-grotesk.zip"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ZipPath)) {
  Write-Error "martian-grotesk.zip was not found. Put it in the project root or pass -ZipPath."
  exit 1
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $projectRoot "src\fonts"
$temp = Join-Path $env:TEMP ("martian-" + [guid]::NewGuid().ToString())

New-Item -ItemType Directory -Force -Path $destination | Out-Null
New-Item -ItemType Directory -Force -Path $temp | Out-Null

try {
  Expand-Archive -LiteralPath (Resolve-Path $ZipPath) -DestinationPath $temp -Force

  $font = Get-ChildItem -Path $temp -Recurse -File |
    Where-Object { $_.Name -eq "MartianGrotesk-Medium.woff2" } |
    Select-Object -First 1

  if (-not $font) {
    Write-Error "MartianGrotesk-Medium.woff2 was not found inside the archive."
    exit 1
  }

  Copy-Item -LiteralPath $font.FullName `
    -Destination (Join-Path $destination "MartianGrotesk-Medium.woff2") `
    -Force

  Write-Host "Martian Grotesk Medium installed."
}
finally {
  if (Test-Path $temp) {
    Remove-Item -LiteralPath $temp -Recurse -Force
  }
}
