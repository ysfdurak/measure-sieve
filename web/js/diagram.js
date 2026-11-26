// Measure Sieve · ilişki diyagramı (Belgele modu)
// DOM kullanmaz; SVG metni üretir. Web arayüzü ve indirilen devir belgesi aynı çizimi kullanır.
// Dış kütüphane yok (sitenin "dış bağımlılık yok" ilkesi ve CSP). Tüm adlar kaçışlanır.
//
// Yerleşim: olgu tabloları (ilişkinin "çok" tarafı) ortada, boyutlar sağda ve solda,
// boyutun boyutu (kar tanesi şeması) bir sütun daha dışarıda. Filtre yönü okla, pasif ilişki kesik çizgiyle.

import { norm } from './core.js';

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const DIAGRAM_MAX = 40;
const W = 176, H = 46, GAPY = 18, COLW = 250, PAD = 24;

/** Diyagramda yer alacak tablolar ve konumları. Çizilemeyecek kadar büyükse null. */
export function relationshipLayout(res) {
  const rels = (res.relationships || []).filter(r => r.fromTable && r.toTable);
  const byName = new Map(res.tables.filter(t => !t.system).map(t => [norm(t.name), t]));
  const names = [...new Set(rels.flatMap(r => [norm(r.fromTable), norm(r.toTable)]))].filter(k => byName.has(k));
  if (!names.length) return { nodes: [], edges: [], width: 0, height: 0 };
  if (names.length > DIAGRAM_MAX) return null;
  const score = new Map(names.map(k => [k, 0])), adj = new Map(names.map(k => [k, new Set()]));
  rels.forEach(r => {
    const a = norm(r.fromTable), b = norm(r.toTable); if (!score.has(a) || !score.has(b)) return;
    adj.get(a).add(b); adj.get(b).add(a);
    if (r.fromCard === 'many' && r.toCard !== 'many') { score.set(a, score.get(a) + 1); score.set(b, score.get(b) - 1); }
    if (r.toCard === 'many' && r.fromCard !== 'many') { score.set(b, score.get(b) + 1); score.set(a, score.get(a) - 1); }
  });
  let facts = names.filter(k => score.get(k) > 0);
  if (!facts.length) facts = [names.reduce((b, k) => (adj.get(k).size > adj.get(b).size ? k : b), names[0])];
  // Olgulardan uzaklık (BFS); bağlantısız parçalar kendi merkezini alır
  const dist = new Map(); facts.forEach(f => dist.set(f, 0));
  const q = [...facts];
  while (q.length) { const k = q.shift(); adj.get(k).forEach(n => { if (!dist.has(n)) { dist.set(n, dist.get(k) + 1); q.push(n); } }); }
  names.forEach(k => { if (!dist.has(k)) { dist.set(k, 0); facts.push(k); } });
  facts.sort((a, b) => adj.get(b).size - adj.get(a).size || a.localeCompare(b));
  const factIdx = new Map(facts.map((f, i) => [f, i]));
  // Her boyutun "sahibi": en yakın olgu; sağ/sol, sahibine göre dengelenir
  const owner = new Map(); facts.forEach(f => owner.set(f, f));
  [...names].sort((a, b) => dist.get(a) - dist.get(b)).forEach(k => {
    if (owner.has(k)) return;
    const p = [...adj.get(k)].filter(n => dist.get(n) === dist.get(k) - 1 && owner.has(n)).sort((a, b) => (factIdx.get(owner.get(a)) ?? 0) - (factIdx.get(owner.get(b)) ?? 0))[0];
    owner.set(k, p ? owner.get(p) : facts[0]);
  });
  const side = new Map(); let lr = 0;
  [...names].filter(k => dist.get(k) === 1).sort((a, b) => factIdx.get(owner.get(a)) - factIdx.get(owner.get(b)) || a.localeCompare(b)).forEach(k => { side.set(k, lr++ % 2 === 0 ? -1 : 1); });
  const sideOf = k => { if (dist.get(k) === 0) return 0; if (side.has(k)) return side.get(k); const p = [...adj.get(k)].find(n => dist.get(n) === dist.get(k) - 1); const s = p ? sideOf(p) : 1; side.set(k, s || 1); return side.get(k); };
  const cols = new Map();
  names.forEach(k => { const c = dist.get(k) === 0 ? 0 : sideOf(k) * dist.get(k); if (!cols.has(c)) cols.set(c, []); cols.get(c).push(k); });
  cols.forEach(list => list.sort((a, b) => (factIdx.get(owner.get(a)) ?? 0) - (factIdx.get(owner.get(b)) ?? 0) || a.localeCompare(b)));
  const keys = [...cols.keys()].sort((a, b) => a - b), minC = keys[0];
  const tallest = Math.max(...[...cols.values()].map(l => l.length));
  const height = PAD * 2 + tallest * H + (tallest - 1) * GAPY;
  const nodes = [];
  keys.forEach(c => {
    const list = cols.get(c), colH = list.length * H + (list.length - 1) * GAPY, y0 = (height - colH) / 2;
    list.forEach((k, i) => {
      const t = byName.get(k), cn = t.nodes.filter(id => res.nodes[id].kind === 'column').length, mn = t.nodes.filter(id => res.nodes[id].kind === 'measure').length;
      nodes.push({ key: k, table: t.id, name: t.name, x: PAD + (c - minC) * COLW, y: y0 + i * (H + GAPY), fact: dist.get(k) === 0, columns: cn, measures: mn });
    });
  });
  const pos = new Map(nodes.map(n => [n.key, n]));
  const edges = rels.map((r, i) => ({ i, a: pos.get(norm(r.fromTable)), b: pos.get(norm(r.toTable)), r })).filter(e => e.a && e.b);
  // Aynı sütundaki iki tablo arasındaki ilişki sağa doğru bir yay çizer; yay kesilmesin diye en sağda pay bırak
  const sameCol = edges.some(e => e.a.x === e.b.x);
  const width = PAD * 2 + (keys[keys.length - 1] - minC) * COLW + W + (sameCol ? 56 : 0);
  return { nodes, edges, width, height };
}

/**
 * SVG metni. labels: { many, one, title, cols(c, m) } — dil dosyasından gelir.
 * opts.link(tableId) verilirse kutular tıklanabilir (data-table) olur.
 */
export function relationshipSvg(layout, labels, opts = {}) {
  if (!layout || !layout.nodes.length) return '';
  const { nodes, edges, width, height } = layout;
  const short = s => (s.length > 22 ? s.slice(0, 21) + '…' : s);
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" class="reldiagram" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="${opts.link ? 'group' : 'img'}" aria-label="${esc(labels.title)}">`);
  parts.push(`<defs><marker id="ms-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`);
  // Çizgiler önce (kutuların altında kalsın)
  edges.forEach(e => {
    const { a, b, r } = e;
    const ax = a.x + (b.x > a.x ? W : b.x < a.x ? 0 : W), bx = b.x + (b.x > a.x ? 0 : b.x < a.x ? W : W);
    const ay = a.y + H / 2, by = b.y + H / 2;
    const same = a.x === b.x, bend = same ? 60 : Math.abs(bx - ax) / 2;
    const d = same ? `M${ax} ${ay}C${ax + bend} ${ay} ${bx + bend} ${by} ${bx} ${by}` : `M${ax} ${ay}C${ax + Math.sign(bx - ax) * bend} ${ay} ${bx - Math.sign(bx - ax) * bend} ${by} ${bx} ${by}`;
    const risky = r.crossFilter === 'both' || (r.fromCard === 'many' && r.toCard === 'many');
    // Filtre yönü: "bir" tarafından "çok" tarafına. Çift yönde iki ok.
    const toFrom = r.toCard === 'one' && r.fromCard !== 'one';
    const markEnd = r.crossFilter === 'both' || toFrom ? ' marker-start="url(#ms-arrow)"' : '';
    const markStart = r.crossFilter === 'both' || !toFrom ? ' marker-end="url(#ms-arrow)"' : '';
    parts.push(`<path class="rel${risky ? ' risky' : ''}${r.active ? '' : ' inactive'}" d="${d}" fill="none"${markEnd}${markStart}/>`);
    const card = c => (c === 'one' ? '1' : '*');
    const off = (x, toward) => x + (toward > x ? 10 : -10);
    parts.push(`<text class="card" x="${off(ax, bx)}" y="${ay - 6}" text-anchor="${bx >= ax ? 'start' : 'end'}">${card(r.fromCard)}</text>`);
    parts.push(`<text class="card" x="${off(bx, ax)}" y="${by - 6}" text-anchor="${ax >= bx ? 'start' : 'end'}">${card(r.toCard)}</text>`);
  });
  nodes.forEach(n => {
    const link = opts.link ? ` data-table="${esc(n.table)}" tabindex="0" role="button" aria-label="${esc(n.name)}: ${esc(labels.cols(n.columns, n.measures))}"` : '';
    parts.push(`<g class="tbl${n.fact ? ' fact' : ''}"${link}><title>${esc(n.name)}</title><rect x="${n.x}" y="${n.y}" width="${W}" height="${H}" rx="8"/>`
      + `<text class="tname" x="${n.x + 12}" y="${n.y + 19}">${esc(short(n.name))}</text>`
      + `<text class="tsub" x="${n.x + 12}" y="${n.y + 36}">${esc(labels.cols(n.columns, n.measures))}</text></g>`);
  });
  parts.push('</svg>');
  return parts.join('');
}

/** Diyagram için gömülü stil (indirilen belgede de aynı görünsün). Renkler CSS değişkeniyle değiştirilebilir. */
export const DIAGRAM_CSS = `.reldiagram{max-width:100%;height:auto;color:var(--dg-line,#64748b);font-family:inherit}
.reldiagram .rel{stroke:var(--dg-line,#64748b);stroke-width:1.4}
.reldiagram .rel.risky{stroke:var(--dg-warn,#b45309);color:var(--dg-warn,#b45309);stroke-width:2}
.reldiagram .rel.inactive{stroke-dasharray:6 5}
.reldiagram .card{font-size:12px;fill:var(--dg-muted,#475569)}
.reldiagram .tbl rect{fill:var(--dg-box,#fff);stroke:var(--dg-line,#64748b);stroke-width:1.2}
.reldiagram .tbl.fact rect{stroke:var(--dg-accent,#0b6478);stroke-width:2;fill:var(--dg-accent-bg,#e8f3f5)}
.reldiagram .tbl[role=button]{cursor:pointer}
.reldiagram .tbl[role=button]:hover rect,.reldiagram .tbl[role=button]:focus rect{stroke:var(--dg-accent,#0b6478);stroke-width:2.4}
.reldiagram .tname{font-size:13.5px;font-weight:600;fill:var(--dg-ink,#0f172a)}
.reldiagram .tsub{font-size:11.5px;fill:var(--dg-muted,#475569)}`;
