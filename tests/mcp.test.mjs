// MCP protokol denetimi: sunucuyu gerçekten başlatır ve araçları çağırır.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { sampleEntries } from '../web/js/sample.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(here, '../mcp/package.json'));
const { Client } = await import(pathToFileURL(req.resolve('@modelcontextprotocol/sdk/client/index.js')).href);
const { StdioClientTransport } = await import(pathToFileURL(req.resolve('@modelcontextprotocol/sdk/client/stdio.js')).href);
const JSZip = (await import(pathToFileURL(req.resolve('jszip')).href)).default;

test('MCP: araçlar listelenir ve örnek PBIT taranır', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'olcu-'));
  const zip = new JSZip();
  for (const e of sampleEntries('tr')) zip.file(e.path, await e.read());
  const file = path.join(dir, 'Satış Raporu.pbit');
  await writeFile(file, await zip.generateAsync({ type: 'nodebuffer' }));
  const client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(here, '../mcp/server.mjs'), dir] }));
  try {
    const tools = (await client.listTools()).tools.map(t => t.name).sort();
    assert.deepEqual(tools, ['degerleri_karsilastir', 'degerleri_olc', 'desktop_listele', 'devir_belgesi', 'modeli_tara', 'oge_detayi', 'silme_plani', 'soyagaci', 'temiz_kopya_olustur']);
    // Belgele: soyağacı (görselden kaynağa, kaynaktan görsele) ve devir belgesi
    const up = (await client.callTool({ name: 'soyagaci', arguments: { yollar: [file], ad: 'Genel Bakış › Ürün Tablosu' } })).content[0].text;
    assert.match(up, /2 kaynaktan/); assert.match(up, /Excel dosyası: C:\\Ortak\\Satış\\Ürün Listesi\.xlsx/); assert.match(up, /SQL Server: sql-satis-01/);
    const down = (await client.callTool({ name: 'soyagaci', arguments: { yollar: [file], ad: 'Ürün Listesi.xlsx' } })).content[0].text;
    assert.match(down, /değişirse 2 görsel/);
    const doc = (await client.callTool({ name: 'devir_belgesi', arguments: { yollar: [file], hazirlayan: 'Test' } })).content[0].text;
    assert.match(doc, /^# Devir belgesi: Satış Raporu\.pbit/); assert.match(doc, /\| Hazırlayan \| Test \|/); assert.match(doc, /Çift yönlü filtre/); assert.match(doc, /## Devralan kontrol listesi/); assert.match(doc, /- \[ \] Yenileme zamanı ve sıklığı: ______/); assert.match(doc, /Ağ geçidi/);
    const yaz = await client.callTool({ name: 'devir_belgesi', arguments: { yollar: [file], kaydet: path.join(dir, 'devir.md') } });
    assert.match(yaz.content[0].text, /İndirildi|devir\.md/);
    const dis = await client.callTool({ name: 'devir_belgesi', arguments: { yollar: [file], kaydet: path.join(os.tmpdir(), '..', 'x.md') } });
    assert.ok(dis.isError || /dışına|outside/.test(dis.content[0].text), 'izinli klasör dışına yazılmaz');
    const scan = (await client.callTool({ name: 'modeli_tara', arguments: { yollar: [file] } })).content[0].text;
    assert.match(scan, /\[Kullanılmıyor gibi\] Satış\[Hedefe Uzaklık\]/);
    assert.match(scan, /Toplam Satış = Ciro|Ciro = Toplam Satış/);
    const det = (await client.callTool({ name: 'oge_detayi', arguments: { yollar: [file], ad: 'Toplam Maliyet' } })).content[0].text;
    assert.match(det, /Brüt Kâr/);
    const plan = (await client.callTool({ name: 'silme_plani', arguments: { yollar: [file], dil: 'en' } })).content[0].text;
    assert.match(plan, /Measures\["Hedefe Uzaklık"\]\.Delete\(\);/);
    const outside = await client.callTool({ name: 'modeli_tara', arguments: { yollar: [os.homedir() === dir ? '/' : path.join(os.tmpdir(), '..')] } });
    assert.equal(outside.isError, true, 'izinli klasör dışı reddedilir');
  } finally { await client.close(); await rm(dir, { recursive: true, force: true }); }
});

test('MCP: temizlenmiş kopya ve sayısal doğrulama (sahte motor)', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'olcu-'));
  const zip = new JSZip();
  for (const e of sampleEntries('tr')) zip.file(e.path, await e.read());
  const file = path.join(dir, 'Satis.pbit');
  await writeFile(file, await zip.generateAsync({ type: 'nodebuffer' }));
  const pwsh = process.env.MEASURE_SIEVE_PWSH;
  const env = { ...process.env, ...(pwsh ? { MEASURE_SIEVE_MOCK: '1' } : {}) };
  const client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(here, '../mcp/server.mjs'), dir], env }));
  try {
    const res = (await client.callTool({ name: 'temiz_kopya_olustur', arguments: { yol: file } })).content[0].text;
    assert.match(res, /Doğrulama geçti/);
    assert.match(res, /Satis\.temiz\.pbit/);
    const again = await client.callTool({ name: 'temiz_kopya_olustur', arguments: { yol: file } });
    assert.match(again.content[0].text, /zaten var|exists/, 'üzerine yazmaz');
    // Kopya yeniden taranınca kaldırılan measure'lar yok
    const scan = (await client.callTool({ name: 'modeli_tara', arguments: { yollar: [path.join(dir, 'Satis.temiz.pbit')] } })).content[0].text;
    assert.doesNotMatch(scan, /Hedefe Uzaklık/);
    if (pwsh) {
      const snap = (await client.callTool({ name: 'degerleri_olc', arguments: { yollar: [file], port: 1 } })).content[0].text;
      const id = /olcum-\d+/.exec(snap)[0];
      const cmp = (await client.callTool({ name: 'degerleri_karsilastir', arguments: { olcum: id } })).content[0].text;
      assert.match(cmp, /Rakamlar aynı/);
    }
  } finally { await client.close(); await rm(dir, { recursive: true, force: true }); }
});
