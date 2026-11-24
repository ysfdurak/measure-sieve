# Measure Sieve · Desktop testini "oturum açılınca bir kez çalış" olarak kurar
# Kullanım (repo klasöründe, normal PowerShell penceresinde):
#   powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1            # bir sonraki oturum açılışında bir kez
#   powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1 -Simdi     # hemen çalıştır (görev kurmadan)
#   powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1 -Kaldir    # kurulu görevi sil
# Görev yalnızca senin oturumunda, yönetici yetkisi olmadan çalışır; Desktop penceresini görebilmek için etkileşimli oturum gerekir.
param([switch]$Simdi, [switch]$Kaldir, [int]$GecikmeDakika = 2)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$name = 'MeasureSieve-DesktopTest'

if ($Kaldir) { Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue; Write-Host 'Görev silindi.'; return }

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw 'Node.js bulunamadı. https://nodejs.org adresinden 20 veya üstünü kur.' }
if (-not (Test-Path (Join-Path $repo 'mcp\node_modules'))) {
  Write-Host 'Bağımlılıklar kuruluyor (npm install)...'
  Push-Location (Join-Path $repo 'mcp'); npm install --silent; Pop-Location
}
$script = Join-Path $repo 'tools\desktop-e2e.mjs'

if ($Simdi) { & $node $script; return }

$action = New-ScheduledTaskAction -Execute $node -Argument "`"$script`" --once" -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME"
$trigger.Delay = "PT$($GecikmeDakika)M"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 1) -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $name -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
Write-Host "Kuruldu: bir sonraki oturum açılışından $GecikmeDakika dakika sonra test bir kez çalışacak, sonra görev kendini silecek."
Write-Host "Rapor: $([Environment]::GetFolderPath('MyDocuments'))\MeasureSieve-Test\son-rapor.md"
