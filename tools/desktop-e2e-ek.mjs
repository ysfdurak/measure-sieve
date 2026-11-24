// Measure Sieve · Power BI Desktop ek testleri (Windows).
//
// Otomatik testin (desktop-e2e.mjs) yapamadığı, gerçek bir "Farklı kaydet › PBIP" klasörü gerektiren adımlar:
//   1. Desktop'ın kaydettiği gerçek PBIP (TMDL + PBIR + veri önbelleği) ve PBIT, Türkçe karakterli yolda taranır;
//      sonuç aynı raporun PBIX'iyle karşılaştırılır.
//   2. MCP sunucusu Windows'ta: tarama, temizlenmiş kopya (PBIP ve PBIT), değerleri ölç/karşılaştır.
//   3. Gerçek verili PBIP: aslı ve temizlenmiş kopya Desktop'ta açılır, rakamlar karşılaştırılır.
//   4. Negatif test: kullanılan bir measure'ın formülü bilerek değiştirilir; karşılaştırma farkı yakalamalı.
//   5. Temizlenmiş PBIT Desktop'ta açılır.
//   6. Yerel web sunucusu (npm run web) ve oturum açılışı görevi (kur/kaldır).
//
// Hazırlık: Desktop'ta bir raporu Dosya › Farklı kaydet › Power BI projesi (.pbip) ile kaydet,
// aynı klasöre Dosya › Dışarı aktar › Power BI şablonu ile PBIT al ve PBIX'i de yanına koy.
// Kullanım: node tools/desktop-e2e-ek.mjs --pbip "<klasör>"   (varsayılan: Belgeler\MeasureSieve-Test\Satış Raporu)
// Asıl dosyalara yazılmaz; her şey tarihli test klasörüne kopyalanır.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const imp = p => import(pathToFileURL(path.join(repo, ...p.split('/'))).href);
const { readPath } = await imp('mcp/files.mjs');
const core = await imp('web/js/core.js');
const dsk = await imp('mcp/desktop.mjs');
const req = createRequire(path.join(repo, 'mcp', 'package.json'));
const { Client } = await import(pathToFileURL(req.resolve('@modelcontextprotocol/sdk/client/index.js')).href);
const { StdioClientTransport } = await import(pathToFileURL(req.resolve('@modelcontextprotocol/sdk/client/stdio.js')).href);

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const WIN = process.platform === 'win32';
const ps = cmd => new Promise(res => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', cmd], { windowsHide: true, maxBuffer: 1 << 24 }, (e, out) => res(String(out || '').trim())));
const docs = WIN ? await ps("[Environment]::GetFolderPath('MyDocuments')") : path.join(os.homedir(), 'Documents');
const root = path.join(docs, 'MeasureSieve-Test');
const src = path.resolve(arg('--pbip', path.join(root, 'Satış Raporu')));
const runDir = path.join(root, 'ek-' + new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16));

/* ---------------------------------------------------------------- Rapor */
const steps = []; let logText = '';
const log = (...a) => { const l = `[${new Date().toLocaleTimeString('tr-TR')}] ${a.join(' ')}`; console.log(l); logText += l + '\n'; };
function step(title) { const s = { title, status: 'geçti', notes: [] }; steps.push(s); log('▶', title); return s; }
const note = (s, t) => { s.notes.push(t); log('   ', t); };
const fail = (s, t) => { s.status = 'kaldı'; note(s, '✗ ' + t); };
const warn = (s, t) => { if (s.status === 'geçti') s.status = 'uyarı'; note(s, '! ' + t); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------------------------------------------------------- Desktop yardımcıları */
const desktopPids = async () => (await ps('(Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue).Id -join ","')).split(',').filter(Boolean).map(Number);
async function openInDesktop(file, expectedTables, s, waitMin = 6) {
  const beforePorts = new Set((await dsk.findDesktopPorts()).map(p => p.port)), beforePids = new Set(await desktopPids());
  await ps(`Start-Process -FilePath '${file.replace(/'/g, "''")}'`);
  const names = new Set(expectedTables.map(core.norm)), t0 = Date.now();
  while (Date.now() - t0 < waitMin * 60 * 1000) {
    await sleep(5000);
    for (const p of (await dsk.findDesktopPorts()).filter(p => !beforePorts.has(p.port))) {
      try {
        const [r] = await dsk.runQueries(p.port, [{ id: 't', dax: 'EVALUATE SELECTCOLUMNS(INFO.TABLES(), "n", [Name])' }], { timeoutMs: 30000 });
        if (r.error) continue;
        const got = new Set(r.rows.map(x => core.norm(x[0])));
        if ([...names].filter(n => got.has(n)).length >= Math.max(1, Math.floor(names.size / 2))) {
          note(s, `Desktop açıldı (${Math.round((Date.now() - t0) / 1000)} sn, port ${p.port})`);
          await sleep(8000);
          return { port: p.port, pid: (await desktopPids()).find(x => !beforePids.has(x)) };
        }
      } catch (e) { /* motor henüz hazır değil */ }
    }
  }
  return null;
}
async function closeDesktop(h) {
  if (h && h.pid) await ps(`Stop-Process -Id ${h.pid} -Force -ErrorAction SilentlyContinue`);
  else { const now = await desktopPids(); for (const p of now) if (!startPids.has(p)) await ps(`Stop-Process -Id ${p} -Force -ErrorAction SilentlyContinue`); }
  await sleep(6000);
}
async function engineMeasures(port) {
  const [r] = await dsk.runQueries(port, [{ id: 'm', dax: 'EVALUATE SELECTCOLUMNS(INFO.MEASURES(), "n", [Name])' }], { timeoutMs: 60000 });
  if (r.error) throw new Error(r.error);
  return new Set(r.rows.map(x => core.norm(x[0])));
}
const analyzePath = async p => {
  const r = await readPath(p); if (r.error) throw new Error(r.error);
  return { r, res: core.buildProjects([r.extraction]).projects.map(core.analyze).find(z => z.hasModel) };
};
const measureSet = (res, f) => new Set(res.items.filter(n => n.kind === 'measure' && n.origin === 'model' && (!f || f(n))).map(n => core.norm(n.name)));
const same = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

/* ---------------------------------------------------------------- MCP istemcisi */
let mcp = null;
async function mcpCall(name, args) {
  const r = await mcp.callTool({ name, arguments: args });
  const t = (r.content || []).map(c => c.text).join('\n');
  if (r.isError) throw new Error(t);
  return t;
}

/* ---------------------------------------------------------------- Akış */
const startPids = new Set(WIN ? await desktopPids() : []);
await fs.mkdir(runDir, { recursive: true });
log(`Measure Sieve Desktop ek testleri → ${runDir}`);
const pbipFile = existsSync(src) ? (await fs.readdir(src)).find(f => /\.pbip$/i.test(f)) : null;
const pbitFile = existsSync(src) ? (await fs.readdir(src)).find(f => /\.pbit$/i.test(f) && !/\.temiz\./i.test(f)) : null;
const pbixFile = existsSync(src) ? (await fs.readdir(src)).find(f => /\.pbix$/i.test(f)) : null;
const ctx = {};

try {
  /* 1. Gerçek PBIP, PBIT ve PBIX taraması (Türkçe karakterli yol) */
  {
    const s = step('Tarama: Desktop\'ın kaydettiği PBIP, PBIT ve PBIX (Türkçe karakterli yol)');
    if (!pbipFile) throw new Error(`PBIP bulunamadı: ${src}`);
    // Aslına dokunmamak için kopya üzerinde çalışılır
    ctx.orig = path.join(runDir, 'asil'); await fs.cp(src, ctx.orig, { recursive: true });
    note(s, `Kaynak: ${src}`);
    const pbip = await analyzePath(ctx.orig); ctx.res = pbip.res;
    const cnt = (res, k) => res.items.filter(n => n.kind === k).length;
    note(s, `PBIP: ${cnt(pbip.res, 'measure')} measure (${measureSet(pbip.res, n => core.CANDIDATE(n.status)).size} aday) · ${cnt(pbip.res, 'column')} sütun · ${pbip.res.tableItems.length} tablo · biçim ${pbip.res.source.format}`);
    existsSync(path.join(ctx.orig, pbipFile.replace(/\.pbip$/i, '.SemanticModel'), '.pbi', 'cache.abf')) ? note(s, '✓ Veri önbelleği (cache.abf) var') : warn(s, 'Veri önbelleği yok: rakam karşılaştırması boş görsellerle yapılır');
    for (const [label, f] of [['PBIX', pbixFile], ['PBIT', pbitFile]]) {
      if (!f) { warn(s, `${label} yok, karşılaştırma atlandı`); continue; }
      const o = await analyzePath(path.join(ctx.orig, f));
      const all = same(measureSet(o.res), measureSet(pbip.res)), cand = same(measureSet(o.res, n => core.CANDIDATE(n.status)), measureSet(pbip.res, n => core.CANDIDATE(n.status)));
      all && cand ? note(s, `✓ ${label} ile aynı sonuç (${measureSet(o.res).size} measure, ${measureSet(o.res, n => core.CANDIDATE(n.status)).size} aday)`)
        : fail(s, `${label} sonucu farklı: measure ${measureSet(o.res).size}/${measureSet(pbip.res).size}, aday ${measureSet(o.res, n => core.CANDIDATE(n.status)).size}/${measureSet(pbip.res, n => core.CANDIDATE(n.status)).size}`);
    }
  }

  /* 2. MCP sunucusu: tarama ve temizlenmiş kopyalar */
  {
    const s = step('MCP sunucusu Windows\'ta: tarama ve temizlenmiş kopya (PBIP, PBIT)');
    mcp = new Client({ name: 'desktop-e2e-ek', version: '1.0.0' });
    await mcp.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(repo, 'mcp', 'server.mjs'), runDir], stderr: 'ignore' }));
    const tools = (await mcp.listTools()).tools.length; note(s, `${tools} araç listelendi`);
    const scan = await mcpCall('modeli_tara', { yollar: [ctx.orig] });
    /Kullanılmıyor gibi/.test(scan) ? note(s, `✓ modeli_tara Türkçe yolda çalıştı (${scan.split('\n')[0].slice(0, 120)})`) : fail(s, `modeli_tara beklenmeyen çıktı: ${scan.slice(0, 200)}`);
    try { await mcpCall('modeli_tara', { yollar: [src] }); fail(s, 'İzinli klasör dışı okunabildi'); } catch (e) { note(s, '✓ İzinli klasör dışı reddedildi'); }
    ctx.clean = path.join(runDir, 'temiz');
    const out = await mcpCall('temiz_kopya_olustur', { yol: ctx.orig, hedef: ctx.clean });
    /✗/.test(out) || !existsSync(ctx.clean) ? fail(s, `PBIP kopyası: ${out.slice(0, 400)}`) : note(s, `✓ PBIP kopyası yazıldı ve yapısal doğrulamadan geçti: ${(out.match(/Kaldırılan \/ removed \((\d+)\)/) || [])[1]} öğe`);
    ctx.removed = ((out.match(/Kaldırılan \/ removed \(\d+\): (.*)/) || [])[1] || '').split(', ').filter(Boolean);
    existsSync(path.join(ctx.clean, pbipFile.replace(/\.pbip$/i, '.SemanticModel'), '.pbi', 'cache.abf')) ? note(s, '✓ Kopyada veri önbelleği korundu') : warn(s, 'Kopyada veri önbelleği yok');
    try { await mcpCall('temiz_kopya_olustur', { yol: ctx.orig, hedef: ctx.clean }); fail(s, 'Var olan kopyanın üzerine yazıldı'); } catch (e) { note(s, '✓ Var olan klasörün üzerine yazmayı reddetti'); }
    if (pbitFile) {
      ctx.pbitClean = path.join(runDir, 'temiz.pbit');
      const o2 = await mcpCall('temiz_kopya_olustur', { yol: path.join(ctx.orig, pbitFile), hedef: ctx.pbitClean });
      /✗/.test(o2) || !existsSync(ctx.pbitClean) ? fail(s, `PBIT kopyası: ${o2.slice(0, 400)}`) : note(s, '✓ PBIT kopyası yazıldı ve yapısal doğrulamadan geçti');
    }
  }

  /* 3. Gerçek verili PBIP: aslı ölçülür, temizlenmiş kopya karşılaştırılır (MCP araçlarıyla) */
  const tables = ctx.res.tableItems.map(t => t.name);
  {
    const s = step('Desktop · gerçek verili PBIP: aslı ve temizlenmiş kopya, MCP ile ölç ve karşılaştır');
    let h = await openInDesktop(path.join(ctx.orig, pbipFile), tables, s);
    if (!h) throw new Error('Aslı Desktop\'ta açılmadı');
    try {
      const list = await mcpCall('desktop_listele', {}); list.includes(String(h.port)) ? note(s, '✓ desktop_listele açık Desktop\'ı buldu') : warn(s, 'desktop_listele portu göstermedi');
      const olc = await mcpCall('degerleri_olc', { yollar: [ctx.orig], port: h.port });
      ctx.olcum = (olc.match(/olcum-\d+/) || [])[0];
      note(s, olc.split('\n').slice(0, 2).join(' · '));
      ctx.baseMeasures = await engineMeasures(h.port);
    } finally { await closeDesktop(h); }
    h = await openInDesktop(path.join(ctx.clean, pbipFile), tables, s);
    if (!h) { fail(s, 'TEMİZLENMİŞ KOPYA DESKTOP\'TA AÇILMADI'); }
    else try {
      note(s, '✓ Temizlenmiş kopya veri yenilemeden açıldı');
      const eng = await engineMeasures(h.port);
      const gone = [...ctx.baseMeasures].filter(n => !eng.has(n));
      note(s, `Measure: asılda ${ctx.baseMeasures.size}, kopyada ${eng.size} (${gone.length} eksik: ${gone.slice(0, 8).join(', ')}${gone.length > 8 ? '…' : ''})`);
      const cmp = await mcpCall('degerleri_karsilastir', { olcum: ctx.olcum, port: h.port });
      cmp.startsWith('✓') ? note(s, cmp.split('\n')[0]) : fail(s, cmp.slice(0, 600));
    } finally { await closeDesktop(h); }
  }

  /* 4. Negatif test: kullanılan bir measure'ın formülü değiştirilir */
  {
    const s = step('Negatif test: kullanılan bir measure bilerek değiştirilir, karşılaştırma farkı yakalamalı');
    const bozuk = path.join(runDir, 'bozuk'); await fs.cp(ctx.clean, bozuk, { recursive: true });
    const used = ctx.res.items.filter(n => n.kind === 'measure' && n.origin === 'model' && n.status === 'used');
    const tdir = path.join(bozuk, pbipFile.replace(/\.pbip$/i, '.SemanticModel'), 'definition', 'tables');
    let changed = null;
    for (const f of await fs.readdir(tdir)) {
      const lines = (await fs.readFile(path.join(tdir, f), 'utf8')).split(/\r?\n/);
      for (let i = 0; i < lines.length && !changed; i++) {
        const m = lines[i].match(/^(\s*measure\s+)('(?:[^']|'')+'|[^\s=]+)(\s*=\s*)(\S.*)$/);
        if (!m) continue;
        const name = m[2].replace(/^'|'$/g, '').replace(/''/g, "'");
        const next = (lines[i + 1] || '').trim();
        if (!used.find(n => core.norm(n.name) === core.norm(name)) || (next && !/^[A-Za-z]+\s*:|^(annotation|changedProperty|formatString)\b/.test(next))) continue;
        lines[i] = `${m[1]}${m[2]}${m[3]}(${m[4]}) * 2 + 1`;
        await fs.writeFile(path.join(tdir, f), lines.join('\r\n'), 'utf8');
        changed = name;
      }
      if (changed) break;
    }
    if (!changed) { warn(s, 'Tek satırlık formüllü, kullanılan bir measure bulunamadı; atlandı'); }
    else {
      note(s, `Değiştirilen measure: ${changed} → (formül) * 2 + 1`);
      const h = await openInDesktop(path.join(bozuk, pbipFile), tables, s);
      if (!h) fail(s, 'Değiştirilmiş kopya açılmadı');
      else try {
        const cmp = await mcpCall('degerleri_karsilastir', { olcum: ctx.olcum, port: h.port });
        cmp.startsWith('✗') ? note(s, `✓ Fark yakalandı: ${cmp.split('\n')[0]} · ${cmp.split('\n')[1] || ''}`) : fail(s, `Fark yakalanmadı: ${cmp.split('\n')[0]}`);
      } finally { await closeDesktop(h); }
    }
  }

  /* 5. Temizlenmiş PBIT Desktop'ta açılır */
  if (ctx.pbitClean) {
    const s = step('Desktop · temizlenmiş PBIT açılır');
    const h = await openInDesktop(ctx.pbitClean, tables, s, 8);
    if (!h) warn(s, 'PBIT 8 dakikada açılmadı. Şablon açılırken veri kaynağı ya da kimlik bilgisi sorulmuş olabilir; ekrana bak.');
    else try {
      const eng = await engineMeasures(h.port), left = ctx.removed.filter(r => eng.has(core.norm(r.replace(/^.*\[|\]$/g, ''))));
      left.length ? fail(s, `Kopyada duran silinmiş öğe: ${left.join(', ')}`) : note(s, `✓ Silinenler yok, ${eng.size} measure var`);
    } finally { await closeDesktop(h); }
  }
} catch (e) { const s = step('Beklenmeyen hata'); fail(s, e.stack || e.message); }
finally { if (mcp) await mcp.close().catch(() => {}); }

/* 6. Yerel web sunucusu */
{
  const s = step('npm run web: yerel sunucu');
  const port = 8099, p = spawn(process.execPath, [path.join(repo, 'tools', 'serve.mjs'), String(port)], { stdio: 'ignore', windowsHide: true });
  try {
    await sleep(2500);
    for (const u of ['/', '/js/core.js', '/js/xpress9.js', '/fonts/fonts.css', '/olmayan-sayfa']) {
      const r = await fetch(`http://127.0.0.1:${port}${u}`);
      note(s, `${r.status} ${u}`);
      if ((u === '/olmayan-sayfa') !== (r.status === 404)) fail(s, `Beklenmeyen durum kodu: ${u}`);
    }
  } catch (e) { fail(s, e.message); }
  finally { p.kill(); }
}

/* 7. Oturum açılışı görevi: kur, denetle, kaldır */
if (WIN) {
  const s = step('Oturum açılışı görevi (desktop-e2e-kur.ps1): kur ve kaldır');
  const kur = path.join(repo, 'tools', 'desktop-e2e-kur.ps1');
  const runKur = extra => new Promise(res => execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', kur, ...extra], { windowsHide: true }, (e, out, err) => res(String(out || '') + String(err || ''))));
  const kurOut = await runKur([]);
  const t = await ps("$t = Get-ScheduledTask -TaskName 'MeasureSieve-DesktopTest' -ErrorAction SilentlyContinue; if ($t) { \"$($t.State)|$($t.Triggers[0].CimClass.CimClassName)|$($t.Triggers[0].Delay)|$($t.Actions[0].Arguments)\" }");
  t ? note(s, `✓ Görev kuruldu: ${t}`) : fail(s, `Görev kurulamadı: ${kurOut.trim().slice(0, 300)}`);
  /--once/.test(t) ? note(s, '✓ Görev bitince kendini silecek (--once)') : warn(s, '--once bayrağı görülmedi');
  await runKur(['-Kaldir']);
  const gone = await ps("if (Get-ScheduledTask -TaskName 'MeasureSieve-DesktopTest' -ErrorAction SilentlyContinue) { 'var' } else { 'yok' }");
  gone === 'yok' ? note(s, '✓ -Kaldir ile görev silindi') : fail(s, 'Görev silinemedi');
}

/* ---------------------------------------------------------------- Rapor */
const icon = { 'geçti': '✅', 'uyarı': '⚠️', 'kaldı': '❌', 'atlandı': '⏭️' };
const total = st => steps.filter(x => x.status === st).length;
const md = ['# Measure Sieve · Desktop ek testleri', '', `Tarih: ${new Date().toLocaleString('tr-TR')}  `, `Klasör: \`${runDir}\``, '',
  `**Özet:** ${total('geçti')} geçti · ${total('uyarı')} uyarı · ${total('kaldı')} kaldı`, '',
  ...steps.flatMap(x => [`## ${icon[x.status]} ${x.title}`, '', ...x.notes.map(n => `- ${n.replace(/\n/g, ' ')}`), ''])].join('\n');
await fs.writeFile(path.join(runDir, 'rapor.md'), md, 'utf8');
await fs.writeFile(path.join(runDir, 'gunluk.txt'), logText, 'utf8');
await fs.writeFile(path.join(root, 'son-ek-rapor.md'), md, 'utf8');
log(`Rapor: ${path.join(runDir, 'rapor.md')}`);
process.exit(steps.some(x => x.status === 'kaldı') ? 1 : 0);
