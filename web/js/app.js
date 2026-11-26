// Measure Sieve · tarayıcı arayüzü
// Dosyaları okur, çekirdeğe (core.js) verir ve sonucu çizer. Hesap yapmaz; tüm kararlar çekirdekte.
import { extractGroup, buildProjects, analyze, removalPlan, teScript, sniff, STATUS_ORDER, CANDIDATE, norm, nodeLabel, tokenizeDax, readZipEntry, entryLimit, LIMITS } from './core.js';
import { makeT, reasonText, noteText, usageText, listNames, LANGS } from './i18n.js';
import { sampleEntries, sampleName } from './sample.js';
import { cleanupPlan, buildCleanFiles, verifyCopy, packCopy } from './clean.js';
import { buildLineage } from './lineage.js';
import { explainAll } from './explain.js';
import { docHeadHtml, docTabsHtml, docBodyHtml, exportHtml, defaultStart, DOC_TABS } from './docview.js';
import { handoverMarkdown, handoverHtml } from './docgen.js';

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PAGE = 150;
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* özel pencere */ } } };

/* ---------- Dil ---------- */
function pickLang() {
  try { const q = new URLSearchParams(location.search).get('lang'); if (LANGS.includes(q)) return q; } catch (e) { /* yok */ }
  const s = store.get('measure-sieve.lang'); if (LANGS.includes(s)) return s;
  return /^tr\b/i.test(navigator.language || 'tr') ? 'tr' : 'en';
}
let lang = pickLang(), t = makeT(lang);
function applyStatic() {
  document.documentElement.lang = lang;
  document.title = t('doc.title');
  const md = document.querySelector('meta[name=description]'); if (md) md.content = t('doc.desc');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(',').forEach(p => { const [a, k] = p.split(':'); el.setAttribute(a, t(k)); }));
  $('#langSwitch').lang = lang === 'tr' ? 'en' : 'tr';
}

/* ---------- Durum ---------- */
const state = { extractions: [], projects: [], pi: 0, res: null, tab: 'measure', filter: 'all', q: '', open: new Set(), selected: new Set(), sample: true, loadNotes: [], busy: false, limit: PAGE,
  mode: /^#(belgele|document)$/i.test(location.hash) ? 'doc' : 'clean', doc: { tab: 'lineage', start: null, q: '', by: '', to: '', msg: '' }, lin: null, ex: null };
/** Soyağacı ve açıklamalar yalnız Belgele açılınca hesaplanır (Temizle'yi yavaşlatmasın). */
function docData() {
  const R = state.res; if (!R) return null;
  if (!state.lin) { state.lin = buildLineage(R); state.doc.start = defaultStart(R, state.lin); }
  if (!state.ex) state.ex = explainAll(R, lang);
  return { R, L: state.lin, EX: state.ex };
}
const key = (kind, id) => (kind === 'table' ? 't:' : 'n:') + id;

function setProjects(extractions) {
  const { projects, notes } = buildProjects(extractions);
  state.projects = projects; state.projectNotes = notes;
  const best = projects.reduce((b, p, i) => (p.model && p.reports.length && (b < 0 || !projects[b].reports.length)) ? i : b, -1);
  selectProject(best >= 0 ? best : 0);
}
function selectProject(i) {
  state.pi = i;
  const p = state.projects[i];
  state.res = p ? analyze(p) : null; resetClean(); state.lin = null; state.ex = null; state.doc.q = ''; state.doc.msg = '';
  state.selected = new Set(); state.filter = 'all'; state.q = ''; state.limit = PAGE; $('#search').value = '';
  if (state.res) {
    state.res.items.filter(n => n.kind === 'measure' && CANDIDATE(n.status) && n.origin !== 'reportOnly').forEach(n => state.selected.add(key('node', n.id)));
    const counts = k => state.res.items.filter(n => n.kind === k).length;
    if (!counts(state.tab) && state.tab !== 'table') state.tab = counts('measure') ? 'measure' : 'column';
    const first = sorted().find(n => n.status === 'unused' && n.uses && n.uses.size) || sorted()[0];
    state.open = new Set(first ? [rowKey(first)] : []);
  }
}

/* ---------- Dosya okuma ---------- */
async function zipGroup(file) {
  if (file.size > LIMITS.fileBytes) throw { code: 'tooLarge' };
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const kind = sniff(head);
  if (kind === 'protected') throw { code: 'protected' };
  if (kind !== 'zip') throw { code: 'notZip' };
  const zip = await window.JSZip.loadAsync(file), entries = [];
  zip.forEach((p, e) => { if (!e.dir) entries.push({ path: p, read: () => readZipEntry(e, entryLimit(p)) }); });
  return { label: file.name, kind: 'zip', entries };
}
async function ingest(items) {
  if (!items.length) return;
  const groups = [], notes = [], loose = [];
  if (typeof window.JSZip === 'undefined' && items.some(i => /\.(pbit|pbix|zip)$/i.test(i.file.name))) { state.loadNotes = [{ code: 'zipMissing', err: true }]; render(); return; }
  setBusy(true);
  try {
    for (const it of items) {
      if (/\.(pbit|pbix|zip)$/i.test(it.file.name)) {
        try { groups.push(await zipGroup(it.file)); }
        catch (err) { notes.push({ code: err && err.code ? err.code : 'notZip', err: true, args: { name: it.file.name } }); }
      } else loose.push(it); // klasörün tamamı (veri önbelleği dahil): temizlenmiş kopya için gerekir
    }
    if (!groups.length && !loose.length && !notes.length) notes.push({ code: 'unsupported', err: true, args: { name: items[0].file.name } });
    if (loose.length && !loose.some(i => /\.(json|tmdl|bim|pbir|pbism|pbip)$/i.test(i.file.name))) { notes.push({ code: 'unsupported', err: true, args: { name: loose[0].file.name } }); loose.length = 0; }
    if (loose.length) {
      if (loose.length === 1 && /\.pbip$/i.test(loose[0].file.name)) notes.push({ code: 'pbipPointer', err: true, args: { name: loose[0].file.name } });
      else {
        const first = loose[0].path || loose[0].file.name, top = first.includes('/') ? first.split('/')[0] : loose[0].file.name;
        // Okunacak metin dosyalarına boyut sınırı (veri önbelleği gibi büyük dosyalar yalnız kopyaya aynen aktarılır)
        groups.push({ label: top, kind: 'folder', entries: loose.map(i => ({ path: i.path || i.file.name, read: async () => {
          if (i.file.size > (/\.(json|tmdl|bim|pbir|pbism|pbip)$/i.test(i.file.name) ? LIMITS.entryBytes : LIMITS.fileBytes)) throw Object.assign(new Error('tooLarge'), { code: 'tooLarge' });
          return new Uint8Array(await i.file.arrayBuffer());
        } })) });
      }
    }
    const extracted = [];
    for (const g of groups) extracted.push(await extractGroup(g));
    const useful = extracted.filter(x => x.models.length || x.reports.length);
    extracted.filter(x => !x.models.length && !x.reports.length).forEach(x => notes.push({ code: 'noContent', err: true, args: { name: x.label } }));
    if (useful.length) {
      if (state.sample) { state.extractions = []; state.sample = false; }
      state.extractions.push(...useful);
      setProjects(state.extractions);
    }
    state.loadNotes = notes;
  } finally { setBusy(false); }
  render();
}
async function walkEntry(entry, prefix, out) {
  if (entry.isFile) { const file = await new Promise((res, rej) => entry.file(res, rej)); out.push({ file, path: prefix + entry.name }); return; }
  if (entry.isDirectory) {
    const r = entry.createReader(); let batch;
    do { batch = await new Promise((res, rej) => r.readEntries(res, rej)); for (const c of batch) await walkEntry(c, prefix + entry.name + '/', out); } while (batch.length);
  }
}
function setBusy(b) {
  state.busy = b; $('#pickFile').disabled = b; $('#pickDir').disabled = b;
  $('#pickFile').textContent = b ? t('drop.busy') : t('drop.file');
}

/* ---------- Seçiciler ---------- */
const rowKey = x => x.nodes && Array.isArray(x.nodes) ? key('table', x.id) : key('node', x.id);
function itemsOfTab() { const R = state.res; if (!R) return []; return state.tab === 'table' ? R.tableItems : R.items.filter(n => n.kind === state.tab); }
function sorted() {
  return [...itemsOfTab()].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || (a.table || '').localeCompare(b.table || '', lang) || a.name.localeCompare(b.name, lang));
}
const itemLabel = x => x.nodes && Array.isArray(x.nodes) ? x.name : (x.kind === 'column' ? `${x.table}[${x.name}]` : x.name);

/* ---------- Çizim ---------- */
function renderTabs() {
  const R = state.res, c = k => !R ? 0 : (k === 'table' ? R.tableItems.length : R.items.filter(n => n.kind === k).length);
  $('#tabs').innerHTML = ['measure', 'column', 'table'].map(k => `<button class="tab" role="tab" type="button" data-tab="${esc(k)}" aria-selected="${esc(state.tab === k)}">${esc(t('tab.' + k))}<b>${c(k)}</b></button>`).join('');
  const mp = $('#modelpick'); mp.hidden = state.projects.length < 2;
  if (!mp.hidden) $('#modelSelect').innerHTML = state.projects.map((p, i) => `<option value="${esc(i)}" ${i === state.pi ? 'selected' : ''}>${esc(p.label)}${p.model ? '' : ' (PBIX)'}</option>`).join('');
}
function renderTop() {
  const R = state.res;
  renderTabs();
  $('#reset').hidden = state.sample;
  $('#sources').innerHTML = state.sample ? `<span class="source sample">${esc(t('sample.badge'))}</span>` : state.extractions.map(x => `<span class="source">${esc(x.label)}</span>`).join('');
  if (!R) { $('#headline').textContent = ''; $('#scope').textContent = ''; $('#sieve').innerHTML = ''; $('#chips').innerHTML = ''; $('#notices').innerHTML = notesHtml(state.loadNotes); return; }
  const items = itemsOfTab(), n = s => items.filter(x => x.status === s).length, cand = n('unused') + n('chain'), rev = n('review');
  let head;
  if (!R.hasModel) head = esc(t('head.noModel', { n: R.items.filter(x => x.kind === 'measure').length }));
  else if (!R.hasReport) head = esc(t('head.noReport', { n: R.items.filter(x => x.kind === 'measure').length }));
  else if (!cand && !rev) head = esc(t('head.allUsed.' + state.tab, { n: items.length }));
  else head = t('head.cand.' + state.tab, { n: items.length, c: cand }) + (rev ? esc(t('head.review', { r: rev })) : '');
  $('#headline').innerHTML = head;
  const reps = R.reports;
  $('#scope').textContent = state.sample ? t('scope.sample') : R.hasReport ? t('scope.files', { r: reps.length, p: reps.reduce((a, x) => a + x.pages, 0), v: reps.reduce((a, x) => a + x.visuals, 0) }) : '';
  const notes = [...state.loadNotes, ...(state.projectNotes || []), ...R.notes];
  if (!R.hasModel && R.binary) notes.push({ code: 'binary' });
  else if (!R.hasModel && R.live) notes.push({ code: 'live' });
  if (!R.hasReport && R.hasModel) notes.push({ code: 'noReport' });
  let html = notesHtml(notes);
  if (R.duplicates.length && state.tab === 'measure') {
    html += `<div class="notice info"><b>${esc(t('dup.title', { n: R.duplicates.length }))}</b><span>${esc(t('dup.text'))}</span><div class="links">${R.duplicates.map(g => g.map(id => `<button class="jump" type="button" data-jump="n:${esc(id)}">${esc(R.nodes[id].name)}</button>`).join(' = ')).join('<span class="muted">·</span>')}</div></div>`;
  }
  if (R.autoDate && state.tab !== 'measure') html += `<div class="notice info"><b>${esc(t('auto.title', { n: R.autoDate }))}</b><span>${esc(t('auto.text'))}</span></div>`;
  $('#notices').innerHTML = html;
  const list = sorted(), sieve = $('#sieve');
  sieve.classList.toggle('dense', list.length > 80);
  sieve.setAttribute('aria-label', t('tab.' + state.tab));
  sieve.innerHTML = list.slice(0, 600).map(x => `<button class="cell" type="button" data-s="${esc(x.status)}" data-jump="${esc(rowKey(x))}" title="${esc(itemLabel(x))}: ${esc(t('st.' + x.status))}" aria-label="${esc(itemLabel(x))}: ${esc(t('st.' + x.status))}"></button>`).join('');
  const present = STATUS_ORDER.filter(s => n(s));
  $('#chips').innerHTML = [`<button class="chip" type="button" data-filter="all" aria-pressed="${esc(state.filter === 'all')}"><b>${items.length}</b> ${esc(t('chip.all'))}</button>`,
    ...present.map(s => `<button class="chip" type="button" data-filter="${esc(s)}" aria-pressed="${esc(state.filter === s)}"><span class="cell small" data-s="${esc(s)}"></span><b>${n(s)}</b> ${esc(t('st.' + s))}</button>`)].join('');
}
function notesHtml(notes) {
  const seen = new Set();
  return notes.map(x => noteText(t, x)).filter(x => { const k = x.title + x.text; if (seen.has(k)) return false; seen.add(k); return true; })
    .map(x => `<div class="notice${esc(x.err ? ' err' : '')}"><b>${esc(x.title)}</b><span>${esc(x.text)}</span></div>`).join('');
}
function formulaHtml(n, R) {
  if (n.expr == null) return `<p class="muted m0">${esc(t('d.noFormula'))}</p>`;
  const html = tokenizeDax(n.expr).map(tok => {
    if (tok.t === 'comment') return `<span class="cm">${esc(tok.v)}</span>`;
    if (tok.t === 'string') return `<span class="st">${esc(tok.v)}</span>`;
    if (tok.t === 'ref') {
      const d = [...n.uses].map(i => R.nodes[i]).find(x => norm(x.name) === norm(tok.name) && (!tok.table || norm(x.table) === norm(tok.table) || x.kind === 'measure'));
      return d ? `<button class="jump" type="button" data-jump="n:${esc(d.id)}">${esc(tok.v)}</button>` : `<span class="rf">${esc(tok.v)}</span>`;
    }
    return esc(tok.v);
  }).join('');
  return `<pre class="dax">${html}</pre>`;
}
const jumpList = (ids, R) => `<div class="links">${[...ids].map(i => `<button class="jump" type="button" data-jump="n:${esc(i)}">${esc(nodeLabel(R.nodes[i]))}</button>`).join('')}</div>`;
function detailHtml(x, R) {
  const multi = R.reports.length > 1;
  if (x.nodes && Array.isArray(x.nodes)) {
    const mem = x.nodes.map(i => R.nodes[i]).sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    return `<div class="detail">
      ${x.calculated && x.expr ? `<div><h3>${esc(t('d.tableFormula'))}</h3>${formulaHtml({ expr: x.expr, uses: new Set() }, R)}</div>` : ''}
      <div><h3>${esc(t('d.members'))}</h3><ul class="members">${mem.map(m => `<li><span class="cell small" data-s="${esc(m.status)}"></span><button class="jump" type="button" data-jump="n:${esc(m.id)}">${esc(m.name)}</button><span class="muted">${esc(t('kind.' + m.kind))}</span></li>`).join('')}</ul></div>
    </div>`;
  }
  const where = x.usages.map(u => { const s = usageText(t, u, multi); return `<li>${esc(s.place)} <span>· ${esc(s.extra)}</span></li>`; });
  x.structural.forEach(s => where.push(`<li>${esc(s.label)} <span>· ${esc(t('what.' + s.what))}</span></li>`));
  [...new Set(x.textRefs.map(r => r.name))].forEach(nm => where.push(`<li>${esc(nm)} <span>· ${esc(t('d.textRef'))}</span></li>`));
  const formula = x.kind === 'measure' || x.calculated ? formulaHtml(x, R) : `<p class="muted m0">${esc(t('d.dataColumn'))}</p>`;
  return `<div class="detail">
    <div><h3>${esc(t('d.formula'))}</h3>${formula}</div>
    ${where.length ? `<div><h3>${esc(t('d.where'))}</h3><ul class="uses">${where.join('')}</ul></div>` : ''}
    ${x.duplicates.length ? `<div><h3>${esc(t('d.dups'))}</h3>${jumpList(x.duplicates, R)}</div>` : ''}
    ${x.usedBy.size ? `<div><h3>${esc(t('d.usedBy'))}</h3>${jumpList(x.usedBy, R)}</div>` : ''}
    ${x.uses.size ? `<div><h3>${esc(t('d.uses'))}</h3>${jumpList(x.uses, R)}</div>` : ''}
    ${R.hasModel && x.origin !== 'reportOnly' ? `<div><button class="btn" type="button" data-lin="node:${esc(x.id)}">${esc(t('d.lineage'))}</button></div>` : ''}
  </div>`;
}
function renderList() {
  const R = state.res;
  if (!R) { $('#list').innerHTML = ''; $('#missing').innerHTML = ''; $('#more').innerHTML = ''; return; }
  const q = norm(state.q);
  const rows = sorted().filter(x => (state.filter === 'all' || x.status === state.filter) && (!q || norm(x.name).includes(q) || norm(x.table).includes(q) || norm(x.expr || '').includes(q)));
  const shown = rows.slice(0, state.limit);
  $('#list').innerHTML = shown.length ? shown.map(x => {
    const k = rowKey(x), open = state.open.has(k), isTable = k[0] === 't';
    const tags = [];
    if (x.hidden) tags.push(`<span class="tag">${esc(t('tag.hidden'))}</span>`);
    if (!isTable && x.kind === 'column' && x.calculated) tags.push(`<span class="tag">${esc(t('tag.calc'))}</span>`);
    if (!isTable && x.origin === 'report') tags.push(`<span class="tag">${esc(t('tag.reportMeasure'))}</span>`);
    if (!isTable && x.duplicates && x.duplicates.length) tags.push(`<span class="tag dup">${esc(t('tag.dup'))}</span>`);
    const sub = isTable ? '' : (x.table ? esc(x.table) + ' · ' : '');
    const disabled = (!isTable && x.origin === 'reportOnly') || !R.hasModel;
    return `<li class="row" id="row-${esc(k.replace(':', '-'))}">
      <div class="rowhead">
        <input type="checkbox" id="sel-${esc(k.replace(':', '-'))}" data-sel="${esc(k)}" ${state.selected.has(k) ? 'checked' : ''} aria-label="${esc(t('row.select', { name: itemLabel(x) }))}" ${disabled ? 'disabled' : ''}>
        <button class="rowmain" type="button" data-toggle="${esc(k)}" aria-expanded="${esc(open)}">
          <span class="rowname">${esc(x.name)}${tags.join('')}</span>
          <span class="rowwhy">${sub}${esc(reasonText(t, x.reason))}</span>
        </button>
        <span class="pill" data-s="${esc(x.status)}">${esc(t('st.' + x.status))}</span>
      </div>
      ${open ? detailHtml(x, R) : ''}
    </li>`;
  }).join('') : `<li class="empty">${esc(t('empty'))}</li>`;
  $('#more').innerHTML = rows.length > shown.length ? `<button class="btn morebtn" type="button" id="showMore">${esc(lang === 'tr' ? `${rows.length - shown.length} öğe daha göster` : `Show ${rows.length - shown.length} more`)}</button>` : '';
  const miss = R.missing;
  $('#missing').innerHTML = miss.length ? `<div class="notice err mt12"><b>${esc(t('miss.title', { n: miss.length }))}</b><span>${esc(t('miss.text', { names: listNames(t, miss.map(m => m.type === 'measure' ? m.name : `${m.table}[${m.name}]`), 6) }))}</span></div>` : '';
}
function selection() {
  return [...state.selected].map(k => ({ kind: k[0] === 't' ? 'table' : 'node', id: +k.slice(2) }));
}
function renderPanel() {
  const R = state.res;
  if (!R) { $('#panel').innerHTML = `<h2>${esc(t('panel.title'))}</h2><p class="muted">${esc(t('panel.empty'))}</p>`; return; }
  const plan = removalPlan(R, selection());
  const warn = plan.warnings.map(w => {
    if (w.code === 'breaks') return t('w.breaks', { label: esc(w.label), names: esc(listNames(t, w.names, 3)) });
    if (w.code === 'inReport') return t('w.inReport', { label: esc(w.label), n: w.n });
    return t('w.structural', { label: esc(w.label), what: esc(t('what.' + w.what)) });
  });
  const hasReport = plan.units.some(u => u.kind === 'node' && R.nodes[u.id].origin === 'report');
  const hasData = plan.units.some(u => u.kind === 'node' && R.nodes[u.id].kind === 'column' && !R.nodes[u.id].calculated);
  $('#panel').innerHTML = `<h2>${esc(t('panel.title'))}</h2>
    ${plan.units.length ? `
      <p class="muted">${esc(t('panel.count', { n: plan.units.length }))}</p>
      <ol class="order">${plan.labels.map(l => `<li>${esc(l)}</li>`).join('')}</ol>
      ${warn.length ? `<div class="impact warn"><b>${esc(t('panel.warn'))}</b><ul>${warn.slice(0, 6).map(w => `<li>${w}</li>`).join('')}</ul>${warn.length > 6 ? `<span>${esc(t('panel.more', { n: warn.length - 6 }))}</span>` : ''}</div>`
        : `<div class="impact"><b>${esc(t('panel.safe'))}</b><span>${esc(t('panel.safeSub'))}</span></div>`}
      <div class="btns">
        <button class="btn primary" type="button" data-copy="script">${esc(t('btn.script'))}</button>
        ${hasData ? `<button class="btn" type="button" data-copy="pq">${esc(t('btn.pq'))}</button>` : ''}
        <button class="btn" type="button" data-copy="list">${esc(t('btn.list'))}</button>
      </div>
      ${hasData ? `<p class="muted fs13">${esc(t('panel.pqNote'))}</p>` : ''}
      ${hasReport ? `<p class="muted fs13">${esc(t('panel.reportNote'))}</p>` : ''}
    ` : `<p class="muted">${esc(t('panel.empty'))}</p>`}
    <button class="btn" type="button" data-copy="tsv">${esc(t('btn.tsv'))}</button>
    <div class="copied" id="copied" role="status"></div>
    <textarea id="out" readonly hidden aria-label="${esc(t('out.label'))}"></textarea>
    ${plan.units.length && R.hasModel && R.source ? cleanHtml(R) : ''}`;
}

/* ---------- Temizlenmiş kopya ---------- */
function resetClean() { if (state.clean && state.clean.url) URL.revokeObjectURL(state.clean.url); state.clean = null; }
function cleanHtml(R) {
  const fmt = R.source.format;
  let body;
  if (fmt === 'pbix') body = `<p class="muted fs135">${t('c.pbix')}</p>`;
  else {
    const c = state.clean;
    body = `<p class="muted fs135">${esc(t('c.lead'))}</p>
      <button class="btn" type="button" id="buildClean" ${c && c.busy ? 'disabled' : ''}>${esc(c && c.busy ? t('c.busy') : t('c.btn'))}</button>`;
    if (c && c.err) body += `<div class="impact warn"><b>${esc(t('c.err', { why: c.err }))}</b></div>`;
    if (c && c.none) body += `<p class="muted fs135">${esc(t('c.none'))}</p>`;
    if (c && c.v) {
      const v = c.v, k = v.counts;
      body += `<div class="impact${esc(v.ok ? '' : ' warn')}"><b>${esc(t(v.ok ? 'c.ok' : 'c.fail'))}</b>
        <span>${esc(t('c.counts', { mb: k.before.measure, ma: k.after.measure, cb: k.before.column, ca: k.after.column, tb: k.before.table, ta: k.after.table }))}</span>
        <ul class="checks">${v.checks.map(ch => `<li data-ok="${esc(ch.ok)}"><span aria-hidden="true">${ch.ok ? '✓' : '✗'}</span> ${esc(t('chk.' + ch.code))}${ch.ok ? '' : ': ' + esc(listNames(t, ch.items, 4))}</li>`).join('')}</ul></div>
        ${c.url ? `<button class="btn primary" type="button" id="saveClean">${esc(t('c.download', { name: c.name }))}</button><div class="copied" role="status">${esc(c.saveMsg || '')}</div><p class="muted fs125">${esc(t('c.downloadNote'))}</p>` : ''}
        <p class="muted fs13">${esc(t('c.next'))}</p>`;
    }
    if (c && c.plan && c.plan.skipped.length) {
      body += `<details class="skipped"><summary>${esc(t('c.skippedTitle', { n: c.plan.skipped.length }))}</summary><ul>${c.plan.skipped.slice(0, 40).map(x => `<li><b>${esc(x.label)}</b> · ${esc(t('sk.' + x.code, { detail: x.code === 'structural' ? t('what.' + x.detail) : x.detail }))}</li>`).join('')}${c.plan.skipped.length > 40 ? `<li>…</li>` : ''}</ul></details>`;
    }
  }
  return `<div class="cleanbox"><h2>${esc(t('c.title'))}</h2>${body}</div>`;
}
async function buildClean() {
  const R = state.res; resetClean(); state.clean = { busy: true }; renderPanel();
  try {
    const plan = cleanupPlan(R, selection());
    if (!plan.removedUnits.length) { state.clean = { none: true, plan }; renderPanel(); return; }
    const out = await buildCleanFiles(R, plan.rm);
    const v = await verifyCopy(R, R.source.group, out, plan);
    const bytes = await packCopy(R.source.group, out, window.JSZip);
    // Dosya adında Türkçe ve özel karakter kullanma: bazı tarayıcı ve sistemler adı bozar
    const ascii = x => x.replace(/[çÇğĞıİöÖşŞüÜ]/g, ch => ({ ç: 'c', Ç: 'C', ğ: 'g', Ğ: 'G', ı: 'i', İ: 'I', ö: 'o', Ö: 'O', ş: 's', Ş: 'S', ü: 'u', Ü: 'U' }[ch])).normalize('NFKD').replace(/[^\w.\- ]+/g, '').trim() || 'model';
    const base = ascii(R.source.group.label.replace(/\.(pbit|zip)$/i, ''));
    const name = R.source.format === 'pbit' ? `${base}.${lang === 'tr' ? 'temiz' : 'clean'}.pbit` : `${base}-${lang === 'tr' ? 'temiz' : 'clean'}.zip`;
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }));
    state.clean = { plan, v, url, name, bytes };
  } catch (e) { state.clean = { err: String(e && e.message || e) }; }
  renderPanel();
}
function renderMode() {
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === state.mode)));
  const doc = state.mode === 'doc';
  $('#docmode').hidden = !doc; document.querySelector('.verdict').hidden = doc; $('#work').hidden = doc;
}
function renderDoc() {
  if (state.mode !== 'doc') return;
  const d = docData();
  if (!d) { $('#docHead').textContent = ''; $('#docBody').innerHTML = ''; $('#dtabs').innerHTML = ''; $('#exportBox').innerHTML = ''; $('#docNotices').innerHTML = notesHtml(state.loadNotes); return; }
  $('#docHead').innerHTML = docHeadHtml(t, d.R, d.L);
  $('#docNotices').innerHTML = notesHtml(state.loadNotes);
  $('#exportBox').innerHTML = d.R.hasModel ? exportHtml(t, state.doc) : '';
  $('#dtabs').innerHTML = d.R.hasModel ? docTabsHtml(t, state.doc) : '';
  $('#docBody').innerHTML = docBodyHtml(t, d.R, d.L, d.EX, state.doc);
}
function renderDocBody() { const d = docData(); if (d) $('#docBody').innerHTML = docBodyHtml(t, d.R, d.L, d.EX, state.doc); }
function render() { renderMode(); renderTop(); renderList(); renderPanel(); renderDoc(); }
function setMode(m, opts = {}) {
  state.mode = m; renderMode(); if (m === 'doc') renderDoc(); else { renderTop(); renderList(); renderPanel(); }
  try { history.replaceState(null, '', m === 'doc' ? '#' + (lang === 'tr' ? 'belgele' : 'document') : location.pathname + location.search); } catch (e) { /* çerçeve izin vermeyebilir */ }
  if (opts.focus !== false) {
    const el = document.querySelector(`[data-mode="${m}"]`); if (el) el.focus({ preventScroll: true });
    // Telefonda mod içeriği ilk ekranın altında kalıyordu: seçim çubuğunu üste getir
    const bar = $('#modes'); if (bar && bar.getBoundingClientRect().top > innerHeight * 0.35) bar.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}
/** Belgele: bir başlangıçtan soyağacını aç */
function openLineage(kind, id) {
  docData(); state.doc.tab = 'lineage'; state.doc.start = { kind, id };
  if (state.mode !== 'doc') setMode('doc', { focus: false }); else renderDoc();
  const g = $('#docBody'); if (g) g.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
/* ---------- Devir belgesi ---------- */
function exportDoc(kind) {
  const d = docData(); if (!d || !d.R.hasModel) return;
  const meta = { by: state.doc.by, to: state.doc.to, date: new Date().toISOString().slice(0, 10), file: state.sample ? sampleName(lang) : state.extractions.map(x => x.label).join(', ') };
  const ascii = x => x.replace(/[çÇğĞıİöÖşŞüÜ]/g, ch => ({ ç: 'c', Ç: 'C', ğ: 'g', Ğ: 'G', ı: 'i', İ: 'I', ö: 'o', Ö: 'O', ş: 's', Ş: 'S', ü: 'u', Ü: 'U' }[ch])).normalize('NFKD').replace(/[^\w.\- ]+/g, '').trim() || 'model';
  const base = ascii((meta.file.split(',')[0] || 'model').replace(/\.(pbix|pbit|pbip|zip)$/i, '')) + (lang === 'tr' ? '-devir-belgesi' : '-handover');
  if (kind === 'md') {
    const text = handoverMarkdown(t, d.R, d.L, d.EX, meta), name = base + '.md';
    download(new Blob([text], { type: 'text/markdown;charset=utf-8' }), name);
    state.doc.msg = t('ex.done', { name });
  } else {
    const html = handoverHtml(t, d.R, d.L, d.EX, meta, lang), name = base + '.html';
    download(new Blob([html], { type: 'text/html;charset=utf-8' }), name);
    state.doc.msg = t('ex.done', { name });
  }
  const m = $('#exMsg'); if (m) m.textContent = state.doc.msg;
}
async function download(blob, name) {
  let dl = null;
  try { dl = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('downloads') : null; } catch (e) { dl = null; }
  if (dl) { try { await dl.save({ filename: name, data: blob }); } catch (e) { /* kullanıcı vazgeçti */ } return; }
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ---------- Kopyalama ---------- */
function outputs(kind) {
  const R = state.res, plan = removalPlan(R, selection());
  if (kind === 'list') return plan.labels.map((l, i) => `${i + 1}. ${l}`).join('\n');
  if (kind === 'script') return teScript(R, plan, t).script;
  if (kind === 'pq') return teScript(R, plan, t).powerQuery;
  const clean = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  // Excel formül enjeksiyonuna karşı: =, +, -, @ ile başlayan metne ' eklenir; sayılar olduğu gibi kalır
  const cell = v => { const x = clean(v); return /^[=+\-@\t\r]/.test(x) && !/^[+-]?\d[\d.,]*$/.test(x) ? "'" + x : x; };
  const rows = [t('tsv.head')];
  R.items.forEach(n => rows.push([t('kind.' + n.kind), n.table, n.name, t('st.' + n.status), reasonText(t, n.reason), n.usages.length + n.usedBy.size + n.structural.length, n.expr].map(cell).join('\t')));
  R.tableItems.forEach(x => rows.push([t('kind.table'), '', x.name, t('st.' + x.status), reasonText(t, x.reason), '', ''].map(cell).join('\t')));
  return rows.join('\n');
}
async function copyOut(kind) {
  const text = outputs(kind), out = $('#out'), msg = $('#copied');
  try { await navigator.clipboard.writeText(text); msg.textContent = t('copied.' + kind); out.hidden = true; }
  catch (e) { out.hidden = false; out.value = text; out.focus(); out.select(); msg.textContent = t('copied.fail'); }
}

/* ---------- Olaylar ---------- */
function jumpTo(k) {
  const R = state.res; if (!R) return;
  const isTable = k[0] === 't', id = +k.slice(2);
  state.tab = isTable ? 'table' : R.nodes[id].kind; state.filter = 'all'; state.q = ''; $('#search').value = '';
  const idx = sorted().findIndex(x => rowKey(x) === k); if (idx >= state.limit) state.limit = idx + 1;
  state.open.add(k); renderTop(); renderList();
  const el = document.getElementById('row-' + k.replace(':', '-'));
  if (el) { el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); el.querySelector('.rowmain').focus({ preventScroll: true }); }
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-jump],[data-toggle],[data-filter],[data-copy],[data-tab],#showMore'); if (!el) return;
  if (el.id === 'showMore') { state.limit += PAGE; renderList(); return; }
  if (el.dataset.jump) { jumpTo(el.dataset.jump); return; }
  if (el.dataset.toggle) { const k = el.dataset.toggle; state.open.has(k) ? state.open.delete(k) : state.open.add(k); renderList(); const b = document.querySelector(`[data-toggle="${esc(k)}"]`); if (b) b.focus(); return; }
  if (el.dataset.tab) { state.tab = el.dataset.tab; state.filter = 'all'; state.limit = PAGE; renderTop(); renderList(); document.querySelector(`[data-tab="${esc(state.tab)}"]`).focus(); return; }
  if (el.dataset.filter) { state.filter = el.dataset.filter; state.limit = PAGE; renderTop(); renderList(); return; }
  if (el.dataset.copy) copyOut(el.dataset.copy);
});
document.addEventListener('click', e => { if (e.target.closest('#buildClean')) buildClean(); if (e.target.closest('#saveClean')) saveClean(); });
// Belgele olayları
document.addEventListener('click', e => {
  const el = e.target.closest('[data-mode],[data-dtab],[data-lin],[data-toclean],[data-export],[data-table]'); if (!el) return;
  if (el.dataset.mode) { if (el.dataset.mode !== state.mode) setMode(el.dataset.mode); return; }
  if (el.dataset.dtab) { state.doc.tab = el.dataset.dtab; renderDoc(); const b = document.querySelector(`[data-dtab="${esc(state.doc.tab)}"]`); if (b) b.focus(); return; }
  if (el.dataset.lin) { const [k, id] = el.dataset.lin.split(':'); openLineage(k, +id); return; }
  if (el.dataset.toclean) { setMode('clean', { focus: false }); jumpTo(el.dataset.toclean); return; }
  if (el.dataset.export) { exportDoc(el.dataset.export); return; }
  if (el.dataset.table != null) openLineage('table', +el.dataset.table);
});
document.addEventListener('keydown', e => {
  const g = e.target.closest && e.target.closest('[data-table]');
  if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLineage('table', +g.dataset.table); }
  // Sekmeler arasında ok tuşlarıyla gezinme
  const tab = e.target.closest && e.target.closest('[data-dtab],[data-mode]');
  if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    const list = [...tab.parentElement.querySelectorAll(tab.dataset.dtab ? '[data-dtab]' : '[data-mode]')], i = list.indexOf(tab);
    const nx = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length]; nx.click(); nx.focus();
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'linStart') { const [k, id] = e.target.value.split(':'); state.doc.start = { kind: k, id: +id }; renderDocBody(); const s = $('#linStart'); if (s) s.focus(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'msNoExp') { state.doc.noExp = e.target.checked; renderDocBody(); const s = $('#msNoExp'); if (s) s.focus(); return; }
  if (e.target.id === 'msSearch') { state.doc.q = e.target.value; const pos = e.target.selectionStart; renderDocBody(); const s = $('#msSearch'); if (s) { s.focus(); s.setSelectionRange(pos, pos); } }
  if (e.target.id === 'exBy') state.doc.by = e.target.value;
  if (e.target.id === 'exTo') state.doc.to = e.target.value;
});

/** Kopyayı kaydet: claude.ai içinde "downloads" yeteneğiyle, kendi sitede normal indirme bağlantısıyla. */
async function saveClean() {
  const c = state.clean; if (!c || !c.url) return;
  let dl = null;
  try { dl = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('downloads') : null; } catch (e) { dl = null; }
  if (dl) {
    let name = c.name, data = new Blob([c.bytes]);
    if (/\.pbit$/i.test(name)) { const z = new window.JSZip(); z.file(name, c.bytes); data = await z.generateAsync({ type: 'blob' }); name += '.zip'; } // .pbit uzantısı burada indirilemiyor
    try { await dl.save({ filename: name, data }); c.saveMsg = /\.zip$/.test(name) && /\.pbit\.zip$/.test(name) ? t('c.savedZip') : t('c.saved'); }
    catch (e) { c.saveMsg = e && e.code === 'declined' ? '' : t('c.saveFail', { why: e && (e.code || e.message) || '' }); }
    renderPanel(); return;
  }
  const a = document.createElement('a'); a.href = c.url; a.download = c.name; document.body.appendChild(a); a.click(); a.remove();
}
document.addEventListener('change', e => {
  if (e.target.dataset.sel) { const k = e.target.dataset.sel; e.target.checked ? state.selected.add(k) : state.selected.delete(k); resetClean(); renderPanel(); }
  if (e.target.id === 'modelSelect') { selectProject(+e.target.value); render(); }
});
$('#search').addEventListener('input', e => { state.q = e.target.value; state.limit = PAGE; renderList(); });
$('#selCand').addEventListener('click', () => {
  if (!state.res || !state.res.hasModel) return;
  sorted().filter(x => CANDIDATE(x.status) && x.origin !== 'reportOnly').forEach(x => state.selected.add(rowKey(x)));
  resetClean(); renderList(); renderPanel();
});
$('#selNone').addEventListener('click', () => { state.selected = new Set(); resetClean(); renderList(); renderPanel(); });
$('#pickFile').addEventListener('click', () => $('#fileInput').click());
$('#pickDir').addEventListener('click', () => $('#dirInput').click());
$('#fileInput').addEventListener('change', e => { ingest([...e.target.files].map(file => ({ file, path: file.name }))); e.target.value = ''; });
$('#dirInput').addEventListener('change', e => { ingest([...e.target.files].map(file => ({ file, path: file.webkitRelativePath || file.name }))); e.target.value = ''; });
$('#reset').addEventListener('click', loadSample);
$('#langSwitch').addEventListener('click', () => {
  lang = lang === 'tr' ? 'en' : 'tr'; t = makeT(lang); store.set('measure-sieve.lang', lang);
  try { const u = new URL(location.href); if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) { /* çerçeve izin vermeyebilir */ }
  applyStatic(); state.ex = null;
  if (state.sample) loadSample(); else render();
});
const drop = $('#drop');
['dragenter', 'dragover'].forEach(ev => document.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
document.addEventListener('dragleave', e => { if (!e.relatedTarget) drop.classList.remove('over'); });
document.addEventListener('drop', async e => {
  e.preventDefault(); drop.classList.remove('over');
  const entries = [...(e.dataTransfer.items || [])].map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean), out = [];
  if (entries.length) { for (const en of entries) await walkEntry(en, '', out); }
  else [...e.dataTransfer.files].forEach(file => out.push({ file, path: file.name }));
  ingest(out);
});

async function loadSample() {
  state.sample = true; state.loadNotes = [];
  state.extractions = [await extractGroup({ label: sampleName(lang), kind: 'zip', entries: sampleEntries(lang) })];
  setProjects(state.extractions); render();
}
applyStatic();
loadSample();
// Testler ve hata ayıklama için
window.__sieve = { state, ingest };
