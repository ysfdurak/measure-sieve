// PBIX metadata okuyucusu ve temizlenmiş kopya testleri
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { openSqlite, modelFromMetadata } from '../web/js/pbix.js';
import { extractGroup, buildProjects, analyze, CANDIDATE, decode } from '../web/js/core.js';
import { cleanupPlan, buildCleanFiles, verifyCopy, applyTmdlFile } from '../web/js/clean.js';
import { sampleEntries } from '../web/js/sample.js';

let sqlite = null; try { sqlite = await import('node:sqlite'); } catch (e) { /* eski Node */ }

test('PBIX metadata: SQLite okuyucu ve model eşlemesi', { skip: !sqlite && 'node:sqlite yok' }, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'ms-')), file = path.join(dir, 'm.db');
  const db = new sqlite.DatabaseSync(file);
  db.exec(`CREATE TABLE [Table]( [ID] INTEGER , [Name] TEXT , [IsHidden] INTEGER , [SystemFlags] INTEGER , [ShowAsVariationsOnly] INTEGER , [DataCategory] TEXT , PRIMARY KEY("ID" ASC) );
    CREATE TABLE [Column]( [ID] INTEGER , [TableID] INTEGER , [ExplicitName] TEXT , [InferredName] TEXT , [Type] INTEGER , [Expression] TEXT , [IsHidden] INTEGER , [IsKey] INTEGER , [SortByColumnID] INTEGER , [DisplayOrdinal] INTEGER , PRIMARY KEY("ID" ASC) );
    CREATE TABLE [Measure]( [ID] INTEGER , [TableID] INTEGER , [Name] TEXT , [Expression] TEXT , [IsHidden] INTEGER , [DisplayFolder] TEXT , [FormatStringDefinitionID] INTEGER , [DetailRowsDefinitionID] INTEGER , PRIMARY KEY("ID" ASC) );
    CREATE TABLE [Relationship]( [ID] INTEGER , [IsActive] INTEGER , [FromTableID] INTEGER , [FromColumnID] INTEGER , [ToTableID] INTEGER , [ToColumnID] INTEGER , PRIMARY KEY("ID" ASC) );`);
  db.exec(`INSERT INTO [Table] VALUES (1,'Satış',0,0,0,NULL),(2,'Ürün',0,0,0,NULL),(3,'H$Satış (1)$Tutar',1,1,0,NULL),(4,'Hesaplar',0,2,0,NULL);
    INSERT INTO [Column] VALUES (10,1,'Tutar',NULL,1,NULL,0,0,0,1),(11,1,'ÜrünKodu',NULL,1,NULL,0,0,0,2),(12,2,'ÜrünKodu',NULL,1,NULL,0,0,0,1),(13,2,'Ad',NULL,1,NULL,0,0,14,2),(14,2,'Sıra',NULL,1,NULL,1,0,0,3),(15,1,'Kâr',NULL,2,'[Tutar] * 0.2',0,0,0,3),(16,1,NULL,'RowNumber-1',3,NULL,1,0,0,0);
    INSERT INTO [Relationship] VALUES (1,1,1,11,2,12);`);
  const long = 'VAR x = [Toplam]\n' + '-- uzun yorum\n'.repeat(800) + 'RETURN x';
  const ins = db.prepare('INSERT INTO [Measure] VALUES (?,?,?,?,?,?,0,0)');
  ins.run(20, 4, 'Toplam', 'SUM(Satış[Tutar])', 0, ''); ins.run(21, 4, 'Uzun', long, 0, 'Klasör'); ins.run(22, 3, 'İç', '1', 0, '');
  db.close();
  const m = modelFromMetadata(openSqlite(new Uint8Array(await readFile(file))));
  await rm(dir, { recursive: true, force: true });
  assert.deepEqual(m.tables.map(t => t.name), ['Satış', 'Ürün', 'Hesaplar'], 'motorun iç tabloları atlanır');
  const h = m.tables.find(t => t.name === 'Hesaplar');
  assert.equal(h.measures.length, 2);
  assert.equal(h.measures[1].expr, long, 'taşma sayfalarındaki uzun formül eksiksiz okunur');
  assert.equal(h.measures[1].folder, 'Klasör');
  const u = m.tables.find(t => t.name === 'Ürün');
  assert.equal(u.columns.find(c => c.name === 'Ad').sortBy, 'Sıra');
  assert.equal(m.tables[0].columns.find(c => c.name === 'Kâr').calculated, true);
  assert.ok(!m.tables[0].columns.some(c => /RowNumber/.test(c.name)), 'satır numarası sütunu atlanır');
  assert.deepEqual(m.relationships[0], { fromTable: 'Satış', fromColumn: 'ÜrünKodu', toTable: 'Ürün', toColumn: 'ÜrünKodu', active: true });
});

test('Temizlenmiş kopya: PBIT örneği doğrulamadan geçer', async () => {
  const g = { label: 'Satış Raporu.pbit', kind: 'zip', entries: sampleEntries('tr') };
  const x = await extractGroup(g); const res = analyze(buildProjects([x]).projects[0]);
  const sel = [...res.items.filter(n => CANDIDATE(n.status)).map(n => ({ kind: 'node', id: n.id })), ...res.tableItems.filter(t => CANDIDATE(t.status)).map(t => ({ kind: 'table', id: t.id }))];
  const plan = cleanupPlan(res, sel);
  assert.ok(plan.removed.includes('Satış[Hedefe Uzaklık]') && plan.removed.includes('Satış[Eski Hedef]') && plan.removed.includes('Satış[Satır Kârı]'));
  assert.ok(plan.skipped.some(s => s.label === "'Stok'" && s.code === 'importTable'));
  assert.ok(plan.skipped.some(s => s.label === 'Ürün[Renk]' && s.code === 'dataColumn'));
  const out = await buildCleanFiles(res, plan.rm);
  const v = await verifyCopy(res, x.source, out, plan);
  assert.equal(v.ok, true, JSON.stringify(v.checks));
  assert.equal(v.counts.after.measure, v.counts.before.measure - 5);
  const json = JSON.parse(decode(out.changed.get('DataModelSchema')));
  assert.ok(!json.model.tables[0].measures.some(m => m.name === 'Ciro'));
});

test('Temizlenmiş kopya: bağımlı öğe seçilmezse kaldırılmaz', async () => {
  const x = await extractGroup({ label: 's', kind: 'zip', entries: sampleEntries('tr') }); const res = analyze(buildProjects([x]).projects[0]);
  const n = res.items.find(i => i.name === 'Eski Hedef');
  const plan = cleanupPlan(res, [{ kind: 'node', id: n.id }]);
  assert.equal(plan.removed.length, 0);
  assert.equal(plan.skipped[0].code, 'breaks');
});

test('TMDL düzenleme: measure, sıralama sütunu, hiyerarşi düzeyi, perspektif, ilişki', () => {
  const rm = { tables: new Set(['eski']), measures: new Set(['satış|yetim']), columns: new Set(['takvim|ay no']) };
  const table = "table Takvim\n\tlineageTag: x\n\n\t/// açıklama\n\tmeasure Yetim = ```\n\t\t\t1\n\t\t\t```\n\t\tformatString: 0\n\n\tcolumn 'Ay Adı'\n\t\tdataType: string\n\t\tsortByColumn: 'Ay No'\n\n\tcolumn 'Ay No' = MONTH([Tarih])\n\t\tdataType: int64\n\n\thierarchy H\n\t\tlevel Ay\n\t\t\tcolumn: 'Ay No'\n\n\tcolumn Tarih\n\t\tdataType: dateTime\n";
  const out = applyTmdlFile('M.SemanticModel/definition/tables/Takvim.tmdl', table.replace('table Takvim', 'table Takvim'), { ...rm, measures: new Set(['takvim|yetim']) });
  assert.doesNotMatch(out, /Yetim|açıklama|'Ay No'|hierarchy|sortByColumn/);
  assert.match(out, /column 'Ay Adı'\n\t\tdataType: string\n/);
  assert.match(out, /column Tarih/);
  const persp = "perspective P\n\tperspectiveTable Satış\n\t\tperspectiveMeasure Yetim\n\t\tperspectiveMeasure Kalan\n\tperspectiveTable Eski\n\t\tperspectiveColumn A\n";
  const p2 = applyTmdlFile('M.SemanticModel/definition/perspectives/P.tmdl', persp, rm);
  assert.equal(p2, "perspective P\n\tperspectiveTable Satış\n\t\tperspectiveMeasure Kalan\n");
  const rel = "relationship a\n\tfromColumn: Satış.Kod\n\ttoColumn: Eski.Kod\n\nrelationship b\n\tfromColumn: Satış.Kod\n\ttoColumn: Ürün.Kod\n";
  assert.equal(applyTmdlFile('M.SemanticModel/definition/relationships.tmdl', rel, rm), "relationship b\n\tfromColumn: Satış.Kod\n\ttoColumn: Ürün.Kod\n");
  assert.deepEqual(applyTmdlFile('M.SemanticModel/definition/tables/Eski.tmdl', 'table Eski\n', rm), { delete: true });
  assert.equal(applyTmdlFile('M.SemanticModel/definition/model.tmdl', 'model Model\n\nref table Satış\nref table Eski\n', rm), 'model Model\n\nref table Satış\n');
});

test('Q&A dil verisi, diyagram ve PBIT güvenlik bağı temizlenir', async () => {
  const { cleanLinguistic, cleanDiagram } = await import('../web/js/clean.js');
  const rm = { tables: new Set(['eski']), measures: new Set(['satış|yetim']), columns: new Set() };
  const lm = { Entities: { a: { Definition: { Binding: { ConceptualEntity: 'Satış', ConceptualProperty: 'Yetim' } } }, b: { Definition: { Binding: { ConceptualEntity: 'Eski' } } }, c: { Definition: { Binding: { ConceptualEntity: 'Satış', ConceptualProperty: 'Kalan' } } } } };
  assert.equal(cleanLinguistic(lm, rm), true);
  assert.deepEqual(Object.keys(lm.Entities), ['c']);
  const dg = { diagrams: [{ nodes: [{ nodeIndex: 'Eski' }, { nodeIndex: 'Satış' }] }] };
  assert.equal(cleanDiagram(dg, rm), true); assert.deepEqual(dg.diagrams[0].nodes, [{ nodeIndex: 'Satış' }]);
  const tmdl = "cultureInfo tr-TR\n\n\tlinguisticMetadata =\n\t\t\t{\n\t\t\t  \"Entities\": {\n\t\t\t    \"a\": { \"Definition\": { \"Binding\": { \"ConceptualEntity\": \"Satış\", \"ConceptualProperty\": \"Yetim\" } } },\n\t\t\t    \"c\": { \"Definition\": { \"Binding\": { \"ConceptualEntity\": \"Satış\", \"ConceptualProperty\": \"Kalan\" } } }\n\t\t\t  }\n\t\t\t}\n\t\tcontentType: json\n\n";
  const out = applyTmdlFile('M.SemanticModel/definition/cultures/tr-TR.tmdl', tmdl, rm);
  assert.doesNotMatch(out, /Yetim/); assert.match(out, /Kalan/); assert.match(out, /\n\t\tcontentType: json\n/);
  // PBIT: SecurityBindings ve [Content_Types].xml kaydı
  const enc = s => new TextEncoder().encode(s);
  const es = [...sampleEntries('tr'),
    { path: 'SecurityBindings', read: async () => new Uint8Array([1, 2, 3]) },
    { path: '[Content_Types].xml', read: async () => enc('<Types><Override PartName="/SecurityBindings" ContentType="" /><Default Extension="json" ContentType="" /></Types>') }];
  const x = await extractGroup({ label: 's', kind: 'zip', entries: es }); const res = analyze(buildProjects([x]).projects[0]);
  const plan = cleanupPlan(res, [{ kind: 'node', id: res.items.find(n => n.name === 'Test Measure').id }]);
  const o = await buildCleanFiles(res, plan.rm);
  assert.ok(o.deleted.has('SecurityBindings'));
  assert.doesNotMatch(decode(o.changed.get('[Content_Types].xml')), /SecurityBindings/);
});

test('Güvenlik: zip girdisi açılırken sayılır, sınırı aşan okuma durur', async () => {
  const { readZipEntry } = await import('../web/js/core.js');
  const { createRequire } = await import('node:module');
  const JSZip = createRequire(new URL('../mcp/package.json', import.meta.url))('jszip');
  const z = new JSZip(); z.file('Report/Layout', new Uint8Array(500000)); // 500 KB sıfır: birkaç yüz bayta sıkışır
  const zz = await JSZip.loadAsync(await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' }));
  await assert.rejects(readZipEntry(zz.file('Report/Layout'), 100000), /tooLarge/);
  assert.equal((await readZipEntry(zz.file('Report/Layout'), 600000)).length, 500000);
});

test('Güvenlik: bozuk PBIX parçası ve SQLite kaydı güvenle reddedilir', async () => {
  const { decompressDataModel, openSqlite } = await import('../web/js/pbix.js');
  const sig = 'This backup was created using XPress9 compression.';
  const head = new Uint8Array(102); for (let i = 0; i < sig.length; i++) head[2 * i] = sig.charCodeAt(i);
  const bad = new Uint8Array(110); bad.set(head); new DataView(bad.buffer).setUint32(102, 0x7fffffff, true); new DataView(bad.buffer).setUint32(106, 4, true);
  assert.throws(() => decompressDataModel(bad), /badChunk/);
  assert.throws(() => openSqlite(new TextEncoder().encode('bu bir veritabanı değil')), /notSqlite/);
});
