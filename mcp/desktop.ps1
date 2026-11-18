# Measure Sieve · Power BI Desktop sorgu köprüsü (yalnızca okur)
# Açık Power BI Desktop'ın yerel Analysis Services motoruna bağlanır ve DAX sorgularını çalıştırır.
# Girdi (stdin, JSON):  { "port": 51234, "queries": [ { "id": "v1", "dax": "EVALUATE ..." } ] }
# Çıktı (stdout, JSON): { "ok": true, "results": [ { "id": "v1", "columns": [...], "rows": [[...]], "error": null } ] }
# Yalnızca EVALUATE sorguları çalıştırılır; modeli değiştiren hiçbir komut gönderilmez.
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$inv = [System.Globalization.CultureInfo]::InvariantCulture

function J([object]$v) {
  if ($null -eq $v -or $v -is [System.DBNull]) { return 'null' }
  if ($v -is [bool]) { if ($v) { return 'true' } else { return 'false' } }
  if ($v -is [datetime]) { return '"' + $v.ToString('yyyy-MM-ddTHH:mm:ss.fff', $inv) + '"' }
  if ($v -is [byte] -or $v -is [int16] -or $v -is [int32] -or $v -is [int64] -or $v -is [decimal] -or $v -is [double] -or $v -is [single]) {
    $d = [double]$v
    if ([double]::IsNaN($d) -or [double]::IsInfinity($d)) { return '"' + $d.ToString($inv) + '"' }
    return $d.ToString('R', $inv)
  }
  $s = [string]$v
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('"')
  foreach ($ch in $s.ToCharArray()) {
    switch ($ch) {
      '"' { [void]$sb.Append('\"') } '\' { [void]$sb.Append('\\') }
      "`n" { [void]$sb.Append('\n') } "`r" { [void]$sb.Append('\r') } "`t" { [void]$sb.Append('\t') }
      default { if ([int]$ch -lt 32) { [void]$sb.Append('\u' + ([int]$ch).ToString('x4')) } else { [void]$sb.Append($ch) } }
    }
  }
  [void]$sb.Append('"')
  return $sb.ToString()
}

function Find-Adomd {
  $c = @()
  if ($env:MEASURE_SIEVE_ADOMD) { $c += $env:MEASURE_SIEVE_ADOMD }
  $c += "$env:ProgramFiles\Microsoft Power BI Desktop\bin\Microsoft.PowerBI.AdomdClient.dll"
  $c += (Get-ChildItem "$env:ProgramFiles\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_*\bin\Microsoft.PowerBI.AdomdClient.dll" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | ForEach-Object FullName)
  $c += (Get-ChildItem "$env:ProgramFiles\Microsoft SQL Server Management Studio*\Common7\IDE\Microsoft.AnalysisServices.AdomdClient.dll" -ErrorAction SilentlyContinue | ForEach-Object FullName)
  foreach ($p in $c) { if ($p -and (Test-Path $p)) { return $p } }
  return $null
}

$req = [Console]::In.ReadToEnd() | ConvertFrom-Json
$out = New-Object System.Text.StringBuilder
try {
  if ($env:MEASURE_SIEVE_MOCK) {
    # Test modu: motor yerine sorgu metninden türetilmiş sabit sonuçlar döner
    $conn = $null
  } else {
    $dll = Find-Adomd
    if (-not $dll) { throw 'ADOMD istemcisi bulunamadı. Power BI Desktop kurulu olmalı ya da MEASURE_SIEVE_ADOMD ortam değişkeni DLL yolunu göstermeli.' }
    Add-Type -Path $dll
    $conn = New-Object Microsoft.AnalysisServices.AdomdClient.AdomdConnection("Data Source=localhost:$($req.port)")
    $conn.Open()
  }
  [void]$out.Append('{"ok":true,"results":[')
  $first = $true
  foreach ($q in $req.queries) {
    if (-not $first) { [void]$out.Append(',') }; $first = $false
    [void]$out.Append('{"id":' + (J $q.id) + ',')
    if ($q.dax -notmatch '^\s*EVALUATE\b') { [void]$out.Append('"columns":[],"rows":[],"error":"only EVALUATE"}'); continue }
    try {
      if ($env:MEASURE_SIEVE_MOCK) {
        $h = 0; foreach ($ch in $q.dax.ToCharArray()) { $h = ($h * 31 + [int]$ch) % 1000003 }
        if ($env:MEASURE_SIEVE_MOCK -eq 'shift' -and $q.dax -match 'SHIFTME') { $h = $h + 1 }
        [void]$out.Append('"columns":["[x]","[v]"],"rows":[[' + (J 'a') + ',' + (J ([double]$h)) + '],[' + (J 'b') + ',null]],"error":null}')
        continue
      }
      $cmd = $conn.CreateCommand(); $cmd.CommandText = $q.dax; $cmd.CommandTimeout = 120
      $r = $cmd.ExecuteReader()
      $cols = @(); for ($i = 0; $i -lt $r.FieldCount; $i++) { $cols += (J $r.GetName($i)) }
      [void]$out.Append('"columns":[' + ($cols -join ',') + '],"rows":[')
      $rf = $true; $n = 0
      while ($r.Read() -and $n -lt 5000) {
        if (-not $rf) { [void]$out.Append(',') }; $rf = $false; $n++
        $vals = @(); for ($i = 0; $i -lt $r.FieldCount; $i++) { $vals += (J $r.GetValue($i)) }
        [void]$out.Append('[' + ($vals -join ',') + ']')
      }
      $r.Close()
      [void]$out.Append('],"error":null}')
    } catch {
      [void]$out.Append('"columns":[],"rows":[],"error":' + (J $_.Exception.Message) + '}')
    }
  }
  [void]$out.Append(']}')
  if ($conn) { $conn.Close() }
  [Console]::Out.Write($out.ToString())
} catch {
  [Console]::Out.Write('{"ok":false,"error":' + (J $_.Exception.Message) + '}')
}
