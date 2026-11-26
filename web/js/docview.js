// Measure Sieve · Belgele görünümü (tarayıcı)
// Yalnızca HTML metni üretir; olayları app.js bağlar. Hesap yapmaz: soyağacı lineage.js'de, açıklama explain.js'de.
// Modelden gelen HER ad ve formül esc() ile kaçışlanır (dosya içeriğine güvenilmez).

import { traceUp, traceDown, relationshipWarnings } from './lineage.js';
import { relationshipLayout, relationshipSvg } from './diagram.js';
import { visualName } from './i18n.js';
import { norm } from './core.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CAP = 24;

export const DOC_TABS = ['lineage', 'sources', 'model', 'measures', 'pages'];

/* ---------------------------------------------------------------- Ortak etiketler */

export function sourceLabel(t, s) {
  const loc = s.location != null && s.location !== '' ? s.location : (s.param ? '{' + s.param + '}' : t('src.noLoc'));
  return { type: t('src.type.' + s.type), loc, extra: [s.database ? t('src.db', { d: s.database }) : '', s.param && s.location != null ? t('src.param', { p: s.param }) : ''].filter(Boolean).join(' · ') };
}
export function visualLabel(t, v) {
  if (v.type === 'pageFilter') return t('v.pageFilter');
  if (v.type === 'reportFilter') return t('v.reportFilter');
  return v.title ? `${v.title} (${visualName(t, v.type)})` : visualName(t, v.type);
}
const nodeText = n => (n.kind === 'column' ? `${n.table}[${n.name}]` : n.name);
export const relText = r => `${r.fromTable}[${r.fromColumn}] → ${r.toTable}[${r.toColumn}]`;

/** Kaynağı görünmeyen sorgu için kısa açıklama. */
export function queryWhy(t, q) {
  if (q.isFunction) return t('src.why.fn');
  const parts = [];
  if (q.refs.length) parts.push(t('src.why.refs', { names: q.refs.join(', ') }));
  if (q.external && q.external.length) parts.push(t('src.why.external', { names: q.external.join(', ') }));
  if (q.params.length) parts.push(t('src.why.params', { names: q.params.join(', ') }));
  if (q.unknown.length) parts.push(t('src.why.unknown', { names: q.unknown.join(', ') }));
  return parts.length ? parts.join(' · ') : t('src.why.generated');
}

/* ---------------------------------------------------------------- Üst kısım */

export function docHeadHtml(t, R, L) {
  if (!R.hasModel) return `<div class="notice err"><b>${esc(t('doc.noModel'))}</b></div>`;
  const tables = R.tables.filter(x => !x.system).length, measures = R.nodes.filter(n => n.kind === 'measure' && n.origin === 'model').length;
  const head = R.hasReport ? t('doc.head', { t: tables, m: measures, s: L.sources.length, v: L.visuals.filter(v => v.type !== 'pageFilter' && v.type !== 'reportFilter').length })
    : t('doc.headNoReport', { t: tables, m: measures, s: L.sources.length });
  return esc(head);
}

export function docTabsHtml(t, ds) {
  return DOC_TABS.map(k => `<button class="tab" role="tab" type="button" data-dtab="${esc(k)}" aria-selected="${esc(ds.tab === k)}">${esc(t('doc.tab.' + k))}</button>`).join('');
}

export function exportHtml(t, ds) {
  return `<div class="exportbox">
    <div><h2>${esc(t('ex.title'))}</h2><p class="muted fs135 m0">${esc(t('ex.lead'))}</p></div>
    <div class="exfields">
      <label>${esc(t('ex.by'))}<input id="exBy" type="text" maxlength="80" autocomplete="off" value="${esc(ds.by || '')}"></label>
      <label>${esc(t('ex.to'))}<input id="exTo" type="text" maxlength="80" autocomplete="off" value="${esc(ds.to || '')}"></label>
    </div>
    <div class="btns"><button class="btn primary" type="button" data-export="md">${esc(t('ex.md'))}</button><button class="btn" type="button" data-export="html">${esc(t('ex.html'))}</button></div>
    <p class="muted fs125 m0">${esc(t('ex.note'))}</p><div class="copied" id="exMsg" role="status">${esc(ds.msg || '')}</div>
  </div>`;
}

/* ---------------------------------------------------------------- Soyağacı */

/** Varsayılan başlangıç: kaynağa ulaşan ilk normal sayfa görseli; yoksa ilk measure. */
export function defaultStart(R, L) {
  const vis = L.visuals.filter(v => v.state === 'normal' && v.type !== 'pageFilter' && v.type !== 'reportFilter');
  // Zinciri en iyi gösteren görsel: en çok kaynağa ve alana ulaşan (ilk 60 görsel içinde, hızlı kalsın)
  let best = null, score = -1;
  vis.slice(0, 60).forEach(v => { const u = traceUp(R, L, { kind: 'visual', id: v.id }); const sc = u.sources.length * 100 + u.nodes.length; if (sc > score) { score = sc; best = v; } });
  if (best) return { kind: 'visual', id: best.id };
  const m = R.nodes.find(n => n.kind === 'measure' && n.origin === 'model');
  if (m) return { kind: 'node', id: m.id };
  if (L.sources[0]) return { kind: 'source', id: 0 };
  return null;
}

function startOptions(t, R, L, start) {
  const sel = (k, id) => (start && start.kind === k && start.id === id ? ' selected' : '');
  const groups = [];
  const vis = L.visuals.filter(v => v.type !== 'pageFilter' && v.type !== 'reportFilter');
  if (vis.length) groups.push(`<optgroup label="${esc(t('lin.g.visual'))}">${vis.map(v => `<option value="visual:${v.id}"${sel('visual', v.id)}>${esc(v.page)} › ${esc(visualLabel(t, v))}</option>`).join('')}</optgroup>`);
  const ms = R.nodes.filter(n => n.kind === 'measure' && n.origin !== 'reportOnly').sort((a, b) => a.name.localeCompare(b.name));
  if (ms.length) groups.push(`<optgroup label="${esc(t('lin.g.measure'))}">${ms.map(n => `<option value="node:${n.id}"${sel('node', n.id)}>${esc(n.name)}</option>`).join('')}</optgroup>`);
  if (L.sources.length) groups.push(`<optgroup label="${esc(t('lin.g.source'))}">${L.sources.map(s => { const l = sourceLabel(t, s); return `<option value="source:${s.id}"${sel('source', s.id)}>${esc(l.type)}: ${esc(l.loc)}</option>`; }).join('')}</optgroup>`);
  const tbs = R.tables.filter(x => !x.system);
  if (tbs.length) groups.push(`<optgroup label="${esc(t('lin.g.table'))}">${tbs.map(x => `<option value="table:${x.id}"${sel('table', x.id)}>${esc(x.name)}</option>`).join('')}</optgroup>`);
  return groups.join('');
}

/** Başlangıç noktasına göre zincir: yukarı (kaynağa) ve/veya aşağı (görsele). */
export function chainFor(R, L, start) {
  const up = start.kind === 'visual' || start.kind === 'node' || start.kind === 'table' ? traceUp(R, L, start) : null;
  const down = start.kind !== 'visual' ? traceDown(R, L, start) : null;
  const u = (a, b) => [...new Set([...(a || []), ...(b || [])])];
  const c = {
    sources: u(up && up.sources, down && down.sources), queries: u(up && up.queries, down && down.queries),
    tables: u(up && up.tables, down && down.tables), nodes: u(up && up.nodes, down && down.nodes), visuals: u(up && up.visuals, down && down.visuals)
  };
  // Kaynak ya da tablodan aşağı inerken o tablonun bütün sütunları gelir; görsele ulaşmayan veri sütunlarını gizle
  if (start.kind === 'source' || start.kind === 'query' || start.kind === 'table') {
    const live = new Set(); c.visuals.forEach(v => L.visuals[v].nodeIds.forEach(id => live.add(id)));
    const reach = new Set(); const q = [...live];
    while (q.length) { const id = q.pop(); if (reach.has(id)) continue; reach.add(id); R.nodes[id].uses.forEach(x => q.push(x)); }
    c.hiddenCols = c.nodes.filter(id => R.nodes[id].kind === 'column' && !reach.has(id)).length;
    c.nodes = c.nodes.filter(id => R.nodes[id].kind === 'measure' || reach.has(id));
  }
  return c;
}

export function lineageHtml(t, R, L, ds) {
  const start = ds.start;
  if (!start) return `<p class="muted">${esc(t('lin.noSource'))}</p>`;
  const c = chainFor(R, L, start);
  const on = (k, id) => start.kind === k && start.id === id;
  const chip = (k, id, label, sub, title) => `<button class="lchip${on(k, id) ? ' on' : ''}" type="button" data-lin="${esc(k)}:${esc(id)}"${title ? ` title="${esc(title)}"` : ''}><span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}</button>`;
  const capped = (arr, f) => arr.slice(0, CAP).map(f).join('') + (arr.length > CAP ? `<span class="muted fs13">+${arr.length - CAP}</span>` : '');
  const col = (key, inner, n) => `<div class="lcol"><h3>${esc(t('lin.col.' + key))} <b>${n}</b></h3><div class="lchips">${inner || `<span class="muted">${esc(t('lin.empty'))}</span>`}</div></div>`;
  const srcs = c.sources.map(i => L.sources[i]);
  const qs = c.queries.map(i => L.queries[i]).filter(q => !q.isFunction);
  const tbs = c.tables.map(i => R.tables[i]).filter(x => !x.system);
  const nodes = c.nodes.map(i => R.nodes[i]).filter(n => !(n.tableId != null && R.tables[n.tableId].system))
    .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'measure' ? -1 : 1) || a.name.localeCompare(b.name));
  const vis = c.visuals.map(i => L.visuals[i]);
  let name = '';
  if (start.kind === 'visual') name = visualLabel(t, L.visuals[start.id]);
  else if (start.kind === 'node') name = nodeText(R.nodes[start.id]);
  else if (start.kind === 'source') name = sourceLabel(t, L.sources[start.id]).loc;
  else if (start.kind === 'table') name = R.tables[start.id].name;
  let sum;
  if (start.kind === 'visual') sum = t('lin.sumUp', { name, s: srcs.length, q: qs.length, t: tbs.length });
  else if (start.kind === 'source') sum = t('lin.sumDown', { name, v: vis.length, n: nodes.length });
  else sum = t('lin.sumBoth', { name, s: srcs.length, v: vis.length });
  const noSrc = !srcs.length && start.kind !== 'source' ? `<p class="muted fs13 m0">${esc(t('lin.noSource'))}</p>` : '';
  return `<div class="lpick"><label>${esc(t('lin.pick'))} <select id="linStart">${startOptions(t, R, L, start)}</select></label></div>
    <p class="lsum">${esc(sum)}</p>${noSrc}
    <div class="lgrid" aria-label="${esc(t('doc.tab.lineage'))}">
      ${col('source', capped(srcs, s => { const l = sourceLabel(t, s); return chip('source', s.id, l.loc, l.type, l.loc); }), srcs.length)}
      ${col('query', capped(qs, q => chip('table', q.table != null ? R.tables.findIndex(x => x.name === q.table) : -1, q.name, q.mode === 'directQuery' ? t('src.mode.directQuery') : '', q.name).replace('data-lin="table:-1"', 'disabled')), qs.length)}
      ${col('table', capped(tbs, x => chip('table', x.id, x.name, x.calculated ? t('mdl.calc') : '')), tbs.length)}
      ${col('field', capped(nodes, n => chip('node', n.id, n.kind === 'column' ? `${n.table}[${n.name}]` : n.name, n.kind === 'measure' ? t('kind.measure') : '')) + (c.hiddenCols ? `<span class="muted fs13">+${c.hiddenCols} ${esc(t('kind.column'))}</span>` : ''), nodes.length)}
      ${col('visual', capped(vis, v => chip('visual', v.id, visualLabel(t, v), v.page)), vis.length)}
    </div>
    <p class="muted fs13">${esc(t('lin.hint'))}</p>`;
}

/* ---------------------------------------------------------------- Kaynaklar */

export function sourcesHtml(t, R, L) {
  const tablesOf = s => [...new Set(s.queries.map(i => L.queries[i]).flatMap(q => q.table ? [q.table] : L.queries.filter(x => x.table && x.refs.some(r => norm(r) === norm(q.name))).map(x => x.table)))];
  const rows = L.sources.map(s => {
    const l = sourceLabel(t, s), tb = tablesOf(s);
    return `<tr><td>${esc(l.type)}</td><td class="loc"><button class="jump" type="button" data-lin="source:${esc(s.id)}">${esc(l.loc)}</button>${l.extra ? `<small>${esc(l.extra)}</small>` : ''}</td><td>${esc(tb.join(', '))}</td></tr>`;
  }).join('');
  const params = L.params.length ? `<h3>${esc(t('src.params'))}</h3><ul class="plain">${L.params.map(p => `<li><b>${esc(p.name)}</b> = ${p.value == null ? `<span class="muted">${esc(t('src.paramEmpty'))}</span>` : `<code>${esc(p.value)}</code>`}</li>`).join('')}</ul>` : '';
  const other = L.queries.filter(q => q.table && !q.allSourceIds.length);
  const calc = R.tables.filter(x => !x.system && x.calculated && !(x.queries || []).length);
  const otherHtml = other.length || calc.length ? `<h3>${esc(t('src.other'))}</h3><ul class="plain">${other.map(q => `<li><b>${esc(q.table)}</b> · ${esc(queryWhy(t, q))}</li>`).join('')}${calc.map(x => `<li><b>${esc(x.name)}</b> · ${esc(t('src.why.calc'))}</li>`).join('')}</ul>` : '';
  const mcode = L.queries.filter(q => q.table).map(q => `<details class="mcode"><summary>${esc(q.table)} · ${esc(t('src.showM'))}</summary><pre class="dax">${esc(q.expr)}</pre></details>`).join('');
  return `<p class="muted">${esc(t('src.lead', { n: L.sources.length }))}</p>
    ${L.sources.length ? `<div class="tablewrap"><table class="dtable"><thead><tr><th>${esc(t('src.th.type'))}</th><th>${esc(t('src.th.loc'))}</th><th>${esc(t('src.th.tables'))}</th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}
    ${params}${otherHtml}${mcode ? `<div class="mcodes">${mcode}</div>` : ''}`;
}

/* ---------------------------------------------------------------- Tablolar ve ilişkiler */

export function warningText(t, R, w) {
  if (w.table != null) return t('w.rel.' + w.code, { table: R.tables[w.table].name });
  return t('w.rel.' + w.code, { rel: relText(R.relationships[w.rel]) });
}

export function modelHtml(t, R, L) {
  const layout = relationshipLayout(R);
  const labels = { title: t('mdl.diagram'), cols: (c, m) => t('mdl.cols', { c, m }) };
  let diagram;
  if (!(R.relationships || []).length) diagram = `<p class="muted">${esc(t('mdl.noRel'))}</p>`;
  else if (!layout) diagram = `<p class="muted">${esc(t('mdl.tooMany', { n: R.tables.filter(x => !x.system).length }))}</p>`;
  else diagram = `<div class="diagramwrap">${relationshipSvg(layout, labels, { link: true })}</div><p class="muted fs13">${esc(t('mdl.legend'))}</p>`;
  const ws = relationshipWarnings(R);
  const warn = ws.length ? `<ul class="warnlist">${ws.map(w => `<li data-kind="${esc(w.code)}">${esc(warningText(t, R, w))}</li>`).join('')}</ul>` : `<p class="muted">${esc(t('mdl.ok'))}</p>`;
  const rows = R.tables.filter(x => !x.system).map(x => {
    const cn = x.nodes.filter(id => R.nodes[id].kind === 'column').length, mn = x.nodes.filter(id => R.nodes[id].kind === 'measure').length;
    const tags = [x.calculated ? t('mdl.calc') : '', x.hidden ? t('mdl.hidden') : '', ...(x.queries || []).filter(q => q.mode && q.mode !== 'import').map(q => q.mode === 'directQuery' ? t('src.mode.directQuery') : t('src.mode.dual'))].filter(Boolean);
    return `<tr id="dt-${esc(x.id)}"><td><button class="jump" type="button" data-lin="table:${esc(x.id)}">${esc(x.name)}</button>${tags.length ? ` <span class="tag">${esc(tags.join(' · '))}</span>` : ''}</td><td class="num">${cn}</td><td class="num">${mn}</td><td>${esc(x.description || '')}</td></tr>`;
  }).join('');
  return `<h3>${esc(t('mdl.diagram'))}</h3>${diagram}
    <h3>${esc(t('mdl.warn'))}</h3>${warn}
    <h3>${esc(t('mdl.tables'))}</h3><div class="tablewrap"><table class="dtable"><thead><tr><th>${esc(t('kind.table'))}</th><th class="num">${esc(t('tab.column'))}</th><th class="num">${esc(t('tab.measure'))}</th><th>${esc(t('ms.byAuthor'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ---------------------------------------------------------------- Measure açıklamaları */

export function measuresHtml(t, R, L, EX, ds) {
  const all = R.nodes.filter(n => n.kind === 'measure' && n.origin !== 'reportOnly').sort((a, b) => (a.table || '').localeCompare(b.table || '') || a.name.localeCompare(b.name));
  const author = [...EX.values()].filter(x => x.by === 'author').length, rule = EX.size - author;
  const q = norm(ds.q || '');
  const list = all.filter(n => !q || norm(n.name).includes(q) || norm(n.table).includes(q) || norm((EX.get(n.id) || {}).text || '').includes(q));
  const visOf = new Map(); L.visuals.forEach(v => v.nodeIds.forEach(id => { if (!visOf.has(id)) visOf.set(id, []); visOf.get(id).push(v); }));
  const items = list.slice(0, 300).map(n => {
    const e = EX.get(n.id), vs = visOf.get(n.id) || [];
    const pages = [...new Set(vs.map(v => v.page))];
    return `<li class="mrow">
      <div class="mhead"><b>${esc(n.name)}</b><span class="muted fs13">${esc(n.table || '')}</span><span class="pill" data-s="${esc(n.status)}">${esc(t('st.' + n.status))}</span></div>
      ${e ? `<p class="mexp"><span class="by ${esc(e.by)}">${esc(t(e.by === 'author' ? 'ms.byAuthor' : 'ms.byRule'))}</span>${esc(e.text)}</p>` : `<p class="mexp muted">${esc(t('ms.none'))}</p>`}
      <p class="muted fs13 m0">${esc(t('ms.where'))}: ${pages.length ? esc(pages.join(', ')) + ` (${vs.length})` : esc(t('ms.nowhere'))}</p>
      <details><summary>${esc(t('d.formula'))}</summary><pre class="dax">${esc(n.expr || '')}</pre></details>
      <div class="btns sm"><button class="btn" type="button" data-lin="node:${esc(n.id)}">${esc(t('ms.toLineage'))}</button><button class="btn" type="button" data-toclean="n:${esc(n.id)}">${esc(t('ms.toClean'))}</button></div>
    </li>`;
  }).join('');
  return `<p class="muted">${esc(t('ms.lead', { a: EX.size, n: all.length, au: author, ru: rule }))}</p>
    <input class="search" id="msSearch" type="search" value="${esc(ds.q || '')}" placeholder="${esc(t('ms.filter'))}" aria-label="${esc(t('ms.filter'))}">
    <ul class="mlist">${items || `<li class="empty">${esc(t('empty'))}</li>`}</ul>${list.length > 300 ? `<p class="muted fs13">+${list.length - 300}</p>` : ''}`;
}

/* ---------------------------------------------------------------- Sayfalar */

export function pagesByReport(L) {
  const out = new Map();
  L.visuals.filter(v => v.type !== 'reportFilter').forEach(v => {
    const k = (v.report || '') + '\u0001' + v.page;
    if (!out.has(k)) out.set(k, { report: v.report, page: v.page, state: v.state, visuals: [] });
    out.get(k).visuals.push(v);
  });
  return [...out.values()];
}

export function pagesHtml(t, R, L) {
  const pages = pagesByReport(L), multi = new Set(pages.map(p => p.report)).size > 1;
  const nv = pages.reduce((a, p) => a + p.visuals.filter(v => v.type !== 'pageFilter').length, 0);
  return `<p class="muted">${esc(t('pg.lead', { p: pages.length, v: nv }))}</p>` + pages.map(p => {
    const st = p.state && p.state !== 'normal' ? ` <span class="tag">${esc(t('pg.' + p.state))}</span>` : '';
    return `<section class="pagebox"><h3>${multi ? esc(p.report) + ' › ' : ''}${esc(p.page)}${st}</h3><ul class="plain">${p.visuals.map(v =>
      `<li><button class="jump" type="button" data-lin="visual:${esc(v.id)}">${esc(visualLabel(t, v))}</button> <span class="muted fs13">${esc(v.nodeIds.map(id => nodeText(R.nodes[id])).join(', '))}</span></li>`).join('')}</ul></section>`;
  }).join('');
}

export function docBodyHtml(t, R, L, EX, ds) {
  if (!R.hasModel) return '';
  switch (ds.tab) {
    case 'sources': return sourcesHtml(t, R, L);
    case 'model': return modelHtml(t, R, L);
    case 'measures': return measuresHtml(t, R, L, EX, ds);
    case 'pages': return pagesHtml(t, R, L);
    default: return lineageHtml(t, R, L, ds);
  }
}
