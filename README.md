# Ölçü Eleği

Power BI modelinde hangi ölçü, sütun ve tabloların gerçekten kullanıldığını bulur; kullanılmayanları nedenleriyle ve güvenli silme sırasıyla listeler.

**Canlı:** https://olcu-elegi.ysfdurak.com · [English](#english)

- Dosyan bilgisayarından çıkmaz. Analiz tarayıcıda yapılır, sunucu yoktur.
- PBIT, PBIP (TMSL ve TMDL, eski ve yeni PBIR rapor biçimi), model.bim ve PBIX okur.
- Aynı klasörde birden çok model ve rapor varsa her raporu kendi modeline bağlar.
- Aynı formüle sahip ölçüleri ve raporda kullanılıp modelde artık bulunmayan alanları da bildirir.
- Tabular Editor C# betiği ve Power Query `Table.RemoveColumns` adımı üretir.
- Aynı çekirdek bir MCP sunucusu olarak da çalışır; Claude'a "bu raporda kullanılmayan ölçüler hangileri?" diye sorabilirsin.

## Sonuç durumları

| Durum | Anlamı |
|---|---|
| Kullanılıyor | Görselde, filtrede, koşullu biçimlendirmede ya da dinamik başlıkta doğrudan kullanılıyor. |
| Dolaylı kullanım | Kullanılan bir ölçünün formülünde, ilişkide, sıralama sütununda, güvenlik rolünde ya da hesaplama grubunda. |
| Kontrol et | Yalnızca gizli sayfada, yer iminde ya da metin olarak geçiyor. Karar senin. |
| Zincirleme | Yalnızca kullanılmayan başka öğelerin içinde. Onlarla birlikte silinebilir. |
| Kullanılmıyor gibi | Yüklenen dosyalarda hiçbir kullanımı yok. |

"Kullanılmıyor gibi" kesin hüküm değildir: yüklemediğin raporlar, Excel pivotları, sayfalandırılmış raporlar ve modele dışarıdan yazılan sorgular görülemez. Silmeden önce dosyanın kopyasını al.

## Hangi dosyayı yüklemeliyim?

| Dosya | Ölçü, sütun ve formüller | Rapordaki kullanım |
|---|---|---|
| PBIT | Var | Var |
| PBIP klasörü (veya ZIP'i) | Var | Var |
| model.bim + report.json | Var | Var |
| PBIX | Yok (model sıkıştırılmış) | Var |

PBIX'ten PBIT almak için Power BI Desktop'ta **Dosya › Dışarı aktar › Power BI şablonu**. Duyarlılık etiketiyle şifrelenmiş dosyalar açılamaz; uygulama bunu söyler.

## Klasör yapısı

```
web/           Tarayıcı sürümü (Cloudflare'de olcu-elegi.ysfdurak.com olarak yayınlanır)
  js/core.js   Analiz çekirdeği: okuyucular, bağımlılık grafiği, silme planı (DOM'a dokunmaz)
  js/i18n.js   TR/EN metinler; web ve MCP aynı cümleleri kullanır
  js/sample.js Örnek rapor (gerçek PBIT biçiminde üretilir)
  js/app.js    Arayüz
mcp/           MCP sunucusu (Node, stdio, salt okunur)
tests/         Otomatik testler ve gerçek dosya deneme betiği
tools/         Tek dosyalık sürüm üretici (claude.ai Artifact)
docs/          Proje rehberi, MCP kurulumu, gerçek dosya test sonuçları
```

## Geliştirme

```bash
cd mcp && npm install && npm test        # 9 test: çekirdek + MCP protokolü
node tests/gercek-dosyalar.mjs Rapor.pbit  # kendi dosyanla dene
cd web && python3 -m http.server 8080      # tarayıcı sürümünü yerelde aç
node tools/build-artifact.mjs             # dist/olcu-elegi.html
```

Ayrıntılı anlatım için [docs/PROJE_REHBERI.md](docs/PROJE_REHBERI.md), Claude ile kullanım için [docs/MCP.md](docs/MCP.md).

## Lisans

Bu proje [PolyForm Shield 1.0.0](LICENSE.md) lisansıyla yayınlanır. Kaynak kodu açıktır, ancak resmi anlamda bir "açık kaynak" lisansı değildir.

- **Serbest:** Kişiler, okullar ve şirketler kendi işlerinde ücretsiz kullanabilir, değiştirebilir ve kendi bilgisayarlarına ya da sunucularına kurabilir. İzin almak gerekmez.
- **Yazılı izin gerekir:** Yazılımı satmak, adını değiştirip ürün gibi sunmak ya da bununla (ücretsiz olsa bile) rakip bir ürün veya hizmet sunmak.
- **Garanti yok:** Yazılım olduğu gibi sunulur. Bağlayıcı olan İngilizce lisans metnidir.
- Üçüncü taraf bileşenler kendi lisanslarına tabidir (JSZip: MIT; bkz. `web/vendor/README.md`).

**Kurum içinde kullanım:** Tarayıcı sürümü sunucu gerektirmez; `web/` klasörünü kurumunuzun iç ağındaki herhangi bir web sunucusunda (IIS, nginx, Apache) yayınlamanız yeterlidir. Power BI dosyaları kullanıcının tarayıcısında kalır. MCP sunucusu her kullanıcının kendi bilgisayarında çalışır ve ağa çıkmaz.

Kurumunuzda kullanıyorsanız haber verirseniz sevinirim: kurulumda yardımcı olabilir, kurumunuza özel ihtiyaçları birlikte değerlendirebiliriz. İletişim: iletisim@ysfdurak.com

---

## English

Ölçü Eleği ("measure sieve") finds which measures, columns and tables in a Power BI model are really used, and lists the unused ones with the reason and a safe removal order.

**Live:** https://olcu-elegi.ysfdurak.com/?lang=en

- Your file never leaves your computer. The analysis runs in the browser; there is no server.
- Reads PBIT, PBIP (TMSL and TMDL, legacy and PBIR report formats), model.bim and PBIX.
- Links each report to its own model when a folder holds several models and reports.
- Also reports measures with identical formulas and fields the report uses but the model no longer has.
- Produces a Tabular Editor C# script and a Power Query `Table.RemoveColumns` step.
- The same core runs as an MCP server, so you can ask Claude "which measures are unused in this report?".

"Looks unused" is not a final verdict: reports you did not load, Excel pivots, paginated reports and external queries are invisible to it. Make a copy before removing anything. PBIX files only expose the report side; export a PBIT (**File › Export › Power BI template**) or use PBIP for the full analysis.

### Licence

Released under [PolyForm Shield 1.0.0](LICENSE.md). The source is available, but this is not an OSI "open source" licence.

- **Free:** individuals, schools and companies may use it in their own work, change it and run it on their own computers or servers. No permission needed.
- **Needs written permission:** selling it, rebranding it as a product, or providing a product or service that competes with it (even free of charge).
- **No warranty:** provided as is. The English licence text is binding.

**Running it inside your organisation:** the browser version needs no server; publish the `web/` folder on any internal web server (IIS, nginx, Apache). Power BI files stay in the user's browser. The MCP server runs on each user's own computer and makes no network calls.

If your organisation uses it, I would be glad to hear from you: I can help with setup and discuss your needs. Contact: contact@ysfdurak.com
