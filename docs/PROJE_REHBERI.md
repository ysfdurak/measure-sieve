# Ölçü Eleği · Proje rehberi

Bu belge, projeyi anlatabilmen ve sorulara cevap verebilmen için yazıldı. Kod okumadan da takip edilebilir; kod parçaları yalnızca "nerede" sorusunu yanıtlamak için var.

## 1. Problem ve çözüm, bir cümlede

Power BI modelleri zamanla denenmiş ama kullanılmamış ölçülerle, hiç görsele girmemiş sütunlarla dolar. Bu, modeli ağırlaştırır ve yeni gelenin kafasını karıştırır. Ölçü Eleği, modeli ve raporu okuyup **her öğenin nerede kullanıldığını bir bağımlılık grafiğinde** izler; hiçbir yere ulaşmayanları "kullanılmıyor gibi" diye işaretler ve **hangi sırayla silineceğini** söyler.

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

Soru: *"PBIX neden tam desteklenmiyor?"* → Model bölümü veriyle birlikte özel bir sıkıştırmayla saklanıyor. Python'daki pbixray gibi araçlar bunu açabiliyor ama tarayıcıda çalışan, güvenilir bir açıcı yok. Kullanıcıya PBIT almasını söylüyoruz (veri içermez, birkaç saniye).

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

Her ölçü ve her sütun bir **düğüm**. Kenarlar "A, B'yi kullanır" demek:

- Ölçü formülü: `[Brüt Kâr] = [Toplam Satış] - [Toplam Maliyet]` → Brüt Kâr iki ölçüye bağlı.
- KPI, dinamik biçim dizesi, detay satırları formülleri de ölçünün parçası sayılır.
- Hesaplanmış sütun formülü, hesaplanmış tablo formülü.
- **Sıralama sütunu**: "Ay Adı", "Ay No"ya göre sıralanıyorsa Ay Adı → Ay No.

**Kök** (kesin kullanılan) noktalar:
- Rapordaki kullanımlar: görsel alanı, filtre (rapor/sayfa/görsel), koşullu biçimlendirme, dinamik başlık, görsel hesaplama, grup/küme.
- Modelin "yapısal" kullanımları: ilişki anahtarları, güvenlik rolü (RLS) filtreleri, hesaplama grupları, tablo anahtarı.

Sonra kökten başlayıp kenarlar boyunca yayılırız (graf taraması). Ulaşılan her şey kullanılıyordur. Ulaşılamayanlar:
- Kimse kullanmıyorsa → **Kullanılmıyor gibi**
- Yalnızca kullanılmayanlar kullanıyorsa → **Zincirleme** (ör. Eski Hedef, sadece kullanılmayan Hedefe Uzaklık'ta geçiyor)
- Yalnızca gizli sayfada, yer iminde ya da metin içinde geçiyorsa → **Kontrol et**

Soru: *"Neden sadece görsellere bakmıyorsun?"* → Görselde olmayan bir ölçü başka bir ölçünün içinde, koşullu biçimlendirmede ya da güvenlik rolünde kullanılıyor olabilir. Silersen o görsel ya da kural bozulur. Grafik bu zinciri yakalar.

Soru: *"Gizli sayfa neden 'kontrol et'?"* → Gizli sayfa bazen detay/araç ipucu sayfasıdır (bunları ayrıca tanıyıp "kullanılıyor" sayıyoruz), bazen unutulmuş taslaktır. Hangisi olduğunu dosyadan anlayamayız; karar kullanıcının.

### DAX okuyucu (`tokenizeDax`)

Tam bir DAX ayrıştırıcı değil; sadece başvuruları bulur: `[Ad]`, `Tablo[Ad]`, `'Boşluklu Tablo'[Ad]`. Önemli ayrıntılar:
- `"metin içindeki [Ad]"` ve `-- yorumdaki [Ad]` başvuru **sayılmaz**.
- `[Ad]` tek başınaysa önce ölçü aranır, bulunamazsa sütun (`SUMX(Satış, [Tutar])` gibi). Belirsizse aynı adlı tüm sütunlar kullanılıyor sayılır: yanlışlıkla "silinebilir" demektense ihtiyatlı davranırız.

## 5. Tablolar

Bir tablo, içindeki hiçbir ölçü ya da sütun "içerik olarak" kullanılmıyorsa adaydır. İlişki anahtarları sayılmaz; yoksa ilişkisi olan her tablo kullanılıyor görünürdü. İstisna: iki kullanılan tabloyu birbirine bağlayan **köprü tablo** silinmez. Otomatik tarih tabloları (`LocalDateTable_...`) listede gösterilmez; sayıları bilgi notu olarak verilir.

## 6. Silme planı

`removalPlan()` seçilen öğeleri **topolojik sırayla** dizer: bir öğeyi kullanan öğe ondan önce silinir (önce Hedefe Uzaklık, sonra Eski Hedef). Seçim başka bir öğeyi bozacaksa ("Toplam Maliyet silinirse Brüt Kâr bozulur") uyarır.

`teScript()` iki çıktı üretir:
- **Tabular Editor C# betiği**: ölçü, hesaplanmış sütun ve tablo silme komutları.
- **Power Query adımı**: veri sütunları için `Table.RemoveColumns`. Neden? Veri sütununu sadece modelden silersen sorgu hâlâ onu getirir; doğru yer Power Query.

Uygulama hiçbir zaman dosyayı kendisi değiştirmez. Bu bilinçli: silme geri dönüşü zor bir işlem, son karar ve son tuş kullanıcıda.

## 7. Ek kontroller

- **Aynı formül**: Yorum ve boşluklar atılıp küçük harfe çevrilen formüller karşılaştırılır. `SUM(Satış[Tutar])` ile `sum( Satış[Tutar] )` aynı sayılır. Kafa karışıklığının en sık nedeni.
- **Raporda olup modelde olmayan alan**: Silinmiş ya da adı değişmiş bir sütuna bakan görsel/filtre. Gerçek bir Microsoft örneğinde bile çıktı.
- **Şifreli dosya**: Duyarlılık etiketli dosyaların ilk baytları ZIP değil; bunu tanıyıp açık bir mesaj veriyoruz.

## 8. MCP sunucusu

`mcp/server.mjs`, aynı çekirdeği Claude'a üç araçla açar: `modeli_tara`, `oge_detayi`, `silme_plani`. Kurulum: [MCP.md](MCP.md).

- **Neden yerel (stdio)?** Power BI dosyaları şirket verisi taşıyabilir. Sunucu kullanıcının bilgisayarında çalışır, ağa çıkmaz. VPS gerekmez.
- **Neden salt okunur?** Yapay zekânın model dosyasını kendi başına değiştirmesini istemiyoruz. Betiği üretir, kullanıcı çalıştırır.
- **Güvenlik**: Sadece başlatırken verilen klasörlerin altı okunabilir; sembolik bağlantılar çözülüp kontrol edilir.

## 9. Testler

- `tests/core.test.mjs`: örnek rapor, çok modelli PBIP, TMDL, PBIX, DAX okuyucu, silme sırası, İngilizce metinler.
- `tests/mcp.test.mjs`: sunucuyu gerçekten başlatır, araçları MCP protokolüyle çağırır, izinli klasör dışını reddettiğini doğrular.
- `tests/gercek-dosyalar.mjs`: elle deneme betiği. Sonuçlar: [GERCEK_DOSYA_TESTLERI.md](GERCEK_DOSYA_TESTLERI.md).

## 10. Bilinen sınırlar

- Yüklenmeyen raporlar, Excel pivotları, sayfalandırılmış raporlar, dışarıdan yazılan DAX sorguları görünmez. Bu yüzden "kullanılmıyor" değil "kullanılmıyor gibi" diyoruz.
- `SELECTEDMEASURE()` kullanan hesaplama grupları her ölçüye uygulanabilir; grubun içindeki açık başvurular izlenir.
- PBIX'te model okunmaz.
- Q&A (doğal dil sorusu) önerileri ve görsel dışı kişisel ayarlar izlenmez.

## 11. Sık sorulabilecek sorular

**"Measure Killer varken neden bu?"** Kurulum istemiyor, dosya bilgisayardan çıkmıyor, Türkçe; her sonucun nedenini cümleyle söylüyor ve aynı analizi Claude'a MCP olarak açıyor.

**"Bir ölçüyü yanlışlıkla 'kullanılmıyor' derse?"** En sık neden, aynı modeli kullanan başka bir raporun yüklenmemiş olmasıdır. O raporları da ekleyince sonuç güncellenir. Ayrıca betik çalıştırmadan önce kopya almak her ekranda hatırlatılıyor.

**"Neden sütunları da gösteriyor?"** Ölçüler kafa karıştırır, kullanılmayan sütunlar ise modeli büyütür (her sütun bellekte yer kaplar). İkisi birlikte temizlenince fayda büyür.

**"Kişisel veri ya da dosya içeriği topluyor mu?"** Hayır. Uygulamanın kendisi yalnızca dil seçimini tarayıcıda saklar; dosya içeriği hiçbir yere gönderilmez. Sayfa güvenlik başlıkları (`web/_headers`) başka sitelere bağlantıyı da engeller.
