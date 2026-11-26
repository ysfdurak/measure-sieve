# Measure Sieve

Power BI modelini iki açıdan ele alır:

- **Temizle:** Hangi measure, sütun ve tabloların gerçekten kullanıldığını bulur. Kullanılmayanları nedenleriyle ve güvenli silme sırasıyla listeler, istersen bunları çıkarılmış bir kopya üretir ve kopyanın bozulmadığını doğrular.
- **Belgele:** Modelin ne yaptığını gösterir. Bir sayının hangi kaynaktan geldiğini (veri soyağacı), tabloların nasıl bağlandığını, measure'ların ne hesapladığını anlatır ve raporu devralacak kişi için tek dosyalık bir devir belgesi üretir.

**Canlı:** https://measure-sieve.ysfdurak.com · [English](#english)

- **Dosyan bilgisayarından çıkmaz.** Analiz tarayıcıda yapılır, sunucu yoktur. Veri satırları hiç okunmaz; yalnızca model tanımı.
- **PBIX, PBIT, PBIP** (TMSL ve TMDL; eski ve PBIR rapor biçimi) ve model.bim okur. PBIX'in sıkıştırılmış modeli tarayıcıda açılır.
- Aynı klasörde birden çok model ve rapor varsa her raporu kendi modeline bağlar.
- Aynı formüle sahip measure'ları ve raporda kullanılıp modelde artık bulunmayan alanları bildirir.
- **Temizlenmiş kopya:** PBIT ve PBIP için seçilen measure, hesaplanmış sütun ve hesaplanmış tabloları çıkarılmış yeni bir dosya üretir. Aslına dokunmaz.
- **Yapısal doğrulama:** Kopyayı yeniden tarar ve aslıyla karşılaştırır. Rapor alanları yerinde mi, formüllerde kırık başvuru var mı, kullanılan bir şey kayboldu mu?
- **Sayısal doğrulama (MCP, Windows):** Açık Power BI Desktop'ta görsellerin değerlerini temizlikten önce ve sonra hesaplatıp karşılaştırır.
- Tabular Editor C# betiği ve Power Query `Table.RemoveColumns` adımı üretir.
- Aynı çekirdek bir MCP sunucusu olarak da çalışır; Claude'a "bu raporda kullanılmayan measure'lar hangileri?" ya da "Ciro kartındaki sayı nereden geliyor?" diye sorabilirsin.

## Belgele

| Bölüm | Ne gösterir |
|---|---|
| Soyağacı | Kaynak → Power Query sorgusu → tablo → measure/sütun → görsel. Görselden kaynağa ("bu sayı nereden geliyor?") ve kaynaktan görsele ("bu dosya değişirse ne etkilenir?") |
| Kaynaklar | Excel, CSV, SQL, SharePoint, web vb. konumlar, parametreler, kaynağı doğrudan görünmeyen sorgular ve M kodu |
| Tablolar ve ilişkiler | İlişki diyagramı (filtre yönü, kardinalite), çift yönlü / çoka çok / pasif ilişki ve ilişkisiz tablo uyarıları |
| Measure açıklamaları | Modeldeki açıklama varsa o; yoksa formülden **kural tabanlı** Türkçe/İngilizce açıklama. Emin olunmayan formül açıklanmaz |
| Sayfalar | Sayfa sayfa görseller ve kullandıkları alanlar |
| Devir belgesi | Markdown ya da yazdırılabilir HTML (tarayıcıdan PDF). Betik içermez, açıldığında hiçbir yere bağlanmaz |

Kaynaklar M kodundan metin olarak okunur; M kodu hiçbir zaman çalıştırılmaz. Doğrudan açmak için: https://measure-sieve.ysfdurak.com/#belgele

## Sonuç durumları

| Durum | Anlamı |
|---|---|
| Kullanılıyor | Görselde, filtrede, koşullu biçimlendirmede ya da dinamik başlıkta doğrudan kullanılıyor. |
| Dolaylı kullanım | Kullanılan bir measure'ın formülünde, ilişkide, sıralama sütununda, güvenlik rolünde ya da hesaplama grubunda. |
| Kontrol et | Yalnızca gizli sayfada, yer iminde ya da metin olarak geçiyor. Karar senin. |
| Zincirleme | Yalnızca kullanılmayan başka öğelerin içinde. Onlarla birlikte silinebilir. |
| Kullanılmıyor gibi | Yüklenen dosyalarda hiçbir kullanımı yok. |

"Kullanılmıyor gibi" kesin hüküm değildir: yüklemediğin raporlar, Excel pivotları, sayfalandırılmış raporlar ve modele dışarıdan yazılan sorgular görülemez.

## Dosya türleri

| Dosya | Measure, sütun, formül | Rapordaki kullanım | Temizlenmiş kopya |
|---|---|---|---|
| PBIX | Var | Var | Yok (aşağıya bak) |
| PBIT | Var | Var | Var |
| PBIP klasörü (veya ZIP'i) | Var | Var | Var |
| model.bim + report.json | Var | Var | Var |

**PBIX'e neden yazılmıyor?** Model, veriyle birlikte özel bir sıkıştırmayla saklanıyor ve Microsoft PBIX'in içini değiştirmeyi desteklemiyor; dosya bozulursa veri de gider. İki yol var:
1. Power BI Desktop'ta **Dosya › Farklı kaydet › Power BI projesi (.pbip)**, klasörü yükle, temizlenmiş kopyayı oluştur.
2. Açık dosyada Tabular Editor ile üretilen betiği çalıştır.

Duyarlılık etiketiyle şifrelenmiş dosyalar açılamaz; uygulama bunu söyler.

## Neler otomatik kaldırılır?

| Öğe | Otomatik | Neden |
|---|---|---|
| Model measure'ı | Evet | |
| Hesaplanmış sütun | Evet | |
| Hesaplanmış tablo, alan parametresi | Evet | İlişkileri ve perspektif kayıtları da temizlenir |
| Veri sütunu | Hayır | Power Query'de kaldırılmalı; adım üretilir |
| İçe aktarılan tablo | Hayır | Sorgusu Power Query'de kaldırılmalı |
| Rapor measure'ı | Hayır | Raporun içinden kaldırılmalı |
| Raporda, rolde, ilişkide kullanılan ya da kalan bir öğeyi bozan | Hayır | Güvenlik |

## Klasör yapısı

```
web/             Tarayıcı sürümü (Cloudflare'de measure-sieve.ysfdurak.com)
  js/core.js     Analiz çekirdeği: okuyucular, bağımlılık grafiği, silme planı
  js/pbix.js     PBIX modeli: Xpress9 açma, ABF içindekiler, metadata SQLite okuyucu
  js/xpress9.js  Microsoft'un Xpress9 çözücüsü (JavaScript'e derlenmiş; tools/xpress9)
  js/clean.js    Temizlenmiş kopya (TMSL/TMDL) ve yapısal doğrulama
  js/lineage.js  Belgele: M kodundan kaynak çıkarma, iki yönlü soyağacı, ilişki uyarıları
  js/explain.js  Belgele: kural tabanlı DAX açıklaması (küçük ayrıştırıcı + TR/EN kalıplar)
  js/diagram.js  Belgele: bağımlılıksız SVG ilişki diyagramı
  js/docview.js  Belgele sekmesinin HTML'i
  js/docgen.js   Devir belgesi: Markdown ve yazdırılabilir HTML
  js/i18n.js     TR/EN metinler; web ve MCP aynı cümleleri kullanır
  js/sample.js   Örnek rapor
  js/app.js      Arayüz
mcp/             MCP sunucusu (Node, stdio)
  desktop.mjs    Sayısal doğrulama: sorgu üretimi ve karşılaştırma
  desktop.ps1    Power BI Desktop'a bağlanan PowerShell köprüsü (yalnız EVALUATE)
tests/           Otomatik testler ve gerçek dosya deneme betiği
tools/           Tek dosyalık sürüm üretici, Xpress9 derleme betiği
docs/            Proje rehberi, MCP kurulumu, gerçek dosya test sonuçları
```

## Geliştirme

```bash
cd mcp && npm install && npm test          # çekirdek, PBIX okuyucu, temizlik, sayısal doğrulama, MCP
node tests/gercek-dosyalar.mjs Rapor.pbix    # kendi dosyanla dene
npm run desktop-test                         # (mcp klasöründe, Windows) Power BI Desktop ile otomatik uçtan uca test
npm run web                                  # (mcp klasöründe) tarayıcı sürümü: http://localhost:8080
node tools/build-artifact.mjs               # dist/measure-sieve.html
```

Ayrıntılı anlatım: [docs/PROJE_REHBERI.md](docs/PROJE_REHBERI.md) · Desktop test planı: [docs/DESKTOP_TEST_PLANI.md](docs/DESKTOP_TEST_PLANI.md) · Claude ile kullanım: [docs/MCP.md](docs/MCP.md) · Test sonuçları: [docs/GERCEK_DOSYA_TESTLERI.md](docs/GERCEK_DOSYA_TESTLERI.md)

## Güvenlik ve gizlilik

- Dosyan ve sonuçlar hiçbir sunucuya gönderilmez; sayfa çerez, analitik ya da dış yazı tipi kullanmaz.
- Sıkı içerik güvenlik politikası ve tarayıcı güvenlik başlıkları (`web/_headers`).
- Dosya okurken boyut sınırları açılırken sayılarak uygulanır (zip bombasına karşı).
- MCP sunucusu yalnızca izin verilen klasörleri okur; tek yazan araç yeni bir kopya oluşturur, var olan dosyanın üzerine yazmaz.

## Lisans

Bu proje [PolyForm Shield 1.0.0](LICENSE.md) lisansıyla yayınlanır. Kaynak kodu açıktır, ancak resmi anlamda bir "açık kaynak" lisansı değildir.

- **Serbest:** Kişiler, okullar ve şirketler kendi işlerinde ücretsiz kullanabilir, değiştirebilir ve kendi bilgisayarlarına ya da sunucularına kurabilir. İzin almak gerekmez.
- **Yazılı izin gerekir:** Yazılımı satmak, adını değiştirip ürün gibi sunmak ya da bununla (ücretsiz olsa bile) rakip bir ürün veya hizmet sunmak.
- **Garanti yok:** Yazılım olduğu gibi sunulur. Bağlayıcı olan İngilizce lisans metnidir.
- Üçüncü taraf bileşenler kendi lisanslarına tabidir: JSZip (MIT), Xpress9 çözücüsü (Microsoft, MIT). PBIX okuma mantığı pbixray (MIT) projesinden yararlanılarak yazılmıştır. Bkz. `web/vendor/README.md`.

**Kurum içinde kullanım:** Tarayıcı sürümü sunucu gerektirmez; `web/` klasörünü kurumunuzun iç ağındaki herhangi bir web sunucusunda (IIS, nginx, Apache) yayınlamanız yeterlidir. Power BI dosyaları kullanıcının tarayıcısında kalır. MCP sunucusu her kullanıcının kendi bilgisayarında çalışır ve ağa çıkmaz.

Kurumunuzda kullanıyorsanız haber verirseniz sevinirim: kurulumda yardımcı olabilir, kurumunuza özel ihtiyaçları birlikte değerlendirebiliriz. İletişim: iletisim@ysfdurak.com

---

## English

Measure Sieve looks at a Power BI model in two ways. **Clean up** finds which measures, columns and tables are really used, lists the unused ones with the reason and a safe removal order, can build a copy without them and verifies that the copy is not broken. **Document** shows what the model does: where a number comes from (data lineage from source through Power Query, tables and measures to the visual, in both directions), how tables are related (diagram and warnings), what each measure calculates (the model's own description, or a rule-based explanation from the formula), and builds a one-file handover document (Markdown or printable HTML).

**Live:** https://measure-sieve.ysfdurak.com/?lang=en

- Your file never leaves your computer. The analysis runs in the browser; no data rows are read, only the model definition.
- Reads **PBIX, PBIT, PBIP** (TMSL and TMDL, legacy and PBIR reports) and model.bim. The compressed PBIX model is opened in the browser.
- **Cleaned copy** for PBIT and PBIP: removes the selected measures, calculated columns and calculated tables into a new file; the original is untouched.
- **Structural verification:** scans the copy again and compares it with the original (report fields, broken formula references, lost items).
- **Numeric verification (MCP, Windows):** computes visual values in an open Power BI Desktop before and after cleanup and compares them.
- PBIX files are never written; save as PBIP (File › Save as › Power BI project) or run the generated script in Tabular Editor.
- The same core runs as an MCP server for Claude.

### Licence

Released under [PolyForm Shield 1.0.0](LICENSE.md). The source is available, but this is not an OSI "open source" licence.

- **Free:** individuals, schools and companies may use it in their own work, change it and run it on their own computers or servers. No permission needed.
- **Needs written permission:** selling it, rebranding it as a product, or providing a product or service that competes with it (even free of charge).
- **No warranty:** provided as is. The English licence text is binding.

**Running it inside your organisation:** the browser version needs no server; publish the `web/` folder on any internal web server (IIS, nginx, Apache). Power BI files stay in the user's browser. The MCP server runs on each user's own computer and makes no network calls.

If your organisation uses it, I would be glad to hear from you: I can help with setup and discuss your needs. Contact: contact@ysfdurak.com
