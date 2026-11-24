// Çekirdek testleri: node --test tests/   (mcp klasöründe: npm test)
import test from 'node:test';
import assert from 'node:assert/strict';
import { extractGroup, buildProjects, analyze, removalPlan, teScript, sniff, tokenizeDax, normalizeDax } from '../web/js/core.js';
import { sampleEntries } from '../web/js/sample.js';
import { makeT, reasonText } from '../web/js/i18n.js';

const enc = s => new TextEncoder().encode(typeof s === 'string' ? s : JSON.stringify(s));
const entry = (path, data) => ({ path, read: async () => enc(data) });
async function run(entries, kind = 'folder') {
  const g = await extractGroup({ label: 'test', kind, entries });
  return buildProjects([g]).projects.map(analyze);
}
const find = (res, label) => res.items.find(n => `${n.table}[${n.name}]` === label || n.name === label);

test('örnek rapor: ölçü durumları', async () => {
  const [r] = await run(sampleEntries('tr'), 'zip');
  const st = n => find(r, n).status;
  assert.equal(st('Toplam Satış'), 'used');
  assert.equal(st('Toplam Maliyet'), 'indirect');
  assert.equal(st('Marj Rengi'), 'used', 'koşullu biçimlendirme kullanım sayılır');
  assert.equal(st('Seçili Bölge Başlığı'), 'used', 'dinamik başlık kullanım sayılır');
  assert.equal(st('Ortalama Sepet'), 'used', 'araç ipucu sayfası kullanım sayılır');
  assert.equal(st('Ortalama İskonto'), 'review', 'gizli sayfa kontrol edilir');
  assert.equal(st('Hedefe Uzaklık'), 'unused');
  assert.equal(st('Eski Hedef'), 'chain');
  assert.equal(st('Ciro'), 'unused');
  assert.deepEqual(r.duplicates.map(g => g.map(i => r.nodes[i].name).sort()), [['Ciro', 'Toplam Satış']]);
});

test('örnek rapor: sütun ve tablo durumları', async () => {
  const [r] = await run(sampleEntries('tr'), 'zip');
  assert.equal(find(r, 'Satış[ÜrünKodu]').status, 'indirect', 'ilişki anahtarı silinmez');
  assert.equal(find(r, 'Takvim[Ay No]').reason.code, 'sortFor');
  assert.equal(find(r, 'Ürün[Kategori]').status, 'used', 'sayfa filtresi');
  assert.equal(find(r, 'Ürün[Renk]').status, 'unused');
  assert.equal(find(r, 'Stok[Çıkış]').status, 'chain');
  const tb = n => r.tableItems.find(t => t.name === n).status;
  assert.equal(tb('Stok'), 'unused');
  assert.equal(tb('Eski Hedefler'), 'unused');
  assert.equal(tb('Satış'), 'used');
});

test('silme sırası: kullanan önce silinir, etkiler bildirilir', async () => {
  const [r] = await run(sampleEntries('tr'), 'zip');
  const id = n => ({ kind: 'node', id: find(r, n).id });
  const plan = removalPlan(r, [id('Eski Hedef'), id('Hedefe Uzaklık')]);
  assert.deepEqual(plan.labels, ['Satış[Hedefe Uzaklık]', 'Satış[Eski Hedef]']);
  assert.equal(plan.warnings.length, 0);
  const only = removalPlan(r, [id('Toplam Maliyet')]);
  assert.ok(only.warnings.some(w => w.code === 'breaks' && w.names.includes('Satış[Brüt Kâr]')));
  const t = makeT('tr');
  const tab = removalPlan(r, [{ kind: 'table', id: r.tableItems.find(x => x.name === 'Stok').id }, id('Stok Devir Hızı'), id('Ürün[Renk]')]);
  const sc = teScript(r, tab, t);
  assert.match(sc.script, /Measures\["Stok Devir Hızı"\]\.Delete\(\);[\s\S]*Model\.Tables\["Stok"\]\.Delete\(\);/);
  assert.match(sc.powerQuery, /Table\.RemoveColumns\(#"Önceki adım", \{"Renk"\}\)/);
});

test('DAX: metin ve yorum içindeki başvurular sayılmaz', () => {
  const refs = tokenizeDax('-- [A]\n"[B]" & \'T 1\'[C] + T2 [D] + [E]]x]').filter(t => t.t === 'ref');
  assert.deepEqual(refs.map(r => [r.table, r.name]), [['T 1', 'C'], ['T2', 'D'], [null, 'E]x']]);
  assert.equal(normalizeDax('SUM ( T[a] ) // x'), normalizeDax('sum(t[a])'));
});

test('dosya imzası: korumalı dosya tanınır', () => {
  assert.equal(sniff(new Uint8Array([0x50, 0x4B, 3, 4])), 'zip');
  assert.equal(sniff(new Uint8Array([0xD0, 0xCF, 0x11, 0xE0])), 'protected');
  assert.equal(sniff(enc('.pfile\x03\x00')), 'protected');
});

test('PBIP: birden çok model, rapor bağlantısı ve TMDL', async () => {
  const tmdl = (name, body) => entry(`M${name}.SemanticModel/definition/tables/Sales.tmdl`, `table Sales\n${body}`);
  const es = [
    tmdl(1, "\tmeasure 'A Ölçü' = ```\n\t\t\tVAR x = [B]\n\t\t\tRETURN x\n\t\t\t```\n\t\tformatString: 0\n\n\tmeasure B = SUM(Sales[Amt])\n\t\tformatStringDefinition = [Fmt]\n\n\tmeasure Fmt = \"0\"\n\tmeasure Yetim = 1\n\n\tcolumn Amt\n\t\tdataType: double\n\n\tcolumn Key\n\t\tdataType: int64\n"),
    entry('M1.SemanticModel/definition/tables/Dim.tmdl', 'table Dim\n\tcolumn Key\n\t\tdataType: int64\n\tcolumn Ad\n\t\tdataType: string\n\t\tsortByColumn: Sıra\n\tcolumn Sıra\n\t\tisHidden\n'),
    entry('M1.SemanticModel/definition/relationships.tmdl', 'relationship r1\n\tfromColumn: Sales.Key\n\ttoColumn: Dim.Key\n'),
    tmdl(2, '\tmeasure Yetim = 1\n\tmeasure B = 2\n'),
    entry('R1.Report/definition.pbir', { datasetReference: { byPath: { path: '../M1.SemanticModel' } } }),
    entry('R1.Report/definition/pages/p/page.json', { name: 'p', displayName: 'Sayfa' }),
    entry('R1.Report/definition/pages/p/visuals/v/visual.json', { visual: { visualType: 'card', query: { queryState: { Values: { projections: [
      { field: { Measure: { Expression: { SourceRef: { Entity: 'Sales' } }, Property: 'A Ölçü' } } },
      { field: { Column: { Expression: { SourceRef: { Entity: 'Dim' } }, Property: 'Ad' } } }] } } } } }),
    entry('R2.Report/definition.pbir', { datasetReference: { byPath: { path: '../M2.SemanticModel' } } }),
    entry('R2.Report/definition/pages/p/page.json', { name: 'p', displayName: 'P' }),
    entry('R2.Report/definition/pages/p/visuals/v/visual.json', { visual: { visualType: 'card', query: { queryState: { Values: { projections: [{ field: { Measure: { Expression: { SourceRef: { Entity: 'Sales' } }, Property: 'B' } } }] } } } } })
  ];
  const res = await run(es);
  assert.equal(res.length, 2, 'her model ayrı proje');
  const [m1, m2] = res;
  assert.equal(m1.reports[0].name, 'R1'); assert.equal(m2.reports[0].name, 'R2');
  assert.equal(find(m1, 'A Ölçü').status, 'used');
  assert.equal(find(m1, 'B').status, 'indirect');
  assert.equal(find(m1, 'Fmt').status, 'indirect', 'dinamik biçim dizesi');
  assert.equal(find(m1, 'Yetim').status, 'unused');
  assert.equal(find(m1, 'Dim[Sıra]').reason.code, 'sortFor');
  assert.equal(find(m1, 'Sales[Key]').status, 'indirect');
  assert.equal(find(m2, 'B').status, 'used', 'ikinci modelin raporu birinciye karışmaz');
  assert.equal(find(m2, 'Yetim').status, 'unused');
});

test('PBIX: model yoksa aday önerilmez', async () => {
  const layout = { sections: [{ name: 's', displayName: 'S', config: '{}', visualContainers: [{ config: JSON.stringify({ singleVisual: { visualType: 'card', prototypeQuery: { From: [{ Name: 's', Entity: 'T' }], Select: [{ Measure: { Expression: { SourceRef: { Source: 's' } }, Property: 'X' } }] } } }) }] }] };
  const [r] = await run([entry('Report/Layout', layout), entry('DataModel', 'ikili')], 'zip');
  assert.equal(r.hasModel, false); assert.equal(r.binary, true);
  assert.ok(r.items.every(n => n.status !== 'unused'));
});

test('İngilizce metinler', async () => {
  const [r] = await run(sampleEntries('en'), 'zip');
  const t = makeT('en');
  assert.equal(reasonText(t, find(r, 'Total Sales').reason), '3 visual fields');
  assert.equal(reasonText(t, find(r, 'Calendar[Month No]').reason), 'Sort-by column for Calendar[Month Name]');
});

test('Power Query adımı: modelde yeniden adlandırılmış sütun için kaynaktaki ad kullanılır', async () => {
  const [r] = await run([
    entry('M.SemanticModel/definition/tables/Satış.tmdl', "table Satış\n\tmeasure Toplam = SUM(Satış[Tutar])\n\n\tcolumn Tutar\n\t\tdataType: double\n\t\tsourceColumn: Amount\n\n\tcolumn 'Bölge Adı'\n\t\tdataType: string\n\t\tsourceColumn: 'Region Name'\n\n\tcolumn Not\n\t\tdataType: string\n\t\tsourceColumn: Note\n"),
    entry('M.SemanticModel/definition/tables/Takvim.tmdl', "table Takvim\n\tcolumn Tarih\n\t\tdataType: dateTime\n\t\tsourceColumn: [Tarih]\n\n\tpartition Takvim = calculated\n\t\tmode: import\n\t\tsource = CALENDARAUTO()\n")
  ]);
  const unused = r.items.filter(n => n.kind === 'column' && n.origin === 'model' && n.name !== 'Tutar');
  const sc = teScript(r, removalPlan(r, unused.map(n => ({ kind: 'node', id: n.id }))), makeT('tr'));
  assert.match(sc.powerQuery, /\{"Region Name", "Note"\}|\{"Note", "Region Name"\}/);
  assert.doesNotMatch(sc.powerQuery, /Bölge Adı/);
  assert.doesNotMatch(sc.powerQuery, /Tarih/, 'hesaplanmış tablonun sütunu Power Query adımına girmez');
  assert.match(sc.script, /hesaplanmış tablonun sütunu.*Takvim\[Tarih\]/);
});
