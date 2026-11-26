// Kural tabanlı DAX açıklaması: 20 ölçülük doğruluk seti (her beklenen cümle elle okunup onaylandı),
// tanınmaması gereken kalıplar ve gruplama (parantez) kuralları
import test from 'node:test';
import assert from 'node:assert/strict';
import { explainDax } from '../web/js/explain.js';

const M = new Set(['ciro', 'maliyet', 'adet', 'hedef', 'ciro gy', 'marj', 'a', 'b', 'c']);
const SET = [
 [
  "SUM(Satış[Tutar])",
  "Satış[Tutar] sütununun toplamı."
 ],
 [
  "DISTINCTCOUNT(Satış[MüşteriKodu])",
  "Satış[MüşteriKodu] sütunundaki farklı değer sayısı."
 ],
 [
  "COUNTROWS(Satış)",
  "Satış tablosundaki satır sayısı."
 ],
 [
  "AVERAGE(Satış[İskonto])",
  "Satış[İskonto] sütununun ortalaması."
 ],
 [
  "SUMX(Satış, Satış[Adet] * Satış[BirimFiyat])",
  "Satış tablosunda satır satır hesaplanan (Satış[Adet] × Satış[BirimFiyat]) değerlerinin toplamı."
 ],
 [
  "DIVIDE([Ciro] - [Maliyet], [Ciro])",
  "([Ciro] ölçüsü eksi [Maliyet] ölçüsü) bölü ([Ciro] ölçüsü); bölen sıfır ya da boşsa boş."
 ],
 [
  "DIVIDE([Ciro], [Hedef], 0)",
  "([Ciro] ölçüsü) bölü ([Hedef] ölçüsü); bölen sıfır ya da boşsa 0."
 ],
 [
  "[Ciro] - [Maliyet]",
  "[Ciro] ölçüsü eksi [Maliyet] ölçüsü."
 ],
 [
  "CALCULATE([Ciro], SAMEPERIODLASTYEAR(Takvim[Tarih]))",
  "[Ciro] ölçüsü; şu koşulla: geçen yılın aynı dönemi (Takvim[Tarih])."
 ],
 [
  "CALCULATE([Ciro], DATESYTD(Takvim[Tarih]))",
  "[Ciro] ölçüsü; şu koşulla: yılbaşından bu yana (Takvim[Tarih])."
 ],
 [
  "TOTALYTD([Ciro], Takvim[Tarih])",
  "[Ciro] ölçüsü, yılbaşından bu yana kümülatif (Takvim[Tarih])."
 ],
 [
  "CALCULATE([Ciro], ALL(Ürün))",
  "[Ciro] ölçüsü; şu koşulla: Ürün üzerindeki tüm filtreler kaldırılarak."
 ],
 [
  "DIVIDE([Ciro], CALCULATE([Ciro], ALLSELECTED(Ürün)))",
  "([Ciro] ölçüsü) bölü ([Ciro] ölçüsü; şu koşulla: Ürün için yalnız rapordaki seçimler korunarak); bölen sıfır ya da boşsa boş."
 ],
 [
  "CALCULATE([Adet], Satış[Kanal] = \"Online\")",
  "[Adet] ölçüsü; şu koşulla: Satış[Kanal] = \"Online\"."
 ],
 [
  "CALCULATE([Ciro], DATEADD(Takvim[Tarih], -1, MONTH))",
  "[Ciro] ölçüsü; şu koşulla: 1 ay önce (Takvim[Tarih])."
 ],
 [
  "CALCULATE([Ciro], DATESINPERIOD(Takvim[Tarih], MAX(Takvim[Tarih]), -12, MONTH))",
  "[Ciro] ölçüsü; şu koşulla: son 12 ay (Takvim[Tarih])."
 ],
 [
  "IF(ISBLANK([Hedef]), BLANK(), [Ciro] - [Hedef])",
  "[Hedef] ölçüsü boş ise boş, değilse [Ciro] ölçüsü eksi [Hedef] ölçüsü."
 ],
 [
  "SELECTEDVALUE(Bölge[Ad], \"Tüm bölgeler\")",
  "Bölge[Ad] için seçili tek değer (tek seçim yoksa \"Tüm bölgeler\")."
 ],
 [
  "CALCULATE([Ciro], USERELATIONSHIP(Satış[SevkTarihi], Takvim[Tarih]))",
  "[Ciro] ölçüsü; şu koşulla: Satış[SevkTarihi] ile Takvim[Tarih] arasındaki pasif ilişki kullanılarak."
 ],
 [
  "CALCULATE([Ciro], FILTER(ALL(Ürün[Kategori]), Ürün[Kategori] <> \"İade\"))",
  "[Ciro] ölçüsü; şu koşulla: Ürün[Kategori] filtresi kaldırılarak, Ürün[Kategori] ≠ \"İade\" olan değerler."
 ]
];

test('doğruluk seti: 20 ölçünün 20si doğru açıklanır', () => {
  assert.equal(SET.length, 20);
  SET.forEach(([dax, beklenen]) => assert.equal(explainDax(dax, 'tr', M), beklenen, dax));
});

test('emin olunmayan kalıpta açıklama üretilmez', () => {
  ['VAR x = [Ciro] RETURN x * 2', 'RANKX(ALL(Ürün[Ad]), [Ciro])', 'CALCULATE([Ciro], TREATAS(VALUES(A[x]), B[y]))', 'GENERATE(A, B)', 'SUM(', '[Ciro] @ 2']
    .forEach(d => assert.equal(explainDax(d, 'tr', M), null, d));
});

test('gruplama korunur: anlam değişmez', () => {
  assert.equal(explainDax('[A]/([A]+[B])', 'tr', M), '[A] ölçüsü bölü ([A] ölçüsü artı [B] ölçüsü).');
  assert.equal(explainDax('[A]-([B]-[C])', 'tr', M), '[A] ölçüsü eksi ([B] ölçüsü eksi [C] ölçüsü).');
  assert.equal(explainDax('[A]-[B]-[C]', 'tr', M), '[A] ölçüsü eksi [B] ölçüsü eksi [C] ölçüsü.');
  assert.match(explainDax('CALCULATE(SUM(T[x]), Y[Yil] = 2016) - CALCULATE(SUM(T[x]), Y[Yil] = 2010)', 'tr', M), /^\(T\[x\].*2016\) eksi \(T\[x\].*2010\)\.$/);
});

test('İngilizce ve tırnaklı tablo adı', () => {
  assert.equal(explainDax("SUM('Satış Detay'[Tutar])", 'en', M), "The sum of 'Satış Detay'[Tutar].");
  assert.equal(explainDax('CALCULATE([Ciro], DATESINPERIOD(Takvim[Tarih], MAX(Takvim[Tarih]), -3, MONTH))', 'en', M), 'The [Ciro] measure, under this condition: the last 3 months (Takvim[Tarih]).');
});
