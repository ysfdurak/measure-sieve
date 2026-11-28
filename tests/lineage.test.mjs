// Soyağacı testleri: kaynak çıkarma (M), iki yönlü izleme, ilişki uyarıları
import test from 'node:test';
import assert from 'node:assert/strict';
import { extractGroup, buildProjects, analyze } from '../web/js/core.js';
import { sourcesOfM, parameterValue, buildLineage, traceUp, traceDown, relationshipWarnings } from '../web/js/lineage.js';

const P = new Map([['sunucu', { value: 'srv01' }], ['start date', { value: null }]]);
const src = (m, params = P, q = new Set(['sunucu', 'start date', 'ara sorgu'])) => sourcesOfM(m, params, q);

test('M: Excel ve CSV kaynağı iç çağrıdan konumla çıkar, File.Contents ayrıca sayılmaz', () => {
  const r = src('let\n  Kaynak = Excel.Workbook(File.Contents("C:\\Veri\\satış.xlsx"), null, true)\nin Kaynak');
  assert.deepEqual(r.sources.map(s => [s.type, s.location]), [['excel', 'C:\\Veri\\satış.xlsx']]);
  const c = src('Csv.Document(Web.Contents("https://ornek.com/a.csv"),[Delimiter=","])');
  assert.deepEqual(c.sources.map(s => [s.type, s.location]), [['csv', 'https://ornek.com/a.csv']]);
});

test('M: SQL parametreyle; değer ve parametre adı birlikte gelir', () => {
  const r = src('let S = Sql.Database(Sunucu, "DW"), T = S{[Schema="dbo",Item="Satis"]}[Data] in T');
  assert.equal(r.sources[0].type, 'sql');
  assert.equal(r.sources[0].location, 'srv01');
  assert.equal(r.sources[0].param, 'Sunucu');
  assert.equal(r.sources[0].database, 'DW');
  assert.deepEqual(r.params, ['sunucu']);
});

test('M: yorum ve metin içindeki bağlayıcı sayılmaz; elle girilen veri tanınır', () => {
  const r = src('// Sql.Database("eski", "x")\nlet K = Table.FromRows(Json.Document(Binary.Decompress(Binary.FromText("abc", BinaryEncoding.Base64), Compression.Deflate)), let _t = ((type nullable text) meta [Serialized.Text = true]) in type table [A = _t]), Not = "Sql.Database(""y"")" in K');
  assert.deepEqual(r.sources.map(s => s.type), ['entered']);
  assert.deepEqual(src('#table({"A"}, {{1}})').sources.map(s => s.type), ['entered']);
});

test('M: başka sorguya başvuru, modelde olmayan ara sorgu, alan erişimi karışmaz', () => {
  const r = src('let K = Table.Combine({#"Ara Sorgu", #"Yüklenmeyen"}), E = Table.AddColumn(K, "x", each [#"Sütun Adı"] * 2), #"Adım 2" = E in #"Adım 2"');
  assert.deepEqual(r.refs, ['Ara Sorgu']);
  assert.deepEqual(r.external, ['Yüklenmeyen']);
  assert.deepEqual(r.sources, []);
});

test('M: tanınmayan bağlayıcı tahmin edilmez, adıyla bildirilir', () => {
  const r = src('let K = AcmeCloud.Contents("x") in K');
  assert.deepEqual(r.sources, []);
  assert.deepEqual(r.unknown, ['AcmeCloud.Contents']);
});

test('parametre değeri', () => {
  assert.deepEqual(parameterValue('"srv" meta [IsParameterQuery=true, Type="Text"]'), { value: 'srv' });
  assert.deepEqual(parameterValue('null meta [IsParameterQuery=true]'), { value: null });
  assert.equal(parameterValue('let a = 1 in a'), null);
});

const enc = s => new TextEncoder().encode(typeof s === 'string' ? s : JSON.stringify(s));
const entry = (path, data) => ({ path, read: async () => enc(data) });
async function fixture() {
  const bim = { model: {
    tables: [
      { name: 'Satış', columns: [{ name: 'Tutar' }, { name: 'Kod' }, { name: 'Tarih' }], measures: [{ name: 'Ciro', expression: 'SUM(Satış[Tutar])' }, { name: 'Ciro GY', expression: 'CALCULATE([Ciro], SAMEPERIODLASTYEAR(Takvim[Tarih]))' }],
        partitions: [{ name: 'Satış', source: { type: 'm', expression: 'let K = Sql.Database(Sunucu, "DW") in K' } }] },
      { name: 'Ürün', columns: [{ name: 'Kod' }, { name: 'Ad' }], partitions: [{ name: 'Ürün', source: { type: 'm', expression: 'let K = Excel.Workbook(File.Contents("C:\\\\ürün.xlsx")) in K' } }] },
      { name: 'Takvim', columns: [{ name: 'Tarih' }], partitions: [{ name: 'Takvim', source: { type: 'calculated', expression: 'CALENDARAUTO()' } }] },
      { name: 'Kesici', columns: [{ name: 'Seçenek' }], partitions: [{ name: 'Kesici', source: { type: 'm', expression: '#table({"Seçenek"}, {{"A"}})' } }] }
    ],
    expressions: [{ name: 'Sunucu', kind: 'm', expression: '"srv01" meta [IsParameterQuery=true, Type="Text"]' }],
    relationships: [
      { fromTable: 'Satış', fromColumn: 'Kod', toTable: 'Ürün', toColumn: 'Kod', crossFilteringBehavior: 'bothDirections' },
      { fromTable: 'Satış', fromColumn: 'Tarih', toTable: 'Takvim', toColumn: 'Tarih', isActive: false }
    ]
  } };
  const layout = { sections: [{ name: 's', displayName: 'Özet', visualContainers: [
    { config: JSON.stringify({ singleVisual: { visualType: 'card', projections: { Values: [{ queryRef: 'Satış.Ciro GY' }] }, prototypeQuery: { From: [{ Name: 's', Entity: 'Satış' }], Select: [{ Measure: { Expression: { SourceRef: { Source: 's' } }, Property: 'Ciro GY' }, Name: 'Satış.Ciro GY' }] } } }) },
    { config: JSON.stringify({ singleVisual: { visualType: 'tableEx', prototypeQuery: { From: [{ Name: 'u', Entity: 'Ürün' }], Select: [{ Column: { Expression: { SourceRef: { Source: 'u' } }, Property: 'Ad' }, Name: 'Ürün.Ad' }] } } }) }
  ] }] };
  const g = await extractGroup({ label: 't', kind: 'folder', entries: [entry('M.SemanticModel/model.bim', bim), entry('M.Report/report.json', layout), entry('M.Report/definition.pbir', { datasetReference: { byPath: { path: '../M.SemanticModel' } } })] });
  return analyze(buildProjects([g]).projects[0]);
}

test('soyağacı: görselden kaynağa ve kaynaktan görsele', async () => {
  const res = await fixture(), L = buildLineage(res);
  assert.deepEqual(L.sources.map(s => s.type).sort(), ['entered', 'excel', 'sql']);
  const kart = L.visuals.find(v => v.type === 'card'), tablo = L.visuals.find(v => v.type === 'tableEx');
  const up = traceUp(res, L, { kind: 'visual', id: kart.id });
  const names = ids => ids.map(i => res.nodes[i].name).sort();
  assert.deepEqual(names(up.nodes), ['Ciro', 'Ciro GY', 'Tarih', 'Tutar'], 'measure zinciri ve sütunlar');
  assert.deepEqual(up.tables.map(i => res.tables[i].name).sort(), ['Satış', 'Takvim']);
  assert.deepEqual(up.sources.map(i => L.sources[i].type), ['sql'], 'hesaplanmış tablonun kaynağı yok, yalnız SQL');
  const sql = L.sources.find(s => s.type === 'sql');
  assert.equal(sql.location, 'srv01'); assert.equal(sql.param, 'Sunucu');
  const down = traceDown(res, L, { kind: 'source', id: sql.id });
  assert.deepEqual(down.visuals, [kart.id], 'SQL değişirse yalnız kart etkilenir');
  const ex = traceDown(res, L, { kind: 'source', id: L.sources.find(s => s.type === 'excel').id });
  assert.deepEqual(ex.visuals, [tablo.id]);
});

test('ilişki uyarıları: çift yön, pasif, ilişkisiz tablo', async () => {
  const res = await fixture();
  const w = relationshipWarnings(res).map(x => x.code + (x.table != null ? ':' + res.tables[x.table].name : '')).sort();
  assert.deepEqual(w, ['bothDirections', 'inactive', 'isolated:Kesici']);
});

test('Windows bulguları: başlıksız iki kart ayrı görsel, grup ve metin kutusu sayımı, yerel SQL sunucusu etiketi', async () => {
  const { docHead, sourceLabel } = await import('../web/js/docview.js');
  const { makeT } = await import('../web/js/i18n.js');
  const t = makeT('tr');
  const bim = { model: { tables: [{ name: 'Satış', columns: [{ name: 'Tutar' }], measures: [{ name: 'Ciro', expression: 'SUM(Satış[Tutar])' }, { name: 'Adet', expression: 'COUNTROWS(Satış)' }],
    partitions: [{ name: 'Satış', source: { type: 'm', expression: 'let K = Sql.Database(".", "DW") in K' } }] }] } };
  const kart = (n, m) => ({ config: JSON.stringify({ name: n, singleVisual: { visualType: 'card', prototypeQuery: { From: [{ Name: 's', Entity: 'Satış' }], Select: [{ Measure: { Expression: { SourceRef: { Source: 's' } }, Property: m }, Name: 'Satış.' + m }] } } }) });
  const layout = { sections: [{ name: 's', displayName: 'Özet', visualContainers: [kart('k1', 'Ciro'), kart('k2', 'Adet'),
    { config: JSON.stringify({ name: 'g1', singleVisualGroup: { displayName: 'Grup' } }) },
    { config: JSON.stringify({ name: 'm1', singleVisual: { visualType: 'textbox' } }) }] }] };
  const g = await extractGroup({ label: 't', kind: 'folder', entries: [entry('M.SemanticModel/model.bim', bim), entry('M.Report/report.json', layout), entry('M.Report/definition.pbir', { datasetReference: { byPath: { path: '../M.SemanticModel' } } })] });
  const res = analyze(buildProjects([g]).projects[0]), L = buildLineage(res);
  assert.equal(L.visuals.filter(v => v.type === 'card').length, 2, 'aynı sayfada başlıksız iki kart birleşmez');
  assert.equal(res.reports[0].visuals, 3, 'grup görsel sayılmaz: iki kart + metin kutusu');
  assert.match(docHead(t, res, L, 1, 2), /raporda 2 görsel \(\+1 metin kutusu/, 'Belgele, Temizle ile aynı toplamı açıklar');
  assert.match(sourceLabel(t, L.sources[0]).loc, /^\. \(bu bilgisayardaki yerel sunucu\)$/);
  assert.equal(sourceLabel(t, { type: 'sql', location: 'srv01' }).loc, 'srv01', 'gerçek sunucu adı olduğu gibi');
});
