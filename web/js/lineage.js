// Measure Sieve · veri soyağacı (Belgele modu)
// analyze() sonucunun üstünde çalışır; DOM'a, ağa ya da dosya sistemine dokunmaz. Web ve MCP aynı dosyayı kullanır.
//
// Zincir:  kaynak → Power Query sorgusu → tablo → sütun / measure → rapor görseli
//
// Kaynaklar M kodundan KURAL TABANLI çıkarılır. M kodu hiçbir zaman çalıştırılmaz; yalnızca metin olarak okunur.
// Tanınmayan bağlayıcı tahmin edilmez, "unknown" olarak bildirilir.

import { norm } from './core.js';

/* ---------------------------------------------------------------- M metni */

/** Yorumları atar; "metin" içindeki // ya da /* dokunulmadan kalır. */
export function stripMComments(s) {
  s = String(s == null ? '' : s); let out = '', i = 0; const n = s.length;
  while (i < n) {
    const c = s[i], d = s[i + 1];
    if (c === '"') { let j = i + 1; while (j < n) { if (s[j] === '"') { if (s[j + 1] === '"') { j += 2; continue; } break; } j++; } out += s.slice(i, j + 1); i = j + 1; continue; }
    if (c === '/' && d === '/') { while (i < n && s[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { const j = s.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; out += ' '; continue; }
    out += c; i++;
  }
  return out;
}

/** "a""b" → a"b */
const unquote = s => s.slice(1, -1).replace(/""/g, '"');

/** Bir çağrının argümanlarını üst düzey virgüllerden böler. start = açılan parantezin konumu. */
function callArgs(s, start) {
  const args = []; let depth = 0, cur = '', i = start + 1;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === '"') { let j = i + 1; while (j < s.length) { if (s[j] === '"') { if (s[j + 1] === '"') { j += 2; continue; } break; } j++; } cur += s.slice(i, j + 1); i = j; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (depth === 0) break; depth--; }
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) args.push(cur.trim());
  return { args, end: i };
}

/** Argümanı okunur hâle getirir: metin → değeri, parametre → { param }, iç içe çağrı → içindeki ilk metin. */
function argValue(a, params) {
  if (a == null) return null;
  a = a.trim();
  if (/^"(?:[^"]|"")*"$/.test(a)) return { value: unquote(a) };
  const id = /^#"((?:[^"]|"")*)"$/.exec(a) || /^([A-Za-z_][\w.]*)$/.exec(a);
  if (id) {
    const name = id[1].replace(/""/g, '"'), p = params.get(norm(name));
    if (p) return { value: p.value, param: name };
    return { ref: name };
  }
  const inner = /"((?:[^"]|"")*)"/.exec(a);
  return inner ? { value: inner[1].replace(/""/g, '"'), partial: true } : null;
}

/* Bağlayıcı tablosu. Sıra önemli: daha özel olan önce (Excel.Workbook(File.Contents(...)) → excel, file değil). */
const CONNECTORS = [
  { re: /\bExcel\.Workbook\s*\(/g, type: 'excel', arg: a => a[0] },
  { re: /\bCsv\.Document\s*\(/g, type: 'csv', arg: a => a[0] },
  { re: /\bXml\.(?:Tables|Document)\s*\(/g, type: 'file', arg: a => a[0] },
  { re: /\bJson\.Document\s*\(\s*Binary\.Decompress/g, type: 'entered', arg: () => null },
  { re: /\bTable\.FromRows\s*\(\s*Json\.Document\s*\(\s*Binary\.Decompress/g, type: 'entered', arg: () => null },
  { re: /\bJson\.Document\s*\(/g, type: 'file', arg: a => a[0] },
  { re: /#table\s*\(/g, type: 'entered', arg: () => null },
  { re: /\bFolder\.(?:Files|Contents)\s*\(/g, type: 'folder', arg: a => a[0] },
  { re: /\bSharePoint\.(?:Files|Contents|Tables)\s*\(/g, type: 'sharepoint', arg: a => a[0] },
  { re: /\bSql\.Databases?\s*\(/g, type: 'sql', arg: a => a[0], db: a => a[1] },
  { re: /\bOracle\.Database\s*\(/g, type: 'oracle', arg: a => a[0] },
  { re: /\bPostgreSQL\.Database\s*\(/g, type: 'postgresql', arg: a => a[0], db: a => a[1] },
  { re: /\bMySQL\.Database\s*\(/g, type: 'mysql', arg: a => a[0], db: a => a[1] },
  { re: /\bSnowflake\.Databases\s*\(/g, type: 'snowflake', arg: a => a[0] },
  { re: /\bGoogleBigQuery\.Database\s*\(/g, type: 'bigquery', arg: () => null },
  { re: /\bDatabricks\.(?:Catalogs|Contents)\s*\(/g, type: 'databricks', arg: a => a[0] },
  { re: /\bAnalysisServices\.Databases?\s*\(/g, type: 'ssas', arg: a => a[0], db: a => a[1] },
  { re: /\bOdbc\.(?:DataSource|Query)\s*\(/g, type: 'odbc', arg: a => a[0] },
  { re: /\bOleDb\.(?:DataSource|Query)\s*\(/g, type: 'oledb', arg: a => a[0] },
  { re: /\bOData\.Feed\s*\(/g, type: 'odata', arg: a => a[0] },
  { re: /\bWeb\.(?:Contents|Page|BrowserContents)\s*\(/g, type: 'web', arg: a => a[0] },
  { re: /\bAzureStorage\.(?:Blobs|DataLake|Tables)\s*\(/g, type: 'azure', arg: a => a[0] },
  { re: /\b(?:PowerPlatform|PowerBI)\.Dataflows\s*\(/g, type: 'dataflow', arg: () => null },
  { re: /\bSalesforce\.(?:Data|Reports)\s*\(/g, type: 'salesforce', arg: () => null },
  { re: /\bFile\.Contents\s*\(/g, type: 'file', arg: a => a[0] }
];

/**
 * M sorgusunun kaynaklarını ve başvurduğu diğer sorguları çıkarır.
 * params: Map(norm(ad) → { value }) — parametre sorguları
 * queryNames: Set(norm(ad)) — modeldeki paylaşılan sorgular (başvuru tespiti için)
 */
export function sourcesOfM(expr, params = new Map(), queryNames = new Set()) {
  const s = stripMComments(expr), found = [], taken = [];
  const noStrings = s.replace(/(#?)"(?:[^"]|"")*"/g, (m0, hash) => (hash ? m0 : '""'));
  // let içinde tanımlanan adımlar (#"Ad" = … ya da Ad = …)
  const defined = new Set(); let dm; const defRe = /#"((?:[^"]|"")*)"\s*=(?!=)|(?:^|[\s,])([A-Za-z_\u00C0-\uFFFF][\w\u00C0-\uFFFF]*)\s*=(?!=)/g;
  while ((dm = defRe.exec(noStrings))) defined.add(norm((dm[1] != null ? dm[1].replace(/""/g, '"') : dm[2])));
  // Bağlayıcı aranırken metinlerin içi boşlukla maskelenir (konumlar aynı kalır)
  const masked = s.replace(/"(?:[^"]|"")*"/g, m0 => '"' + ' '.repeat(m0.length - 2) + '"');
  CONNECTORS.forEach(c => {
    c.re.lastIndex = 0; let m;
    while ((m = c.re.exec(masked))) {
      const at = m.index, open = s.indexOf('(', at + m[0].length - 1);
      if (taken.some(t => at >= t.from && at < t.to)) continue;          // daha özel bir bağlayıcının içinde
      const { args, end } = callArgs(s, open);
      const loc = c.arg(args), db = c.db ? c.db(args) : null;
      const v = argValue(loc, params), d = argValue(db, params);
      found.push({ type: c.type, location: v && v.value != null ? v.value : null, param: v && v.param ? v.param : (v && v.ref ? v.ref : null), database: d && d.value != null ? d.value : null, at });
      taken.push({ from: at, to: end });
    }
  });
  // Excel.Workbook(File.Contents("x")) → konumu iç çağrıdan al
  found.forEach(f => {
    if (f.location || !(f.type === 'excel' || f.type === 'csv' || (f.type === 'file' && f.param))) return;
    const inner = /\b(?:File|Web)\.Contents\s*\(\s*("(?:[^"]|"")*"|#"(?:[^"]|"")*"|[A-Za-z_][\w.]*)/.exec(s.slice(f.at));
    if (inner) { const v = argValue(inner[1], params); if (v) { f.location = v.value != null ? v.value : null; f.param = v.param || v.ref || f.param; } }
  });
  // Başka bir sorguya başvuru: #"Ad" ya da düz ad, modeldeki paylaşılan sorgulardan biriyse
  const refs = new Set();
  const idRe = /#"((?:[^"]|"")*)"|\b([A-Za-z_][\w]*)\b/g; let m;
  while ((m = idRe.exec(noStrings))) {
    const name = (m[1] != null ? m[1].replace(/""/g, '"') : m[2]);
    if (queryNames.has(norm(name)) && !params.has(norm(name))) refs.add(name);
  }
  // Modelde olmayan sorgulara başvuru (yüklenmeyen ara sorgular): let içinde adım olarak tanımlanmamış #"Ad"
  const external = new Set(); const extRe = /#"((?:[^"]|"")*)"/g; let em;
  while ((em = extRe.exec(noStrings))) {
    if (/\[\s*$/.test(noStrings.slice(Math.max(0, em.index - 4), em.index))) continue;   // [#"Sütun"] alan erişimi, sorgu değil
    const nm = em[1].replace(/""/g, '"'); if (!defined.has(norm(nm)) && !queryNames.has(norm(nm)) && !params.has(norm(nm))) external.add(nm);
  }
  const esc = k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lowNs = noStrings.toLowerCase();
  const usedParams = [...params.keys()].filter(k => lowNs.includes('#"' + k.replace(/"/g, '""') + '"') || new RegExp('(^|[^\\w"#])' + esc(k) + '([^\\w"]|$)').test(lowNs));
  // Bilinmeyen bağlayıcı: Ad.Ad( biçiminde, M standart kitaplığı dışında
  const unknown = [];
  if (!found.length && !refs.size) {
    const cand = /\b([A-Z][A-Za-z0-9]+)\.(Database|Databases|Contents|Files|Feed|DataSource|Query|Tables|Data|Catalogs)\s*\(/g; let u;
    while ((u = cand.exec(masked))) unknown.push(u[1] + '.' + u[2]);
  }
  // Aynı sorgunun önceki bir adımını okuyan bağlayıcı yeni kaynak değildir: Csv.Document(Dosya) gibi
  const fresh = found.filter(f => !(f.location == null && f.param && defined.has(norm(f.param)) && !params.has(norm(f.param))));
  const uniq = [];
  fresh.sort((a, b) => a.at - b.at).forEach(f => { const k = f.type + '|' + (f.location || f.param || '') + '|' + (f.database || ''); if (!uniq.some(x => x.k === k)) uniq.push({ ...f, k }); });
  return {
    sources: uniq.map(({ k, at, ...f }) => f),
    refs: [...refs],
    external: [...external],
    params: usedParams,
    unknown: [...new Set(unknown)]
  };
}

/** Parametre sorgusu mu? "x" meta [IsParameterQuery=true, ...] */
export function parameterValue(expr) {
  const s = stripMComments(expr).trim();
  if (!/IsParameterQuery\s*=\s*true/i.test(s)) return null;
  const m = /^("(?:[^"]|"")*"|null|[-\d.]+|true|false)\s+meta\b/i.exec(s);
  if (!m) return { value: null };
  return { value: m[1].startsWith('"') ? unquote(m[1]) : (m[1].toLowerCase() === 'null' ? null : m[1]) };
}

/* ---------------------------------------------------------------- Soyağacı grafiği */

const LIVE_KINDS = new Set(['field', 'filter', 'format', 'title', 'viscalc']);
export const visualKey = u => [u.report || '', u.page || '', u.visual && typeof u.visual === 'object' ? (u.visual.id ? '#' + u.visual.id : (u.visual.type || '') + '\u0001' + (u.visual.title || '')) : String(u.visual || '')].join('\u0002');

/**
 * analyze() sonucundan soyağacı grafiği kurar.
 * Dönüş: { sources, queries, visuals, tableQueries, ... } ve iki yönlü izleme için dizinler.
 */
export function buildLineage(res) {
  const params = new Map(), shared = new Map();
  (res.expressions || []).forEach(e => {
    const pv = parameterValue(e.expr);
    if (pv) params.set(norm(e.name), { name: e.name, value: pv.value, description: e.description || '' });
    else shared.set(norm(e.name), e);
  });
  const queryNames = new Set([...shared.keys(), ...params.keys()]);
  const sources = [], sourceIdx = new Map();
  const addSource = f => {
    const loc = f.location != null ? f.location : (f.param ? '{' + f.param + '}' : '');
    const k = f.type + '|' + norm(loc) + '|' + norm(f.database || '');
    if (sourceIdx.has(k)) return sourceIdx.get(k);
    const src = { id: sources.length, type: f.type, location: f.location, param: f.param || null, database: f.database || null, queries: [] };
    sources.push(src); sourceIdx.set(k, src.id); return src.id;
  };
  const queries = [];
  const mkQuery = (name, expr, table, extra = {}) => {
    const p = sourcesOfM(expr, params, queryNames);
    const q = { id: queries.length, name, table, expr, isFunction: /^\s*\([^)]*\)\s*(as\s+[\w ]+)?=>/.test(stripMComments(expr)), mode: extra.mode || null, description: extra.description || '', sourceIds: [], refs: p.refs, external: p.external, params: p.params.map(k => params.get(k).name), unknown: p.unknown, direct: p.sources.length > 0 };
    p.sources.forEach(f => { const id = addSource(f); if (!q.sourceIds.includes(id)) q.sourceIds.push(id); });
    queries.push(q); return q;
  };
  shared.forEach(e => mkQuery(e.name, e.expr, null, { description: e.description }));
  const byName = new Map(queries.map(q => [norm(q.name), q]));
  const tableQueries = new Map();
  res.tables.forEach(t => (t.queries || []).forEach(tq => {
    const q = mkQuery(tq.name, tq.expr, t.name, { mode: tq.mode });
    if (!tableQueries.has(t.id)) tableQueries.set(t.id, []); tableQueries.get(t.id).push(q.id);
  }));
  // Başvuru zinciri üzerinden kaynakları topla (döngüye karşı korumalı)
  const allSources = (q, seen = new Set()) => {
    if (seen.has(q.id)) return []; seen.add(q.id);
    const out = [...q.sourceIds];
    q.refs.forEach(r => { const rq = byName.get(norm(r)); if (rq) allSources(rq, seen).forEach(id => { if (!out.includes(id)) out.push(id); }); });
    return out;
  };
  queries.forEach(q => { q.allSourceIds = allSources(q); q.allSourceIds.forEach(id => { if (!sources[id].queries.includes(q.id)) sources[id].queries.push(q.id); }); });

  // Görseller: aynı rapor + sayfa + tür + başlık tek görsel sayılır
  const visuals = [], visualIdx = new Map();
  res.nodes.forEach(n => n.usages.forEach(u => {
    if (!LIVE_KINDS.has(u.kind) || !u.page) return;
    const k = visualKey(u);
    if (!visualIdx.has(k)) {
      const v = u.visual && typeof u.visual === 'object' ? u.visual : { type: 'visual', title: null };
      visualIdx.set(k, visuals.length);
      visuals.push({ id: visuals.length, report: u.report, page: u.page, state: u.state, type: v.type, title: v.title, name: v.id || null, nodeIds: [], kinds: {} });
    }
    const vis = visuals[visualIdx.get(k)];
    if (!vis.nodeIds.includes(n.id)) vis.nodeIds.push(n.id);
    vis.kinds[n.id] = [...new Set([...(vis.kinds[n.id] || []), u.kind])];
  }));
  return { sources, queries, visuals, tableQueries, params: [...params.values()], visualIdx };
}

/**
 * Yukarı doğru iz (görsel ya da düğümden kaynağa): "bu sayı nereden geliyor?"
 * start: { kind: 'visual' | 'node' | 'table', id }
 */
export function traceUp(res, lin, start) {
  const out = { visuals: new Set(), nodes: new Set(), tables: new Set(), queries: new Set(), sources: new Set() };
  const seeds = start.kind === 'visual' ? lin.visuals[start.id].nodeIds : start.kind === 'node' ? [start.id] : [];
  if (start.kind === 'visual') out.visuals.add(start.id);
  const q = [...seeds];
  while (q.length) {
    const id = q.pop(); if (out.nodes.has(id)) continue; out.nodes.add(id);
    const n = res.nodes[id]; n.uses.forEach(u => q.push(u));
    if (n.tableId != null) out.tables.add(n.tableId);
  }
  if (start.kind === 'table') out.tables.add(start.id);
  // Hesaplanmış tablo: kendi sütunlarının bağımlılıkları zaten uses içinde; tablo sorguları
  out.tables.forEach(tid => (lin.tableQueries.get(tid) || []).forEach(qid => {
    const qq = lin.queries[qid]; out.queries.add(qid);
    qq.refs.forEach(r => { const rq = lin.queries.find(x => norm(x.name) === norm(r)); if (rq) out.queries.add(rq.id); });
    qq.allSourceIds.forEach(s => out.sources.add(s));
  }));
  return toArrays(out);
}

/**
 * Aşağı doğru iz (etki analizi): "bu kaynak / sorgu / tablo / measure değişirse ne etkilenir?"
 * start: { kind: 'source' | 'query' | 'table' | 'node', id }
 */
export function traceDown(res, lin, start) {
  const out = { visuals: new Set(), nodes: new Set(), tables: new Set(), queries: new Set(), sources: new Set() };
  const tablesFromQuery = qid => res.tables.filter(t => (lin.tableQueries.get(t.id) || []).some(x => x === qid || lin.queries[x].refs.some(r => norm(r) === norm(lin.queries[qid].name)))).map(t => t.id);
  let seedTables = [], seedNodes = [];
  if (start.kind === 'source') {
    out.sources.add(start.id);
    lin.sources[start.id].queries.forEach(qid => { out.queries.add(qid); seedTables.push(...tablesFromQuery(qid)); });
  } else if (start.kind === 'query') { out.queries.add(start.id); seedTables = tablesFromQuery(start.id); lin.queries[start.id].allSourceIds.forEach(s => out.sources.add(s)); }
  else if (start.kind === 'table') seedTables = [start.id];
  else seedNodes = [start.id];
  seedTables.forEach(tid => { out.tables.add(tid); seedNodes.push(...res.tables[tid].nodes); });
  const q = [...seedNodes];
  while (q.length) {
    const id = q.pop(); if (out.nodes.has(id)) continue; out.nodes.add(id);
    res.nodes[id].usedBy.forEach(u => q.push(u));
  }
  out.nodes.forEach(id => { const n = res.nodes[id]; if (n.tableId != null) out.tables.add(n.tableId); });
  lin.visuals.forEach(v => { if (v.nodeIds.some(id => out.nodes.has(id))) out.visuals.add(v.id); });
  return toArrays(out);
}
const toArrays = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, [...v]]));

/* ---------------------------------------------------------------- İlişki uyarıları */

/** Riskli ilişkiler ve ilişkisiz tablolar. Kod listesi i18n.js'de metne çevrilir. */
export function relationshipWarnings(res) {
  const w = [];
  (res.relationships || []).forEach((r, i) => {
    if (r.crossFilter === 'both') w.push({ code: 'bothDirections', rel: i });
    if (r.fromCard === 'many' && r.toCard === 'many') w.push({ code: 'manyToMany', rel: i });
    if (!r.active) w.push({ code: 'inactive', rel: i });
    if (r.fromCard === 'one' && r.toCard === 'one') w.push({ code: 'oneToOne', rel: i });
  });
  const linked = new Set(); (res.relationships || []).forEach(r => { linked.add(norm(r.fromTable)); linked.add(norm(r.toTable)); });
  res.tables.filter(t => !t.system && !t.calcGroup && t.nodes.some(id => res.nodes[id].kind === 'column') && !linked.has(norm(t.name)))
    .filter(t => !t.nodes.every(id => res.nodes[id].kind === 'measure'))
    .forEach(t => w.push({ code: 'isolated', table: t.id }));
  return w;
}
