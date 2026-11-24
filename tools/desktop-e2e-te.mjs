// Measure Sieve · Tabular Editor 2 betiği testi (Windows, elle bir adım içerir).
//
//   node tools/desktop-e2e-te.mjs olc   --pbix "<dosya>" --te "<TabularEditor.exe>"
//       PBIX'in kopyasını Desktop'ta açar, görsellerin değerlerini ölçer, Measure Sieve'in ürettiği
//       C# betiğini betik.cs olarak yazar ve Tabular Editor 2'yi açık modele bağlı başlatır.
//   (elle) Tabular Editor › C# Script › betik.cs içeriğini yapıştır › Çalıştır (F5) › Kaydet (Ctrl+S)
//   node tools/desktop-e2e-te.mjs karsilastir
//       Silinen measure'ların Desktop'ta olmadığını ve rakamların değişmediğini denetler, Desktop'ı kaydetmeden kapatır.
//
// Asıl dosyaya yazılmaz; kopya Belgeler\MeasureSieve-Test\te-<tarih> içindedir.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const imp = p => import(pathToFileURL(path.join(repo, ...p.split('/'))).href);
const { readPath } = await imp('mcp/files.mjs');
const core = await imp('web/js/core.js');
const { makeT } = await imp('web/js/i18n.js');
const dsk = await imp('mcp/desktop.mjs');

const argv = process.argv.slice(2), mode = argv[0];
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ps = cmd => new Promise(res => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', cmd], { windowsHide: true }, (e, out) => res(String(out || '').trim())));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const root = path.join(await ps("[Environment]::GetFolderPath('MyDocuments')"), 'MeasureSieve-Test');
const stateFile = path.join(root, 'te-durum.json');
const log = (...a) => console.log(`[${new Date().toLocaleTimeString('tr-TR')}]`, ...a);

async function analyzePbix(file) {
  const r = await readPath(file); if (r.error) throw new Error(r.error);
  return core.buildProjects([r.extraction]).projects.map(core.analyze).find(z => z.hasModel);
}
async function engineMeasures(port) {
  const [r] = await dsk.runQueries(port, [{ id: 'm', dax: 'EVALUATE SELECTCOLUMNS(INFO.MEASURES(), "n", [Name])' }], { timeoutMs: 60000 });
  if (r.error) throw new Error(r.error);
  return new Set(r.rows.map(x => core.norm(x[0])));
}

if (mode === 'olc') {
  const pbix = path.resolve(arg('--pbix', path.join(root, 'ornekler', 'Store Sales.pbix')));
  const te = path.resolve(arg('--te', path.join(root, 'TabularEditor2', 'TabularEditor.exe')));
  if (!existsSync(te)) throw new Error('Tabular Editor bulunamadı: ' + te);
  const dir = path.join(root, 'te-' + new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16));
  await fs.mkdir(dir, { recursive: true });
  const copy = path.join(dir, path.basename(pbix)); await fs.copyFile(pbix, copy);
  const res = await analyzePbix(copy);
  // Aday measure'lar, aday hesaplanmış sütunlar ve aday tablolar birlikte (betik, kalan bir öğeyi bozacak silmeyi atlar)
  const sel = [...res.items.filter(n => n.origin === 'model' && core.CANDIDATE(n.status) && (n.kind === 'measure' || (n.kind === 'column' && n.calculated))).map(n => ({ kind: 'node', id: n.id })),
    ...res.tableItems.filter(t => core.CANDIDATE(t.status)).map(t => ({ kind: 'table', id: t.id }))];
  const plan = core.removalPlan(res, sel);
  const sc = core.teScript(res, plan, makeT('tr'));
  await fs.writeFile(path.join(dir, 'betik.cs'), sc.script, 'utf8');
  const deleted = sc.script.split('\n').map(l => (l.match(/^Model\.Tables\["(?:[^"\\]|\\.)*"\]\.Measures\["((?:[^"\\]|\\.)*)"\]\.Delete\(\);$/) || [])[1]).filter(Boolean).map(x => x.replace(/\\(.)/g, '$1'));
  log(`Betik: ${deleted.length} measure silinecek → ${path.join(dir, 'betik.cs')}`);
  const before = new Set((await dsk.findDesktopPorts()).map(p => p.port));
  const beforePids = new Set((await ps('(Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue).Id -join ","')).split(',').filter(Boolean));
  await ps(`Start-Process -FilePath '${copy.replace(/'/g, "''")}'`);
  let port = null; const t0 = Date.now();
  while (!port && Date.now() - t0 < 6 * 60000) {
    await sleep(5000);
    for (const p of (await dsk.findDesktopPorts()).filter(p => !before.has(p.port))) {
      const [r] = await dsk.runQueries(p.port, [{ id: 't', dax: 'EVALUATE SELECTCOLUMNS(INFO.TABLES(), "n", [Name])' }], { timeoutMs: 30000 }).catch(() => [{ error: 'x' }]);
      if (!r.error && r.rows.length) { port = p.port; break; }
    }
  }
  if (!port) throw new Error('Desktop açılmadı');
  await sleep(10000);
  const pid = (await ps('(Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue).Id -join ","')).split(',').filter(Boolean).find(x => !beforePids.has(x));
  const queries = dsk.buildQueries(res), results = await dsk.runQueries(port, queries);
  log(`Desktop açık (port ${port}); ölçüm: ${queries.length} sorgu, ${results.filter(r => !r.error).length} başarılı`);
  await fs.writeFile(stateFile, JSON.stringify({ dir, port, pid, deleted, queries, results }), 'utf8');
  spawn(te, [`localhost:${port}`], { detached: true, stdio: 'ignore' }).unref();
  log('Tabular Editor 2 açılıyor. C# Script sekmesine betik.cs içeriğini yapıştır, F5 ile çalıştır, Ctrl+S ile kaydet.');
} else if (mode === 'karsilastir') {
  const st = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  const lines = ['# Measure Sieve · Tabular Editor 2 betiği testi', '', `Tarih: ${new Date().toLocaleString('tr-TR')}  `, `Klasör: \`${st.dir}\``, ''];
  let ok = true;
  const eng = await engineMeasures(st.port);
  const still = st.deleted.filter(n => eng.has(core.norm(n)));
  if (still.length) { ok = false; lines.push(`- ✗ Silinmesi gerekirken Desktop'ta duran: ${still.join(', ')}`); }
  else lines.push(`- ✓ Betikteki ${st.deleted.length} measure Desktop'ta yok (kalan ${eng.size})`);
  const c = dsk.compareSnapshots({ queries: st.queries, results: st.results }, { results: await dsk.runQueries(st.port, st.queries) });
  if (c.ok) lines.push(`- ✓ Rakamlar aynı: ${c.compared} sorgu karşılaştırıldı, fark yok`);
  else { ok = false; c.differences.slice(0, 10).forEach(d => lines.push(`- ✗ ${d.label}: ${d.why}${d.detail ? ' (' + d.detail + ')' : ''}`)); }
  lines.splice(4, 0, `**Sonuç:** ${ok ? 'geçti' : 'kaldı'}`, '');
  if (st.pid) await ps(`Stop-Process -Id ${st.pid} -Force -ErrorAction SilentlyContinue`);
  lines.push('- Desktop kaydetmeden kapatıldı (asıl dosyaya dokunulmadı)');
  await fs.writeFile(path.join(st.dir, 'rapor.md'), lines.join('\n'), 'utf8');
  await fs.writeFile(path.join(root, 'son-te-rapor.md'), lines.join('\n'), 'utf8');
  log(lines.join('\n'));
} else {
  console.log('Kullanım: node tools/desktop-e2e-te.mjs olc | karsilastir');
}
