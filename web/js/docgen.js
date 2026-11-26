// Measure Sieve · devir belgesi (Belgele modu)
// Markdown ve tek dosyalık, yazdırılabilir HTML üretir. DOM'a, ağa ya da dosya sistemine dokunmaz; web ve MCP aynı dosyayı kullanır.
// Güvenlik: modelden gelen her ad ve formül kaçışlanır. HTML'de betik yoktur ve sıkı bir CSP vardır
// (default-src 'none'); dosya açıldığında hiçbir şey çalışmaz, hiçbir yere bağlanmaz.

import { relationshipWarnings } from './lineage.js';
import { relationshipLayout, relationshipSvg, DIAGRAM_CSS } from './diagram.js';
import { sourceLabel, visualLabel, queryWhy, warningText, relText, pagesByReport } from './docview.js';
import { listNames } from './i18n.js';

const escH = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Markdown metni: biçim karakterleri ve HTML kaçışlanır; tek satıra indirilir. */
const md = s => String(s == null ? '' : s).replace(/\r?\n+/g, ' ').replace(/([\\`*_{}[\]<>|#!~])/g, '\\$1');
const fence = code => { const n = Math.max(3, ...[...String(code).matchAll(/`+/g)].map(m => m[0].length + 1)); const f = '`'.repeat(n); return `${f}\n${code}\n${f}`; };
const nodeText = n => (n.kind === 'column' ? `${n.table}[${n.name}]` : n.name);

/** Belgenin içeriği: hem Markdown hem HTML aynı yapıdan üretilir (ikisi tutarlı kalsın). */
export function handoverModel(t, R, L, EX, meta) {
  const tables = R.tables.filter(x => !x.system);
  const measures = R.nodes.filter(n => n.kind === 'measure' && n.origin === 'model');
  const visOf = new Map(); L.visuals.forEach(v => v.nodeIds.forEach(id => { if (!visOf.has(id)) visOf.set(id, []); visOf.get(id).push(v); }));
  const tablesFed = s => [...new Set(s.queries.map(i => L.queries[i]).flatMap(q => (q.table ? [q.table] : L.queries.filter(x => x.table && x.refs.includes(q.name)).map(x => x.table))))];
  const unusedM = measures.filter(n => n.status === 'unused' || n.status === 'chain').length;
  const unusedC = R.nodes.filter(n => n.kind === 'column' && n.origin === 'model' && !(n.tableId != null && R.tables[n.tableId].system) && (n.status === 'unused' || n.status === 'chain')).length;
  const watch = relationshipWarnings(R).map(w => warningText(t, R, w));
  if (R.hasReport && (unusedM || unusedC)) watch.push(t('hd.unused', { m: unusedM, c: unusedC }));
  if (R.duplicates.length) watch.push(t('hd.dups', { list: R.duplicates.map(g => g.map(i => R.nodes[i].name).join(' = ')).join('; ') }));
  if (R.missing.length) watch.push(t('hd.missing', { list: listNames(t, R.missing.map(m => (m.type === 'measure' ? m.name : `${m.table}[${m.name}]`)), 8) }));
  const byTable = new Map(); measures.forEach(n => { const k = n.table || ''; if (!byTable.has(k)) byTable.set(k, []); byTable.get(k).push(n); });
  return {
    meta, tables, measures, watch,
    summary: R.hasReport ? t('doc.head', { t: tables.length, m: measures.length, s: L.sources.length, v: L.visuals.filter(v => v.type !== 'pageFilter' && v.type !== 'reportFilter').length })
      : t('doc.headNoReport', { t: tables.length, m: measures.length, s: L.sources.length }),
    sources: L.sources.map(s => ({ ...sourceLabel(t, s), tables: tablesFed(s) })),
    params: L.params,
    otherQueries: [...L.queries.filter(q => q.table && !q.allSourceIds.length).map(q => ({ table: q.table, why: queryWhy(t, q) })),
      ...tables.filter(x => x.calculated && !(x.queries || []).length).map(x => ({ table: x.name, why: t('src.why.calc') }))],
    tableRows: tables.map(x => ({ name: x.name, cols: x.nodes.filter(id => R.nodes[id].kind === 'column').length, meas: x.nodes.filter(id => R.nodes[id].kind === 'measure').length,
      note: [x.calculated ? t('mdl.calc') : '', x.hidden ? t('mdl.hidden') : '', ...(x.queries || []).filter(q => q.mode && q.mode !== 'import').map(() => t('src.mode.directQuery')), x.description || ''].filter(Boolean).join(' · ') })),
    rels: (R.relationships || []).map(r => ({ text: relText(r), card: `${r.fromCard === 'one' ? '1' : '*'} : ${r.toCard === 'one' ? '1' : '*'}`, filter: t(r.crossFilter === 'both' ? 'hd.both' : 'hd.single'), state: t(r.active ? 'hd.active' : 'hd.inactive') })),
    measureGroups: [...byTable.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([table, list]) => ({ table, items: list.sort((a, b) => a.name.localeCompare(b.name)).map(n => {
      const e = EX.get(n.id), vs = visOf.get(n.id) || [];
      return { name: n.name, exp: e ? e.text : null, auto: !!(e && e.by === 'rule'), pages: [...new Set(vs.map(v => v.page))], expr: n.expr || '', hidden: n.hidden, folder: n.folder };
    }) })),
    pages: pagesByReport(L).map(p => ({ title: p.page, state: p.state, report: p.report, visuals: p.visuals.map(v => ({ label: visualLabel(t, v), fields: v.nodeIds.map(id => nodeText(R.nodes[id])) })) })),
    roles: (R.roles || []).map(r => ({ name: r.name, expr: r.expr })),
    diagram: relationshipSvg(relationshipLayout(R), { title: t('mdl.diagram'), cols: (c, m) => t('mdl.cols', { c, m }) })
  };
}

const metaRows = (t, m) => [[t('hd.file'), m.file], [t('hd.date'), m.date], m.by ? [t('hd.by'), m.by] : null, m.to ? [t('hd.to'), m.to] : null].filter(Boolean);

export function handoverMarkdown(t, R, L, EX, meta) {
  const H = handoverModel(t, R, L, EX, meta), o = [];
  o.push(`# ${md(t('hd.title'))}: ${md(meta.file)}`, '');
  o.push('| | |', '|---|---|', ...metaRows(t, meta).map(([k, v]) => `| ${md(k)} | ${md(v)} |`), '');
  o.push(`## ${md(t('hd.summary'))}`, '', md(H.summary), '');
  o.push(`## 1. ${md(t('hd.sources'))}`, '');
  if (H.sources.length) {
    o.push(`| ${md(t('src.th.type'))} | ${md(t('src.th.loc'))} | ${md(t('src.th.tables'))} |`, '|---|---|---|');
    H.sources.forEach(s => o.push(`| ${md(s.type)} | ${md(s.loc)}${s.extra ? ' (' + md(s.extra) + ')' : ''} | ${md(s.tables.join(', '))} |`));
    o.push('');
  }
  if (H.params.length) { o.push(`**${md(t('src.params'))}:** ` + H.params.map(p => `${md(p.name)} = ${p.value == null ? md(t('src.paramEmpty')) : '`' + String(p.value).replace(/`/g, "'") + '`'}`).join(' · '), ''); }
  if (H.otherQueries.length) { o.push(`**${md(t('src.other'))}:**`, '', ...H.otherQueries.map(q => `- ${md(q.table)}: ${md(q.why)}`), ''); }
  o.push(`## 2. ${md(t('hd.model'))}`, '');
  o.push(`| ${md(t('kind.table'))} | ${md(t('tab.column'))} | ${md(t('tab.measure'))} | |`, '|---|---:|---:|---|', ...H.tableRows.map(r => `| ${md(r.name)} | ${r.cols} | ${r.meas} | ${md(r.note)} |`), '');
  if (H.rels.length) {
    o.push(`### ${md(t('hd.rels'))}`, '', `| ${md(t('hd.th.rel'))} | ${md(t('hd.th.card'))} | ${md(t('hd.th.filter'))} | ${md(t('hd.th.state'))} |`, '|---|---|---|---|');
    H.rels.forEach(r => o.push(`| ${md(r.text)} | ${md(r.card)} | ${md(r.filter)} | ${md(r.state)} |`)); o.push('');
  }
  o.push(`## 3. ${md(t('hd.watch'))}`, '', ...(H.watch.length ? H.watch.map(w => `- ${md(w)}`) : [md(t('hd.noWatch'))]), '');
  o.push(`## 4. ${md(t('hd.measures'))}`, '');
  H.measureGroups.forEach(g => {
    o.push(`### ${md(g.table || '—')}`, '');
    g.items.forEach(m => {
      o.push(`**${md(m.name)}**${m.exp ? ' — ' + md(m.exp) + (m.auto ? ` _(${md(t('hd.auto'))})_` : '') : ` — _${md(t('hd.noExp'))}_`}`, '');
      o.push(`${md(t('hd.usedIn'))}: ${m.pages.length ? md(m.pages.join(', ')) : '_' + md(t('hd.notUsed')) + '_'}`, '');
      if (m.expr) o.push(fence(m.expr), '');
    });
  });
  if (H.pages.length) {
    o.push(`## 5. ${md(t('hd.pages'))}`, '');
    H.pages.forEach(p => {
      o.push(`### ${md(p.title)}${p.state && p.state !== 'normal' ? ` _(${md(t('pg.' + p.state))})_` : ''}`, '');
      p.visuals.forEach(v => o.push(`- **${md(v.label)}**: ${md(v.fields.join(', '))}`)); o.push('');
    });
  }
  if (H.roles.length) {
    o.push(`## ${H.pages.length ? 6 : 5}. ${md(t('hd.roles'))}`, '');
    H.roles.forEach(r => o.push(`**${md(r.name)}**`, '', fence(r.expr), ''));
  }
  o.push('---', '', md(t('hd.footer', { date: meta.date })), '');
  return o.join('\n');
}

export function handoverHtml(t, R, L, EX, meta, lang = 'tr') {
  const H = handoverModel(t, R, L, EX, meta), e = escH;
  const sec = (id, title, body) => `<section id="${id}"><h2>${e(title)}</h2>${body}</section>`;
  const table = (head, rows, cls = '') => `<table class="${cls}"><thead><tr>${head.map(h => `<th>${e(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const n = { i: 0 }; const num = () => ++n.i;
  const parts = [];
  parts.push(sec('ozet', t('hd.summary'), `<p>${e(H.summary)}</p>`));
  parts.push(sec('kaynaklar', `${num()}. ${t('hd.sources')}`,
    (H.sources.length ? table([t('src.th.type'), t('src.th.loc'), t('src.th.tables')], H.sources.map(s => [e(s.type), `<code>${e(s.loc)}</code>${s.extra ? `<br><small>${e(s.extra)}</small>` : ''}`, e(s.tables.join(', '))])) : '')
    + (H.params.length ? `<p><b>${e(t('src.params'))}:</b> ${H.params.map(p => `${e(p.name)} = ${p.value == null ? `<i>${e(t('src.paramEmpty'))}</i>` : `<code>${e(p.value)}</code>`}`).join(' · ')}</p>` : '')
    + (H.otherQueries.length ? `<p><b>${e(t('src.other'))}:</b></p><ul>${H.otherQueries.map(q => `<li><b>${e(q.table)}</b>: ${e(q.why)}</li>`).join('')}</ul>` : '')));
  parts.push(sec('model', `${num()}. ${t('hd.model')}`,
    (H.diagram ? `<figure class="diagram">${H.diagram}<figcaption>${e(t('mdl.legend'))}</figcaption></figure>` : '')
    + table([t('kind.table'), t('tab.column'), t('tab.measure'), ''], H.tableRows.map(r => [e(r.name), `<span class="num">${r.cols}</span>`, `<span class="num">${r.meas}</span>`, e(r.note)]))
    + (H.rels.length ? `<h3>${e(t('hd.rels'))}</h3>` + table([t('hd.th.rel'), t('hd.th.card'), t('hd.th.filter'), t('hd.th.state')], H.rels.map(r => [e(r.text), e(r.card), e(r.filter), e(r.state)])) : '')));
  parts.push(sec('dikkat', `${num()}. ${t('hd.watch')}`, H.watch.length ? `<ul class="watch">${H.watch.map(w => `<li>${e(w)}</li>`).join('')}</ul>` : `<p>${e(t('hd.noWatch'))}</p>`));
  parts.push(sec('measurelar', `${num()}. ${t('hd.measures')}`, H.measureGroups.map(g => `<h3>${e(g.table || '—')}</h3>` + g.items.map(m => `<div class="measure">
      <p><b>${e(m.name)}</b>${m.exp ? ` — ${e(m.exp)}${m.auto ? ` <span class="auto">${e(t('hd.auto'))}</span>` : ''}` : ` — <i>${e(t('hd.noExp'))}</i>`}</p>
      <p class="muted">${e(t('hd.usedIn'))}: ${m.pages.length ? e(m.pages.join(', ')) : `<i>${e(t('hd.notUsed'))}</i>`}</p>
      ${m.expr ? `<pre>${e(m.expr)}</pre>` : ''}</div>`).join('')).join('')));
  if (H.pages.length) parts.push(sec('sayfalar', `${num()}. ${t('hd.pages')}`, H.pages.map(p => `<h3>${e(p.title)}${p.state && p.state !== 'normal' ? ` <small>(${e(t('pg.' + p.state))})</small>` : ''}</h3><ul>${p.visuals.map(v => `<li><b>${e(v.label)}</b>: ${e(v.fields.join(', '))}</li>`).join('')}</ul>`).join('')));
  if (H.roles.length) parts.push(sec('roller', `${num()}. ${t('hd.roles')}`, H.roles.map(r => `<p><b>${e(r.name)}</b></p><pre>${e(r.expr)}</pre>`).join('')));
  const toc = `<nav class="toc"><b>${e(t('hd.toc'))}</b><ol>${parts.slice(1).map(p => { const m = /<section id="([^"]+)"><h2>([^<]*)<\/h2>/.exec(p); return m ? `<li><a href="#${m[1]}">${m[2].replace(/^\d+\.\s*/, '')}</a></li>` : ''; }).join('')}</ol></nav>`;
  return `<!doctype html>
<html lang="${e(lang)}"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(t('hd.title'))}: ${e(meta.file)}</title>
<style>
body{font:15px/1.55 "Segoe UI",system-ui,sans-serif;color:#14262f;max-width:920px;margin:0 auto;padding:32px 24px 48px}
h1{font-size:26px;margin:0 0 12px}h2{font-size:20px;margin:32px 0 10px;padding-top:8px;border-top:2px solid #0b6478}h3{font-size:16px;margin:20px 0 6px}
table{border-collapse:collapse;width:100%;margin:8px 0 12px;font-size:14px}th,td{border:1px solid #cad6dc;padding:6px 8px;text-align:left;vertical-align:top}th{background:#edf2f4}
.meta td:first-child{width:160px;color:#526771}.num{font-variant-numeric:tabular-nums}code{font:13px Consolas,monospace;word-break:break-all}
pre{font:12.5px/1.45 Consolas,monospace;background:#f3f7f8;border:1px solid #e2eaee;padding:8px 10px;white-space:pre-wrap;word-break:break-word;margin:4px 0 10px}
.measure{break-inside:avoid;margin-bottom:6px}.measure p{margin:4px 0}.muted{color:#526771;font-size:13.5px}
.auto{font-size:11.5px;color:#526771;border:1px solid #cad6dc;border-radius:3px;padding:0 5px;margin-left:4px}
.watch li{margin-bottom:4px}.toc{background:#edf2f4;padding:10px 16px;margin:12px 0}.toc ol{margin:4px 0 0}
figure{margin:8px 0 16px;overflow-x:auto}figcaption{font-size:13px;color:#526771}footer{margin-top:36px;font-size:12.5px;color:#526771}
${DIAGRAM_CSS}
@media print{body{padding:0;max-width:none}h2{break-after:avoid}.toc{display:none}a{color:inherit;text-decoration:none}}
</style></head><body>
<h1>${e(t('hd.title'))}: ${e(meta.file)}</h1>
<table class="meta"><tbody>${metaRows(t, meta).map(([k, v]) => `<tr><td>${e(k)}</td><td>${e(v)}</td></tr>`).join('')}</tbody></table>
${toc}
${parts.join('\n')}
<footer>${e(t('hd.footer', { date: meta.date }))}</footer>
</body></html>`;
}
