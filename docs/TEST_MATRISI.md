# Test matrisi · her özellik

Durum sütunu: **Bulut ✓** = bulut ortamında gerçek dosyalarla denendi ve geçti · **PC** = kullanıcının Windows bilgisayarında denenecek · **Yayın** = repo ve Cloudflare kurulduktan sonra.

PC'deki testlerin hepsi bilgisayar bu sohbete bağlandığında Claude tarafından yapılır. Komut satırıyla yapılabilenler komutla, ekran tıklaması gerekenler (Farklı kaydet, Tabular Editor, Claude Desktop ayarı) bilgisayar kullanımıyla yapılır.

## 1. Dosya okuma

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 1.1 | PBIX modeli (Xpress9, ABF, SQLite) | 17 PBIX, pbixray ile karşılaştırma | Bulut ✓ |
| 1.2 | PBIX measure listesi = Desktop'ın listesi | INFO.MEASURES() ile karşılaştırma (otomatik test) | PC ✓ (23.11.2026) Store Sales 32/32, Adventure Works 1/1 |
| 1.3 | PBIT | COVID, örnek rapor | Bulut ✓ |
| 1.4 | PBIP · TMSL (model.bim) | Adventure Works 02 | Bulut ✓ |
| 1.5 | PBIP · TMDL | Adventure Works 03, pbip-demo | Bulut ✓ |
| 1.6 | PBIR rapor biçimi | Adventure Works 04 | Bulut ✓ |
| 1.7 | Çok modelli klasör, rapor–model eşleşmesi | pbip-demo (3 model, 5 rapor) | Bulut ✓ |
| 1.8 | Şifreli (etiketli) dosya uyarısı | PlayFab PBIT | Bulut ✓ |
| 1.9 | Bozuk dosya, .pbip işaretçi, desteklenmeyen dosya uyarıları | Yapay dosyalar | Bulut ✓ |
| 1.10 | Desktop'ta "Farklı kaydet › PBIP" ile üretilen gerçek PBIP | Store Sales'i PBIP kaydet, tara | PC ✓ (24.11.2026) Store Sales → Farklı kaydet › PBIP (TMDL + PBIR + cache.abf): 32 measure, 18 aday; PBIX ve PBIT ile aynı |
| 1.11 | Windows yolları (boşluk, Türkçe karakter, OneDrive) | `C:\Users\...\Belgeler\Satış Raporu\` altında tarama | PC ✓ (24.11.2026) `Belgeler\MeasureSieve-Test\Satış Raporu\`: tarama, MCP, kopya ve Desktop açılışı sorunsuz |

## 2. Analiz

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 2.1 | Beş durum ve gerekçeleri (measure) | Örnek rapor testleri, gerçek dosyalarda ham metin taraması (0 kaçak) | Bulut ✓ |
| 2.2 | Sütun ve tablo düzeyi (ilişki, sıralama, hiyerarşi, köprü tablo) | Testler + pbip-demo | Bulut ✓ |
| 2.3 | Gizli sayfa, araç ipucu, detay sayfası, yer imi | Örnek rapor + gerçek dosyalar | Bulut ✓ |
| 2.4 | Alan parametresi, hesaplama grubu, güvenlik rolü, KPI | pbip-demo | Bulut ✓ |
| 2.5 | Aynı formül tespiti | Örnek rapor, HR ve Sales & Returns örnekleri | Bulut ✓ |
| 2.6 | Raporda olup modelde olmayan alan | COVID, Power BI Visuals | Bulut ✓ |
| 2.7 | Kullanıcının kendi gerçek raporu | Bir iş raporunun kopyası | PC (isteğe bağlı) |

## 3. Silme planı ve çıktılar

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 3.1 | Silme sırası ve etki uyarıları | Testler | Bulut ✓ |
| 3.2 | Tabular Editor betiği sözdizimi | Üretilen betik | Bulut ✓ |
| 3.3 | Tabular Editor betiği açık PBIX'te çalışır, görseller bozulmaz | TE2 › C# Script, sonra rakam karşılaştırma | Kısmen: aynı silme işlemi (TOM ile açık PBIX'ten 12 measure) otomatik testte yapıldı, rakamlar aynı. TE2 kurulu değil; betiğin TE2'de çalışması denenmedi |
| 3.4 | Power Query adımı (`Table.RemoveColumns`) Desktop'ta çalışır | Power Query Düzenleyicisi'nde uygula | Kısmen: adım üretimi düzeltildi (yeniden adlandırılmış sütunda kaynaktaki ad; hesaplanmış tablo sütunları adıma girmez). Örneklerin veri kaynağı SQL sunucusu olduğu için Desktop'ta yenileme denenemedi → kendi raporunda (2.7) dene |
| 3.5 | Kopyalama düğmeleri (liste, betik, Excel) gerçek tarayıcıda | Edge/Chrome'da yapıştırma | Kısmen: yerel sunucuda gerçek tıklama; Claude'un tarayıcı panelinde pano kapalı, yedek yol (metin seçili + Ctrl+C iletisi) çalıştı. Edge/Chrome'da elle denenecek |

## 4. Temizlenmiş kopya

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 4.1 | PBIT / TMSL / TMDL kopya üretimi ve yapısal doğrulama | 6 gerçek kopya | Bulut ✓ |
| 4.2 | Q&A, diyagram, perspektif, SecurityBindings temizliği | Gerçek dosyalar + testler | Bulut ✓ |
| 4.3 | PBIP kopyası Desktop'ta açılır, silinenler yok, kalanlar var | Otomatik test | PC ✓ (23.11.2026) AdventureWorks-PBIP ve pbip-demo: açıldı, 6 silinen yok, 10 kalan yerinde, 22 sorgu aynı |
| 4.4 | Gerçek veri önbelleğiyle PBIP kopyası yenilemeden açılır, rakamlar aynı | 1.10'daki PBIP'in kopyası | PC ✓ (24.11.2026) Gerçek verili PBIP kopyası yenilemeden açıldı, 32 → 20 measure, 27 sorgu aynı |
| 4.5 | PBIT kopyası Desktop'ta açılır | Desktop'tan alınan PBIT'in kopyası | PC ✓ (24.11.2026) Desktop'tan alınan PBIT'in temizlenmiş kopyası açıldı, 20 measure, silinenler yok (veri kaynağı SQL olduğu için yenileme iptal edildi) |
| 4.6 | İndirme: yerel sunucu, Edge/Chrome | `npm run web`, indir, aç | Kısmen: yerel sunucuda PBIP klasörü yüklendi, kopya üretildi ve doğrulandı (32 → 20, 5 onay). İndirme Edge/Chrome'da elle denenecek |
| 4.7 | İndirme: claude.ai sayfası (PBIT ZIP içinde) | Yayınlanmış sayfa | PC |

## 5. Arayüz

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 5.1 | TR/EN, açık/koyu, telefon genişliği, taşma | Playwright ekran görüntüleri | Bulut ✓ |
| 5.2 | Sürükle-bırak dosya ve klasör (gerçek Windows Gezgini'nden) | Elle | PC |
| 5.3 | "PBIP klasörü seç" Windows klasör seçicisiyle | Elle | PC |
| 5.4 | Büyük model performansı (100+ measure, 500+ sütun) | Power BI Visuals örneği | Bulut ✓ (0,45 sn) |

## 6. MCP sunucusu

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 6.1 | 7 araç, izinli klasör dışını reddetme, üzerine yazmama | MCP protokol testleri | Bulut ✓ |
| 6.2 | Claude Desktop'a ekleme ve sohbetten çağırma | `claude_desktop_config.json`, örnek sorular | PC |
| 6.3 | Windows yolları ve Türkçe karakterli klasörler | 6.2 sırasında | PC ✓ (24.11.2026) Türkçe karakterli klasör, izinli klasör dışı reddedildi |
| 6.4 | `temiz_kopya_olustur` Windows'ta kopya yazar | 6.2 sırasında | PC ✓ (24.11.2026) PBIP ve PBIT kopyası yazıldı, var olan klasörün üzerine yazmadı, veri önbelleği korundu |

## 7. Sayısal doğrulama

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 7.1 | Sorgu üretimi, karşılaştırma, Türkçe karakter taşıma | Sahte motorla PowerShell testi | Bulut ✓ |
| 7.2 | Açık Desktop'ı bulma (port), ADOMD yükleme | Otomatik test | PC ✓ (23.11.2026) 4 açılışta port bulundu, ADOMD yüklendi |
| 7.3 | Ölç → temizle → karşılaştır, fark yok | Otomatik test (PBIX) | PC ✓ (23.11.2026) Store Sales: 12 measure silindi, 27 sorgu, fark yok |
| 7.4 | Gerçek bir fark yakalanıyor mu (negatif test) | Kullanılan bir measure'ın formülü değiştirilir, fark beklenir | PC ✓ (24.11.2026) `Sales` measure'ı ×2+1 yapıldı: 27 sorgudan 22'sinde fark yakalandı (ekranda da $22M → $44M) |
| 7.5 | Microsoft Store sürümü ve yükleyici sürümü | Hangisi kuruluysa | PC ✓ (23.11.2026) Microsoft Store sürümü 2.159.1231.0 (yükleyici sürümü denenmedi) |

## 8. Araçlar ve kurulum

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 8.1 | `npm install`, `npm test` Windows'ta | Komut | PC ✓ (23.11.2026) Node 24.22.3: 20/20 (ilk denemede Windows yol hatası bulundu ve düzeltildi) |
| 8.2 | `npm run web` yerel sunucu | Komut + tarayıcı | PC ✓ (24.11.2026) 200 / · core.js · xpress9.js · fonts.css, 404 bilinmeyen adres |
| 8.3 | Otomatik test (`npm run desktop-test`) | Komut | PC ✓ (23.11.2026) 10 adım geçti, 0 uyarı |
| 8.4 | Oturum açılışında çalışan görev, kendini silme | `desktop-e2e-kur.ps1`, sonra `-Kaldir` | PC ✓ (24.11.2026) Görev kuruldu (AtLogOn, 2 dk gecikme, --once), -Kaldir ile silindi. Bulunan hata: .ps1 BOM'suzdu, Türkçe iletiler bozuk görünüyordu (düzeltildi) |
| 8.5 | `tools/build-artifact.mjs`, `tools/xpress9/build.sh` | Bulutta çalıştırıldı | Bulut ✓ |

## 9. Yayın (repo açıldıktan sonra)

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 9.1 | Cloudflare Workers dağıtımı, measure-sieve.ysfdurak.com | Canlı adres | Yayın ✓ (23.11.2026) |
| 9.2 | Güvenlik başlıkları (CSP vb.) gerçek sunucuda, sayfa bozulmadan | Tarayıcı konsolu + başlık kontrolü | Yayın ✓ (23.11.2026) |
| 9.3 | 404 sayfası, `?lang=en` | Canlı adres | Yayın ✓ (23.11.2026) |

## Bulunan hatalar (Windows testleri)

| Tarih | Hata | Durum |
|---|---|---|
| 23.11.2026 | `import()` Windows mutlak yolunu kabul etmiyordu (`npm test`, Desktop testi) | Düzeltildi (#4) |
| 24.11.2026 | `.ps1` dosyaları BOM'suz: Windows PowerShell 5.1 Türkçe iletileri bozuyordu | Düzeltildi (#6) |
| 24.11.2026 | Power Query adımı modeldeki sütun adını kullanıyordu; yeniden adlandırılmış sütunda çalışmazdı. Hesaplanmış tablo sütunları da adıma giriyordu | Düzeltildi (#6) |

Ek testler: `tools/desktop-e2e-ek.mjs` (Desktop'ta Farklı kaydet › PBIP ile kaydedilmiş bir klasör ister).
