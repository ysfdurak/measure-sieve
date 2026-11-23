// Measure Sieve · sayısal doğrulama (Power BI Desktop)
// Temizlikten önce ve sonra rapordaki görsellerin değerlerini açık Power BI Desktop'a hesaplatıp karşılaştırır.
// Yalnızca Windows'ta ve Power BI Desktop açıkken çalışır. Yalnızca EVALUATE sorguları gönderilir; model değişmez.
//
// Yöntem: her görselin alanlarından (sütunlar + measure'lar) bir DAX sorgusu kurulur:
//   EVALUATE TOPN(500, SUMMARIZECOLUMNS('T'[a], 'T'[b], "m1", [M1]), 'T'[a], 1, 'T'[b], 1) ORDER BY 'T'[a], 'T'[b]
// ve her measure için toplam değer:  EVALUATE ROW("v", [M1])
// Görsel ve sayfa filtreleri uygulanmaz; amaç birebir rapor değil, önce/sonra karşılaştırmasıdır.
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { norm } from '../web/js/core.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const qt = s => "'" + String(s).replace(/'/g, "''") + "'";
const br = s => '[' + String(s).replace(/]/g, ']]') + ']';
const col = n => qt(n.table) + br(n.name);
const dstr = s => '"' + String(s).replace(/"/g, '""') + '"';

/** Analiz sonucundan sorgu listesi üretir. Dönüş: [{ id, label, dax }] */
export function buildQueries(res) {
  const visuals = new Map();
  res.items.forEach(n => n.usages.forEach(u => {
    if (u.kind !== 'field' || !u.visual || typeof u.visual === 'string') return;
    const k = [u.report, u.page, JSON.stringify(u.visual)].join('|');
    if (!visuals.has(k)) visuals.set(k, { label: [u.report, u.page, u.visual.title || u.visual.type].filter(Boolean).join(' › '), cols: [], meas: [] });
    const v = visuals.get(k);
    if (n.kind === 'column' && !v.cols.includes(n)) v.cols.push(n);
    if (n.kind === 'measure' && n.expr != null && !v.meas.includes(n)) v.meas.push(n);
  }));
  const qs = [];
  let i = 0;
  visuals.forEach(v => {
    i++;
    if (!v.cols.length && !v.meas.length) return;
    const ms = v.meas.map((m, j) => `${dstr('m' + (j + 1))}, ${br(m.name)}`);
    let dax;
    if (!v.cols.length) dax = `EVALUATE ROW(${ms.join(', ')})`;
    else {
      const cs = v.cols.map(col);
      const inner = `SUMMARIZECOLUMNS(${[...cs, ...ms].join(', ')})`;
      dax = `EVALUATE TOPN(500, ${inner}, ${cs.map(c => c + ', 1').join(', ')}) ORDER BY ${cs.join(', ')}`;
    }
    qs.push({ id: 'v' + i, label: v.label, dax });
  });
  // Her kullanılan measure'ın toplamı (görsel kurulamayan durumlar için ek güvence)
  res.items.filter(n => n.kind === 'measure' && n.expr != null && (n.status === 'used' || n.status === 'indirect')).forEach((m, j) => {
    qs.push({ id: 't' + j, label: `[${m.name}]`, dax: `EVALUATE ROW("v", ${br(m.name)})` });
  });
  return qs;
}

/** PowerShell köprüsünü çalıştırır. Veri UTF-8 geçici dosyalarla taşınır. */
export async function runQueries(port, queries, { timeoutMs = 300000 } = {}) {
  const j = await runPs('desktop.ps1', { port, queries: queries.map(q => ({ id: q.id, dax: q.dax })) }, timeoutMs);
  return j.results;
}

/** Yalnızca otomatik test için: açık Desktop'ın bellekteki modelinden measure siler (kaydetmez). */
export async function deleteMeasuresInDesktop(port, measures, { timeoutMs = 120000 } = {}) {
  return runPs('desktop-tom.ps1', { port, deleteMeasures: measures }, timeoutMs);
}

async function runPs(script, payload, timeoutMs) {
  if (process.platform !== 'win32' && !process.env.MEASURE_SIEVE_MOCK) throw new Error('windowsOnly');
  const shell = process.env.MEASURE_SIEVE_PWSH || (process.platform === 'win32' ? 'powershell.exe' : 'pwsh');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'measure-sieve-q-'));
  const inFile = path.join(dir, 'in.json'), outFile = path.join(dir, 'out.json');
  await fs.writeFile(inFile, JSON.stringify(payload), 'utf8');
  try {
    const err = await new Promise((resolve, reject) => {
      const ps = spawn(shell, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', path.join(here, script), '-InFile', inFile, '-OutFile', outFile], { windowsHide: true });
      let e = '';
      const timer = setTimeout(() => { ps.kill(); reject(new Error('timeout')); }, timeoutMs);
      ps.stdout.on('data', d => { e += d; }); ps.stderr.on('data', d => { e += d; });
      ps.on('error', x => { clearTimeout(timer); reject(x); });
      ps.on('close', () => { clearTimeout(timer); resolve(e); });
    });
    let txt;
    try { txt = await fs.readFile(outFile, 'utf8'); } catch (e) { throw new Error('bridge: ' + String(err).slice(0, 600)); }
    const j = JSON.parse(txt.replace(/^\uFEFF/, ''));
    if (!j.ok) throw new Error(j.error);
    return j;
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
}

/** Açık Power BI Desktop pencerelerinin motor portlarını bulur. */
export async function findDesktopPorts() {
  const roots = [
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Power BI Desktop', 'AnalysisServicesWorkspaces'),
    path.join(os.homedir(), 'Microsoft', 'Power BI Desktop Store App', 'AnalysisServicesWorkspaces')
  ].filter(Boolean);
  const out = [];
  for (const r of roots) {
    let dirs = []; try { dirs = await fs.readdir(r); } catch (e) { continue; }
    for (const d of dirs) {
      const f = path.join(r, d, 'Data', 'msmdsrv.port.txt');
      try {
        const b = await fs.readFile(f), st = await fs.stat(f);
        const txt = (b[1] === 0 ? b.toString('utf16le') : b.toString('utf8')).replace(/[^\d]/g, '');
        if (txt) out.push({ port: +txt, workspace: d, started: st.mtime.toISOString() });
      } catch (e) { /* bu çalışma alanı kapalı */ }
    }
  }
  return out.sort((a, b) => b.started.localeCompare(a.started));
}

/** Modeldeki tablo adlarına en çok benzeyen açık Desktop'ı seçer. */
export async function pickPort(res, ports) {
  const names = new Set(res.tableItems.map(t => norm(t.name)));
  let best = null;
  for (const p of ports) {
    try {
      const [r] = await runQueries(p.port, [{ id: 'info', dax: 'EVALUATE SELECTCOLUMNS(INFO.TABLES(), "n", [Name])' }], { timeoutMs: 30000 });
      if (r.error) continue;
      const got = new Set(r.rows.map(x => norm(x[0])));
      const score = [...names].filter(n => got.has(n)).length / Math.max(1, names.size);
      if (!best || score > best.score) best = { ...p, score };
    } catch (e) { /* bu port yanıt vermedi */ }
  }
  // INFO.TABLES() eski Desktop sürümlerinde yoktur: tek bir Desktop açıksa onu kullan
  if (!best && ports.length === 1) best = { ...ports[0], score: null };
  return best;
}

const same = (a, b) => {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  return false;
};
/** İki ölçümü karşılaştırır. Dönüş: { ok, compared, differences: [{label, why}] } */
export function compareSnapshots(before, after) {
  const A = new Map(after.results.map(r => [r.id, r]));
  const diffs = []; let compared = 0;
  before.results.forEach(b => {
    const q = before.queries.find(x => x.id === b.id), a = A.get(b.id), label = q ? q.label : b.id;
    if (b.error) return; // önceden de çalışmayan sorgu karşılaştırılmaz
    compared++;
    if (!a) return diffs.push({ label, why: 'missing' });
    if (a.error) return diffs.push({ label, why: 'error', detail: a.error });
    if (a.rows.length !== b.rows.length) return diffs.push({ label, why: 'rowCount', detail: `${b.rows.length} → ${a.rows.length}` });
    for (let i = 0; i < b.rows.length; i++) {
      for (let j = 0; j < b.rows[i].length; j++) {
        if (!same(b.rows[i][j], a.rows[i][j])) return diffs.push({ label, why: 'value', detail: `${JSON.stringify(b.rows[i][j])} → ${JSON.stringify(a.rows[i][j])}` });
      }
    }
  });
  return { ok: !diffs.length, compared, differences: diffs };
}

/** Ölçümü diske kaydeder (oturumlar arası karşılaştırma için). */
export async function saveSnapshot(snap) {
  const dir = path.join(os.tmpdir(), 'measure-sieve');
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `olcum-${Date.now()}.json`);
  await fs.writeFile(file, JSON.stringify(snap));
  return file;
}
export async function loadSnapshot(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
