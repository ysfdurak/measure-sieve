#!/usr/bin/env node
// Ölçü Eleği MCP sunucusu (stdio, salt okunur)
// Web sürümüyle aynı çekirdeği (web/js/core.js) kullanır: aynı dosya, aynı sonuç.
// Yalnızca izin verilen klasörlerin altındaki dosyaları okur; hiçbir dosyaya yazmaz, ağa çıkmaz.
//
// Kullanım:  node server.mjs <izinli klasör> [<izinli klasör> ...]
// Klasör verilmezse kullanıcının ev klasörü kullanılır.
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { analyzePaths } from './files.mjs';
import { removalPlan, teScript, CANDIDATE, nodeLabel, norm } from '../web/js/core.js';
import { makeT, reasonText, noteText, usageText } from '../web/js/i18n.js';

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const ROOTS = (args.length ? args : [os.homedir()]).map(r => path.resolve(r));

async function checkPath(p) {
  const abs = path.resolve(p);
  let real; try { real = await fs.realpath(abs); } catch (e) { throw new Error(`Yol bulunamadı / path not found: ${abs}`); }
  const ok = ROOTS.some(r => real === r || real.startsWith(r.endsWith(path.sep) ? r : r + path.sep));
  if (!ok) throw new Error(`Bu yol izinli klasörlerin dışında / outside allowed folders: ${real}. İzinli / allowed: ${ROOTS.join(', ')}`);
  return real;
}

// Aynı dosya tekrar tekrar sorulduğunda yeniden okumamak için küçük bir önbellek
const cache = new Map();
async function load(paths) {
  const real = []; for (const p of paths) real.push(await checkPath(p));
  const stamp = (await Promise.all(real.map(async r => { const s = await fs.stat(r); return r + ':' + s.mtimeMs; }))).join('|');
  if (cache.has(stamp)) return cache.get(stamp);
  const r = await analyzePaths(real);
  cache.set(stamp, r); if (cache.size > 8) cache.delete(cache.keys().next().value);
  return r;
}
function pickProject(r, model) {
  if (!r.results.length) return null;
  if (model) { const m = r.results.find(x => norm(x.label) === norm(model)); if (m) return m; }
  return r.results.find(x => x.hasModel && x.hasReport) || r.results[0];
}
const text = s => ({ content: [{ type: 'text', text: s }] });
const LANG = z.enum(['tr', 'en']).optional().describe('Yanıt dili / answer language (tr varsayılan)');
const PATHS = z.array(z.string()).min(1).describe('PBIT/PBIX/ZIP dosyası, PBIP klasörü, model.bim veya .tmdl yolları. Aynı modele bağlı birden çok rapor verilebilir.');

function errorNotes(t, r) {
  return [...r.errors.map(e => noteText(t, { code: e.error, err: true, args: { name: e.label } })), ...r.notes.map(n => noteText(t, n))]
    .map(n => `! ${n.title}: ${n.text}`);
}
function summary(t, x) {
  const c = k => { const o = {}; x.items.filter(n => n.kind === k).forEach(n => { o[n.status] = (o[n.status] || 0) + 1; }); return o; };
  const fmt = o => Object.entries(o).map(([s, n]) => `${t('st.' + s)}: ${n}`).join(', ') || '-';
  const tc = {}; x.tableItems.forEach(tb => { tc[tb.status] = (tc[tb.status] || 0) + 1; });
  return [`## ${x.label}`,
    `${t('tab.measure')}: ${fmt(c('measure'))}`, `${t('tab.column')}: ${fmt(c('column'))}`, `${t('tab.table')}: ${fmt(tc)}`,
    `Rapor / reports: ${x.reports.map(r => `${r.name} (${r.pages}p, ${r.visuals}v)`).join(', ') || '-'}`];
}

const server = new McpServer({ name: 'olcu-elegi', version: '1.0.0' }, {
  instructions: 'Ölçü Eleği, Power BI modelinde kullanılmayan ölçü, sütun ve tabloları bulur. Önce modeli_tara ile özet al, gerekirse oge_detayi ile tek bir öğeye bak, silme_plani ile güvenli silme sırasını ve Tabular Editor betiğini üret. Sunucu yalnızca okur; silme işlemini kullanıcı kendisi yapar. Sonuçları "kullanılmıyor gibi görünüyor" diye aktar; yüklenmeyen raporlar ve Excel bağlantıları görülemez. PBIX dosyalarında ölçü listesi okunamaz, PBIT veya PBIP iste.'
});

server.registerTool('modeli_tara', {
  title: 'Modeli tara',
  description: 'Power BI modelini ve raporlarını tarar; kullanılmayan gibi görünen ölçü, sütun ve tabloları nedenleriyle listeler. Aynı formüllü ölçüleri ve raporda olup modelde olmayan alanları da bildirir.',
  inputSchema: { yollar: PATHS, model: z.string().optional().describe('Klasörde birden çok model varsa hangisi (ör. Model01)'), dil: LANG, tumu: z.boolean().optional().describe('true: kullanılan öğeleri de listele') },
  annotations: { readOnlyHint: true, openWorldHint: false }
}, async ({ yollar, model, dil, tumu }) => {
  const t = makeT(dil || 'tr'), r = await load(yollar), out = errorNotes(t, r);
  if (!r.results.length) return text(out.join('\n') || 'Okunabilir model veya rapor bulunamadı.');
  if (r.results.length > 1) out.push(`Modeller / models: ${r.results.map(x => x.label).join(', ')}`);
  const x = pickProject(r, model);
  out.push(...summary(t, x));
  x.notes.forEach(n => { const k = noteText(t, n); out.push(`! ${k.title}: ${k.text}`); });
  if (!x.hasModel && x.binary) { const k = noteText(t, { code: 'binary' }); out.push(`! ${k.title}: ${k.text}`); }
  if (!x.hasReport && x.hasModel) { const k = noteText(t, { code: 'noReport' }); out.push(`! ${k.title}: ${k.text}`); }
  const show = n => tumu || n.status !== 'used' && n.status !== 'indirect';
  ['measure', 'column'].forEach(k => {
    const rows = x.items.filter(n => n.kind === k && show(n));
    if (!rows.length) return;
    out.push('', `### ${t('tab.' + k)}`);
    rows.sort((a, b) => ['unused', 'chain', 'review', 'unknown', 'indirect', 'used'].indexOf(a.status) - ['unused', 'chain', 'review', 'unknown', 'indirect', 'used'].indexOf(b.status))
      .forEach(n => out.push(`- [${t('st.' + n.status)}] ${nodeLabel(n)}${n.hidden ? ' (' + t('tag.hidden') + ')' : ''} — ${reasonText(t, n.reason)}`));
  });
  const tbl = x.tableItems.filter(show);
  if (tbl.length) { out.push('', `### ${t('tab.table')}`); tbl.forEach(tb => out.push(`- [${t('st.' + tb.status)}] '${tb.name}' — ${reasonText(t, tb.reason)}`)); }
  if (x.duplicates.length) { out.push('', `### ${t('dup.title', { n: x.duplicates.length })}`); x.duplicates.forEach(g => out.push('- ' + g.map(i => x.nodes[i].name).join(' = '))); }
  if (x.missing.length) { out.push('', `### ${t('miss.title', { n: x.missing.length })}`); x.missing.forEach(m => out.push(`- ${m.type === 'measure' ? '[' + m.name + ']' : m.table + '[' + m.name + ']'}`)); }
  if (x.autoDate) out.push('', `${t('auto.title', { n: x.autoDate })}. ${t('auto.text')}`);
  return text(out.join('\n'));
});

server.registerTool('oge_detayi', {
  title: 'Öğe detayı',
  description: 'Tek bir ölçü, sütun ya da tablonun formülünü, raporda nerelerde kullanıldığını, onu kullanan ve onun kullandığı öğeleri gösterir.',
  inputSchema: { yollar: PATHS, ad: z.string().describe('Öğe adı: "Toplam Satış", "Satış[Tutar]" ya da tablo adı'), model: z.string().optional(), dil: LANG },
  annotations: { readOnlyHint: true, openWorldHint: false }
}, async ({ yollar, ad, model, dil }) => {
  const t = makeT(dil || 'tr'), r = await load(yollar), x = pickProject(r, model);
  if (!x) return text(errorNotes(t, r).join('\n') || 'Model bulunamadı.');
  const m = /^'?(.*?)'?\[(.+)\]$/.exec(ad.trim());
  const tbName = m ? m[1] : null, nm = m ? m[2] : ad.trim().replace(/^\[|\]$/g, '');
  let n = x.items.find(i => norm(i.name) === norm(nm) && (!tbName || norm(i.table) === norm(tbName)) && (tbName || i.kind === 'measure'))
    || x.items.find(i => norm(i.name) === norm(nm) && (!tbName || norm(i.table) === norm(tbName)));
  const tb = !n && x.tableItems.find(i => norm(i.name) === norm(nm));
  if (tb) {
    const lines = [`'${tb.name}' — [${t('st.' + tb.status)}] ${reasonText(t, tb.reason)}`];
    tb.nodes.map(i => x.nodes[i]).forEach(c => lines.push(`- ${t('kind.' + c.kind)} ${c.name}: [${t('st.' + c.status)}] ${reasonText(t, c.reason)}`));
    return text(lines.join('\n'));
  }
  if (!n) return text(`"${ad}" bulunamadı / not found.`);
  const multi = x.reports.length > 1, lines = [`${nodeLabel(n)} (${t('kind.' + n.kind)}) — [${t('st.' + n.status)}] ${reasonText(t, n.reason)}`];
  if (n.expr) lines.push('', `${t('d.formula')}:`, '```dax', n.expr, '```');
  if (n.usages.length || n.structural.length) {
    lines.push('', `${t('d.where')}:`);
    n.usages.forEach(u => { const s = usageText(t, u, multi); lines.push(`- ${s.place} · ${s.extra}`); });
    n.structural.forEach(s => lines.push(`- ${s.label} · ${t('what.' + s.what)}`));
  }
  if (n.usedBy.size) lines.push('', `${t('d.usedBy')}: ${[...n.usedBy].map(i => nodeLabel(x.nodes[i])).join(', ')}`);
  if (n.uses.size) lines.push(`${t('d.uses')}: ${[...n.uses].map(i => nodeLabel(x.nodes[i])).join(', ')}`);
  if (n.duplicates.length) lines.push(`${t('d.dups')}: ${n.duplicates.map(i => x.nodes[i].name).join(', ')}`);
  return text(lines.join('\n'));
});

server.registerTool('silme_plani', {
  title: 'Silme planı',
  description: 'Seçilen öğeler (verilmezse tüm silme adayları) için güvenli silme sırasını, etkilerini, Tabular Editor C# betiğini ve Power Query adımını üretir. Hiçbir şeyi silmez.',
  inputSchema: {
    yollar: PATHS, model: z.string().optional(), dil: LANG,
    ogeler: z.array(z.string()).optional().describe('Silinecek öğeler: "Ölçü adı", "Tablo[Sütun]" ya da "\'Tablo\'". Boşsa adaylar kullanılır.'),
    kapsam: z.array(z.enum(['olcu', 'sutun', 'tablo'])).optional().describe('ogeler boşsa hangi türlerin adayları alınsın (varsayılan: olcu)')
  },
  annotations: { readOnlyHint: true, openWorldHint: false }
}, async ({ yollar, model, dil, ogeler, kapsam }) => {
  const t = makeT(dil || 'tr'), r = await load(yollar), x = pickProject(r, model);
  if (!x || !x.hasModel) return text('Silme planı için model gerekir (PBIT veya PBIP). / A model is needed (PBIT or PBIP).');
  const sel = [], notFound = [];
  if (ogeler && ogeler.length) {
    ogeler.forEach(raw => {
      const s = raw.trim(), tq = /^'(.+)'$/.exec(s), m = /^'?(.*?)'?\[(.+)\]$/.exec(s);
      if (tq) { const tb = x.tableItems.find(i => norm(i.name) === norm(tq[1])); if (tb) sel.push({ kind: 'table', id: tb.id }); else notFound.push(s); return; }
      const n = x.items.find(i => m ? norm(i.table) === norm(m[1]) && norm(i.name) === norm(m[2]) : norm(i.name) === norm(s) && i.kind === 'measure');
      if (n) sel.push({ kind: 'node', id: n.id }); else notFound.push(s);
    });
  } else {
    const k = new Set(kapsam && kapsam.length ? kapsam : ['olcu']);
    if (k.has('tablo')) x.tableItems.filter(tb => CANDIDATE(tb.status)).forEach(tb => sel.push({ kind: 'table', id: tb.id }));
    x.items.filter(n => CANDIDATE(n.status) && n.origin !== 'reportOnly' && ((n.kind === 'measure' && k.has('olcu')) || (n.kind === 'column' && k.has('sutun')))).forEach(n => sel.push({ kind: 'node', id: n.id }));
  }
  if (!sel.length) return text('Silinecek öğe yok. / Nothing to remove.' + (notFound.length ? ` Bulunamayan: ${notFound.join(', ')}` : ''));
  const plan = removalPlan(x, sel), sc = teScript(x, plan, t);
  const lines = [`${t('panel.count', { n: plan.units.length })}`, ...plan.labels.map((l, i) => `${i + 1}. ${l}`)];
  if (notFound.length) lines.push('', `Bulunamayan / not found: ${notFound.join(', ')}`);
  const strip = s => s.replace(/<\/?b>/g, '');
  if (plan.warnings.length) {
    lines.push('', t('panel.warn') + ':');
    plan.warnings.forEach(w => lines.push('- ' + strip(w.code === 'breaks' ? t('w.breaks', { label: w.label, names: w.names.join(', ') }) : w.code === 'inReport' ? t('w.inReport', { label: w.label, n: w.n }) : t('w.structural', { label: w.label, what: t('what.' + w.what) }))));
  } else lines.push('', `${t('panel.safe')} ${t('panel.safeSub')}`);
  lines.push('', 'Tabular Editor (C# Script):', '```csharp', sc.script, '```');
  if (sc.powerQuery) lines.push('', 'Power Query:', '```powerquery', sc.powerQuery, '```');
  return text(lines.join('\n'));
});

if (process.argv.includes('--self-test')) {
  // Protokol denetimi tests/mcp.test.mjs içinde yapılır; burada yalnızca açılışı doğrularız.
  console.error('olcu-elegi-mcp: ok, roots=' + ROOTS.join(';'));
  process.exit(0);
}
await server.connect(new StdioServerTransport());
console.error('Ölçü Eleği MCP hazır. İzinli klasörler: ' + ROOTS.join(', '));
