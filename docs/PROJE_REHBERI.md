# Measure Sieve · Proje rehberi

Bu belge, projeyi anlatabilmen ve sorulara cevap verebilmen için yazıldı. Kod okumadan da takip edilebilir; kod parçaları yalnızca "nerede" sorusunu yanıtlamak için var.

## 1. Problem ve çözüm, bir cümlede

Power BI modelleri zamanla denenmiş ama kullanılmamış measure'larla, hiç görsele girmemiş sütunlarla dolar. Bu, modeli ağırlaştırır ve yeni gelenin kafasını karıştırır. Measure Sieve, modeli ve raporu okuyup **her öğenin nerede kullanıldığını bir bağımlılık grafiğinde** izler; hiçbir yere ulaşmayanları "kullanılmıyor gibi" diye işaretler ve **hangi sırayla silineceğini** söyler.

1.2.0'dan beri ikinci bir soruya da cevap veriyor: **"Bu model ne yapıyor?"** Belgele modu aynı grafiği ters yönde kullanır: bir sayının hangi kaynaktan geldiğini gösterir ve raporu devralacak kişi için devir belgesi üretir (bkz. bölüm 14).

## 2. Power BI dosyası içinde ne var?

| Dosya | Ne olduğu | Bizim okuduğumuz |
|---|---|---|
| PBIX | ZIP. İçinde `DataModel` (sıkıştırılmış ikili model, veri dahil) ve `Report/Layout` (rapor) | Yalnızca rapor. Model ikili ve özel sıkıştırmalı (XPress9), tarayıcıda açılamıyor |
| PBIT | ZIP. Veri yok; model `DataModelSchema` adlı JSON (TMSL biçimi) | Model + rapor |
| PBIP | Klasör. `X.SemanticModel/` (model.bim ya da `definition/*.tmdl`) ve `X.Report/` (report.json ya da PBIR: sayfa/görsel başına JSON) | Model + rapor |

- **TMSL**: modeli tek büyük JSON olarak yazar.
- **TMDL**: modeli girintili metin dosyalarına böler (her tablo bir dosya). Git'te değişiklik görmek kolay olsun diye.
- **PBIR**: raporun yeni biçimi; her sayfa ve görsel ayrı `visual.json`.
- `X.Report/definition.pbir` dosyası raporun **hangi modele bağlı** olduğunu yazar (`byPath: "../Model01.SemanticModel"`). Çok modelli klasörlerde eşleştirmeyi bununla yapıyoruz.

Soru: *"PBIX'i nasıl okuyorsun?"* → `web/js/pbix.js` dört adımda çalışır:
1. **Xpress9 açma.** `DataModel` dosyası Microsoft'un Xpress9 algoritmasıyla parçalar hâlinde sıkıştırılmış. Microsoft'un MIT lisanslı C kodunu WebAssembly'ye, oradan düz JavaScript'e derledik (`web/js/xpress9.js`, nasıl üretildiği `tools/xpress9/build.sh`). Düz JavaScript olduğu için her tarayıcıda ve Node'da aynı çalışır.
2. **ABF içindekiler.** Açılan veri bir Analysis Services yedeği (ABF). Başındaki XML başlık ve içindekiler listesi, `metadata.sqlitedb` dosyasının nerede durduğunu söyler.
3. **SQLite okuma.** Model tanımı (tablolar, sütunlar, measure'lar, ilişkiler...) bu küçük SQLite veritabanında. Kütüphane kullanmadan, yalnızca okuyan 100 satırlık bir SQLite okuyucusu yazdık.
4. **Model.** Tablolar çekirdeğin anladığı biçime çevrilir; PBIT'ten okunan modelle aynı şekil.

Veri satırları (VertiPaq) hiç açılmaz. 17 gerçek PBIX'te sonuç, Python'daki pbixray aracıyla birebir aynı çıktı.

Soru: *"PBIX'e neden yazmıyorsun?"* → Okumak güvenli, yazmak değil: modeli değiştirmek için veriyle birlikte yeniden sıkıştırmak gerekir ve Microsoft bunu desteklemiyor. Bozulursa kullanıcı verisini kaybeder. Bunun yerine PBIP'e kaydetmeyi ya da Tabular Editor'u öneriyoruz.

## 3. Akış

```
dosyalar ──▶ extractGroup()  ──▶ buildProjects() ──▶ analyze() ──▶ removalPlan() ──▶ teScript()
            (oku: model+rapor)  (raporu modele bağla)  (grafik + durum)  (silme sırası)   (betik)
```

Hepsi `web/js/core.js` içinde. Bu dosya DOM'a, ağa, diske dokunmaz; sadece "giriş" listesi alır: `{ path, read() }`. Bu sayede:
- tarayıcı (ZIP'i JSZip ile açar, klasörü dosya seçiciyle okur),
- MCP sunucusu (diskten okur, `mcp/files.mjs`),
- testler (bellekte üretir)

aynı çekirdeği kullanır. Buna **"tek çekirdek, iki arayüz"** diyoruz: insan için web, yapay zekâ için MCP.

## 4. Analizin kalbi: bağımlılık grafiği

Her measure ve her sütun bir **düğüm**. Kenarlar "A, B'yi kullanır" demek:

- Measure formülü: `[Brüt Kâr] = [Toplam Satış] - [Toplam Maliyet]` → Brüt Kâr iki measure'a bağlı.
- KPI, dinamik biçim dizesi, detay satırları formülleri de measure'ın parçası sayılır.
- Hesaplanmış sütun formülü, hesaplanmış tablo formülü.
- **Sıralama sütunu**: "Ay Adı", "Ay No"ya göre sıralanıyorsa Ay Adı → Ay No.

**Kök** (kesin kullanılan) noktalar:
- Rapordaki kullanımlar: görsel alanı, filtre (rapor/sayfa/görsel), koşullu biçimlendirme, dinamik başlık, görsel hesaplama, grup/küme.
- Modelin "yapısal" kullanımları: ilişki anahtarları, güvenlik rolü (RLS) filtreleri, hesaplama grupları, tablo anahtarı.

Sonra kökten başlayıp kenarlar boyunca yayılırız (graf taraması). Ulaşılan her şey kullanılıyordur. Ulaşılamayanlar:
- Kimse kullanmıyorsa → **Kullanılmıyor gibi**
- Yalnızca kullanılmayanlar kullanıyorsa → **Zincirleme** (ör. Eski Hedef, sadece kullanılmayan Hedefe Uzaklık'ta geçiyor)
- Yalnızca gizli sayfada, yer iminde ya da metin içinde geçiyorsa → **Kontrol et**

Soru: *"Neden sadece görsellere bakmıyorsun?"* → Görselde olmayan bir measure başka bir measure'ın içinde, koşullu biçimlendirmede ya da güvenlik rolünde kullanılıyor olabilir. Silersen o görsel ya da kural bozulur. Grafik bu zinciri yakalar.

Soru: *"Gizli sayfa neden 'kontrol et'?"* → Gizli sayfa bazen detay/araç ipucu sayfasıdır (bunları ayrıca tanıyıp "kullanılıyor" sayıyoruz), bazen unutulmuş taslaktır. Hangisi olduğunu dosyadan anlayamayız; karar kullanıcının.

### DAX okuyucu (`tokenizeDax`)

Tam bir DAX ayrıştırıcı değil; sadece başvuruları bulur: `[Ad]`, `Tablo[Ad]`, `'Boşluklu Tablo'[Ad]`. Önemli ayrıntılar:
- `"metin içindeki [Ad]"` ve `-- yorumdaki [Ad]` başvuru **sayılmaz**.
- `[Ad]` tek başınaysa önce measure aranır, bulunamazsa sütun (`SUMX(Satış, [Tutar])` gibi). Belirsizse aynı adlı tüm sütunlar kullanılıyor sayılır: yanlışlıkla "silinebilir" demektense ihtiyatlı davranırız.

## 5. Tablolar

Bir tablo, içindeki hiçbir measure ya da sütun "içerik olarak" kullanılmıyorsa adaydır. İlişki anahtarları sayılmaz; yoksa ilişkisi olan her tablo kullanılıyor görünürdü. İstisna: iki kullanılan tabloyu birbirine bağlayan **köprü tablo** silinmez. Otomatik tarih tabloları (`LocalDateTable_...`) listede gösterilmez; sayıları bilgi notu olarak verilir.

## 6. Silme planı

`removalPlan()` seçilen öğeleri **topolojik sırayla** dizer: bir öğeyi kullanan öğe ondan önce silinir (önce Hedefe Uzaklık, sonra Eski Hedef). Seçim başka bir öğeyi bozacaksa ("Toplam Maliyet silinirse Brüt Kâr bozulur") uyarır.

`teScript()` iki çıktı üretir:
- **Tabular Editor C# betiği**: measure, hesaplanmış sütun ve tablo silme komutları.
- **Power Query adımı**: veri sütunları için `Table.RemoveColumns`. Neden? Veri sütununu sadece modelden silersen sorgu hâlâ onu getirir; doğru yer Power Query.

Uygulama hiçbir zaman dosyayı kendisi değiştirmez. Bu bilinçli: silme geri dönüşü zor bir işlem, son karar ve son tuş kullanıcıda.

## 7. Ek kontroller

- **Aynı formül**: Yorum ve boşluklar atılıp küçük harfe çevrilen formüller karşılaştırılır. `SUM(Satış[Tutar])` ile `sum( Satış[Tutar] )` aynı sayılır. Kafa karışıklığının en sık nedeni.
- **Raporda olup modelde olmayan alan**: Silinmiş ya da adı değişmiş bir sütuna bakan görsel/filtre. Gerçek bir Microsoft örneğinde bile çıktı.
- **Şifreli dosya**: Duyarlılık etiketli dosyaların ilk baytları ZIP değil; bunu tanıyıp açık bir mesaj veriyoruz.

## 8. Temizlenmiş kopya

`web/js/clean.js` aslına dokunmadan yeni bir dosya üretir.

**Önce ne kaldırılabilir, ona karar verilir (`cleanupPlan`).** Yalnızca model measure'ları, hesaplanmış sütunlar ve hesaplanmış tablolar otomatik kaldırılır. Bir öğe raporda (gizli sayfa ya da yer imi dahil), güvenlik rolünde ya da ilişkide kullanılıyorsa, ya da kalan bir öğe onu kullanıyorsa kaldırılmaz. Atlanan her öğe başka öğeleri de etkileyebileceği için bu kontrol, sonuç değişmeyene kadar tekrarlanır.

**Sonra dosya yazılır:**
- **TMSL (PBIT, model.bim):** JSON'dan öğe çıkarılır. Kaldırılan sütuna bakan sıralama ayarları, hiyerarşi düzeyleri, ilişkiler, perspektif ve rol kayıtları da temizlenir. PBIT'teki dosya aynı karakter kodlamasıyla (UTF-16) geri yazılır.
- **TMDL (PBIP):** Metin dosyalarından ilgili bloklar silinir (üstündeki `///` açıklamalarıyla birlikte). Silinen hesaplanmış tablonun dosyası kaldırılır, `model.tmdl`'deki `ref table` satırı da.
- **Her iki biçimde:** Q&A dil verisindeki (cultures) ilgili kayıtlar ve model diyagramındaki kutular da çıkarılır. Veri önbelleği (`.pbi/cache.abf`) korunur, böylece Desktop kopyayı yenilemeden açar. PBIT'te bu bilgisayara bağlı `SecurityBindings` dosyası çıkarılır; içerik değişince geçersiz kalır.

**Yapısal doğrulama (`verifyCopy`).** Kopya baştan, aslıyla aynı okuyucuyla taranır ve beş şey kontrol edilir:
1. Seçilen öğeler kopyada yok.
2. Başka hiçbir öğe kaybolmadı.
3. Raporun bütün alanları hâlâ modelde var.
4. Kalan formüllerde yeni bir kırık başvuru yok.
5. Önce kullanılan her öğe hâlâ kullanılıyor.

Beşi de geçerse "Doğrulama geçti" yazar.

## 9. Sayısal doğrulama

Yapısal doğrulama "bir şey kırılmadı" der, ama rakamları görmez. Rakam hesaplamak için veriyle çalışan bir motor gerekir; tarayıcıda yok. Bu yüzden MCP sunucusu açık Power BI Desktop'ın kendi motoruna bağlanır (`mcp/desktop.mjs`, `mcp/desktop.ps1`):

- Her görselin alanlarından bir DAX sorgusu kurulur: `SUMMARIZECOLUMNS` ile sütunlar ve measure'lar, en fazla 500 satır. Ayrıca her kullanılan measure'ın toplamı.
- Temizlikten önce çalıştırılıp kaydedilir, sonra tekrar çalıştırılıp satır satır karşılaştırılır.
- Yalnızca `EVALUATE` sorgusu gönderilir; model değişmez.
- Görsel ve sayfa filtreleri uygulanmaz. Amaç raporu birebir kopyalamak değil, önce ve sonrayı karşılaştırmak.

Soru: *"Silinen şeyler hiçbir görsele ulaşmıyorsa rakam neden değişsin?"* → Beklenen, değişmemesi. Bu adım bunu varsaymak yerine kanıtlar. Örneğin yüklenmemiş bir rapor ya da gözden kaçan bir yapı varsa burada yakalanır.

## 10. MCP sunucusu

`mcp/server.mjs`, aynı çekirdeği Claude'a dokuz araçla açar: `modeli_tara`, `oge_detayi`, `soyagaci`, `devir_belgesi`, `silme_plani`, `temiz_kopya_olustur`, `desktop_listele`, `degerleri_olc`, `degerleri_karsilastir`. Kurulum: [MCP.md](MCP.md).

- **Neden yerel (stdio)?** Power BI dosyaları şirket verisi taşıyabilir. Sunucu kullanıcının bilgisayarında çalışır, ağa çıkmaz. VPS gerekmez.
- **Neden yazma sınırlı?** Yapay zekânın asıl dosyayı değiştirmesini istemiyoruz. Tek yazan araç yeni bir kopya oluşturur, var olan dosyanın üzerine yazmaz.
- **Güvenlik:** Sadece başlatırken verilen klasörlerin altı okunabilir ve yazılabilir.

## 11. Testler

- `tests/core.test.mjs`: örnek rapor, çok modelli PBIP, TMDL, PBIX, DAX okuyucu, silme sırası, İngilizce metinler.
- `tests/pbix-clean.test.mjs`: SQLite okuyucu (taşma sayfaları dahil), PBIX metadata eşlemesi, temizlenmiş kopya ve doğrulama, TMDL düzenlemeleri.
- `tests/mcp.test.mjs`: sunucuyu gerçekten başlatır, araçları MCP protokolüyle çağırır, izinli klasör dışını ve üzerine yazmayı reddettiğini doğrular. `MEASURE_SIEVE_PWSH` verilirse PowerShell köprüsünü sahte motorla uçtan uca dener.
- `tests/lineage.test.mjs`: M kodundan kaynak çıkarma (yorum/metin içi, iç içe çağrı, parametre, önceki adım), iki yönlü soyağacı, ilişki uyarıları.
- `tests/explain.test.mjs`: 20 ölçülük doğruluk seti, açıklanmaması gereken kalıplar, parantez (gruplama) korunumu.
- `tests/gercek-dosyalar.mjs`: elle deneme betiği. Sonuçlar: [GERCEK_DOSYA_TESTLERI.md](GERCEK_DOSYA_TESTLERI.md).

## 12. Bilinen sınırlar

- Yüklenmeyen raporlar, Excel pivotları, sayfalandırılmış raporlar, dışarıdan yazılan DAX sorguları görünmez. Bu yüzden "kullanılmıyor" değil "kullanılmıyor gibi" diyoruz.
- `SELECTEDMEASURE()` kullanan hesaplama grupları her measure'a uygulanabilir; grubun içindeki açık başvurular izlenir.
- PBIX'e yazılmaz; temizlenmiş kopya PBIT ve PBIP için.
- Sayısal doğrulama yalnızca Windows'ta, Power BI Desktop açıkken; gerçek bir Desktop ile henüz denenmedi (bkz. test belgesi).
- Veri sütunları ve içe aktarılan tablolar otomatik kaldırılmaz; Power Query adımı üretilir.
- Q&A (doğal dil sorusu) önerileri ve görsel dışı kişisel ayarlar izlenmez.

## 13. Sık sorulabilecek sorular

**"Measure Killer varken neden bu?"** Kurulum istemiyor, dosya bilgisayardan çıkmıyor, Türkçe; her sonucun nedenini cümleyle söylüyor, temizlenmiş kopyayı kendisi üretip doğruluyor ve aynı analizi Claude'a MCP olarak açıyor.

**"Bir measure'ı yanlışlıkla 'kullanılmıyor' derse?"** En sık neden, aynı modeli kullanan başka bir raporun yüklenmemiş olmasıdır. O raporları da ekleyince sonuç güncellenir. Ayrıca betik çalıştırmadan önce kopya almak her ekranda hatırlatılıyor.

**"Neden sütunları da gösteriyor?"** Measure'lar kafa karıştırır, kullanılmayan sütunlar ise modeli büyütür (her sütun bellekte yer kaplar). İkisi birlikte temizlenince fayda büyür.

**"Kişisel veri ya da dosya içeriği topluyor mu?"** Hayır. Uygulamanın kendisi yalnızca dil seçimini tarayıcıda saklar; dosya içeriği hiçbir yere gönderilmez. Sayfa güvenlik başlıkları (`web/_headers`) başka sitelere bağlantıyı da engeller.

## 14. Belgele modu (1.2.0, Kasım 2026)

### Bir bakışta

Aynı dosya yüklenir, üstteki seçimle **Temizle** ("neyi silebilirim?") ya da **Belgele** ("bu model ne yapıyor?") açılır. Belgele beş bölümden oluşur: Soyağacı, Kaynaklar, Tablolar ve ilişkiler, Measure açıklamaları, Sayfalar. En altta devir belgesi (Markdown ya da yazdırılabilir HTML) iner. Doğrudan bağlantı: `https://measure-sieve.ysfdurak.com/#belgele`.

### Kararlar ve nedenleri

| Karar | Neden | Elenen seçenek |
|---|---|---|
| Ayrı "Power BI Belgeleyici" projesi yerine Measure Sieve'e mod | İki iş sahada aynı dosyada art arda yapılır; kodun yaklaşık %70'i (okuyucular, bağımlılık grafiği, rapor kullanımı) ortak; portföyde tek derin araç iki ince araçtan güçlü durur | Ayrı depo: kopya kod, iki bakım |
| Ad değişmedi | Canlı adres, video, Search Console kaydı yeni; DAX Kural Defteri de katılacağı için ad bir kez, kapsam kesinleşince değişir | Hemen yeniden adlandırma |
| Açıklama kural tabanlı, yapay zekâsız | 1. aşama ilkesi: sunucu ve API yok, veri cihazdan çıkmaz. Emin olunmayan formül açıklanmaz | API ile açıklama (maliyet, gizlilik) |
| M kodu çalıştırılmaz, metin olarak okunur | Güvenlik: dosya içindeki kod hiçbir zaman yürütülmez; kaynak bilgisi metinden çıkarılabiliyor | Power Query motorunu taklit etmek |
| Diyagram için dış kütüphane yok | Sitenin "dış bağımlılık yok" ilkesi ve CSP; 40 tabloya kadar basit yerleşim yeterli | Graphviz/D3 gibi kütüphaneler |
| Devir belgesi betiksiz HTML + sıkı CSP | Belge e-postayla dolaşır; açıldığında hiçbir şey çalışmamalı, hiçbir yere bağlanmamalı | PDF kütüphanesi (ağır), Word (V1.1'e) |

### Mimari

```
dosya ─► core.js (okuyucular + analyze) ─► sonuç (düğümler, tablolar, ilişkiler, M sorguları)
                                              │
              ┌───────────────────────────────┼────────────────────────────┐
              ▼                               ▼                            ▼
        lineage.js                       explain.js                   diagram.js
  M → kaynak, iki yönlü iz,        DAX → ağaç → TR/EN cümle        ilişki yerleşimi → SVG
  ilişki uyarıları                 (tanınmazsa açıklama yok)
              └───────────────┬───────────────┴────────────────────────────┘
                              ▼
            docview.js (sekme HTML'i)      docgen.js (Markdown / HTML belge)
                    ▼                                 ▼
              app.js (web)                  mcp/server.mjs (soyagaci, devir_belgesi)
```

Web ve MCP aynı modülleri kullanır; bu yüzden MCP'nin `devir_belgesi` aracı web'deki "Markdown indir" ile aynı belgeyi verir.

### Kod turu

- **`core.js` / `pbix.js` genişletmesi:** Okuyucular artık Power Query bölümlerini (`partition … = m`, TMSL `source.type: "m"`, PBIX `Partition.Type = 4`), paylaşılan sorgu ve parametreleri (`expressions`), ilişki kardinalitesi ve filtre yönünü, `description` alanlarını okuyor. TMDL'de açıklama, nesnenin üstündeki `///` satırlarıdır. Doğrulama: aynı rapor PBIX, PBIT, PBIP-TMSL, PBIP-TMDL ve PBIR biçimlerinde bayt bayt aynı M kodunu verdi.
- **`lineage.js` → `sourcesOfM`:** M metninde 25 bağlayıcı kalıbı aranır (Excel, CSV, SQL, SharePoint, web, klasör, `#table` gibi elle girilen veri…). Önemli inceliklerin her biri gerçek bir hatadan çıktı:
  - Metinlerin içi aramadan önce maskelenir; `"Sql.Database(…)"` yazan bir metin kaynak sayılmaz.
  - `Excel.Workbook(File.Contents(…))` tek kaynaktır; iç çağrı ayrıca sayılmaz (aralık takibi).
  - `Csv.Document(Dosya)` gibi aynı sorgunun önceki adımını okuyan bağlayıcı yeni kaynak değildir (örnek raporda yakalandı).
  - `[#"Sütun Adı"]` alan erişimidir, başka sorguya başvuru değildir (gerçek dosyada yakalandı).
  - Parametre (`Sunucu`) değeriyle birlikte gösterilir; tanınmayan bağlayıcı tahmin edilmez, adıyla bildirilir.
- **`traceUp` / `traceDown`:** Yukarı iz, düğümlerin `uses` kümesini izler ve tablodan sorguya, sorgudan kaynağa çıkar. Aşağı iz `usedBy` ile görsellere iner. Kaynaktan aşağı inerken tablonun bütün veri sütunları gelir; görsele ulaşmayanlar sayı olarak gizlenir (`hiddenCols`).
- **`explain.js`:** Küçük bir DAX ayrıştırıcı (sözcükler → işlem önceliğiyle ağaç) ve her düğüm için cümle kalıbı. Herhangi bir düğüm tanınmazsa `NOPE` atılır ve **hiç açıklama üretilmez**. Gruplama korunur: `[A]/([A]+[B])` için parantez cümlede de kalır (örneklemde bulunan anlam kayması buydu).
- **`diagram.js`:** Olgu tablosu = ilişkilerde "çok" tarafında olan. Olgular ortada, boyutlar BFS uzaklığına göre sağa ve sola, kar tanesi boyutları bir sütun dışarıda. Filtre yönü ok, pasif ilişki kesik çizgi, riskli ilişki turuncu.
- **`docgen.js`:** Belge içeriği tek bir ara yapıdan (`handoverModel`) üretilir; Markdown ve HTML bu yüzden hep tutarlıdır. Markdown'da biçim karakterleri kaçışlanır, formüller kod bloğunda (çit uzunluğu içerikteki ters tırnaktan uzun). HTML'de `default-src 'none'`.

### Testler (örneklem)

| Adım | Beklenen | Gözlenen | Durum |
|---|---|---|---|
| `npm test` | Tüm testler geçer | 34/34 | ✓ |
| Aynı rapor 5 biçimde M ve parametre karşılaştırması | Aynı özet | 5/5 aynı | ✓ |
| 25 gerçek PBIX'te tablo sorgusu kaynağı | Çoğu bulunur, kalan açıklanır | 258 sorgunun 253'ü; kalan 5 başka sorgu/fonksiyondan üretiliyor | ✓ |
| Açıklama kapsaması ve doğruluğu (gerçek 733 measure) | Yanlış açıklama yok | %77 açıklamalı; 46 örneklemde yanlış yok | ✓ |
| 33 gerçek modelde diyagram | Taşma ve üst üste binme yok | 0 sorun | ✓ |
| Kötü niyetli adlar (`<script>`, `onerror`) | Hiçbir kod çalışmaz | Sayfada, indirilen HTML'de ve Markdown'da çalışmadı | ✓ |
| Telefon 390 px, koyu tema, İngilizce | Taşma yok, hata yok | Taşma yok, konsol hatası yok | ✓ |
| Tek dosyalık sürüm (`dist/measure-sieve.html`) | Belgele açılır | Açıldı, hata yok | ✓ |
| Portföy güvenlik taraması | Temiz | Temiz | ✓ |
| Windows'ta Power BI Desktop ile kaydedilmiş PBIX/PBIP | Kaynaklar ve diyagram doğru | **[doğrulanacak]** | — |
| Canlı sitede `#belgele` ve güvenlik başlıkları | Açılır, başlıklar gelir | **[yayından sonra]** | — |

### Kullanıcı gözüyle inceleme

- **Telefonda içerik ilk ekranın altındaydı:** Mod değişince Belgele başlığı 605 px'teydi (ekran 844 px, üstte dosya yükleme alanı). Mod değişince seçim çubuğu üste kayıyor; başlık 96 px'e geldi.
- **Diyagram ekran okuyucuya kapalıydı:** `role="img"` içindeki düğmeler okunmaz. Tıklanabilir diyagramda `role="group"` ve her tabloya etiket verildi.
- **Devir bir süreç, rapor değil (alan uzmanı):** Devralan kişi en çok açıklaması olmayan measure'larda takılır. "Yalnız açıklaması olmayanlar" süzgeci eklendi; hazırlayan devirden önce bunları doldurur.
- **Gizlilik:** Belge sunucu adı ve kullanıcı adı içeren dosya yolları taşır; dışa aktarma kutusuna "paylaşmadan önce göz at" notu eklendi.
- **Gerçek dosyada bulunan hata:** Aynı sütundaki iki tablo arasındaki ilişki yayı kesiliyordu; çizim alanına pay eklendi.
- **Ders:** Bu dördünü teknik testler bulmadı; görev odaklı gezinti ve gerçek dosya buldu.

### Bilinen sınırlar

- Yenileme zamanı, ağ geçidi, çalışma alanı ve rapor sahibi dosyada yoktur; belge bunları uydurmaz. Bunun yerine devir belgesinde elle doldurulacak bir **devralan kontrol listesi** var (kullanıcı onayıyla eklendi). Ağ geçidi maddesi yalnız yerel dosya ya da şirket içi sunucu kaynağı varsa çıkar.
- Yüklenmeyen ara sorgular (`#"Fact A"` gibi) adıyla bildirilir ama kaynağı bilinemez.
- 40'tan fazla ilişkili tabloda diyagram yerine liste gösterilir.
- Açıklama kalıpları yaygın DAX'ı kapsar; `VAR/RETURN`, `RANKX`, `TREATAS` gibi formüller bilerek açıklanmaz.
- Word (.docx) çıktısı V1.1'e kaldı.

### Mülakat soruları

**"Kaynağı M kodundan nasıl buluyorsun, kodu çalıştırıyor musun?"** Hayır, çalıştırmıyorum; metin olarak okuyorum. Önce yorumları atıp metinleri maskeliyorum, sonra bilinen bağlayıcı çağrılarını arıyorum ve argümanlarını parantez derinliğine göre ayırıyorum. Argüman bir parametreyse değerini parametre sorgusundan alıyorum. Tanımadığım bağlayıcıyı tahmin etmiyorum, adıyla bildiriyorum.

**"Otomatik açıklama yanlış bir şey söylerse?"** Tasarım gereği, emin olmadığı formülü açıklamıyor: ağaçta tek bir tanınmayan parça varsa sonuç boş kalıyor. 20 ölçülük sette 20/20 doğru, gerçek dosyalarda %77 kapsama ve 46 örneklemde sıfır yanlış. Örneklemde bir parantez kaybı bulup düzelttim; o yüzden gruplama artık testle korunuyor. Belgede de "otomatik" etiketi var.

**"Neden ayrı bir ürün yapmadın?"** İki iş aynı dosya üzerinde art arda yapılıyor ve kodun çoğu ortak. Ayrı ürün, kopya kod ve iki bakım demekti; portföyde de "proje sayısını şişirmiş" gibi okunurdu.

**"Diyagramı nasıl yerleştiriyorsun?"** İlişkilerin "çok" tarafındaki tabloları olgu sayıp ortaya koyuyorum; boyutları olgulardan uzaklığa göre sağa ve sola dağıtıyorum. Kütüphane kullanmadım çünkü sitenin CSP'si dış kaynağa izin vermiyor ve bu ölçekte basit bir yerleşim yetiyor.

**"Güvenliği nasıl sağladın?"** Dosyadaki her ad ve formül kaçışlanıyor. İndirilen HTML'de betik yok ve CSP her şeyi yasaklıyor. Adlarına `<script>` ve `onerror` konmuş bir dosyayla denedim; ne sayfada ne belgede bir şey çalıştı.

### Kendini test et

<details><summary>1. Örnek raporda "Mağaza" tablosunun kaynağı neden CSV değil SharePoint görünüyor?</summary>Sorguda `Csv.Document(Dosya)` var ama `Dosya` aynı sorgunun önceki adımı (SharePoint'ten gelen dosya). Önceki adımı okuyan bağlayıcı yeni kaynak sayılmaz.</details>

<details><summary>2. `[A]/([A]+[B])` parantezsiz açıklansaydı ne olurdu?</summary>"A bölü A artı B" diye okunur, yani (A/A)+B gibi anlaşılırdı: anlam değişir. Bu yüzden düşük öncelikli alt işlem paranteze alınıyor.</details>

<details><summary>3. Bir kaynaktan aşağı inince neden bazı sütunlar "+N sütun" diye gizleniyor?</summary>Kaynak bir tabloyu besler, tablonun bütün sütunları gelir. Görsele hiç ulaşmayan veri sütunları listeyi boğmasın diye sayı olarak gösteriliyor.</details>

<details><summary>4. PBIT'te parametre değeri neden "değer yok" görünüyor?</summary>Şablon dosyası parametre değerlerini bilerek boşaltır (`null meta [...]`); PBIX ve PBIP'te değer görünür.</details>

### Elle yapılacak alıştırma

1. `web/js/explain.js` içinde `L.tr.agg` nesnesine `MEDIAN: c => \`${c} sütununun ortancası\`` ekle; İngilizce için `MEDIAN: c => \`the median of ${c}\``.
2. `tests/explain.test.mjs`'e bir satır ekle: `assert.equal(explainDax('MEDIAN(Satış[Tutar])', 'tr', M), 'Satış[Tutar] sütununun ortancası.')`.
3. `cd mcp && npm test` ile çalıştır; geçmezse farkın nereden geldiğini bul.

**5 dakikalık demo akışı:**
1. Örnek raporla aç, Temizle'de 5 aday measure'ı göster (30 sn).
2. Belgele'ye geç: "Ürün Tablosu" görselinin 2 kaynaktan (SQL ve Excel) geldiğini göster (1 dk).
3. Excel kaynağına tıkla: "bu dosya değişirse 2 görsel etkilenir" (30 sn).
4. Tablolar ve ilişkiler: çift yönlü filtre uyarısını göster (1 dk).
5. Measure açıklamaları: biri modeldeki açıklama, biri formülden otomatik (1 dk).
6. Devir belgesini indir, yazdırma önizlemesini aç (1 dk).

### Değişiklik günlüğü

- **26 Kasım 2026 · 1.2.0 (ek):** Devir belgesine devralan kontrol listesi.
- **26 Kasım 2026 · 1.2.0:** Belgele modu; okuyucuya M, ilişki ayrıntısı ve açıklamalar; `soyagaci` ve `devir_belgesi` MCP araçları; kullanıcı gözüyle inceleme düzeltmeleri.
