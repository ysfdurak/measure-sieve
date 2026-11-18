# Measure Sieve · Proje rehberi

Bu belge, projeyi anlatabilmen ve sorulara cevap verebilmen için yazıldı. Kod okumadan da takip edilebilir; kod parçaları yalnızca "nerede" sorusunu yanıtlamak için var.

## 1. Problem ve çözüm, bir cümlede

Power BI modelleri zamanla denenmiş ama kullanılmamış measure'larla, hiç görsele girmemiş sütunlarla dolar. Bu, modeli ağırlaştırır ve yeni gelenin kafasını karıştırır. Measure Sieve, modeli ve raporu okuyup **her öğenin nerede kullanıldığını bir bağımlılık grafiğinde** izler; hiçbir yere ulaşmayanları "kullanılmıyor gibi" diye işaretler ve **hangi sırayla silineceğini** söyler.

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

`mcp/server.mjs`, aynı çekirdeği Claude'a yedi araçla açar: `modeli_tara`, `oge_detayi`, `silme_plani`, `temiz_kopya_olustur`, `desktop_listele`, `degerleri_olc`, `degerleri_karsilastir`. Kurulum: [MCP.md](MCP.md).

- **Neden yerel (stdio)?** Power BI dosyaları şirket verisi taşıyabilir. Sunucu kullanıcının bilgisayarında çalışır, ağa çıkmaz. VPS gerekmez.
- **Neden yazma sınırlı?** Yapay zekânın asıl dosyayı değiştirmesini istemiyoruz. Tek yazan araç yeni bir kopya oluşturur, var olan dosyanın üzerine yazmaz.
- **Güvenlik:** Sadece başlatırken verilen klasörlerin altı okunabilir ve yazılabilir.

## 11. Testler

- `tests/core.test.mjs`: örnek rapor, çok modelli PBIP, TMDL, PBIX, DAX okuyucu, silme sırası, İngilizce metinler.
- `tests/pbix-clean.test.mjs`: SQLite okuyucu (taşma sayfaları dahil), PBIX metadata eşlemesi, temizlenmiş kopya ve doğrulama, TMDL düzenlemeleri.
- `tests/mcp.test.mjs`: sunucuyu gerçekten başlatır, araçları MCP protokolüyle çağırır, izinli klasör dışını ve üzerine yazmayı reddettiğini doğrular. `MEASURE_SIEVE_PWSH` verilirse PowerShell köprüsünü sahte motorla uçtan uca dener.
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
