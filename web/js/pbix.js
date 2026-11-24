// Measure Sieve · PBIX model okuyucu
// PBIX'in içindeki "DataModel" dosyası Analysis Services yedeğidir (ABF) ve Xpress9 ile sıkıştırılmıştır.
// Adımlar:
//   1. Xpress9 parçalarını aç (xpress9.js, Microsoft'un çözücüsünün JavaScript'e derlenmiş hâli)
//   2. ABF içindekiler listesini (XML) oku, "metadata.sqlitedb" dosyasının yerini bul
//   3. Bu küçük SQLite veritabanından tablo, sütun, measure, ilişki, hiyerarşi... bilgilerini oku
//   4. Çekirdeğin anladığı model biçimine çevir (modelFromBim ile aynı şekil)
// Veri satırlarına (VertiPaq) hiç dokunulmaz; yalnızca model tanımı okunur.
// Bu okuyucunun mantığı pbixray (MIT, Hugoberry) projesinden yararlanılarak yazılmıştır.
import * as X9 from './xpress9.js';

const u16 = new TextDecoder('utf-16le'), u8 = new TextDecoder('utf-8');
const MAX_CHUNK = 64 * 1024 * 1024, MAX_TOTAL = 1536 * 1024 * 1024;
const SINGLE = 'This backup was created using XPress9 compression.';
const MULTI = 'This backup was created using multithreaded XPrs9.';

/* ---------------------------------------------------------------- 1. Xpress9 */

/** Sıkıştırılmış DataModel'i parça listesi olarak açar. Dönüş: { size, slice(start, end) } */
export function decompressDataModel(dm) {
  const dv = new DataView(dm.buffer, dm.byteOffset, dm.byteLength);
  const head = new TextDecoder('utf-16le').decode(dm.subarray(0, 102));
  const sigStream = String.fromCharCode(...dm.subarray(2, 70).filter((b, i) => i % 2 === 0));
  if (sigStream.startsWith('STREAM_STORAGE_SIGNATURE')) return wrapChunks([dm]);
  const groups = [];
  let pos = 102, total = 0;
  const readGroup = n => {
    const g = [];
    for (let i = 0; i < n && pos + 8 <= dm.length; i++) {
      const us = dv.getUint32(pos, true), cs = dv.getUint32(pos + 4, true); pos += 8;
      // Parça boyutları beyandır: makul sınır ve toplam açılmış boyut sınırı (sıkıştırma bombasına karşı)
      if (us > MAX_CHUNK || cs > MAX_CHUNK || pos + cs > dm.length) throw new Error('badChunk');
      total += us; if (total > MAX_TOTAL) throw new Error('tooLarge');
      g.push({ us, cs, at: pos }); pos += cs;
    }
    return g;
  };
  if (head.includes(MULTI)) {
    const r = k => Number(dv.getBigUint64(102 + 8 * k, true));
    const mainC = r(0), preC = r(1), preT = r(2), mainT = r(3); pos = 102 + 40;
    for (let t = 0; t < preT; t++) groups.push(readGroup(preC));
    for (let t = 0; t < mainT; t++) groups.push(readGroup(mainC));
  } else if (head.includes(SINGLE)) groups.push(readGroup(Infinity));
  else throw new Error('unknownCompression');

  const out = [];
  for (const g of groups) {
    if (!g.length) continue;
    // Her grup kendi geçmiş penceresine sahip ayrı bir Xpress9 akışıdır
    X9.reset_heap(); if (!X9.init()) throw new Error('xpress9Init');
    const maxC = Math.max(...g.map(c => c.cs)), maxU = Math.max(...g.map(c => c.us));
    const src = X9.alloc(maxC), dst = X9.alloc(maxU);
    for (const c of g) {
      new Uint8Array(X9.memory.buffer).set(dm.subarray(c.at, c.at + c.cs), src);
      const w = X9.decompress(src, c.cs, dst, c.us);
      if (w !== c.us) throw new Error('xpress9Chunk');
      out.push(new Uint8Array(X9.memory.buffer).slice(dst, dst + c.us));
    }
  }
  return wrapChunks(out);
}
function wrapChunks(chunks) {
  const starts = []; let size = 0;
  chunks.forEach(c => { starts.push(size); size += c.length; });
  return {
    size,
    slice(a, b) {
      b = Math.min(b, size); const out = new Uint8Array(Math.max(0, b - a)); let o = 0;
      for (let i = 0; i < chunks.length && o < out.length; i++) {
        const s = starts[i], e = s + chunks[i].length; if (e <= a || s >= b) continue;
        const from = Math.max(a, s) - s, to = Math.min(b, e) - s;
        out.set(chunks[i].subarray(from, to), o); o += to - from;
      }
      return out;
    }
  };
}

/* ---------------------------------------------------------------- 2. ABF içindekiler */

const tag = (xml, name) => { const m = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(xml); return m ? m[1] : null; };
const all = (xml, name) => { const re = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, 'g'), out = []; let m; while ((m = re.exec(xml))) out.push(m[1]); return out; };
const xmlText = s => s == null ? null : s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
function decodeXml(b) {
  if (b[0] === 0xFF && b[1] === 0xFE) return u16.decode(b.subarray(2));
  if (b[0] === 0xEF && b[1] === 0xBB) return u8.decode(b.subarray(3));
  if (b[1] === 0 && b[3] === 0) return u16.decode(b);
  return u8.decode(b);
}

/** ABF'deki dosyaları listeler: [{ name, offset, size, sizeFromLog }] */
export function abfFiles(abf) {
  const header = decodeXml(abf.slice(72, 0x1000)).replace(/\u0000+$/, '');
  const errorCode = tag(header, 'ErrorCode') === 'true', applyCompression = tag(header, 'ApplyCompression') === 'true';
  const vdOff = +tag(header, 'm_cbOffsetHeader'), vdSize = +tag(header, 'DataSize');
  const vd = decodeXml(abf.slice(vdOff, vdOff + vdSize));
  const vFiles = all(vd, 'BackupFile').map(x => ({ path: xmlText(tag(x, 'Path')), size: +tag(x, 'Size'), offset: +tag(x, 'm_cbOffsetHeader') }));
  const logRef = vFiles[vFiles.length - 1];
  let logBytes = abf.slice(logRef.offset, logRef.offset + logRef.size);
  if (errorCode) logBytes = logBytes.subarray(0, logBytes.length - 4);
  const log = decodeXml(logBytes);
  const byPath = new Map(vFiles.map(f => [f.path, f]));
  const files = [];
  all(log, 'FileGroup').forEach(g => all(g, 'BackupFile').forEach(b => {
    const sp = xmlText(tag(b, 'StoragePath')), p = xmlText(tag(b, 'Path')) || '';
    const v = byPath.get(sp); if (!v) return;
    files.push({ name: p.split('\\').pop(), path: p, offset: v.offset, size: errorCode ? v.size - 4 : v.size, sizeFromLog: +tag(b, 'Size') });
  }));
  return { files, applyCompression };
}

/* ---------------------------------------------------------------- 3. Salt okunur SQLite */

/** Küçük, salt okunur bir SQLite okuyucusu: yalnızca tablo B-ağaçlarını tarar (indeks, WAL vb. yok). */
export function openSqlite(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (u8.decode(buf.subarray(0, 15)) !== 'SQLite format 3') throw new Error('notSqlite');
  let pageSize = dv.getUint16(16); if (pageSize === 1) pageSize = 65536;
  const usable = pageSize - buf[20];
  const enc = dv.getUint32(56); const text = enc === 2 ? new TextDecoder('utf-16le') : enc === 3 ? new TextDecoder('utf-16be') : u8;
  const pageAt = n => (n - 1) * pageSize;
  const varint = p => {
    let v = 0n;
    for (let i = 0; i < 9; i++) {
      const b = buf[p + i];
      if (i === 8) { v = (v << 8n) | BigInt(b); return [v, p + 9]; }
      v = (v << 7n) | BigInt(b & 0x7F);
      if (!(b & 0x80)) return [v, p + i + 1];
    }
    return [v, p + 9];
  };
  const payloadOf = (p, P) => {
    const X = usable - 35;
    if (P <= X) return buf.subarray(p, p + P);
    if (P > buf.length) throw new Error('badRecord'); // kayıt dosyadan büyük olamaz
    const M = Math.floor((usable - 12) * 32 / 255) - 23, K = M + ((P - M) % (usable - 4)), local = K <= X ? K : M;
    const out = new Uint8Array(P); out.set(buf.subarray(p, p + local)); let o = local;
    let next = dv.getUint32(p + local);
    let hops = 0;
    while (next && o < P && hops++ < buf.length / usable + 1) { const base = pageAt(next); const n = Math.min(usable - 4, P - o); out.set(buf.subarray(base + 4, base + 4 + n), o); o += n; next = dv.getUint32(base); }
    return out;
  };
  const record = (rec, rowid) => {
    const r = new DataView(rec.buffer, rec.byteOffset, rec.byteLength);
    let [hs, p] = varintIn(rec, 0); hs = Number(hs);
    const types = []; while (p < hs) { const [t, q] = varintIn(rec, p); types.push(Number(t)); p = q; }
    let o = hs; const vals = [];
    for (const t of types) {
      if (t === 0) vals.push(null);
      else if (t >= 1 && t <= 6) { const n = [0, 1, 2, 3, 4, 6, 8][t]; let v = 0n; for (let i = 0; i < n; i++) v = (v << 8n) | BigInt(rec[o + i]); if (rec[o] & 0x80) v -= 1n << BigInt(8 * n); vals.push(Number(v)); o += n; }
      else if (t === 7) { vals.push(r.getFloat64(o)); o += 8; }
      else if (t === 8) vals.push(0); else if (t === 9) vals.push(1);
      else if (t >= 12 && t % 2 === 0) { const n = (t - 12) / 2; vals.push(rec.slice(o, o + n)); o += n; }
      else if (t >= 13) { const n = (t - 13) / 2; vals.push(text.decode(rec.subarray(o, o + n))); o += n; }
    }
    return { rowid, vals };
  };
  function varintIn(a, p) { let v = 0n; for (let i = 0; i < 9; i++) { const b = a[p + i]; if (i === 8) return [(v << 8n) | BigInt(b), p + 9]; v = (v << 7n) | BigInt(b & 0x7F); if (!(b & 0x80)) return [v, p + i + 1]; } return [v, p + 9]; }
  const scan = (root, out) => {
    const stack = [root], seen = new Set();
    while (stack.length) {
      const pg = stack.pop(); if (seen.has(pg)) continue; seen.add(pg);
      const base = pageAt(pg), h = base + (pg === 1 ? 100 : 0), type = buf[h], cells = dv.getUint16(h + 3);
      if (type === 0x0D) {
        for (let i = 0; i < cells; i++) {
          let p = base + dv.getUint16(h + 8 + 2 * i); let P, rowid;
          [P, p] = varint(p); [rowid, p] = varint(p);
          out.push(record(payloadOf(p, Number(P)), Number(rowid)));
        }
      } else if (type === 0x05) {
        const kids = [];
        for (let i = 0; i < cells; i++) kids.push(dv.getUint32(base + dv.getUint16(h + 12 + 2 * i)));
        kids.push(dv.getUint32(h + 8));
        for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
      }
    }
    return out;
  };
  const master = scan(1, []).map(r => ({ type: r.vals[0], name: r.vals[1], root: r.vals[3], sql: r.vals[4] })).filter(m => m.type === 'table');
  const tables = new Map(master.map(m => [m.name.toLowerCase(), m]));
  return {
    has: name => tables.has(name.toLowerCase()),
    /** Tablonun tüm satırlarını { kolon: değer } nesneleri olarak döndürür. */
    rows(name) {
      const m = tables.get(name.toLowerCase()); if (!m) return [];
      const cols = columnsOf(m.sql);
      const ipk = cols.findIndex(c => c.ipk);
      return scan(m.root, []).map(r => { const o = {}; cols.forEach((c, i) => { o[c.name] = i === ipk && r.vals[i] == null ? r.rowid : (r.vals[i] === undefined ? null : r.vals[i]); }); return o; });
    }
  };
}
function columnsOf(sql) {
  const body = sql.slice(sql.indexOf('(') + 1, sql.lastIndexOf(')'));
  const parts = []; let depth = 0, cur = '';
  for (const ch of body) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && !depth) { parts.push(cur); cur = ''; } else cur += ch; }
  parts.push(cur);
  const items = parts.map(p => p.trim()).filter(Boolean);
  // Tablo düzeyinde "PRIMARY KEY ([ID])" tek INTEGER sütun içinse o sütun rowid'in kendisidir
  const pkCons = items.map(p => /^(?:CONSTRAINT\s+\S+\s+)?PRIMARY\s+KEY\s*\(\s*[\["`]?([^\]"`,)\s]+)[\]"`]?\s*(?:ASC|DESC)?\s*\)/i.exec(p)).find(Boolean);
  const cols = items.filter(p => !/^(PRIMARY\s+KEY|UNIQUE|CHECK|FOREIGN\s+KEY|CONSTRAINT)\b/i.test(p)).map(p => {
    const m = /^(?:\[([^\]]+)\]|"([^"]+)"|`([^`]+)`|(\S+))\s*(.*)$/s.exec(p);
    const name = m[1] || m[2] || m[3] || m[4], rest = m[5] || '';
    return { name, int: /^INTEGER\b/i.test(rest), ipk: /^INTEGER\b/i.test(rest) && /PRIMARY\s+KEY/i.test(rest) };
  });
  if (pkCons) { const c = cols.find(x => x.name.toLowerCase() === pkCons[1].toLowerCase()); if (c && c.int) c.ipk = true; }
  return cols;
}

/* ---------------------------------------------------------------- 4. Model */

/** PBIX'in DataModel baytlarından çekirdek modelini üretir. */
export function modelFromPbix(dm) {
  const abf = decompressDataModel(dm);
  const { files, applyCompression } = abfFiles(abf);
  if (applyCompression) throw new Error('innerCompression');
  const f = files.find(x => x.name === 'metadata.sqlitedb');
  if (!f) throw new Error('noMetadata');
  const db = openSqlite(abf.slice(f.offset, f.offset + f.size));
  return modelFromMetadata(db);
}

export function modelFromMetadata(db) {
  const rows = n => db.has(n) ? db.rows(n) : [];
  const byId = list => new Map(list.map(r => [r.ID, r]));
  const T = byId(rows('Table')), C = byId(rows('Column')), H = byId(rows('Hierarchy'));
  const colName = c => c ? (c.ExplicitName || c.InferredName) : null;
  const colType = c => c.Type != null ? c.Type : c.BindingType; // 1 veri, 2 hesaplanmış, 3 satır no, 4 hesaplanmış tablo sütunu
  const FSD = byId(rows('FormatStringDefinition')), DRD = byId(rows('DetailRowsDefinition'));
  const kpis = new Map(rows('KPI').map(k => [k.MeasureID, k]));
  const out = { tables: [], relationships: [], roles: [], functions: [] };
  const tbls = new Map();
  // SystemFlags bit 1: motorun iç tabloları (H$, R$, U$...). Bunlar kullanıcı nesnesi değildir, atlanır.
  [...T.values()].forEach(t => {
    const name = t.Name;
    if ((t.SystemFlags || 0) & 1) return;
    const tbl = { name, hidden: !!t.IsHidden, system: !!t.ShowAsVariationsOnly || /^(LocalDateTable|DateTableTemplate)_/i.test(name),
      dataCategory: t.DataCategory || '', calculated: false, expr: '', calcGroup: false, calcItems: [], columns: [], measures: [], hierarchies: [] };
    tbls.set(t.ID, tbl); out.tables.push(tbl);
  });
  const variationTable = new Map();
  rows('Variation').forEach(v => { const h = H.get(v.DefaultHierarchyID); const t = h && T.get(h.TableID); if (t) { if (!variationTable.has(v.ColumnID)) variationTable.set(v.ColumnID, []); variationTable.get(v.ColumnID).push(t.Name); } });
  [...C.values()].sort((a, b) => (a.DisplayOrdinal || 0) - (b.DisplayOrdinal || 0)).forEach(c => {
    const tbl = tbls.get(c.TableID), ty = colType(c); if (!tbl || ty === 3) return;
    tbl.columns.push({ name: colName(c), hidden: !!c.IsHidden, calculated: ty === 2, expr: ty === 2 ? (c.Expression || '') : '',
      sortBy: c.SortByColumnID ? colName(C.get(c.SortByColumnID)) : null, isKey: !!c.IsKey, variationTables: variationTable.get(c.ID) || [],
      source: ty === 2 ? '' : String(c.SourceColumn || '').replace(/^\[(.*)\]$/, '$1') });
  });
  rows('Measure').forEach(m => {
    const tbl = tbls.get(m.TableID); if (!tbl) return;
    const k = kpis.get(m.ID);
    const extras = [m.FormatStringDefinitionID && FSD.get(m.FormatStringDefinitionID) && FSD.get(m.FormatStringDefinitionID).Expression,
      m.DetailRowsDefinitionID && DRD.get(m.DetailRowsDefinitionID) && DRD.get(m.DetailRowsDefinitionID).Expression,
      k && k.TargetExpression, k && k.StatusExpression, k && k.TrendExpression].filter(Boolean).join('\n');
    tbl.measures.push({ name: m.Name, expr: m.Expression || '', extras, hidden: !!m.IsHidden, folder: m.DisplayFolder || '' });
  });
  const levels = rows('Level');
  [...H.values()].forEach(h => {
    const tbl = tbls.get(h.TableID); if (!tbl) return;
    tbl.hierarchies.push({ name: h.Name, levels: levels.filter(l => l.HierarchyID === h.ID).sort((a, b) => (a.Ordinal || 0) - (b.Ordinal || 0)).map(l => ({ name: l.Name, column: colName(C.get(l.ColumnID)) })) });
  });
  rows('Partition').forEach(p => { if (p.Type === 2) { const tbl = tbls.get(p.TableID); if (tbl) { tbl.calculated = true; tbl.expr += (p.QueryDefinition || '') + '\n'; } } });
  const CG = byId(rows('CalculationGroup'));
  rows('CalculationItem').forEach(ci => {
    const g = CG.get(ci.CalculationGroupID), tbl = g && tbls.get(g.TableID); if (!tbl) return;
    tbl.calcGroup = true;
    const fs = ci.FormatStringDefinitionID && FSD.get(ci.FormatStringDefinitionID);
    tbl.calcItems.push({ name: ci.Name, expr: (ci.Expression || '') + '\n' + (fs ? fs.Expression || '' : '') });
  });
  const relCol = (r, modern, legacy) => r[modern] != null ? r[modern] : r[legacy];
  rows('Relationship').forEach(r => {
    const ft = T.get(relCol(r, 'FromTableID', 'FromEndTableID')), tt = T.get(relCol(r, 'ToTableID', 'ToEndTableID'));
    const fc = C.get(relCol(r, 'FromColumnID', 'FromEndColumnID')), tc = C.get(relCol(r, 'ToColumnID', 'ToEndColumnID'));
    if (!ft || !tt || !fc || !tc) return;
    out.relationships.push({ fromTable: ft.Name, fromColumn: colName(fc), toTable: tt.Name, toColumn: colName(tc), active: r.IsActive !== 0 });
  });
  const R = byId(rows('Role'));
  rows('TablePermission').forEach(tp => { if (!tp.FilterExpression) return; const r = R.get(tp.RoleID), t = T.get(tp.TableID); out.roles.push({ name: (r ? r.Name : '?') + ' › ' + (t ? t.Name : '?'), table: t ? t.Name : null, expr: tp.FilterExpression }); });
  rows('Function').forEach(f => { if (f.Expression) out.functions.push({ name: f.Name, expr: f.Expression }); });
  return out;
}
