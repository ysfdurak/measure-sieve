# Measure Sieve · açık Power BI Desktop modelinden measure silme (YALNIZCA otomatik test için)
# Desktop'ın bellekteki modelinde, Tabular Editor'un yaptığı gibi, verilen measure'ları siler.
# Dosyaya kaydetmez: test betiği Desktop'ı kaydetmeden kapatır, asıl dosya değişmez.
# Girdi (-InFile, UTF-8 JSON): { "port": 51234, "deleteMeasures": [ { "table": "Sales", "name": "Cost" } ] }
# Çıktı (-OutFile, UTF-8 JSON): { "ok": true, "removed": ["Sales[Cost]"], "missing": [] }
param([Parameter(Mandatory = $true)][string]$InFile, [Parameter(Mandatory = $true)][string]$OutFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
function J([string]$s) { return '"' + ($s -replace '\\', '\\' -replace '"', '\"' -replace "`r", '\r' -replace "`n", '\n') + '"' }

function Find-Tom {
  $c = @()
  if ($env:MEASURE_SIEVE_TOM) { $c += $env:MEASURE_SIEVE_TOM }
  $dirs = @()
  foreach ($p in (Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue)) { try { if ($p.Path) { $dirs += (Split-Path $p.Path) } } catch { } }
  $dirs += "$env:ProgramFiles\Microsoft Power BI Desktop\bin"
  foreach ($d in $dirs) { $c += (Join-Path $d 'Microsoft.PowerBI.Tabular.dll'); $c += (Join-Path $d 'Microsoft.AnalysisServices.Tabular.dll') }
  foreach ($p in $c) { if ($p -and (Test-Path $p)) { return $p } }
  return $null
}

$req = [System.IO.File]::ReadAllText($InFile, $utf8) | ConvertFrom-Json
try {
  $removed = @(); $missing = @()
  if ($env:MEASURE_SIEVE_MOCK) {
    foreach ($m in $req.deleteMeasures) { $removed += (J ($m.table + '[' + $m.name + ']')) }
  } else {
    $dll = Find-Tom
    if (-not $dll) { throw 'Tabular Object Model (TOM) DLL bulunamadı. MEASURE_SIEVE_TOM ortam değişkeniyle yolunu ver.' }
    $asm = [System.Reflection.Assembly]::LoadFrom($dll)
    $type = $null
    try { $type = $asm.GetExportedTypes() | Where-Object { $_.Name -eq 'Server' -and $_.Namespace -like '*Tabular' } | Select-Object -First 1 } catch { }
    if (-not $type) { throw "Tabular Server sınıfı bulunamadı: $dll" }
    $srv = [Activator]::CreateInstance($type)
    $srv.Connect("localhost:$($req.port)")
    $model = $srv.Databases[0].Model
    foreach ($m in $req.deleteMeasures) {
      $t = $model.Tables.Find($m.table)
      $x = if ($t) { $t.Measures.Find($m.name) } else { $null }
      if ($x) { [void]$t.Measures.Remove($x); $removed += (J ($m.table + '[' + $m.name + ']')) } else { $missing += (J ($m.table + '[' + $m.name + ']')) }
    }
    if ($removed.Count) { [void]$model.SaveChanges() }
    $srv.Disconnect()
  }
  [System.IO.File]::WriteAllText($OutFile, '{"ok":true,"removed":[' + ($removed -join ',') + '],"missing":[' + ($missing -join ',') + ']}', $utf8)
} catch {
  [System.IO.File]::WriteAllText($OutFile, '{"ok":false,"error":' + (J $_.Exception.Message) + '}', $utf8)
}
