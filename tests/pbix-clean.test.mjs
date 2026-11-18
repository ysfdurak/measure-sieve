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
