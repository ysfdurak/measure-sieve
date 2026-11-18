// Ölçü Eleği · analiz çekirdeği
// Bu dosya hem tarayıcıda (web/js/app.js) hem de MCP sunucusunda (mcp/server.mjs) aynen kullanılır.
// DOM'a, ağa ya da dosya sistemine dokunmaz. Girdi olarak "giriş" (entry) listesi alır:
//   { path: "Report/Layout", read: async () => Uint8Array }
// Böylece ZIP içindeki dosya, klasördeki dosya ya da örnek veri aynı yoldan geçer.
//
// Akış:  dosyalar → extractGroup() → buildProjects() → analyze() → removalPlan() / teScript()
//
// Durum kodları (kötüden iyiye):
//   unused   Hiçbir yerde kullanımı bulunamadı
//   chain    Yalnızca kullanılmayan başka öğelerde kullanılıyor
//   review   Yalnızca gizli sayfada, yer iminde ya da metin olarak geçiyor; insan bakmalı
//   indirect Kullanılan bir ölçünün/sütunun formülünde, ilişkide, güvenlik rolünde vb.
//   used     Raporda doğrudan kullanılıyor
//   unknown  Rapor yüklenmedi, karar verilemiyor

export const STATUS_ORDER = ['unused', 'chain', 'review', 'indirect', 'used', 'unknown'];
export const CANDIDATE = s => s === 'unused' || s === 'chain';

export const norm = s => String(s == null ? '' : s).trim().toLowerCase();
const joinExpr = e => Array.isArray(e) ? e.join('\n') : (e == null ? '' : String(e));

/* ---------------------------------------------------------------- Bayt ve JSON */

export function decode(b) {
  if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(b);
  if (b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder('utf-16be').decode(b);
  if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) return new TextDecoder('utf-8').decode(b);
  if (b.length > 3 && b[1] === 0 && b[3] === 0) return new TextDecoder('utf-16le').decode(b);
  return new TextDecoder('utf-8').decode(b);
}
export const parseJson = text => JSON.parse(String(text).replace(/^﻿/, ''));
function tryParse(v) {
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch (e) { return null; }
}

/** Dosyanın ilk baytlarına bakıp ne olduğunu söyler: zip, korumalı (MIP/OLE) ya da bilinmiyor. */
export function sniff(head) {
  if (head[0] === 0x50 && head[1] === 0x4B) return 'zip';
  if (head[0] === 0xD0 && head[1] === 0xCF && head[2] === 0x11 && head[3] === 0xE0) return 'protected';
  const txt = String.fromCharCode(...head.slice(0, 8));
  if (txt.startsWith('.pfile')) return 'protected';
  return 'unknown';
}

/* ---------------------------------------------------------------- DAX ayrıştırıcı */

/**
 * DAX metnini parçalara ayırır. Yalnızca bizim için önemli olanları tanır:
 * yorumlar, "metinler", 'Tablo'[Ad], Tablo[Ad] ve [Ad] başvuruları. Gerisi düz metin kalır.
 * Metin ve yorum içindeki [Ad] başvuru sayılmaz; bu, yanlış "kullanılıyor" sonucunu önler.
 */
export function tokenizeDax(s) {
  s = String(s == null ? '' : s);
  const out = []; let i = 0, buf = ''; const n = s.length;
  const flush = () => { if (buf) { out.push({ t: 'text', v: buf }); buf = ''; } };
  const readBracket = start => {
    let j = start + 1, name = '';
    while (j < n) { if (s[j] === ']') { if (s[j + 1] === ']') { name += ']'; j += 2; continue; } break; } name += s[j++]; }
    return { name, end: j + 1 };
  };
  const skipWs = j => { while (j < n && /\s/.test(s[j])) j++; return j; };
  while (i < n) {
    const c = s[i], d = s[i + 1];
    if ((c === '/' && d === '/') || (c === '-' && d === '-')) { let j = s.indexOf('\n', i); if (j < 0) j = n; flush(); out.push({ t: 'comment', v: s.slice(i, j) }); i = j; continue; }
    if (c === '/' && d === '*') { let j = s.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; flush(); out.push({ t: 'comment', v: s.slice(i, j) }); i = j; continue; }
    if (c === '"') {
      let j = i + 1, val = '';
      while (j < n) { if (s[j] === '"') { if (s[j + 1] === '"') { val += '"'; j += 2; continue; } break; } val += s[j++]; }
      j = Math.min(n, j + 1); flush(); out.push({ t: 'string', v: s.slice(i, j), val }); i = j; continue;
    }
    if (c === "'") {
      let j = i + 1, val = '';
      while (j < n && s[j] !== '\n') { if (s[j] === "'") { if (s[j + 1] === "'") { val += "'"; j += 2; continue; } break; } val += s[j++]; }
      j = Math.min(n, j + 1);
      const k = skipWs(j);
      if (s[k] === '[') { const r = readBracket(k); flush(); out.push({ t: 'ref', v: s.slice(i, r.end), table: val, name: r.name, spaced: false }); i = r.end; continue; }
      flush(); out.push({ t: 'table', v: s.slice(i, j), table: val }); i = j; continue;
    }
    if (c === '[') { const r = readBracket(i); flush(); out.push({ t: 'ref', v: s.slice(i, r.end), table: null, name: r.name }); i = r.end; continue; }
    if (/[\p{L}_]/u.test(c)) {
      let j = i + 1; while (j < n && /[\p{L}\p{N}_]/u.test(s[j])) j++;
      const id = s.slice(i, j), k = skipWs(j);
      if (s[k] === '[') { const r = readBracket(k); flush(); out.push({ t: 'ref', v: s.slice(i, r.end), table: id, name: r.name, spaced: k > j }); i = r.end; continue; }
      buf += id; i = j; continue;
    }
    buf += c; i++;
  }
  flush();
  return out;
}

/** Aynı formül tespiti için: yorumları ve boşlukları atar, metin dışını küçük harfe çevirir. */
export function normalizeDax(s) {
  return tokenizeDax(s).filter(t => t.t !== 'comment').map(t => t.t === 'string' ? t.v : t.v.toLowerCase()).join('').replace(/\s+/g, '');
}

/* ---------------------------------------------------------------- Model okuyucular */

const AUTO_DATE = /^(LocalDateTable|DateTableTemplate)_/i;
function emptyModel() { return { tables: [], relationships: [], roles: [], functions: [] }; }
function newTable(name) {
  return { name, hidden: false, system: AUTO_DATE.test(name), dataCategory: '', calculated: false, expr: '', calcGroup: false, calcItems: [], columns: [], measures: [], hierarchies: [] };
}

/** TMSL biçimi: PBIT içindeki DataModelSchema ve PBIP içindeki model.bim. */
export function modelFromBim(json) {
  const m = json.model || json, out = emptyModel();
  (m.tables || []).forEach(t => {
    const tbl = newTable(t.name);
    tbl.hidden = !!t.isHidden;
    if (t.showAsVariationsOnly) tbl.system = true;
    tbl.dataCategory = t.dataCategory || '';
    (t.columns || []).forEach(c => {
      if (c.type === 'rowNumber' || /^RowNumber-/.test(c.name)) return;
      tbl.columns.push({
        name: c.name, hidden: !!c.isHidden, calculated: c.type === 'calculated', expr: c.type === 'calculated' ? joinExpr(c.expression) : '',
        sortBy: c.sortByColumn || null, isKey: !!c.isKey,
        variationTables: (c.variations || []).map(v => v.defaultHierarchy && v.defaultHierarchy.table).filter(Boolean)
      });
    });
    (t.measures || []).forEach(me => {
      const extras = [me.formatStringDefinition && me.formatStringDefinition.expression, me.detailRowsDefinition && me.detailRowsDefinition.expression,
        me.kpi && me.kpi.targetExpression, me.kpi && me.kpi.statusExpression, me.kpi && me.kpi.trendExpression].filter(Boolean).map(joinExpr).join('\n');
      tbl.measures.push({ name: me.name, expr: joinExpr(me.expression), extras, hidden: !!me.isHidden, folder: me.displayFolder || '' });
    });
    (t.hierarchies || []).forEach(h => tbl.hierarchies.push({ name: h.name, levels: (h.levels || []).map(l => ({ name: l.name, column: l.column })) }));
    (t.partitions || []).forEach(p => { if (p.source && p.source.type === 'calculated') { tbl.calculated = true; tbl.expr += joinExpr(p.source.expression) + '\n'; } });
    if (t.calculationGroup) {
      tbl.calcGroup = true;
      (t.calculationGroup.calculationItems || []).forEach(ci => tbl.calcItems.push({ name: ci.name, expr: joinExpr(ci.expression) + '\n' + (ci.formatStringDefinition ? joinExpr(ci.formatStringDefinition.expression) : '') }));
    }
    out.tables.push(tbl);
  });
  (m.relationships || []).forEach(r => out.relationships.push({ fromTable: r.fromTable, fromColumn: r.fromColumn, toTable: r.toTable, toColumn: r.toColumn, active: r.isActive !== false }));
  (m.roles || []).forEach(r => (r.tablePermissions || []).forEach(tp => { if (tp.filterExpression) out.roles.push({ name: r.name + ' › ' + tp.name, table: tp.name, expr: joinExpr(tp.filterExpression) }); }));
  (m.functions || []).forEach(f => { if (f.expression) out.functions.push({ name: f.name, expr: joinExpr(f.expression) }); });
  return out;
}

/* TMDL: girintili metin biçimi (PBIP'nin yeni model biçimi). Tam bir ayrıştırıcı değil;
   yalnızca ölçü, sütun, hiyerarşi, ilişki, rol ve hesaplama grubu bilgisini okur. */
const indentOf = l => { let i = 0, n = 0; while (l[i] === '\t' || l[i] === ' ') { n += l[i] === '\t' ? 1 : .25; i++; } return Math.floor(n); };
function tmdlName(s) {
  s = s.trim();
  if (s[0] === "'") {
    let j = 1, v = '';
    while (j < s.length) { if (s[j] === "'") { if (s[j + 1] === "'") { v += "'"; j += 2; continue; } break; } v += s[j++]; }
    return { name: v, rest: s.slice(j + 1).trim() };
  }
  const m = /^([^\s=.]+)\s*(.*)$/s.exec(s) || [null, s, ''];
  return { name: m[1], rest: m[2].trim() };
}
/** "Sales.'Order Date'" → ["Sales", "Order Date"] */
function tmdlDotted(s) {
  const a = tmdlName(s); const rest = a.rest.replace(/^\./, '');
  const b = tmdlName(rest);
  return [a.name, b.name];
}
const stripFence = s => s.replace(/```/g, '');
function tmdlObject(block, base) {
  const head = block[0].trim().replace(/^\S+\s*/, ''); const nm = tmdlName(head);
  const hasExpr = nm.rest.startsWith('=');
  const after = hasExpr ? nm.rest.slice(1).trim() : '';
  let fence = after.startsWith('```') && !/```.*```/.test(after), k = 1; const expr = [after];
  while (k < block.length) {
    const line = block[k];
    if (fence) { if (line.trim() === '```') { fence = false; k++; break; } expr.push(line); k++; continue; }
    if (!line.trim()) { expr.push(''); k++; continue; }
    if (indentOf(line) >= base + 2) { expr.push(line); k++; continue; }
    break;
  }
  // Ortak girintiyi kaldır: formül ekranda Power BI'daki gibi görünsün
  const body = expr.slice(1), ind = body.filter(l => l.trim()).map(l => /^[\t ]*/.exec(l)[0].length);
  const cut = ind.length ? Math.min(...ind) : 0;
  const text = [expr[0], ...body.map(l => l.slice(Math.min(cut, /^[\t ]*/.exec(l)[0].length)))].join('\n');
  return { name: nm.name, hasExpr, expr: stripFence(text).trim(), rest: block.slice(k) };
}
function tmdlBlocks(lines, level) {
  const out = []; let cur = null, fence = false;
  lines.forEach(l => {
    const t = l.trim(), ind = indentOf(l), ticks = (l.match(/```/g) || []).length;
    if (!fence && t && ind === level && !t.startsWith('///')) { cur = [l]; out.push(cur); }
    else if (!fence && t && ind < level) { cur = null; }
    else if (cur) cur.push(l);
    if (ticks % 2 === 1) fence = !fence;
  });
  return out;
}
const TMDL_SKIP = /^(annotation|extendedProperty|changedProperty)\b/;
/** Bir bloğun içinden DAX olabilecek satırları toplar (ayar satırlarını atar). */
function tmdlDaxLines(rest) {
  const keep = []; let skipUntil = -1;
  rest.forEach(l => {
    const t = l.trim(); if (!t) return; const ind = indentOf(l);
    if (skipUntil >= 0) { if (ind > skipUntil) return; skipUntil = -1; }
    if (TMDL_SKIP.test(t)) { skipUntil = ind; return; }
    if (/^[A-Za-z]\w*\s*:/.test(t)) return;
    keep.push(t);
  });
  return stripFence(keep.join('\n'));
}
const tmdlProps = (lines, level) => {
  const p = {};
  lines.forEach(l => {
    if (indentOf(l) !== level) return;
    const t = l.trim(); const m = /^([A-Za-z]\w*)\s*(?::\s*(.*))?$/.exec(t);
    if (m) p[m[1]] = m[2] === undefined ? true : m[2].trim();
  });
  return p;
};

export function modelFromTmdl(files) {
  const out = emptyModel();
  files.forEach(f => {
    const lines = f.text.replace(/\r/g, '').split('\n'), lp = f.path.toLowerCase(), base = f.path.split('/').pop();
    if (/(^|\/)roles\//.test(lp)) {
      tmdlBlocks(lines, 1).forEach(b => { if (/^tablePermission\b/.test(b[0].trim())) { const o = tmdlObject(b, 1); out.roles.push({ name: base.replace(/\.tmdl$/i, '') + ' › ' + o.name, table: o.name, expr: o.expr }); } });
      return;
    }
    if (/(^|\/)functions\.tmdl$/.test(lp)) { out.functions.push({ name: base, expr: tmdlDaxLines(lines) }); return; }
    if (/(^|\/)relationships\.tmdl$/.test(lp)) {
      tmdlBlocks(lines, 0).forEach(b => {
        if (!/^relationship\b/.test(b[0].trim())) return;
        const p = tmdlProps(b.slice(1), 1); if (!p.fromColumn || !p.toColumn) return;
        const [ft, fc] = tmdlDotted(p.fromColumn), [tt, tc] = tmdlDotted(p.toColumn);
        out.relationships.push({ fromTable: ft, fromColumn: fc, toTable: tt, toColumn: tc, active: p.isActive !== 'false' });
      });
      return;
    }
    const hdrIdx = lines.findIndex(l => /^(createOrReplace\s+)?table\s/.test(l.trim()) && indentOf(l) === 0);
    if (hdrIdx < 0) return;
    const tname = tmdlName(lines[hdrIdx].trim().replace(/^(createOrReplace\s+)?table\s+/, '')).name;
    const tbl = newTable(tname), body = lines.slice(hdrIdx + 1);
    const tp = tmdlProps(body, 1);
    tbl.hidden = !!tp.isHidden && tp.isHidden !== 'false';
    if (tp.showAsVariationsOnly) tbl.system = true;
    tbl.dataCategory = typeof tp.dataCategory === 'string' ? tp.dataCategory : '';
    tmdlBlocks(body, 1).forEach(block => {
      const kw = block[0].trim().split(/\s/)[0];
      if (kw === 'measure') {
        const o = tmdlObject(block, 1), p = tmdlProps(o.rest, 2);
        tbl.measures.push({ name: o.name, expr: o.expr, extras: tmdlDaxLines(o.rest), hidden: !!p.isHidden && p.isHidden !== 'false', folder: typeof p.displayFolder === 'string' ? p.displayFolder : '' });
      } else if (kw === 'column') {
        const o = tmdlObject(block, 1), p = tmdlProps(o.rest, 2);
        const vt = [];
        tmdlBlocks(o.rest, 2).forEach(sb => {
          if (!/^variation\b/.test(sb[0].trim())) return;
          const vp = tmdlProps(sb.slice(1), 3); if (typeof vp.defaultHierarchy === 'string') vt.push(tmdlDotted(vp.defaultHierarchy)[0]);
        });
        tbl.columns.push({
          name: o.name, hidden: !!p.isHidden && p.isHidden !== 'false', calculated: o.hasExpr && !!o.expr, expr: o.hasExpr ? o.expr : '',
          sortBy: typeof p.sortByColumn === 'string' ? tmdlName(p.sortByColumn).name : null, isKey: !!p.isKey && p.isKey !== 'false', variationTables: vt
        });
      } else if (kw === 'partition') {
        const o = tmdlObject(block, 1);
        if (/^calculated/i.test(o.expr)) {
          const txt = stripFence(o.rest.join('\n')), m = /source\s*=\s*([\s\S]*)$/.exec(txt);
          if (m) { tbl.calculated = true; tbl.expr += m[1].split('\n').filter(l => !TMDL_SKIP.test(l.trim())).join('\n') + '\n'; }
        }
      } else if (kw === 'hierarchy') {
        const o = tmdlObject(block, 1), levels = [];
        tmdlBlocks(o.rest, 2).forEach(lb => { if (!/^level\b/.test(lb[0].trim())) return; const lo = tmdlObject(lb, 2), lp2 = tmdlProps(lo.rest, 3); levels.push({ name: lo.name, column: typeof lp2.column === 'string' ? tmdlName(lp2.column).name : lo.name }); });
        tbl.hierarchies.push({ name: o.name, levels });
      } else if (kw === 'calculationGroup') {
        tbl.calcGroup = true;
        tmdlBlocks(block.slice(1), 2).forEach(ib => { if (/^calculationItem\b/.test(ib[0].trim())) { const o = tmdlObject(ib, 2); tbl.calcItems.push({ name: o.name, expr: o.expr + '\n' + tmdlDaxLines(o.rest) }); } });
      }
    });
    out.tables.push(tbl);
  });
  return out;
}

/* ---------------------------------------------------------------- Rapor okuyucular */

// Kullanım türleri (kind): field = görsel alanı, filter, format = koşullu biçimlendirme,
// title = dinamik başlık, bookmark = yer imi, viscalc = görsel hesaplama
// Sayfa durumu (state): normal, hidden, tooltip, drill
function visualInfo(type, objs) {
  let title = null;
  try { const v = objs && objs.title && objs.title[0].properties.text.expr.Literal.Value; if (v) title = v.replace(/^'|'$/g, ''); } catch (e) { /* başlık yok */ }
  return { type: type || 'visual', title };
}
function pageStateOf(cfg, sec) {
  const b = (cfg && cfg.pageBinding) || (sec && sec.pageBinding), type = String((b && b.type) || (cfg && cfg.type) || '').toLowerCase();
  if (type.includes('tooltip')) return 'tooltip';
  if (type.includes('drill') || (b && b.type !== 'Default')) return 'drill';
  const v = cfg && cfg.visibility; if (v === 1 || v === 'HiddenInViewMode') return 'hidden';
  return 'normal';
}
function newReport(name) { return { name, refs: [], ext: [], pages: 0, visuals: 0, modelRef: null }; }
function childCtx(ctx, key) {
  if (ctx.locked) return ctx;
  if (key === 'filters' || key === 'filterConfig' || key === 'Where') return ctx.kind === 'filter' ? ctx : { ...ctx, kind: 'filter' };
  if (key === 'objects' || key === 'vcObjects' || key === 'visualContainerObjects') return { ...ctx, kind: 'format' };
  if (ctx.kind === 'format' && (key === 'title' || key === 'subTitle')) return { ...ctx, kind: 'title' };
  return ctx;
}
function walk(node, ctx, rep, aliases) {
  if (node == null) return;
  if (typeof node === 'string') {
    const s = node.trim();
    if (s.length > 1 && (s[0] === '{' || s[0] === '[')) { const j = tryParse(s); if (j && typeof j === 'object') walk(j, ctx, rep, aliases); }
    return;
  }
  if (typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(x => walk(x, ctx, rep, aliases)); return; }
  let al = aliases;
  if (Array.isArray(node.From)) { al = { ...aliases }; node.From.forEach(f => { if (f && f.Name && f.Entity) al[f.Name] = f.Entity; }); }
  const entity = x => { const sr = x && x.Expression && x.Expression.SourceRef; return sr ? (sr.Entity || al[sr.Source] || null) : null; };
  const push = r => rep.refs.push({ ...r, kind: ctx.kind || 'field', page: ctx.page, state: ctx.state, visual: ctx.visual, report: rep.name });
  if (node.Measure && typeof node.Measure === 'object' && node.Measure.Property) push({ type: 'measure', name: node.Measure.Property, table: entity(node.Measure) });
  if (node.Column && typeof node.Column === 'object' && node.Column.Property) push({ type: 'column', name: node.Column.Property, table: entity(node.Column) });
  // GroupRef: gruplar ve kümeler (ör. "Ay adı (kümeler)") hesaplanmış bir sütuna başvurur
  if (node.GroupRef && node.GroupRef.Property) push({ type: 'column', name: node.GroupRef.Property, table: entity(node.GroupRef) });
  if (node.PropertyVariationSource && node.PropertyVariationSource.Property) push({ type: 'column', name: node.PropertyVariationSource.Property, table: entity(node.PropertyVariationSource) });
  if (node.HierarchyLevel && node.HierarchyLevel.Level) {
    const h = node.HierarchyLevel.Expression && node.HierarchyLevel.Expression.Hierarchy;
    if (h) {
      const pv = h.Expression && h.Expression.PropertyVariationSource;
      if (pv) push({ type: 'column', name: pv.Property, table: entity(pv) });
      else push({ type: 'level', name: node.HierarchyLevel.Level, hierarchy: h.Hierarchy, table: entity(h) });
    }
  }
  if (node.NativeVisualCalculation && node.NativeVisualCalculation.Expression) {
    tokenizeDax(joinExpr(node.NativeVisualCalculation.Expression)).filter(t => t.t === 'ref').forEach(t => rep.refs.push({ type: 'measure', name: t.name, table: t.table, kind: 'viscalc', page: ctx.page, state: ctx.state, visual: ctx.visual, report: rep.name, soft: true }));
  }
  for (const key of Object.keys(node)) {
    if (key === 'NativeVisualCalculation') continue;
    if (key === 'modelExtensions') { readExtensions(tryParse(node[key]), rep); continue; }
    if (key === 'bookmarks' && Array.isArray(node[key])) {
      const bm = arr => arr.forEach(b => { if (!b) return; walk(b.explorationState || b.options || b, { page: null, state: 'normal', visual: b.displayName || b.name || '', kind: 'bookmark', locked: true }, rep, al); if (Array.isArray(b.children)) bm(b.children); });
      bm(node[key]); continue;
    }
    walk(node[key], childCtx(ctx, key), rep, al);
  }
}
function readExtensions(list, rep) {
  const arr = Array.isArray(list) ? list : (list ? [list] : []);
  arr.forEach(x => (x.entities || []).forEach(en => (en.measures || []).forEach(me => {
    rep.ext.push({ name: me.name, table: en.name, expr: joinExpr(me.expression), extras: '', hidden: !!me.hidden, folder: '', report: rep.name });
  })));
}
/** Eski rapor biçimi: PBIT/PBIX içindeki Report/Layout ve PBIP'de X.Report/report.json */
export function readLegacyReport(json, name) {
  const rep = newReport(name), root = { page: null, state: 'normal', visual: null, kind: null };
  walk(json.filters, { ...root, kind: 'filter', visual: { type: 'reportFilter' } }, rep, {});
  walk(json.config, root, rep, {});
  (json.sections || []).forEach(sec => {
    rep.pages++;
    const cfg = tryParse(sec.config) || {}, page = sec.displayName || sec.name, state = pageStateOf(cfg, sec), pc = { page, state, visual: null, kind: null };
    walk(sec.filters, { ...pc, kind: 'filter', visual: { type: 'pageFilter' } }, rep, {}); walk(cfg, pc, rep, {});
    (sec.visualContainers || []).forEach(v => {
      rep.visuals++;
      const vc = tryParse(v.config) || {}, sv = vc.singleVisual || (vc.singleVisualGroup ? { visualType: 'group' } : {}), visual = visualInfo(sv.visualType, sv.vcObjects), c = { page, state, visual, kind: null };
      walk(vc, c, rep, {}); walk(v.filters, { ...c, kind: 'filter' }, rep, {}); walk(v.query, c, rep, {}); walk(v.dataTransforms, c, rep, {});
    });
  });
  return rep;
}
/** Yeni rapor biçimi (PBIR): definition/pages/<sayfa>/visuals/<görsel>/visual.json */
export async function readPbir(entries, name) {
  const rep = newReport(name), pages = {}, lp = e => e.path.toLowerCase();
  const get = async e => { try { return parseJson(decode(await e.read())); } catch (err) { return null; } };
  for (const e of entries.filter(e => /\/pages\/[^/]+\/page\.json$/.test('/' + lp(e)))) {
    const j = await get(e); if (!j) continue; rep.pages++;
    const dir = e.path.replace(/page\.json$/i, '').toLowerCase(), st = pageStateOf(j, null);
    pages[dir] = { name: j.displayName || j.name, state: st };
    const pc = { page: j.displayName || j.name, state: st, visual: null, kind: null };
    walk(j.filterConfig, { ...pc, kind: 'filter', visual: { type: 'pageFilter' } }, rep, {}); walk(j.objects, pc, rep, {}); walk(j.visualInteractions, pc, rep, {});
  }
  for (const e of entries.filter(e => /\/visuals\/[^/]+\/visual\.json$/.test('/' + lp(e)))) {
    const j = await get(e); if (!j) continue; rep.visuals++;
    const pdir = e.path.replace(/visuals\/[^/]+\/visual\.json$/i, '').toLowerCase(), p = pages[pdir] || { name: '?', state: 'normal' }, v = j.visual || {};
    walk(j, { page: p.name, state: p.state, visual: visualInfo(v.visualType || (j.visualGroup ? 'group' : ''), v.visualContainerObjects), kind: null }, rep, {});
  }
  for (const e of entries.filter(e => /\/bookmarks\/[^/]+\.bookmark\.json$/.test('/' + lp(e)))) {
    const j = await get(e); if (!j) continue;
    walk(j.explorationState || j, { page: null, state: 'normal', visual: j.displayName || j.name || '', kind: 'bookmark', locked: true }, rep, {});
  }
  const main = entries.find(e => /(^|\/)definition\/report\.json$/.test(lp(e)));
  if (main) { const j = await get(main); if (j) walk(j.filterConfig, { page: null, state: 'normal', visual: { type: 'reportFilter' }, kind: 'filter' }, rep, {}); }
  const ext = entries.find(e => /(^|\/)reportextensions\.json$/.test(lp(e)));
  if (ext) { const j = await get(ext); if (j) readExtensions(j, rep); }
  return rep;
}

/* ---------------------------------------------------------------- Dosya grupları */

const SKIP_DIR = /(^|\/)(\.pbi|\.git|node_modules|staticresources|cultures|perspectives|tmdlscripts|diagramlayout)(\/|$)/i;
const MODEL_ROOT = /^(.*?)([^/]+\.(?:semanticmodel|dataset))\//i;
const REPORT_ROOT = /^(.*?)([^/]+\.report)\//i;
const stem = s => s.replace(/\.(semanticmodel|dataset|report|pbix|pbit|pbip|zip|bim)$/i, '');

/**
 * Bir dosya grubunu (bir ZIP ya da bir klasör) okur.
 * Dönen yapı: { label, models:[{key,label,model}], reports:[rapor + modelRef], notes:[], binaryModel, live }
 * Bir klasörde birden çok model ve rapor olabilir; raporun hangi modele bağlı olduğu
 * definition.pbir içindeki datasetReference.byPath'ten okunur.
 */
export async function extractGroup(g) {
  const res = { label: g.label, kind: g.kind || 'folder', models: [], reports: [], notes: [], binaryModel: false, live: false };
  const es = g.entries.filter(e => !SKIP_DIR.test(e.path));
  const base = e => e.path.split('/').pop().toLowerCase();
  res.binaryModel = es.some(e => base(e) === 'datamodel');
  res.live = es.some(e => base(e) === 'connections');

  // Modeller: önce .SemanticModel klasörlerine göre grupla
  const roots = new Map();
  es.forEach(e => {
    const m = MODEL_ROOT.exec(e.path); const key = m ? (m[1] + m[2]).toLowerCase() : '';
    const isModelFile = base(e) === 'datamodelschema' || /\.bim$/i.test(e.path) || /\.tmdl$/i.test(e.path);
    if (!isModelFile) return;
    if (!m && REPORT_ROOT.test(e.path)) return;
    if (!roots.has(key)) roots.set(key, { key, label: m ? stem(m[2]) : stem(g.label), files: [] });
    roots.get(key).files.push(e);
  });
  for (const r of roots.values()) {
    try {
      const dms = r.files.find(e => base(e) === 'datamodelschema') || r.files.find(e => /\.bim$/i.test(e.path));
      let model = null;
      if (dms) model = modelFromBim(parseJson(decode(await dms.read())));
      else { const files = []; for (const e of r.files.filter(e => /\.tmdl$/i.test(e.path))) files.push({ path: e.path, text: decode(await e.read()) }); model = modelFromTmdl(files); }
      if (model && model.tables.length) res.models.push({ key: r.key, label: r.label, model });
    } catch (err) {
      res.notes.push({ code: 'modelUnreadable', err: true, args: { name: r.label } });
    }
  }

  // Raporlar
  const reportRootOf = p => { const m = REPORT_ROOT.exec(p); return m ? m[1] + m[2] : ''; };
  const bindingOf = async root => {
    const pbir = es.find(e => e.path.toLowerCase() === (root + '/definition.pbir').toLowerCase());
    if (!pbir) return root ? null : (res.models.length === 1 ? res.models[0].key : null);
    try {
      const j = parseJson(decode(await pbir.read())), bp = j.datasetReference && j.datasetReference.byPath && j.datasetReference.byPath.path;
      if (!bp) return null;
      // byPath, rapor klasörüne göredir: "X.Report" + "/../Model.SemanticModel" → "Model.SemanticModel"
      const parts = (root + '/' + bp.replace(/\\/g, '/')).split('/'), stack = [];
      parts.forEach(p => { if (p === '..') stack.pop(); else if (p && p !== '.') stack.push(p); });
      return stack.join('/').toLowerCase();
    } catch (e) { return null; }
  };
  const legacy = es.filter(e => base(e) === 'layout' || (base(e) === 'report.json' && !/(^|\/)definition\//i.test(e.path)));
  for (const e of legacy) {
    try {
      const j = parseJson(decode(await e.read())); if (!j.sections) continue;
      const root = reportRootOf(e.path), rep = readLegacyReport(j, root ? stem(root.split('/').pop()) : stem(g.label));
      rep.modelRef = await bindingOf(root); res.reports.push(rep);
    } catch (err) { res.notes.push({ code: 'reportUnreadable', err: true, args: { name: e.path } }); }
  }
  const pbirRoots = new Set();
  es.forEach(e => { const m = /^(.*?)definition\/pages\//i.exec(e.path); if (m) pbirRoots.add(m[1]); });
  for (const r of pbirRoots) {
    const sub = es.filter(e => e.path.startsWith(r) && !MODEL_ROOT.test(e.path.slice(r.length)));
    const root = r.replace(/\/$/, ''), rep = await readPbir(sub, root ? stem(root.split('/').pop()) : stem(g.label));
    rep.modelRef = await bindingOf(REPORT_ROOT.test(r) ? root : '');
    if (rep.modelRef == null && !REPORT_ROOT.test(r) && res.models.length === 1) rep.modelRef = res.models[0].key;
    res.reports.push(rep);
  }
  return res;
}

/**
 * Okunan grupları "projelere" böler: her model bir proje, ona bağlı raporlarla birlikte.
 * Bağlantısı çözülemeyen raporlar, tek model varsa ona bağlanır; yoksa ayrı bir "yalnız rapor" projesi olur.
 */
export function buildProjects(extractions) {
  const models = [], reports = [], notes = [];
  extractions.forEach((x, gi) => {
    notes.push(...x.notes);
    x.models.forEach(m => models.push({ id: gi + '|' + m.key, label: m.label, model: m.model, group: x }));
    x.reports.forEach(r => reports.push({ rep: r, modelId: r.modelRef != null && x.models.some(m => m.key === r.modelRef) ? gi + '|' + r.modelRef : null, group: x }));
  });
  const projects = models.map(m => ({ id: m.id, label: m.label, model: m.model, reports: [], notes: [], binary: false, live: false }));
  const loose = [];
  reports.forEach(r => {
    const p = r.modelId && projects.find(x => x.id === r.modelId);
    if (p) p.reports.push(r.rep); else loose.push(r);
  });
  if (loose.length) {
    if (projects.length === 1) {
      projects[0].reports.push(...loose.map(r => r.rep));
      if (loose.some(r => r.group !== models[0].group)) projects[0].notes.push({ code: 'assumedBinding', args: { model: projects[0].label, reports: loose.map(r => r.rep.name) } });
    } else {
      const lp = { id: 'loose', label: loose.map(r => r.rep.name).join(', '), model: null, reports: loose.map(r => r.rep), notes: [], binary: loose.some(r => r.group.binaryModel), live: loose.some(r => r.group.live) };
      if (projects.length > 1) lp.notes.push({ code: 'unboundReports', args: { reports: loose.map(r => r.rep.name) } });
      projects.push(lp);
    }
  }
  return { projects, notes };
}

/* ---------------------------------------------------------------- Analiz */

/**
 * Bir modeli ve ona bağlı raporları analiz eder.
 * Model yoksa (PBIX) yalnızca rapordaki kullanımları listeler; aday önermez.
 */
export function analyze(project) {
  const model = project.model, reports = project.reports || [];
  const nodes = [], tables = [];
  const measureIdx = new Map(), colIdx = new Map(), colsByName = new Map(), tableIdx = new Map(), systemOwner = new Map();
  const addTable = (name, info) => { const k = norm(name); if (tableIdx.has(k)) return tableIdx.get(k); const t = { id: tables.length, name, ...info, nodes: [] }; tables.push(t); tableIdx.set(k, t); return t; };
  const mkNode = (kind, d, table, origin) => {
    const n = {
      id: nodes.length, kind, name: d.name, table: table ? table.name : (d.table || ''), tableId: table ? table.id : null, origin,
      expr: d.expr == null ? null : d.expr, extras: d.extras || '', hidden: !!d.hidden, folder: d.folder || '', calculated: !!d.calculated,
      usages: [], uses: new Set(), usedBy: new Set(), structural: [], textRefs: [], duplicates: [], status: 'used', reason: null
    };
    nodes.push(n); if (table) table.nodes.push(n.id); return n;
  };
  if (model) {
    model.tables.forEach(t => {
      const tbl = addTable(t.name, { hidden: t.hidden, system: t.system, calculated: t.calculated, calcGroup: t.calcGroup, expr: t.expr, isParam: t.calculated && /NAMEOF\s*\(/i.test(t.expr), status: 'used', reason: null });
      const cmap = new Map(); colIdx.set(norm(t.name), cmap);
      t.columns.forEach(c => {
        const n = mkNode('column', c, tbl, 'model'); n.sortByName = c.sortBy; n.isKey = c.isKey; cmap.set(norm(c.name), n);
        if (!colsByName.has(norm(c.name))) colsByName.set(norm(c.name), []); colsByName.get(norm(c.name)).push(n);
        (c.variationTables || []).forEach(vt => systemOwner.set(norm(vt), n));
      });
      tbl.hierarchies = t.hierarchies; tbl.calcItems = t.calcItems;
      t.measures.forEach(me => { const k = norm(me.name); if (!measureIdx.has(k)) measureIdx.set(k, mkNode('measure', me, tbl, 'model')); });
    });
  }
  reports.forEach(r => r.ext.forEach(me => {
    const k = norm(me.name); if (measureIdx.has(k)) return;
    const tbl = tableIdx.get(norm(me.table)) || null; const n = mkNode('measure', me, tbl, 'report'); n.report = me.report; measureIdx.set(k, n);
  }));

  const realTable = name => { const t = tableIdx.get(norm(name)); return t ? t : null; };
  const colOf = (table, name) => { const c = colIdx.get(norm(table)); return c ? c.get(norm(name)) || null : null; };
  /** DAX başvurusunu düğüm(ler)e çevirir. Belirsiz [Ad] için ihtiyatlı davranır: aynı adlı tüm sütunları sayar. */
  const resolve = (tok, ownTable, preferColumn) => {
    let table = tok.table;
    if (table && tok.spaced && !realTable(table)) table = null;
    const key = norm(tok.name);
    if (table) { const c = colOf(table, tok.name); if (c) return [c]; const m = measureIdx.get(key); return m ? [m] : []; }
    if (preferColumn && ownTable) { const c = colOf(ownTable, tok.name); if (c) return [c]; }
    const m = measureIdx.get(key); if (m) return [m];
    if (ownTable) { const c = colOf(ownTable, tok.name); if (c) return [c]; }
    return colsByName.get(key) || [];
  };
  const link = (from, to) => { if (from !== to) { from.uses.add(to.id); to.usedBy.add(from.id); } };

  // Formül bağımlılıkları
  nodes.forEach(n => {
    if (n.expr == null) return;
    const own = n.table || null, isCol = n.kind === 'column';
    tokenizeDax(n.expr + '\n' + n.extras).forEach(t => {
      if (t.t === 'ref') resolve(t, own, isCol).forEach(d => link(n, d));
      else if (t.t === 'string' && n.kind === 'measure') { const d = measureIdx.get(norm(t.val)); if (d && d !== n && t.val.trim()) d.textRefs.push({ where: 'measure', name: n.name }); }
    });
  });
  // Sıralama sütunu ve hesaplanmış tablo bağımlılıkları
  tables.forEach(t => {
    t.nodes.forEach(id => { const n = nodes[id]; if (n.kind === 'column' && n.sortByName) { const s = colOf(t.name, n.sortByName); if (s) { link(n, s); s.sortTarget = true; } } });
    if (t.calculated && t.expr) {
      const deps = []; tokenizeDax(t.expr).forEach(tok => { if (tok.t === 'ref') deps.push(...resolve(tok, null, false)); });
      t.nodes.forEach(id => deps.forEach(d => link(nodes[id], d)));
    }
  });
  // Yapısal kullanımlar: bunlar silinirse model bozulur, bu yüzden "kullanılıyor" sayılır
  const structural = [];
  const mark = (n, what, label) => { n.structural.push({ what, label }); structural.push(n); };
  if (model) {
    model.relationships.forEach(r => {
      const a = colOf(r.fromTable, r.fromColumn), b = colOf(r.toTable, r.toColumn);
      if (a) mark(a, 'relationship', `${r.fromTable}[${r.fromColumn}] → ${r.toTable}[${r.toColumn}]`);
      if (b) mark(b, 'relationship', `${r.fromTable}[${r.fromColumn}] → ${r.toTable}[${r.toColumn}]`);
    });
    model.roles.forEach(r => tokenizeDax(r.expr).forEach(t => { if (t.t === 'ref') resolve(t, r.table, true).forEach(d => mark(d, 'role', r.name)); }));
    model.functions.forEach(f => tokenizeDax(f.expr).forEach(t => { if (t.t === 'ref') resolve(t, null, false).forEach(d => mark(d, 'function', f.name)); }));
    tables.forEach(t => (t.calcItems || []).forEach(ci => tokenizeDax(ci.expr).forEach(tok => {
      if (tok.t === 'ref') resolve(tok, null, false).forEach(d => mark(d, 'calcGroup', t.name + ' › ' + ci.name));
      else if (tok.t === 'string') { const d = measureIdx.get(norm(tok.val)); if (d) d.textRefs.push({ where: 'calcGroup', name: t.name + ' › ' + ci.name }); }
    })));
    nodes.forEach(n => { if (n.kind === 'column' && n.isKey) mark(n, 'key', n.table); });
  }

  // Rapor kullanımları
  const missing = new Map();
  const hierLevelCol = (table, h, lvl) => { const t = tableIdx.get(norm(table)); if (!t) return null; const hh = (t.hierarchies || []).find(x => norm(x.name) === norm(h)); const l = hh && hh.levels.find(x => norm(x.name) === norm(lvl)); return l ? colOf(table, l.column) : null; };
  reports.forEach(r => r.refs.forEach(ref => {
    let n = null;
    if (ref.type === 'measure') {
      n = measureIdx.get(norm(ref.name)) || null;
      if (!n && !model && !ref.soft) { n = mkNode('measure', { name: ref.name, table: ref.table, expr: null }, null, 'reportOnly'); measureIdx.set(norm(ref.name), n); }
    } else if (ref.type === 'column' || ref.type === 'level') {
      if (ref.table && AUTO_DATE.test(ref.table)) { n = systemOwner.get(norm(ref.table)) || null; if (!n) return; }
      else n = ref.type === 'level' ? (hierLevelCol(ref.table, ref.hierarchy, ref.name) || colOf(ref.table, ref.name)) : colOf(ref.table, ref.name);
      if (!n && ref.type === 'column' && model && realTable(ref.table) && measureIdx.get(norm(ref.name))) n = measureIdx.get(norm(ref.name));
      if (!n && !model && ref.type === 'column') {
        let t = addTable(ref.table || '?', { hidden: false, system: false, calculated: false, calcGroup: false, expr: '', status: 'unknown' });
        const cm = colIdx.get(norm(t.name)) || new Map(); colIdx.set(norm(t.name), cm);
        n = cm.get(norm(ref.name)); if (!n) { n = mkNode('column', { name: ref.name }, t, 'reportOnly'); cm.set(norm(ref.name), n); }
      }
    }
    if (!n) {
      // Tablo adı çözülemeyen başvurular (alt sorgu, tahmin çizgisi gibi analiz çıktıları) modelde aranmaz
      if (ref.soft || !model || !ref.table) return;
      if (ref.table && tableIdx.get(norm(ref.table)) && tableIdx.get(norm(ref.table)).system) return;
      const k = ref.type + '|' + norm(ref.table) + '|' + norm(ref.name);
      if (!missing.has(k)) missing.set(k, { type: ref.type === 'measure' ? 'measure' : 'column', name: ref.name, table: ref.table, where: [] });
      missing.get(k).where.push(ref); return;
    }
    const k = [ref.report, ref.page, JSON.stringify(ref.visual), ref.kind].join('|');
    if (!n.usages.some(u => u.key === k)) n.usages.push({ report: ref.report, page: ref.page, visual: ref.visual, kind: ref.kind, state: ref.state, key: k });
  }));

  const hasReport = reports.length > 0, hasModel = !!model;
  const liveUsage = u => u.kind !== 'bookmark' && u.state !== 'hidden';
  const directLive = n => n.usages.some(liveUsage);
  const items = nodes.filter(n => !(n.tableId != null && tables[n.tableId].system));

  // Canlılık yayılımı: kullanılan bir öğenin kullandığı her şey de kullanılıyordur
  const spread = (seeds, set, blocked) => {
    const q = []; seeds.forEach(n => { if (!set.has(n.id)) { set.add(n.id); q.push(n); } });
    while (q.length) { const n = q.pop(); n.uses.forEach(id => { if (!set.has(id) && !(blocked && blocked.has(id))) { set.add(id); q.push(nodes[id]); } }); }
  };
  const live = new Set(), content = new Set(), review = new Set();
  spread(nodes.filter(directLive).concat(structural), live);
  spread(nodes.filter(n => directLive(n) || n.structural.some(s => s.what !== 'relationship' && s.what !== 'key')), content);
  spread(nodes.filter(n => !live.has(n.id) && (n.usages.length || n.textRefs.length)), review, live);

  const isSys = n => n.tableId != null && tables[n.tableId].system;
  const names = ids => { const a = [...ids].map(i => nodes[i]).filter(Boolean); const out = a.filter(n => !isSys(n)).map(n => n.kind === 'column' ? `${n.table}[${n.name}]` : n.name); if (a.some(isSys)) out.push('@autoDate'); return [...new Set(out)]; };
  items.forEach(n => {
    if (!hasReport) { n.status = 'unknown'; n.reason = { code: n.usedBy.size ? 'formulaOnly' : 'noReport', names: names(n.usedBy) }; return; }
    if (!hasModel) { n.status = 'used'; n.reason = { code: 'direct', counts: countKinds(n.usages.filter(liveUsage)), extra: [] }; if (!directLive(n)) { n.status = 'review'; n.reason = reviewReason(n); } return; }
    if (live.has(n.id)) {
      if (directLive(n)) { n.status = 'used'; n.reason = { code: 'direct', counts: countKinds(n.usages.filter(liveUsage)), extra: [...new Set(n.structural.map(s => s.what))] }; }
      else {
        n.status = 'indirect';
        const lv = [...n.usedBy].filter(i => live.has(i));
        const sorters = lv.filter(i => nodes[i].kind === 'column' && norm(nodes[i].sortByName) === norm(n.name) && nodes[i].tableId === n.tableId);
        if (sorters.length && sorters.length === lv.length) n.reason = { code: 'sortFor', names: names(sorters) };
        else if (lv.length) n.reason = { code: 'via', names: names(lv), extra: [...new Set(n.structural.map(s => s.what))] };
        else n.reason = { code: 'structural', what: n.structural[0] ? n.structural[0].what : 'relationship', label: n.structural[0] ? n.structural[0].label : '' };
      }
      return;
    }
    if (review.has(n.id)) { n.status = 'review'; n.reason = (n.usages.length || n.textRefs.length) ? reviewReason(n) : { code: 'viaReview', names: names([...n.usedBy].filter(i => review.has(i))) }; return; }
    if (n.usedBy.size) {
      const users = [...n.usedBy].map(i => nodes[i]);
      const param = users.find(u => u.tableId != null && tables[u.tableId].isParam);
      n.status = 'chain'; n.reason = param ? { code: 'onlyParam', names: [tables[param.tableId].name] } : { code: 'onlyUnused', names: names(n.usedBy) };
    } else { n.status = 'unused'; n.reason = { code: 'none' }; }
  });

  // Tablo düzeyi
  const tableItems = tables.filter(t => !t.system && t.nodes.length);
  tableItems.forEach(t => {
    if (!hasModel) { t.status = 'unknown'; t.reason = { code: 'noModel' }; return; }
    if (!hasReport) { t.status = 'unknown'; t.reason = { code: 'noReport' }; return; }
    const tn = t.nodes.map(i => nodes[i]);
    const contentLive = tn.filter(n => content.has(n.id));
    if (contentLive.length) { t.status = tn.some(n => directLive(n)) ? 'used' : 'indirect'; t.reason = { code: 'tableUsed', n: contentLive.length, total: tn.length }; return; }
    if (t.calcGroup && (t.calcItems || []).length) { t.status = 'indirect'; t.reason = { code: 'calcGroupTable' }; return; }
    // Köprü tablo: kullanılan iki tabloyu birbirine bağlıyorsa
    const linked = new Set();
    (model.relationships || []).forEach(r => {
      if (norm(r.fromTable) === norm(t.name)) linked.add(norm(r.toTable));
      if (norm(r.toTable) === norm(t.name)) linked.add(norm(r.fromTable));
    });
    const liveLinked = [...linked].filter(k => { const o = tableIdx.get(k); return o && o.nodes.some(i => content.has(i)); });
    if (liveLinked.length >= 2) { t.status = 'indirect'; t.reason = { code: 'bridge', names: liveLinked.map(k => tableIdx.get(k).name) }; return; }
    const outside = new Set(); tn.forEach(n => n.usedBy.forEach(i => { if (nodes[i].tableId !== t.id) outside.add(i); }));
    if (tn.some(n => n.status === 'review')) { t.status = 'review'; t.reason = { code: 'tableReview' }; return; }
    if ([...outside].some(i => live.has(i) && !nodes[i].structural.length)) { t.status = 'indirect'; t.reason = { code: 'via', names: names([...outside].filter(i => live.has(i))) }; return; }
    t.status = 'unused'; t.reason = { code: 'tableNone', relationships: linked.size };
  });

  // Aynı formüle sahip ölçüler (kafa karışıklığının en sık kaynağı)
  const byFormula = new Map();
  items.filter(n => n.kind === 'measure' && n.expr && n.expr.trim().length > 3).forEach(n => {
    const k = normalizeDax(n.expr); if (!byFormula.has(k)) byFormula.set(k, []); byFormula.get(k).push(n.id);
  });
  const duplicates = [...byFormula.values()].filter(g => g.length > 1);
  duplicates.forEach(g => g.forEach(id => { nodes[id].duplicates = g.filter(x => x !== id); }));

  const autoDate = tables.filter(t => t.system).length;
  return {
    label: project.label, hasModel, hasReport, nodes, items, tables, tableItems, duplicates, autoDate,
    reports: reports.map(r => ({ name: r.name, pages: r.pages, visuals: r.visuals })),
    missing: [...missing.values()], notes: project.notes || [], binary: !!project.binary, live: !!project.live
  };
}
function countKinds(us) { const c = {}; us.forEach(u => { c[u.kind] = (c[u.kind] || 0) + 1; }); return c; }
function reviewReason(n) {
  const hid = n.usages.filter(u => u.state === 'hidden'), bm = n.usages.filter(u => u.kind === 'bookmark');
  if (hid.length) return { code: 'hiddenPage', names: [...new Set(hid.map(u => u.page))] };
  if (bm.length) return { code: 'bookmarkOnly', names: [...new Set(bm.map(u => typeof u.visual === 'string' ? u.visual : ''))].filter(Boolean) };
  if (n.textRefs.length) return { code: 'text', names: [...new Set(n.textRefs.map(t => t.name))] };
  return { code: 'none' };
}

/* ---------------------------------------------------------------- Silme planı */

/**
 * Seçilen öğeler için güvenli silme sırası ve etkisi.
 * selection: [{kind:'node', id}] ve/veya [{kind:'table', id}]
 * Bir tablo seçildiyse içindeki ölçü ve sütunlar ayrıca silinmez.
 * Sıra: bir öğeyi kullanan öğe, ondan önce silinir.
 */
export function removalPlan(res, selection) {
  const N = res.nodes, T = res.tables;
  const tablesSel = new Set(selection.filter(s => s.kind === 'table').map(s => s.id));
  const units = [];
  tablesSel.forEach(id => units.push({ kind: 'table', id, members: new Set(T[id].nodes) }));
  selection.filter(s => s.kind === 'node').forEach(s => { const n = N[s.id]; if (n && !(n.tableId != null && tablesSel.has(n.tableId))) units.push({ kind: 'node', id: s.id, members: new Set([s.id]) }); });
  const removed = new Set(); units.forEach(u => u.members.forEach(m => removed.add(m)));
  const unitOf = new Map(); units.forEach((u, i) => u.members.forEach(m => unitOf.set(m, i)));
  const seen = new Set(), order = [];
  const visit = i => {
    if (seen.has(i)) return; seen.add(i);
    units[i].members.forEach(m => N[m].usedBy.forEach(d => { const j = unitOf.get(d); if (j != null && j !== i) visit(j); }));
    order.push(i);
  };
  units.map((u, i) => i).sort((a, b) => labelOf(res, units[a]).localeCompare(labelOf(res, units[b]), 'tr')).forEach(visit);
  const warnings = [];
  order.forEach(i => {
    const u = units[i], label = labelOf(res, u);
    const breaks = new Set(), usages = [], structural = [];
    u.members.forEach(m => {
      const n = N[m];
      n.usedBy.forEach(d => { if (!removed.has(d)) breaks.add(d); });
      n.usages.forEach(x => usages.push(x));
      n.structural.forEach(s => structural.push(s));
    });
    if (breaks.size) warnings.push({ code: 'breaks', label, names: [...breaks].map(d => nodeLabel(N[d])) });
    if (usages.length) warnings.push({ code: 'inReport', label, n: usages.length });
    const st = structural.filter(s => !(u.kind === 'table' && s.what === 'key'));
    if (st.length) warnings.push({ code: 'structural', label, what: st[0].what, detail: st[0].label });
  });
  return { units: order.map(i => units[i]), warnings, labels: order.map(i => labelOf(res, units[i])) };
}
export const nodeLabel = n => n.kind === 'column' ? `${n.table}[${n.name}]` : (n.table ? `${n.table}[${n.name}]` : `[${n.name}]`);
function labelOf(res, u) { return u.kind === 'table' ? `'${res.tables[u.id].name}'` : nodeLabel(res.nodes[u.id]); }

/** Tabular Editor (2 ya da 3) için C# betiği ve Power Query'de kaldırılacak sütunlar. */
export function teScript(res, plan, t) {
  const cs = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const lines = [t('script.head1'), t('script.head2')];
  const pq = new Map();
  plan.units.forEach(u => {
    if (u.kind === 'table') { const tb = res.tables[u.id]; lines.push(`Model.Tables["${cs(tb.name)}"].Delete();`); return; }
    const n = res.nodes[u.id];
    if (n.origin === 'report') { lines.push('// ' + t('script.skipReport', { name: n.name })); return; }
    if (n.origin === 'reportOnly') return;
    if (n.kind === 'measure') lines.push(`Model.Tables["${cs(n.table)}"].Measures["${cs(n.name)}"].Delete();`);
    else if (n.calculated) lines.push(`Model.Tables["${cs(n.table)}"].Columns["${cs(n.name)}"].Delete();`);
    else { if (!pq.has(n.table)) pq.set(n.table, []); pq.get(n.table).push(n.name); }
  });
  let mtext = '';
  if (pq.size) {
    lines.push('', '// ' + t('script.pqNote'));
    pq.forEach((cols, table) => lines.push(`//   ${table}: ${cols.join(', ')}`));
    mtext = [...pq.entries()].map(([table, cols]) => `// ${table}\n= Table.RemoveColumns(#"${t('script.prevStep')}", {${cols.map(c => '"' + c.replace(/"/g, '""') + '"').join(', ')}})`).join('\n\n');
  }
  return { script: lines.join('\n'), powerQuery: mtext };
}
