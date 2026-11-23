#!/usr/bin/env node
// Measure Sieve · Power BI Desktop ile uçtan uca otomatik test
//
// Ne yapar (sırayla, kendi başına):
//   1. Örnek dosyaları internetten indirir (Microsoft'un Store Sales'i, Adventure Works PBIX ve PBIP, pbip-demo)
//   2. Durağan test: her örneği tarar, PBIP'ler için temizlenmiş kopya üretir, yapısal doğrulamayı çalıştırır
//   3. PBIX testi: dosyanın KOPYASINI Desktop'ta açar; Desktop'ın kendi measure listesiyle bizimkini karşılaştırır;
//      değerleri ölçer; aday measure'ları bellekteki modelden siler (Tabular Editor gibi); değerleri tekrar ölçüp karşılaştırır;
//      Desktop'ı KAYDETMEDEN kapatır
//   4. PBIP testi: aslını ve temizlenmiş kopyasını sırayla Desktop'ta açar; kopyanın açıldığını, silinenlerin gittiğini,
//      kalanların durduğunu ve sorguların bozulmadığını kontrol eder
//   5. Belgeler\MeasureSieve-Test\<tarih>\rapor.md dosyasını yazar ve klasörü açar
//
// Asıl dosyalara yazılmaz: her şey test klasöründeki kopyalar üzerinde yapılır.
// Kullanım:  node tools/desktop-e2e.mjs [--klasor <yol>] [--sadece-statik] [--once]
//   --once: bitince "oturum açılınca çalış" görevini (desktop-e2e-kur.ps1) siler
import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(here, '..');
const req = createRequire(path.join(repo, 'mcp', 'package.json'));
const JSZip = req('jszip');
const { readPath } = await import(path.join(repo, 'mcp', 'files.mjs'));
const core = await import(path.join(repo, 'web', 'js', 'core.js'));
const { cleanupPlan, buildCleanFiles, verifyCopy } = await import(path.join(repo, 'web', 'js', 'clean.js'));
const dsk = await import(path.join(repo, 'mcp', 'desktop.mjs'));

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ONLY_STATIC = argv.includes('--sadece-statik');
const ONCE = argv.includes('--once');
const WIN = process.platform === 'win32';
const docs = WIN ? await new Promise(res => execFile('powershell.exe', ['-NoProfile', '-Command', "[Environment]::GetFolderPath('MyDocuments')"], { windowsHide: true }, (e, out) => res(String(out || '').trim()))) : '';
const root = path.resolve(arg('--klasor', path.join(docs || path.join(os.homedir(), 'Documents'), 'MeasureSieve-Test')));
const samplesDir = path.join(root, 'ornekler');
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
const runDir = path.join(root, stamp);

/* ---------------------------------------------------------------- Rapor */
const steps = [];
let logText = '';
const log = (...a) => { const l = `[${new Date().toLocaleTimeString('tr-TR')}] ${a.join(' ')}`; console.log(l); logText += l + '\n'; };
function step(title) { const s = { title, status: 'geçti', notes: [] }; steps.push(s); log('▶', title); return s; }
const note = (s, t) => { s.notes.push(t); log('   ', t); };
const fail = (s, t) => { s.status = 'kaldı'; note(s, '✗ ' + t); };
const warn = (s, t) => { if (s.status === 'geçti') s.status = 'uyarı'; note(s, '! ' + t); };
const skip = (s, t) => { s.status = 'atlandı'; note(s, t); };

/* ---------------------------------------------------------------- Örnekler */
const SAMPLES = {
  storeSales: { file: 'Store Sales.pbix', url: 'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/2026%20Power%20BI%20Samples%20Revamp/Store%20Sales.pbix' },
  awPbix: { file: 'Adventure Works.pbix', url: 'https://raw.githubusercontent.com/alisonpezzott/pbi_file_formats/main/00_pbix/Adventure%20Works.pbix' },
  awPbip: { dir: 'AdventureWorks-PBIP', zip: 'https://codeload.github.com/alisonpezzott/pbi_file_formats/zip/refs/heads/main', prefix: 'pbi_file_formats-main/04_pbir/', open: 'Adventure Works.pbip' },
  demo: { dir: 'pbip-demo', zip: 'https://codeload.github.com/RuiRomano/pbip-demo/zip/refs/heads/main', prefix: 'pbip-demo-main/src/', open: 'Report01.pbip' }
};
async function download(url) {
  const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`);
  return new Uint8Array(await r.arrayBuffer());
}
async function getSamples() {
  const s = step('Örnek dosyaları hazırla');
  await fs.mkdir(samplesDir, { recursive: true });
  for (const [k, x] of Object.entries(SAMPLES)) {
    const target = path.join(samplesDir, x.file || x.dir);
    if (existsSync(target)) { note(s, `${x.file || x.dir}: zaten var`); continue; }
    try {
      if (x.file) { await fs.writeFile(target, await download(x.url)); note(s, `${x.file}: indirildi`); continue; }
      const zip = await JSZip.loadAsync(await download(x.zip)); let n = 0;
      for (const [name, e] of Object.entries(zip.files)) {
        if (e.dir || !name.startsWith(x.prefix)) continue;
        const out = path.join(target, ...name.slice(x.prefix.length).split('/'));
        await fs.mkdir(path.dirname(out), { recursive: true }); await fs.writeFile(out, await e.async('uint8array')); n++;
      }
      note(s, `${x.dir}: ${n} dosya indirildi`);
    } catch (e) { fail(s, `${k} indirilemedi (${e.message}). Dosyayı elle ${samplesDir} içine koyabilirsin.`); }
  }
}

/* ---------------------------------------------------------------- Durağan test */
const analyzePath = async p => {
  const r = await readPath(p); if (r.error) throw new Error(r.error);
  const { projects } = core.buildProjects([r.extraction]);
  return { r, results: projects.map(core.analyze) };
};
const candidates = res => [...res.items.filter(n => core.CANDIDATE(n.status)).map(n => ({ kind: 'node', id: n.id })), ...res.tableItems.filter(t => core.CANDIDATE(t.status)).map(t => ({ kind: 'table', id: t.id }))];
const count = (res, kind, f) => res.items.filter(n => n.kind === kind && (!f || f(n))).length;

async function writeCopy(srcDir, target, out) {
  await fs.cp(srcDir, target, { recursive: true });
  for (const [rel, bytes] of out.changed) await fs.writeFile(path.join(target, ...rel.split('/')), bytes);
  for (const rel of out.deleted) await fs.rm(path.join(target, ...rel.split('/')), { force: true });
}

const ctx = {};
async function staticTests() {
  for (const key of ['storeSales', 'awPbix', 'awPbip', 'demo']) {
    const x = SAMPLES[key], p = path.join(samplesDir, x.file || x.dir);
    const s = step(`Tarama: ${x.file || x.dir}`);
    if (!existsSync(p)) { skip(s, 'Dosya yok'); continue; }
    try {
      const t0 = Date.now(), { r, results } = await analyzePath(p);
      const res = key === 'demo' ? results.find(z => z.label === 'Model01') : results.find(z => z.hasModel) || results[0];
      if (!res || !res.hasModel) { fail(s, 'Model okunamadı'); continue; }
      note(s, `${Date.now() - t0} ms · ${count(res, 'measure')} measure (${count(res, 'measure', n => core.CANDIDATE(n.status))} aday) · ${count(res, 'column')} sütun · ${res.tableItems.length} tablo · ${res.reports.map(z => z.visuals).reduce((a, b) => a + b, 0)} görsel`);
      ctx[key] = { path: p, r, res };
      if (x.dir) {
        const plan = cleanupPlan(res, candidates(res));
        const out = await buildCleanFiles(res, plan.rm);
        const v = await verifyCopy(res, r.extraction.source, out, plan);
        const target = path.join(runDir, x.dir + '-temiz');
        await writeCopy(p, target, out);
        ctx[key].clean = { plan, out, v, dir: target };
        note(s, `Temizlenmiş kopya: ${plan.removed.length} öğe kaldırıldı, ${plan.skipped.length} atlandı → ${target}`);
        v.checks.forEach(c => c.ok ? note(s, `✓ ${c.code}`) : fail(s, `${c.code}: ${c.items.slice(0, 5).join(', ')}`));
      }
    } catch (e) { fail(s, e.stack || e.message); }
  }
}

/* ---------------------------------------------------------------- Desktop yardımcıları */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ps = cmd => new Promise(res => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', cmd], { windowsHide: true }, (e, out) => res(String(out || '').trim())));
const desktopPids = async () => (await ps('(Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue).Id -join ","')).split(',').filter(Boolean).map(Number);
async function openInDesktop(file, expectedTables, s) {
  const beforePorts = new Set((await dsk.findDesktopPorts()).map(p => p.port)), beforePids = new Set(await desktopPids());
  await ps(`Start-Process -FilePath '${file.replace(/'/g, "''")}'`);
  const names = new Set(expectedTables.map(core.norm));
  const t0 = Date.now();
  while (Date.now() - t0 < 6 * 60 * 1000) {
    await sleep(5000);
    const ports = (await dsk.findDesktopPorts()).filter(p => !beforePorts.has(p.port));
    for (const p of ports) {
      try {
        const [r] = await dsk.runQueries(p.port, [{ id: 't', dax: 'EVALUATE SELECTCOLUMNS(INFO.TABLES(), "n", [Name])' }], { timeoutMs: 30000 });
        if (r.error) continue;
        const got = new Set(r.rows.map(x => core.norm(x[0])));
        const hit = [...names].filter(n => got.has(n)).length;
        if (hit >= Math.max(1, Math.floor(names.size / 2))) {
          const pid = (await desktopPids()).find(x => !beforePids.has(x));
          note(s, `Desktop açıldı (${Math.round((Date.now() - t0) / 1000)} sn, port ${p.port})`);
          await sleep(8000); // rapor ve model yüklemesi otursun
          return { port: p.port, pid };
        }
      } catch (e) { /* motor henüz hazır değil */ }
    }
  }
  return null;
}
async function closeDesktop(h) {
  if (h && h.pid) await ps(`Stop-Process -Id ${h.pid} -Force -ErrorAction SilentlyContinue`);
  else await ps('Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue | Stop-Process -Force');
  await sleep(6000);
}
async function engineMeasures(port) {
  const [r] = await dsk.runQueries(port, [{ id: 'm', dax: 'EVALUATE SELECTCOLUMNS(INFO.MEASURES(), "t", [TableID], "n", [Name])' }], { timeoutMs: 60000 });
  if (r.error) throw new Error(r.error);
  return new Set(r.rows.map(x => core.norm(x[1])));
}
const queryErrors = rs => rs.filter(x => x.error).length;

/* ---------------------------------------------------------------- PBIX testi */
async function pbixTest(key) {
  const c = ctx[key]; const s = step(`Desktop · PBIX: ${SAMPLES[key].file}`);
  if (!c) { skip(s, 'Tarama yapılamadı'); return; }
  const copy = path.join(runDir, SAMPLES[key].file);
  await fs.copyFile(c.path, copy);
  const res = c.res, h = await openInDesktop(copy, res.tableItems.map(t => t.name), s);
  if (!h) { fail(s, 'Desktop 6 dakikada açılmadı ya da modeli yüklenmedi (açılışta bir iletişim kutusu beklemiş olabilir).'); await closeDesktop(null); return; }
  try {
    // 1) Bizim PBIX okuyucumuz Desktop'ın gördüğü measure listesini doğru buluyor mu?
    try {
      const eng = await engineMeasures(h.port), ours = new Set(res.items.filter(n => n.kind === 'measure' && n.origin === 'model').map(n => core.norm(n.name)));
      const onlyEng = [...eng].filter(n => !ours.has(n)), onlyOurs = [...ours].filter(n => !eng.has(n));
      if (!onlyEng.length && !onlyOurs.length) note(s, `✓ Measure listesi Desktop ile aynı (${eng.size})`);
      else fail(s, `Measure listesi farklı · yalnız Desktop'ta: ${onlyEng.join(', ') || '-'} · yalnız bizde: ${onlyOurs.join(', ') || '-'}`);
    } catch (e) { warn(s, `INFO.MEASURES çalışmadı (eski Desktop olabilir): ${e.message}`); }
    // 2) Değerleri ölç, kararlılık için bir kez daha ölç
    const qs = dsk.buildQueries(res);
    const before = { queries: qs, results: await dsk.runQueries(h.port, qs) };
    note(s, `Ölçüm: ${qs.length} sorgu, ${qs.length - queryErrors(before.results)} başarılı`);
    before.results.filter(x => x.error).slice(0, 5).forEach(x => warn(s, `Sorgu hatası (${qs.find(q => q.id === x.id).label}): ${x.error.slice(0, 200)}`));
    const again = dsk.compareSnapshots(before, { results: await dsk.runQueries(h.port, qs) });
    again.ok ? note(s, '✓ Aynı sorgular iki kez aynı sonucu verdi') : warn(s, `Tekrar ölçümde fark (karşılaştırma güvenilirliği): ${again.differences.slice(0, 3).map(d => d.label).join('; ')}`);
    // 3) Aday measure'ları bellekteki modelden sil ve tekrar ölç
    const plan = cleanupPlan(res, res.items.filter(n => n.kind === 'measure' && core.CANDIDATE(n.status)).map(n => ({ kind: 'node', id: n.id })));
    const del = plan.removedUnits.map(u => res.nodes[u.id]).filter(n => n.kind === 'measure').map(n => ({ table: n.table, name: n.name }));
    if (!del.length) { note(s, 'Silinecek aday measure yok'); return; }
    let r;
    try { r = await dsk.deleteMeasuresInDesktop(h.port, del); }
    catch (e) { fail(s, `Bellekteki modelden silme çalışmadı: ${e.message}`); return; }
    note(s, `Silindi: ${r.removed.length} measure${r.missing.length ? `, bulunamayan: ${r.missing.join(', ')}` : ''}`);
    await sleep(5000);
    try {
      const eng = await engineMeasures(h.port);
      const still = del.filter(d => eng.has(core.norm(d.name))).map(d => d.name);
      still.length ? fail(s, `Silinmesi gerekirken duran: ${still.join(', ')}`) : note(s, '✓ Silinen measure\'lar Desktop\'ta yok');
    } catch (e) { /* yukarıda uyarıldı */ }
    const cmp = dsk.compareSnapshots(before, { results: await dsk.runQueries(h.port, qs) });
    cmp.ok ? note(s, `✓ Rakamlar aynı: ${cmp.compared} sorgu karşılaştırıldı, fark yok`) : cmp.differences.forEach(d => fail(s, `${d.label}: ${d.why}${d.detail ? ' (' + d.detail + ')' : ''}`));
  } catch (e) { fail(s, e.stack || e.message); }
  finally { await closeDesktop(h); note(s, 'Desktop kaydetmeden kapatıldı'); }
}

/* ---------------------------------------------------------------- PBIP testi */
async function pbipTest(key) {
  const c = ctx[key]; const s = step(`Desktop · PBIP temizlenmiş kopya: ${SAMPLES[key].dir}`);
  if (!c || !c.clean) { skip(s, 'Temizlenmiş kopya yok'); return; }
  const res = c.res, qs = dsk.buildQueries(res), tables = res.tableItems.map(t => t.name);
  // Aslı: temel durum (veri önbelleği GitHub'da olmadığı için görseller boş olabilir; burada açılma ve hatalar önemli)
  const orig = path.join(runDir, SAMPLES[key].dir + '-asil');
  await fs.cp(c.path, orig, { recursive: true });
  let h = await openInDesktop(path.join(orig, SAMPLES[key].open), tables, s), base = null, baseMeasures = null;
  if (!h) { fail(s, 'Aslı Desktop\'ta açılmadı; kopya testi anlamsız'); await closeDesktop(null); return; }
  try {
    base = await dsk.runQueries(h.port, qs);
    try { baseMeasures = await engineMeasures(h.port); } catch (e) { warn(s, 'INFO.MEASURES çalışmadı'); }
    note(s, `Aslı: ${qs.length} sorgu, ${queryErrors(base)} hata${baseMeasures ? `, ${baseMeasures.size} measure` : ''}`);
  } catch (e) { fail(s, e.message); }
  finally { await closeDesktop(h); }
  // Temizlenmiş kopya
  h = await openInDesktop(path.join(c.clean.dir, SAMPLES[key].open), tables, s);
  if (!h) { fail(s, 'TEMİZLENMİŞ KOPYA DESKTOP\'TA AÇILMADI. Desktop\'taki hata mesajını not al.'); await closeDesktop(null); return; }
  try {
    note(s, '✓ Temizlenmiş kopya Desktop\'ta açıldı');
    if (baseMeasures) {
      const eng = await engineMeasures(h.port);
      const removed = c.clean.plan.removedUnits.map(u => u.kind === 'node' ? res.nodes[u.id] : null).filter(n => n && n.kind === 'measure').map(n => core.norm(n.name));
      const still = removed.filter(n => eng.has(n)), lost = [...baseMeasures].filter(n => !eng.has(n) && !removed.includes(n));
      still.length ? fail(s, `Kopyada duran silinmiş measure: ${still.join(', ')}`) : note(s, `✓ Silinen ${removed.length} measure kopyada yok`);
      lost.length ? fail(s, `Kopyada beklenmedik şekilde kaybolan: ${lost.join(', ')}`) : note(s, `✓ Kalan ${eng.size} measure yerinde`);
    }
    const after = await dsk.runQueries(h.port, qs);
    const newErr = after.filter(x => x.error && !(base || []).find(b => b.id === x.id && b.error));
    newErr.length ? newErr.slice(0, 5).forEach(x => fail(s, `Kopyada yeni sorgu hatası (${qs.find(q => q.id === x.id).label}): ${x.error.slice(0, 200)}`)) : note(s, '✓ Kopyada yeni sorgu hatası yok');
    if (base) {
      const cmp = dsk.compareSnapshots({ queries: qs, results: base }, { results: after });
      cmp.ok ? note(s, `✓ Rakamlar aslıyla aynı (${cmp.compared} sorgu)`) : cmp.differences.slice(0, 5).forEach(d => fail(s, `${d.label}: ${d.why}${d.detail ? ' (' + d.detail + ')' : ''}`));
    }
  } catch (e) { fail(s, e.stack || e.message); }
  finally { await closeDesktop(h); }
}

/* ---------------------------------------------------------------- Ortam */
async function environment() {
  const s = step('Ortam');
  note(s, `Node ${process.version} · ${process.platform} ${os.release()} · test klasörü ${runDir}`);
  if (!WIN) { skip(s, 'Windows değil: Desktop testleri atlanacak'); return false; }
  const ver = await ps("(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Microsoft Power BI Desktop' -ErrorAction SilentlyContinue).Version");
  const store = await ps('(Get-AppxPackage -Name Microsoft.MicrosoftPowerBIDesktop -ErrorAction SilentlyContinue).Version');
  if (!ver && !store) { fail(s, 'Power BI Desktop bulunamadı'); return false; }
  note(s, `Power BI Desktop ${ver || store}${store ? ' (Microsoft Store)' : ''}`);
  const open = await desktopPids();
  if (open.length) { warn(s, `Açık ${open.length} Power BI Desktop penceresi var. Test, kendi açtığı pencereleri kapatır; seninkilere dokunmaz ama karışmaması için kapatman iyi olur.`); }
  return true;
}

/* ---------------------------------------------------------------- Ana akış */
await fs.mkdir(runDir, { recursive: true });
log(`Measure Sieve Desktop testi başladı → ${runDir}`);
try {
  const desktopOk = await environment();
  await getSamples();
  await staticTests();
  if (!ONLY_STATIC && desktopOk) {
    await pbixTest('storeSales');
    await pbixTest('awPbix');
    await pbipTest('awPbip');
    await pbipTest('demo');
  }
} catch (e) { const s = step('Beklenmeyen hata'); fail(s, e.stack || e.message); }

const icon = { 'geçti': '✅', 'uyarı': '⚠️', 'kaldı': '❌', 'atlandı': '⏭️' };
const total = st => steps.filter(x => x.status === st).length;
const md = [`# Measure Sieve · Desktop testi`, '', `Tarih: ${new Date().toLocaleString('tr-TR')}  `, `Klasör: \`${runDir}\``, '',
  `**Özet:** ${total('geçti')} geçti · ${total('uyarı')} uyarı · ${total('kaldı')} kaldı · ${total('atlandı')} atlandı`, '',
  ...steps.flatMap(x => [`## ${icon[x.status]} ${x.title}`, '', ...x.notes.map(n => `- ${n.replace(/\n/g, ' ')}`), '']),
  '---', 'Bu raporu Claude ile paylaş: dosyayı sohbete ekle ya da bilgisayarını bağlayıp "test raporunu oku" de.'].join('\n');
await fs.writeFile(path.join(runDir, 'rapor.md'), md, 'utf8');
await fs.writeFile(path.join(runDir, 'rapor.json'), JSON.stringify({ steps }, null, 2), 'utf8');
await fs.writeFile(path.join(runDir, 'gunluk.txt'), logText, 'utf8');
await fs.writeFile(path.join(root, 'son-rapor.md'), md, 'utf8');
log(`Rapor: ${path.join(runDir, 'rapor.md')}`);
if (ONCE && WIN) await ps("Unregister-ScheduledTask -TaskName 'MeasureSieve-DesktopTest' -Confirm:$false -ErrorAction SilentlyContinue");
if (WIN) await ps(`Start-Process -FilePath '${path.join(runDir, 'rapor.md').replace(/'/g, "''")}'`); // raporu aç (.md için Not Defteri ya da varsayılan uygulama)
process.exit(steps.some(x => x.status === 'kaldı') ? 1 : 0);
