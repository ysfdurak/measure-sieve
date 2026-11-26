// Measure Sieve · DAX formüllerinin kural tabanlı açıklaması (Belgele modu)
// Yapay zekâ ya da ağ kullanmaz. Formül küçük bir ifade ağacına ayrıştırılır; her düğüm bilinen bir kalıba
// karşılık geliyorsa okunur bir cümleye çevrilir. TEK BİR parça bile tanınmazsa açıklama ÜRETİLMEZ (null):
// yanlış açıklama, açıklamasızlıktan daha zararlıdır.

/* ---------------------------------------------------------------- Ayrıştırıcı */

function lex(src) {
  const s = String(src || ''), out = []; let i = 0; const n = s.length;
  while (i < n) {
    const c = s[i], d = s[i + 1];
    if (/\s/.test(c)) { i++; continue; }
    if ((c === '/' && d === '/') || (c === '-' && d === '-')) { while (i < n && s[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { const j = s.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue; }
    if (c === '"') { let j = i + 1, v = ''; while (j < n) { if (s[j] === '"') { if (s[j + 1] === '"') { v += '"'; j += 2; continue; } break; } v += s[j++]; } out.push({ t: 'str', v }); i = j + 1; continue; }
    const br = j => { let k = j + 1, v = ''; while (k < n) { if (s[k] === ']') { if (s[k + 1] === ']') { v += ']'; k += 2; continue; } break; } v += s[k++]; } return { v, end: k + 1 }; };
    if (c === "'") {
      let j = i + 1, t = ''; while (j < n) { if (s[j] === "'") { if (s[j + 1] === "'") { t += "'"; j += 2; continue; } break; } t += s[j++]; }
      j++; while (/\s/.test(s[j] || '')) j++;
      if (s[j] === '[') { const b = br(j); out.push({ t: 'ref', table: t, name: b.v }); i = b.end; } else { out.push({ t: 'tbl', v: t }); i = j; }
      continue;
    }
    if (c === '[') { const b = br(i); out.push({ t: 'ref', table: null, name: b.v }); i = b.end; continue; }
    if (/[0-9.]/.test(c) && /[0-9]/.test(c === '.' ? d || '' : c)) { let j = i; while (j < n && /[0-9.eE]/.test(s[j])) j++; out.push({ t: 'num', v: s.slice(i, j) }); i = j; continue; }
    if (/[\p{L}_]/u.test(c)) {
      let j = i; while (j < n && /[\p{L}\p{N}_.]/u.test(s[j])) j++;
      const id = s.slice(i, j); let k = j; while (/\s/.test(s[k] || '')) k++;
      if (s[k] === '(') { out.push({ t: 'fn', v: id.toUpperCase() }); i = k + 1; continue; }
      if (s[k] === '[' && !/^(VAR|RETURN|IN|NOT|AND|OR|TRUE|FALSE)$/i.test(id)) { const b = br(k); out.push({ t: 'ref', table: id, name: b.v }); i = b.end; continue; }
      out.push({ t: 'id', v: id }); i = j; continue;
    }
    const two = s.slice(i, i + 2);
    if (['<=', '>=', '<>', '&&', '||', '=='].includes(two)) { out.push({ t: 'op', v: two }); i += 2; continue; }
    if ('+-*/&=<>^'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    if ('(),{}'.includes(c)) { out.push({ t: c }); i++; continue; }
    return null; // tanınmayan karakter
  }
  return out;
}

const PREC = { '||': 1, '&&': 2, '=': 3, '==': 3, '<>': 3, '<': 3, '>': 3, '<=': 3, '>=': 3, '&': 4, '+': 5, '-': 5, '*': 6, '/': 6, '^': 7 };
function parse(src) {
  const tk = lex(src); if (!tk || !tk.length) return null;
  let p = 0;
  const peek = () => tk[p], next = () => tk[p++];
  function primary() {
    const t = next(); if (!t) throw 0;
    if (t.t === 'num') return { k: 'num', v: t.v };
    if (t.t === 'str') return { k: 'str', v: t.v };
    if (t.t === 'ref') return { k: 'ref', table: t.table, name: t.name };
    if (t.t === 'tbl') return { k: 'tbl', name: t.v };
    if (t.t === 'id') { if (/^(TRUE|FALSE)$/i.test(t.v)) return { k: 'bool', v: t.v.toUpperCase() }; return { k: 'tbl', name: t.v }; }
    if (t.t === 'op' && (t.v === '-' || t.v === '+')) return { k: 'neg', v: t.v, a: unary() };
    if (t.t === '(') { const e = expr(0); if (!next() || tk[p - 1].t !== ')') throw 0; return e; }
    if (t.t === '{') { const items = []; if (peek() && peek().t !== '}') { do { items.push(expr(0)); } while (peek() && peek().t === ',' && next()); } if (!next() || tk[p - 1].t !== '}') throw 0; return { k: 'list', items }; }
    if (t.t === 'fn') {
      const args = [];
      if (peek() && peek().t === ')') { next(); return { k: 'fn', name: t.v, args }; }
      for (;;) {
        if (peek() && (peek().t === ',' || peek().t === ')')) args.push({ k: 'empty' }); else args.push(expr(0));
        const s = next(); if (!s) throw 0; if (s.t === ')') break; if (s.t !== ',') throw 0;
      }
      return { k: 'fn', name: t.v, args };
    }
    throw 0;
  }
  function unary() { return primary(); }
  function expr(min) {
    let left = unary();
    for (;;) {
      const t = peek(); if (!t || t.t !== 'op' || PREC[t.v] == null || PREC[t.v] < min) break;
      next(); const right = expr(PREC[t.v] + 1); left = { k: 'bin', op: t.v, a: left, b: right };
    }
    return left;
  }
  try { const e = expr(0); return p === tk.length ? e : null; } catch (e) { return null; }
}

/* ---------------------------------------------------------------- Cümle kalıpları */

/** Tablo adı boşluk ya da özel karakter içeriyorsa DAX'taki gibi tırnaklanır. */
const colRef = r => `${r.table ? (/^[\p{L}_][\p{L}\p{N}_]*$/u.test(r.table) ? r.table : `'${r.table.replace(/'/g, "''")}'`) : ''}[${r.name}]`;

const L = {
  tr: {
    col: r => colRef(r),
    measure: r => `[${r.name}] ölçüsü`,
    table: t => `${t} tablosu`,
    agg: { SUM: c => `${c} sütununun toplamı`, AVERAGE: c => `${c} sütununun ortalaması`, MIN: c => `${c} sütunundaki en küçük değer`, MAX: c => `${c} sütunundaki en büyük değer`,
      COUNT: c => `${c} sütunundaki dolu (sayısal) değer sayısı`, COUNTA: c => `${c} sütunundaki dolu değer sayısı`, DISTINCTCOUNT: c => `${c} sütunundaki farklı değer sayısı`, COUNTBLANK: c => `${c} sütunundaki boş değer sayısı` },
    aggx: { SUMX: (t, e) => `${t} tablosunda satır satır hesaplanan (${e}) değerlerinin toplamı`, AVERAGEX: (t, e) => `${t} tablosunda satır satır hesaplanan (${e}) değerlerinin ortalaması`,
      MINX: (t, e) => `${t} tablosunda satır satır hesaplanan (${e}) değerlerinin en küçüğü`, MAXX: (t, e) => `${t} tablosunda satır satır hesaplanan (${e}) değerlerinin en büyüğü`, COUNTX: (t, e) => `${t} tablosunda (${e}) değeri dolu olan satır sayısı` },
    countrows: t => `${t} tablosundaki satır sayısı`,
    divide: (a, b, alt) => `(${a}) bölü (${b}); bölen sıfır ya da boşsa ${alt == null ? 'boş' : alt}`,
    op: { '+': 'artı', '-': 'eksi', '*': '×', '/': 'bölü', '&': 've (metin birleştirme)', '=': '=', '==': '=', '<>': '≠', '<': '<', '>': '>', '<=': '≤', '>=': '≥', '&&': 've', '||': 'veya' },
    calc: (e, f) => `${e}; şu koşullarla: ${f.join('; ')}`,
    calc1: (e, f) => `${e}; şu koşulla: ${f}`,
    blank: 'boş',
    sply: d => `geçen yılın aynı dönemi (${d})`, ytd: d => `yılbaşından bu yana (${d})`, qtd: d => `çeyrek başından bu yana (${d})`, mtd: d => `ay başından bu yana (${d})`,
    prev: { PREVIOUSYEAR: d => `önceki yıl (${d})`, PREVIOUSQUARTER: d => `önceki çeyrek (${d})`, PREVIOUSMONTH: d => `önceki ay (${d})`, PREVIOUSDAY: d => `önceki gün (${d})`,
      NEXTYEAR: d => `sonraki yıl (${d})`, NEXTQUARTER: d => `sonraki çeyrek (${d})`, NEXTMONTH: d => `sonraki ay (${d})`, NEXTDAY: d => `sonraki gün (${d})` },
    shift: (d, n, u) => `${Math.abs(n)} ${u} ${n < 0 ? 'önce' : 'sonra'} (${d})`, unit: { YEAR: 'yıl', QUARTER: 'çeyrek', MONTH: 'ay', DAY: 'gün' },
    last: (d, n, u) => `son ${n} ${u} (${d})`,
    total: { TOTALYTD: e => `${e}, yılbaşından bu yana kümülatif`, TOTALQTD: e => `${e}, çeyrek başından bu yana kümülatif`, TOTALMTD: e => `${e}, ay başından bu yana kümülatif` },
    allT: t => `${t} üzerindeki tüm filtreler kaldırılarak`, allC: c => `${c} filtresi kaldırılarak`, allExcept: (t, cs) => `${t} filtreleri, ${cs.join(', ')} dışında kaldırılarak`,
    allSel: x => x ? `${x} için yalnız rapordaki seçimler korunarak` : 'yalnız rapordaki seçimler korunarak',
    keep: x => `${x} (mevcut filtrelerle birlikte)`, userel: (a, b) => `${a} ile ${b} arasındaki pasif ilişki kullanılarak`,
    filter: (t, c) => `${t} tablosunda ${c} olan satırlar`, cond: (a, op, b) => `${a} ${op} ${b}`,
    iff: (c, a, b) => b == null ? `${c} ise ${a}, değilse boş` : `${c} ise ${a}, değilse ${b}`,
    isblank: x => `${x} boş`, notf: x => `${x} değil`,
    selected: (c, alt) => alt == null ? `${c} için seçili tek değer (tek seçim yoksa boş)` : `${c} için seçili tek değer (tek seçim yoksa ${alt})`,
    hasone: c => `${c} için tek bir değer seçili`,
    filterCol: (c, cond, all) => all ? `${c} filtresi kaldırılarak, ${cond} olan değerler` : `${c} içinden ${cond} olan değerler`,
    switchTrue: n => `koşullara göre ${n} farklı sonuçtan biri`, switchOn: (x, n) => `${x} değerine göre ${n} farklı sonuçtan biri`,
    format: (x, f) => `${x}, "${f}" biçiminde metin olarak`,
    coalesce: xs => `${xs.join(', ')} içinden ilk boş olmayan`,
    abs: x => `${x} değerinin mutlak değeri`, round: (x, n) => `${x}, ${n} basamağa yuvarlanmış`,
    distinctT: c => `${c} sütunundaki farklı değerler`, values: c => `${c} sütunundaki değerler`
  },
  en: {
    col: r => colRef(r),
    measure: r => `the [${r.name}] measure`,
    table: t => `the ${t} table`,
    agg: { SUM: c => `the sum of ${c}`, AVERAGE: c => `the average of ${c}`, MIN: c => `the smallest value in ${c}`, MAX: c => `the largest value in ${c}`,
      COUNT: c => `the number of non-blank (numeric) values in ${c}`, COUNTA: c => `the number of non-blank values in ${c}`, DISTINCTCOUNT: c => `the number of distinct values in ${c}`, COUNTBLANK: c => `the number of blank values in ${c}` },
    aggx: { SUMX: (t, e) => `the sum of (${e}) computed row by row over ${t}`, AVERAGEX: (t, e) => `the average of (${e}) computed row by row over ${t}`,
      MINX: (t, e) => `the smallest (${e}) computed row by row over ${t}`, MAXX: (t, e) => `the largest (${e}) computed row by row over ${t}`, COUNTX: (t, e) => `the number of rows in ${t} where (${e}) is not blank` },
    countrows: t => `the number of rows in ${t}`,
    divide: (a, b, alt) => `(${a}) divided by (${b}); ${alt == null ? 'blank' : alt} when the divisor is zero or blank`,
    op: { '+': 'plus', '-': 'minus', '*': '×', '/': 'divided by', '&': 'joined with', '=': '=', '==': '=', '<>': '≠', '<': '<', '>': '>', '<=': '≤', '>=': '≥', '&&': 'and', '||': 'or' },
    calc: (e, f) => `${e}, under these conditions: ${f.join('; ')}`,
    calc1: (e, f) => `${e}, under this condition: ${f}`,
    blank: 'blank',
    sply: d => `the same period last year (${d})`, ytd: d => `year to date (${d})`, qtd: d => `quarter to date (${d})`, mtd: d => `month to date (${d})`,
    prev: { PREVIOUSYEAR: d => `the previous year (${d})`, PREVIOUSQUARTER: d => `the previous quarter (${d})`, PREVIOUSMONTH: d => `the previous month (${d})`, PREVIOUSDAY: d => `the previous day (${d})`,
      NEXTYEAR: d => `the next year (${d})`, NEXTQUARTER: d => `the next quarter (${d})`, NEXTMONTH: d => `the next month (${d})`, NEXTDAY: d => `the next day (${d})` },
    shift: (d, n, u) => `${Math.abs(n)} ${u}${Math.abs(n) === 1 ? '' : 's'} ${n < 0 ? 'earlier' : 'later'} (${d})`, unit: { YEAR: 'year', QUARTER: 'quarter', MONTH: 'month', DAY: 'day' },
    last: (d, n, u) => `the last ${n} ${u}${n === 1 ? '' : 's'} (${d})`,
    total: { TOTALYTD: e => `${e}, accumulated year to date`, TOTALQTD: e => `${e}, accumulated quarter to date`, TOTALMTD: e => `${e}, accumulated month to date` },
    allT: t => `ignoring all filters on ${t}`, allC: c => `ignoring the filter on ${c}`, allExcept: (t, cs) => `ignoring filters on ${t} except ${cs.join(', ')}`,
    allSel: x => x ? `keeping only the report selections on ${x}` : 'keeping only the report selections',
    keep: x => `${x} (combined with existing filters)`, userel: (a, b) => `using the inactive relationship between ${a} and ${b}`,
    filter: (t, c) => `the rows of ${t} where ${c}`, cond: (a, op, b) => `${a} ${op} ${b}`,
    iff: (c, a, b) => b == null ? `if ${c} then ${a}, otherwise blank` : `if ${c} then ${a}, otherwise ${b}`,
    isblank: x => `${x} is blank`, notf: x => `not ${x}`,
    selected: (c, alt) => alt == null ? `the single selected value of ${c} (blank when not exactly one)` : `the single selected value of ${c} (${alt} when not exactly one)`,
    hasone: c => `exactly one value of ${c} is selected`,
    filterCol: (c, cond, all) => all ? `ignoring the filter on ${c}, the values where ${cond}` : `the values of ${c} where ${cond}`,
    switchTrue: n => `one of ${n} results depending on conditions`, switchOn: (x, n) => `one of ${n} results depending on ${x}`,
    format: (x, f) => `${x} as text in the "${f}" format`,
    coalesce: xs => `the first non-blank of ${xs.join(', ')}`,
    abs: x => `the absolute value of ${x}`, round: (x, n) => `${x} rounded to ${n} digits`,
    distinctT: c => `the distinct values of ${c}`, values: c => `the values of ${c}`
  }
};

/* ---------------------------------------------------------------- Çeviri */

const NOPE = Symbol('nope');
function say(node, T, ctx) {
  const r = n => say(n, T, ctx);
  switch (node.k) {
    case 'num': return node.v.startsWith('.') ? '0' + node.v : node.v;
    case 'str': return `"${node.v}"`;
    case 'bool': return node.v === 'TRUE' ? (T === L.tr ? 'DOĞRU' : 'TRUE') : (T === L.tr ? 'YANLIŞ' : 'FALSE');
    case 'neg': return node.v === '-' ? '−' + r(node.a) : r(node.a);
    case 'tbl': return node.name;
    case 'ref': {
      if (node.table) return T.col(node);
      return ctx.isMeasure(node.name) ? T.measure(node) : (ctx.rowTable ? T.col({ table: ctx.rowTable, name: node.name }) : T.measure(node));
    }
    case 'bin': {
      // Gruplama korunur: düşük öncelikli alt işlem ve ";" içeren alt cümle paranteze alınır (anlam değişmesin)
      const wrap = (c, right) => {
        const t = r(c);
        if (c.k === 'bin' && (PREC[c.op] < PREC[node.op] || (right && PREC[c.op] === PREC[node.op] && /^[-/]$/.test(node.op)))) return `(${t})`;
        if (c.k === 'fn' && /[;,]/.test(t)) return `(${t})`;
        return t;
      };
      return `${wrap(node.a, false)} ${T.op[node.op]} ${wrap(node.b, true)}`;
    }
    case 'fn': return fn(node, T, ctx);
    default: throw NOPE;
  }
}
const isCol = n => n && n.k === 'ref' && n.table;
const colText = (n, T) => { if (!isCol(n)) throw NOPE; return T.col(n); };
const tblName = n => { if (n && n.k === 'tbl') return n.name; throw NOPE; };
const intArg = n => { if (n && n.k === 'num') return Number(n.v); if (n && n.k === 'neg' && n.a.k === 'num') return (n.v === '-' ? -1 : 1) * Number(n.a.v); throw NOPE; };
const unitArg = (n, T) => { if (n && n.k === 'tbl' && T.unit[n.name.toUpperCase()]) return T.unit[n.name.toUpperCase()]; throw NOPE; };

function filterArg(a, T, ctx) {
  const r = n => say(n, T, ctx);
  if (a.k === 'bin' && /^(=|==|<>|<|>|<=|>=)$/.test(a.op)) return T.cond(r(a.a), T.op[a.op], r(a.b));
  if (a.k === 'bin' && (a.op === '&&' || a.op === '||')) return `${filterArg(a.a, T, ctx)} ${T.op[a.op]} ${filterArg(a.b, T, ctx)}`;
  if (a.k !== 'fn') throw NOPE;
  const A = a.args, f = a.name;
  if (f === 'SAMEPERIODLASTYEAR') return T.sply(colText(A[0], T));
  if (f === 'DATESYTD') return T.ytd(colText(A[0], T));
  if (f === 'DATESQTD') return T.qtd(colText(A[0], T));
  if (f === 'DATESMTD') return T.mtd(colText(A[0], T));
  if (T.prev[f]) return T.prev[f](colText(A[0], T));
  if (f === 'DATEADD' || f === 'PARALLELPERIOD') return T.shift(colText(A[0], T), intArg(A[1]), unitArg(A[2], T));
  if (f === 'DATESINPERIOD' && A.length === 4) { const n = intArg(A[2]); if (n >= 0) throw NOPE; return T.last(colText(A[0], T), -n, unitArg(A[3], T)); }
  if (f === 'ALL' || f === 'REMOVEFILTERS') {
    if (!A.length) throw NOPE;
    if (A.length === 1 && A[0].k === 'tbl') return T.allT(A[0].name);
    return A.map(x => T.allC(colText(x, T))).join(', ');
  }
  if (f === 'ALLEXCEPT') return T.allExcept(tblName(A[0]), A.slice(1).map(x => colText(x, T)));
  if (f === 'ALLSELECTED') return T.allSel(A.length ? (A[0].k === 'tbl' ? A[0].name : colText(A[0], T)) : null);
  if (f === 'KEEPFILTERS') return T.keep(filterArg(A[0], T, ctx));
  if (f === 'USERELATIONSHIP') return T.userel(colText(A[0], T), colText(A[1], T));
  if (f === 'FILTER' && A[0].k === 'fn' && /^(ALL|VALUES|DISTINCT)$/.test(A[0].name) && A[0].args.length === 1 && isCol(A[0].args[0]))
    return T.filterCol(colText(A[0].args[0], T), filterArg(A[1], T, ctx), A[0].name === 'ALL');
  if (f === 'FILTER') { const t = A[0].k === 'tbl' ? A[0].name : say(A[0], T, ctx); return T.filter(t, filterArg(A[1], T, { ...ctx, rowTable: A[0].k === 'tbl' ? A[0].name : null })); }
  if (f === 'NOT') return T.notf(filterArg(A[0], T, ctx));
  throw NOPE;
}

function fn(node, T, ctx) {
  const A = node.args, f = node.name, r = n => say(n, T, ctx);
  if (T.agg[f] && A.length === 1) return T.agg[f](colText(A[0], T));
  if (T.aggx[f] && A.length === 2) { const t = tblName(A[0]); return T.aggx[f](t, say(A[1], T, { ...ctx, rowTable: t })); }
  if (f === 'COUNTROWS' && A.length === 1) return T.countrows(A[0].k === 'tbl' ? A[0].name : r(A[0]));
  if (f === 'DIVIDE' && (A.length === 2 || A.length === 3)) return T.divide(r(A[0]), r(A[1]), A[2] ? r(A[2]) : null);
  if (f === 'CALCULATE' && A.length >= 1) {
    if (A.length === 1) return r(A[0]);
    const fs = A.slice(1).map(a => filterArg(a, T, ctx));
    return fs.length === 1 ? T.calc1(r(A[0]), fs[0]) : T.calc(r(A[0]), fs);
  }
  if (T.total[f] && A.length === 2) return T.total[f](r(A[0])) + ` (${colText(A[1], T)})`;
  if (f === 'IF' && (A.length === 2 || A.length === 3)) return T.iff(cond(A[0], T, ctx), r(A[1]), A[2] ? r(A[2]) : null);
  if (f === 'BLANK' && !A.length) return T.blank;
  if (f === 'SELECTEDVALUE' && (A.length === 1 || A.length === 2)) return T.selected(colText(A[0], T), A[1] ? r(A[1]) : null);
  if (f === 'HASONEVALUE' && A.length === 1) return T.hasone(colText(A[0], T));
  if (f === 'SWITCH' && A.length >= 3) {
    const cases = Math.floor((A.length - 1) / 2) + ((A.length - 1) % 2);
    if (A[0].k === 'fn' && A[0].name === 'TRUE' && !A[0].args.length) return T.switchTrue(cases);
    return T.switchOn(r(A[0]), cases);
  }
  if (f === 'FORMAT' && A.length === 2 && A[1].k === 'str') return T.format(r(A[0]), A[1].v);
  if (f === 'COALESCE' && A.length >= 2) return T.coalesce(A.map(r));
  if (f === 'ABS' && A.length === 1) return T.abs(r(A[0]));
  if ((f === 'ROUND' || f === 'ROUNDUP' || f === 'ROUNDDOWN') && A.length === 2) return T.round(r(A[0]), intArg(A[1]));
  if (f === 'TRUE' && !A.length) return say({ k: 'bool', v: 'TRUE' }, T, ctx);
  if (f === 'FALSE' && !A.length) return say({ k: 'bool', v: 'FALSE' }, T, ctx);
  throw NOPE;
}
function cond(c, T, ctx) {
  if (c.k === 'fn' && c.name === 'ISBLANK' && c.args.length === 1) return T.isblank(say(c.args[0], T, ctx));
  if (c.k === 'fn' && c.name === 'HASONEVALUE') return fn(c, T, ctx);
  if (c.k === 'fn' && c.name === 'NOT' && c.args.length === 1) return T.notf(cond(c.args[0], T, ctx));
  if (c.k === 'bin') return say(c, T, ctx);
  throw NOPE;
}

/**
 * Bir measure formülünü açıklar. Tanınmayan bir parça varsa null döner.
 * measureNames: modeldeki measure adları (köşeli parantezli [Ad] başvurusunun measure mı sütun mu olduğunu ayırmak için)
 */
export function explainDax(expr, lang = 'tr', measureNames = new Set()) {
  const src = String(expr || '').trim();
  if (!src || /^\s*(VAR|EVALUATE|DEFINE)\b/i.test(src) || /\bRETURN\b/i.test(src)) return null;
  const tree = parse(src); if (!tree) return null;
  const T = L[lang] || L.tr;
  const ctx = { isMeasure: n => measureNames.has(String(n).toLowerCase()), rowTable: null };
  try {
    const out = say(tree, T, ctx);
    if (!out || out.length > 400) return null;
    return out.charAt(0).toLocaleUpperCase(lang === 'tr' ? 'tr' : 'en') + out.slice(1) + '.';
  } catch (e) { if (e === NOPE) return null; throw e; }
}

/** Sonuçtaki her measure için açıklama: modeldeki açıklama (yazarın) önce gelir. */
export function explainAll(res, lang = 'tr') {
  const names = new Set(res.nodes.filter(n => n.kind === 'measure').map(n => n.name.toLowerCase()));
  const out = new Map();
  res.nodes.filter(n => n.kind === 'measure' && n.expr != null).forEach(n => {
    if (n.description) out.set(n.id, { text: n.description, by: 'author' });
    else { const t = explainDax(n.expr, lang, names); if (t) out.set(n.id, { text: t, by: 'rule' }); }
  });
  return out;
}
