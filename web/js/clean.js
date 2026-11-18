// Measure Sieve · temizlenmiş kopya ve yapısal doğrulama
// Aslına hiç dokunmaz: seçilen öğeleri çıkarılmış YENİ dosyalar üretir, sonra bu kopyayı yeniden
// analiz edip aslıyla karşılaştırır. Yalnızca güvenle kaldırılabilecek öğeler kaldırılır:
//   - model measure'ları
//   - hesaplanmış sütunlar
//   - hesaplanmış tablolar (alan parametreleri dahil)
// Kaldırılmayanlar (gerekçesiyle listelenir): veri sütunları ve içe aktarılan tablolar (Power Query'de
// kaldırılmalı), rapor measure'ları, raporda/güvenlik rolünde/ilişkide kullanılanlar, kalan bir öğeyi bozacaklar.
import { removalPlan, extractGroup, buildProjects, analyze, decode, parseJson, norm, nodeLabel } from './core.js';

/* ---------------------------------------------------------------- 1. Ne kaldırılabilir? */

export function cleanupPlan(res, selection) {
  const N = res.nodes, T = res.tables;
  // Yalnızca hesaplanmış tablolar bütün olarak silinebilir; diğer tablo seçimleri ayrıca not edilir
  // ve içlerindeki tek tek seçilmiş öğeler kendi başına değerlendirilir.
  const pre = [];
  selection = selection.filter(s => {
    if (s.kind !== 'table') return true;
    const t = T[s.id]; if (t.calculated && !t.calcGroup) return true;
    pre.push({ label: `'${t.name}'`, code: t.calcGroup ? 'calcGroup' : 'importTable' }); return false;
  });
  const plan = removalPlan(res, selection);
  const skipped = new Map(); // unit index → {code, detail}
  const units = plan.units;
  const label = u => u.kind === 'table' ? `'${T[u.id].name}'` : nodeLabel(N[u.id]);
  // Önce türe göre ele
  units.forEach((u, i) => {
    if (u.kind === 'table') {
      const t = T[u.id];
      if (!t.calculated || t.calcGroup) return skipped.set(i, { code: t.calcGroup ? 'calcGroup' : 'importTable' });
    } else {
      const n = N[u.id];
      if (n.origin !== 'model') return skipped.set(i, { code: 'reportMeasure' });
      if (n.kind === 'column' && !n.calculated) return skipped.set(i, { code: 'dataColumn' });
    }
    const members = [...u.members].map(m => N[m]);
    if (members.some(m => m.usages.length)) return skipped.set(i, { code: 'inReport' });
    const st = members.flatMap(m => m.structural).filter(s => !(u.kind === 'table' && (s.what === 'relationship' || s.what === 'key')));
    if (st.length) return skipped.set(i, { code: 'structural', detail: st[0].what });
  });
  // Sonra bağımlılık: kalan bir öğe bunu kullanıyorsa kaldırma. Atlanan her öğe başkalarını da etkileyebilir.
  let changed = true;
  while (changed) {
    changed = false;
    const removed = new Set(); units.forEach((u, i) => { if (!skipped.has(i)) u.members.forEach(m => removed.add(m)); });
    units.forEach((u, i) => {
      if (skipped.has(i)) return;
      const keepers = new Set();
      u.members.forEach(m => N[m].usedBy.forEach(d => { if (!removed.has(d)) keepers.add(d); }));
      if (keepers.size) { skipped.set(i, { code: 'breaks', detail: [...keepers].map(d => nodeLabel(N[d])).join(', ') }); changed = true; }
    });
  }
  const keep = units.filter((u, i) => !skipped.has(i));
  const rm = { tables: new Set(), measures: new Set(), columns: new Set() }; // anahtar: tablo|ad (küçük harf)
  keep.forEach(u => {
    if (u.kind === 'table') rm.tables.add(norm(T[u.id].name));
    else { const n = N[u.id]; (n.kind === 'measure' ? rm.measures : rm.columns).add(norm(n.table) + '|' + norm(n.name)); }
  });
  return {
    rm, removed: keep.map(label),
    removedUnits: keep,
    skipped: pre.concat(units.map((u, i) => skipped.has(i) ? { label: label(u), ...skipped.get(i) } : null).filter(Boolean))
  };
}

/* ---------------------------------------------------------------- 2. TMSL (PBIT, model.bim) */

export function applyBim(json, rm) {
  const m = json.model || json;
  const tGone = n => rm.tables.has(norm(n));
  const cGone = (t, c) => tGone(t) || rm.columns.has(norm(t) + '|' + norm(c));
  m.tables = (m.tables || []).filter(t => !tGone(t.name));
  m.tables.forEach(t => {
    if (t.measures) t.measures = t.measures.filter(x => !rm.measures.has(norm(t.name) + '|' + norm(x.name)));
    if (t.columns) {
      t.columns = t.columns.filter(c => !cGone(t.name, c.name));
      t.columns.forEach(c => { if (c.sortByColumn && cGone(t.name, c.sortByColumn)) delete c.sortByColumn; });
    }
    if (t.hierarchies) {
      t.hierarchies.forEach(h => { h.levels = (h.levels || []).filter(l => !cGone(t.name, l.column)); h.levels.forEach((l, i) => { l.ordinal = i; }); });
      t.hierarchies = t.hierarchies.filter(h => h.levels.length);
    }
  });
  if (m.relationships) m.relationships = m.relationships.filter(r => !cGone(r.fromTable, r.fromColumn) && !cGone(r.toTable, r.toColumn));
  (m.perspectives || []).forEach(p => {
    p.tables = (p.tables || []).filter(pt => !tGone(pt.name));
    p.tables.forEach(pt => {
      if (pt.measures) pt.measures = pt.measures.filter(x => !rm.measures.has(norm(pt.name) + '|' + norm(x.name)));
      if (pt.columns) pt.columns = pt.columns.filter(x => !cGone(pt.name, x.name));
    });
  });
  (m.roles || []).forEach(r => { if (r.tablePermissions) r.tablePermissions = r.tablePermissions.filter(tp => !tGone(tp.name)); });
  return json;
}

/* ---------------------------------------------------------------- 3. TMDL (PBIP) */

const indentOf = l => { let i = 0, n = 0; while (l[i] === '\t' || l[i] === ' ') { n += l[i] === '\t' ? 1 : .25; i++; } return Math.floor(n); };
function nameOf(s) {
  s = s.trim();
  if (s[0] === "'") { let j = 1, v = ''; while (j < s.length) { if (s[j] === "'") { if (s[j + 1] === "'") { v += "'"; j += 2; continue; } break; } v += s[j++]; } return { name: v, rest: s.slice(j + 1) }; }
  const m = /^([^\s=.:]+)(.*)$/s.exec(s) || [null, s, '']; return { name: m[1], rest: m[2] };
}
const dotted = s => { const a = nameOf(s); const b = nameOf(a.rest.replace(/^\./, '')); return [a.name, b.name]; };
/** Belirli girinti düzeyindeki blokları satır aralıklarıyla döndürür (``` çitlerini dikkate alır). */
function blocks(lines, level, from = 0, to = lines.length) {
  const out = []; let cur = null, fence = false;
  for (let i = from; i < to; i++) {
    const l = lines[i], t = l.trim(), ind = indentOf(l), ticks = (l.match(/```/g) || []).length;
    if (!fence && t && ind === level && !t.startsWith('///')) {
      if (cur) cur.end = i;
      const kw = t.split(/\s/)[0], nm = nameOf(t.slice(kw.length));
      let start = i; while (start > from && lines[start - 1].trim().startsWith('///') && indentOf(lines[start - 1]) === level) start--;
      if (cur && cur.end > start) cur.end = start;
      cur = { kw, name: nm.name, start, head: i, end: to }; out.push(cur);
    } else if (!fence && t && ind < level) { if (cur) { cur.end = i; cur = null; } }
    if (ticks % 2 === 1) fence = !fence;
  }
  return out;
}
/** Satır aralıklarını siler; bloğun ardından gelen tek boş satırı da alır. */
function cut(lines, ranges) {
  const del = new Set();
  ranges.forEach(r => { for (let i = r.start; i < r.end; i++) del.add(i); });
  return lines.filter((l, i) => !del.has(i));
}
const tidy = lines => lines.join('\n').replace(/\n{3,}/g, '\n\n');

export function applyTmdlFile(path, text, rm) {
  const lp = path.toLowerCase(), nl = text.includes('\r\n') ? '\r\n' : '\n';
  let lines = text.replace(/\r/g, '').split('\n');
  const tGone = n => rm.tables.has(norm(n));
  const cGone = (t, c) => tGone(t) || rm.columns.has(norm(t) + '|' + norm(c));
  const out = s => { if (/\n$/.test(text.replace(/\r/g, '')) && !s.endsWith('\n')) s += '\n'; return s.replace(/\n/g, nl); };
  if (/(^|\/)relationships\.tmdl$/.test(lp)) {
    const ranges = blocks(lines, 0).filter(b => {
      if (b.kw !== 'relationship') return false;
      const body = lines.slice(b.head + 1, b.end).map(l => l.trim());
      const f = body.find(l => l.startsWith('fromColumn:')), t = body.find(l => l.startsWith('toColumn:'));
      const [ft, fc] = f ? dotted(f.slice(11)) : [null, null], [tt, tc] = t ? dotted(t.slice(9)) : [null, null];
      return (ft && cGone(ft, fc)) || (tt && cGone(tt, tc));
    });
    return ranges.length ? out(tidy(cut(lines, ranges))) : null;
  }
  if (/(^|\/)model\.tmdl$/.test(lp)) {
    const before = lines.length;
    lines = lines.filter(l => { const m = /^\s*ref\s+table\s+(.+)$/.exec(l); return !(m && tGone(nameOf(m[1]).name)); });
    return lines.length !== before ? out(tidy(lines)) : null;
  }
  if (/(^|\/)perspectives\//.test(lp)) {
    const ranges = [];
    blocks(lines, 1).forEach(pt => {
      if (pt.kw !== 'perspectiveTable') return;
      if (tGone(pt.name)) { ranges.push(pt); return; }
      blocks(lines, 2, pt.head + 1, pt.end).forEach(x => {
        if ((x.kw === 'perspectiveMeasure' && rm.measures.has(norm(pt.name) + '|' + norm(x.name))) || (x.kw === 'perspectiveColumn' && cGone(pt.name, x.name))) ranges.push(x);
      });
    });
    return ranges.length ? out(tidy(cut(lines, ranges))) : null;
  }
  if (/(^|\/)roles\//.test(lp)) {
    const ranges = blocks(lines, 1).filter(b => b.kw === 'tablePermission' && tGone(b.name));
    return ranges.length ? out(tidy(cut(lines, ranges))) : null;
  }
  const hdr = lines.findIndex(l => /^(createOrReplace\s+)?table\s/.test(l.trim()) && indentOf(l) === 0);
  if (hdr < 0) return null;
  const tname = nameOf(lines[hdr].trim().replace(/^(createOrReplace\s+)?table\s+/, '')).name;
  if (tGone(tname)) return { delete: true };
  const ranges = [], edits = new Map();
  blocks(lines, 1, hdr + 1).forEach(b => {
    if (b.kw === 'measure' && rm.measures.has(norm(tname) + '|' + norm(b.name))) ranges.push(b);
    else if (b.kw === 'column') {
      if (cGone(tname, b.name)) { ranges.push(b); return; }
      for (let i = b.head + 1; i < b.end; i++) { const m = /^\s*sortByColumn:\s*(.+)$/.exec(lines[i]); if (m && cGone(tname, nameOf(m[1]).name)) edits.set(i, null); }
    } else if (b.kw === 'hierarchy') {
      const lv = blocks(lines, 2, b.head + 1, b.end).filter(x => x.kw === 'level');
      const gone = lv.filter(x => { const c = lines.slice(x.head + 1, x.end).map(l => /^\s*column:\s*(.+)$/.exec(l)).find(Boolean); return cGone(tname, c ? nameOf(c[1]).name : x.name); });
      if (gone.length && gone.length === lv.length) ranges.push(b); else ranges.push(...gone);
    }
  });
  if (!ranges.length && !edits.size) return null;
  edits.forEach((v, i) => ranges.push({ start: i, end: i + 1 }));
  return out(tidy(cut(lines, ranges)));
}

/* ---------------------------------------------------------------- 4. Kopyayı üret */

const enc16 = s => { const b = new Uint8Array(s.length * 2); for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); b[2 * i] = c & 255; b[2 * i + 1] = c >> 8; } return b; };
const enc8 = s => new TextEncoder().encode(s);
function encodeLike(orig, text) {
  if (orig[0] === 0xFF && orig[1] === 0xFE) { const b = enc16(text), o = new Uint8Array(b.length + 2); o.set([0xFF, 0xFE]); o.set(b, 2); return o; }
  if (orig[0] === 0xEF && orig[1] === 0xBB && orig[2] === 0xBF) { const b = enc8(text), o = new Uint8Array(b.length + 3); o.set([0xEF, 0xBB, 0xBF]); o.set(b, 3); return o; }
  if (orig.length > 3 && orig[1] === 0 && orig[3] === 0) return enc16(text);
  return enc8(text);
}

/**
 * Temizlenmiş kopyanın dosyalarını üretir. Dönüş: { format, changed: Map(path→bytes), deleted: Set(path) }
 * PBIX desteklenmez (model ikili ve sıkıştırılmış; içine yazmak Microsoft tarafından desteklenmiyor).
 */
export async function buildCleanFiles(res, rm) {
  const src = res.source;
  if (!src || !src.format) throw new Error('noSource');
  if (src.format === 'pbix') throw new Error('pbixNotWritable');
  const changed = new Map(), deleted = new Set();
  if (!rm.tables.size && !rm.measures.size && !rm.columns.size) return { format: src.format, changed, deleted };
  if (src.format === 'pbit' || src.format === 'bim') {
    const e = src.files.find(f => /(^|\/)(datamodelschema|[^/]*\.bim)$/i.test(f.path));
    const bytes = await e.read();
    const json = applyBim(parseJson(decode(bytes)), rm);
    changed.set(e.path, encodeLike(bytes, JSON.stringify(json, null, src.format === 'bim' ? 2 : undefined)));
  } else {
    // Modelin klasöründeki TÜM .tmdl dosyaları (perspektifler, roller dahil; okuma sırasında atlananlar da)
    const root = (src.key || '').toLowerCase();
    const all = (src.group ? src.group.entries : src.files).filter(f => /\.tmdl$/i.test(f.path) && (!root || f.path.toLowerCase().startsWith(root + '/')));
    for (const f of all) {
      const bytes = await f.read(), r = applyTmdlFile(f.path, decode(bytes), rm);
      if (r == null) continue;
      if (typeof r === 'object' && r.delete) deleted.add(f.path); else changed.set(f.path, encodeLike(bytes, r));
    }
  }
  return { format: src.format, changed, deleted };
}

/** Grubun girişlerine değişiklikleri uygular: yeni giriş listesi (doğrulama ve paketleme için) */
export function patchedEntries(group, out) {
  return group.entries.filter(e => !out.deleted.has(e.path)).map(e => out.changed.has(e.path) ? { path: e.path, read: async () => out.changed.get(e.path) } : e);
}

/** PBIT için yeni ZIP, PBIP için tüm klasörün ZIP'i. zipLib: JSZip sınıfı. */
export async function packCopy(group, out, zipLib) {
  const zip = new zipLib();
  for (const e of patchedEntries(group, out)) {
    if (/(^|\/)\.pbi\/cache\.abf$/i.test(e.path)) continue; // önbellek; Desktop yeniden üretir
    zip.file(e.path, await e.read(), { date: new Date(), compression: 'DEFLATE' });
  }
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}

/* ---------------------------------------------------------------- 5. Yapısal doğrulama */

/**
 * Kopyayı yeniden analiz eder ve aslıyla karşılaştırır.
 * Dönüş: { ok, after, checks: [{code, ok, items}] }
 */
export async function verifyCopy(beforeRes, group, out, plan) {
  const g = { ...group, entries: patchedEntries(group, out) };
  const x = await extractGroup(g);
  const { projects } = buildProjects([x]);
  const key = beforeRes.source.key;
  const p = projects.find(pr => pr.source && pr.source.key === key) || projects[0];
  const after = analyze(p);
  const idx = r => new Map(r.items.map(n => [n.kind + ':' + nodeLabel(n).toLowerCase(), n]));
  const A = idx(after), B = idx(beforeRes);
  const removedKeys = new Set();
  plan.removedUnits.forEach(u => {
    if (u.kind === 'table') beforeRes.tables[u.id].nodes.forEach(i => { const n = beforeRes.nodes[i]; removedKeys.add(n.kind + ':' + nodeLabel(n).toLowerCase()); });
    else { const n = beforeRes.nodes[u.id]; removedKeys.add(n.kind + ':' + nodeLabel(n).toLowerCase()); }
  });
  const stillThere = [...removedKeys].filter(k => A.has(k)).map(k => B.get(k)).map(nodeLabel);
  const lost = [...B.keys()].filter(k => !removedKeys.has(k) && !A.has(k)).map(k => nodeLabel(B.get(k)));
  const live = s => s === 'used' || s === 'indirect';
  const lostLive = [...B.entries()].filter(([k, n]) => live(n.status) && A.has(k) && !live(A.get(k).status)).map(([k, n]) => nodeLabel(n));
  const missKey = m => (m.type + '|' + norm(m.table) + '|' + norm(m.name));
  const beforeMiss = new Set(beforeRes.missing.map(missKey));
  const newMissing = after.missing.filter(m => !beforeMiss.has(missKey(m))).map(m => m.type === 'measure' ? `[${m.name}]` : `${m.table}[${m.name}]`);
  const newBroken = [];
  A.forEach((n, k) => { const b = B.get(k); const old = new Set(b ? b.unresolved : []); n.unresolved.filter(u => !old.has(u)).forEach(u => newBroken.push(`${nodeLabel(n)} → ${u}`)); });
  const checks = [
    { code: 'removed', ok: !stillThere.length, items: stillThere },
    { code: 'noLoss', ok: !lost.length, items: lost },
    { code: 'reportFields', ok: !newMissing.length, items: newMissing },
    { code: 'formulas', ok: !newBroken.length, items: newBroken },
    { code: 'liveKept', ok: !lostLive.length, items: lostLive }
  ];
  return {
    ok: checks.every(c => c.ok), after, checks,
    counts: {
      before: { measure: beforeRes.items.filter(n => n.kind === 'measure').length, column: beforeRes.items.filter(n => n.kind === 'column').length, table: beforeRes.tableItems.length },
      after: { measure: after.items.filter(n => n.kind === 'measure').length, column: after.items.filter(n => n.kind === 'column').length, table: after.tableItems.length }
    }
  };
}
