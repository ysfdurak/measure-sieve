// Sayısal doğrulama: sorgu üretimi, karşılaştırma ve PowerShell köprüsü (sahte motorla)
import test from 'node:test';
import assert from 'node:assert/strict';
import { extractGroup, buildProjects, analyze } from '../web/js/core.js';
import { sampleEntries } from '../web/js/sample.js';
import { buildQueries, runQueries, compareSnapshots } from '../mcp/desktop.mjs';

const res = analyze(buildProjects([await extractGroup({ label: 's', kind: 'zip', entries: sampleEntries('tr') })]).projects[0]);

test('sorgular: her görsel için SUMMARIZECOLUMNS, Türkçe ve tırnaklı adlar kaçışlı', () => {
  const qs = buildQueries(res);
  const line = qs.find(q => /Aylık Satış/.test(q.label));
  assert.ok(line, 'çizgi grafik sorgusu var');
  assert.match(line.dax, /^EVALUATE TOPN\(500, SUMMARIZECOLUMNS\('Takvim'\[Ay Adı\], "m1", \[Toplam Satış\], "m2", \[Yıllık Büyüme %\]\)/);
  assert.ok(qs.some(q => q.dax === 'EVALUATE ROW("m1", [Toplam Satış])'), 'kart: ROW');
  assert.ok(qs.every(q => /^EVALUATE /.test(q.dax)), 'yalnızca EVALUATE');
});

test('karşılaştırma: sayı toleransı, satır sayısı, önceden hatalı sorgu atlanır', () => {
  const q = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }];
  const before = { queries: q, results: [{ id: 'a', rows: [[1, 0.1 + 0.2]] }, { id: 'b', rows: [[1], [2]] }, { id: 'c', error: 'x' }] };
  assert.equal(compareSnapshots(before, { results: [{ id: 'a', rows: [[1, 0.3]] }, { id: 'b', rows: [[1], [2]] }, { id: 'c', rows: [] }] }).ok, true);
  const d = compareSnapshots(before, { results: [{ id: 'a', rows: [[1, 0.31]] }, { id: 'b', rows: [[1]] }] });
  assert.deepEqual(d.differences.map(x => x.why), ['value', 'rowCount']);
  assert.equal(d.compared, 2);
});

test('PowerShell köprüsü: Türkçe karakterler bozulmadan gider ve gelir', { skip: !process.env.MEASURE_SIEVE_PWSH && 'MEASURE_SIEVE_PWSH yok' }, async () => {
  process.env.MEASURE_SIEVE_MOCK = '1';
  const dax = 'EVALUATE ROW("m1", [Şube Kârı İğdır Ölçüm])';
  const [r] = await runQueries(1, [{ id: 'x', dax }]);
  assert.equal(r.rows[0][0], dax);
  const [bad] = await runQueries(1, [{ id: 'y', dax: 'DELETE FROM x' }]);
  assert.equal(bad.error, 'only EVALUATE', 'EVALUATE dışı sorgu gönderilmez');
});
