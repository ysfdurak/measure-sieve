# Test matrisi · her özellik

Durum sütunu: **Bulut ✓** = bulut ortamında gerçek dosyalarla denendi ve geçti · **PC** = kullanıcının Windows bilgisayarında denenecek · **Yayın** = repo ve Cloudflare kurulduktan sonra.

PC'deki testlerin hepsi bilgisayar bu sohbete bağlandığında Claude tarafından yapılır. Komut satırıyla yapılabilenler komutla, ekran tıklaması gerekenler (Farklı kaydet, Tabular Editor, Claude Desktop ayarı) bilgisayar kullanımıyla yapılır.

## 1. Dosya okuma

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 1.1 | PBIX modeli (Xpress9, ABF, SQLite) | 17 PBIX, pbixray ile karşılaştırma | Bulut ✓ |
| 1.2 | PBIX measure listesi = Desktop'ın listesi | INFO.MEASURES() ile karşılaştırma (otomatik test) | PC |
| 1.3 | PBIT | COVID, örnek rapor | Bulut ✓ |
| 1.4 | PBIP · TMSL (model.bim) | Adventure Works 02 | Bulut ✓ |
| 1.5 | PBIP · TMDL | Adventure Works 03, pbip-demo | Bulut ✓ |
| 1.6 | PBIR rapor biçimi | Adventure Works 04 | Bulut ✓ |
| 1.7 | Çok modelli klasör, rapor–model eşleşmesi | pbip-demo (3 model, 5 rapor) | Bulut ✓ |
| 1.8 | Şifreli (etiketli) dosya uyarısı | PlayFab PBIT | Bulut ✓ |
| 1.9 | Bozuk dosya, .pbip işaretçi, desteklenmeyen dosya uyarıları | Yapay dosyalar | Bulut ✓ |
| 1.10 | Desktop'ta "Farklı kaydet › PBIP" ile üretilen gerçek PBIP | Store Sales'i PBIP kaydet, tara | PC |
| 1.11 | Windows yolları (boşluk, Türkçe karakter, OneDrive) | `C:\Users\...\Belgeler\Satış Raporu\` altında tarama | PC |

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
| 3.3 | Tabular Editor betiği açık PBIX'te çalışır, görseller bozulmaz | TE2 › C# Script, sonra rakam karşılaştırma | PC |
| 3.4 | Power Query adımı (`Table.RemoveColumns`) Desktop'ta çalışır | Power Query Düzenleyicisi'nde uygula | PC |
| 3.5 | Kopyalama düğmeleri (liste, betik, Excel) gerçek tarayıcıda | Edge/Chrome'da yapıştırma | PC |

## 4. Temizlenmiş kopya

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 4.1 | PBIT / TMSL / TMDL kopya üretimi ve yapısal doğrulama | 6 gerçek kopya | Bulut ✓ |
| 4.2 | Q&A, diyagram, perspektif, SecurityBindings temizliği | Gerçek dosyalar + testler | Bulut ✓ |
| 4.3 | PBIP kopyası Desktop'ta açılır, silinenler yok, kalanlar var | Otomatik test | PC |
| 4.4 | Gerçek veri önbelleğiyle PBIP kopyası yenilemeden açılır, rakamlar aynı | 1.10'daki PBIP'in kopyası | PC |
| 4.5 | PBIT kopyası Desktop'ta açılır | Desktop'tan alınan PBIT'in kopyası | PC |
| 4.6 | İndirme: yerel sunucu, Edge/Chrome | `npm run web`, indir, aç | PC |
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
| 6.3 | Windows yolları ve Türkçe karakterli klasörler | 6.2 sırasında | PC |
| 6.4 | `temiz_kopya_olustur` Windows'ta kopya yazar | 6.2 sırasında | PC |

## 7. Sayısal doğrulama

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 7.1 | Sorgu üretimi, karşılaştırma, Türkçe karakter taşıma | Sahte motorla PowerShell testi | Bulut ✓ |
| 7.2 | Açık Desktop'ı bulma (port), ADOMD yükleme | Otomatik test | PC |
| 7.3 | Ölç → temizle → karşılaştır, fark yok | Otomatik test (PBIX) | PC |
| 7.4 | Gerçek bir fark yakalanıyor mu (negatif test) | Kullanılan bir measure'ın formülü değiştirilir, fark beklenir | PC |
| 7.5 | Microsoft Store sürümü ve yükleyici sürümü | Hangisi kuruluysa | PC |

## 8. Araçlar ve kurulum

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 8.1 | `npm install`, `npm test` Windows'ta | Komut | PC |
| 8.2 | `npm run web` yerel sunucu | Komut + tarayıcı | PC |
| 8.3 | Otomatik test (`npm run desktop-test`) | Komut | PC |
| 8.4 | Oturum açılışında çalışan görev, kendini silme | `desktop-e2e-kur.ps1`, sonra `-Kaldir` | PC |
| 8.5 | `tools/build-artifact.mjs`, `tools/xpress9/build.sh` | Bulutta çalıştırıldı | Bulut ✓ |

## 9. Yayın (repo açıldıktan sonra)

| # | Özellik | Nasıl denenir | Durum |
|---|---|---|---|
| 9.1 | Cloudflare Workers dağıtımı, measure-sieve.ysfdurak.com | Canlı adres | Yayın |
| 9.2 | Güvenlik başlıkları (CSP vb.) gerçek sunucuda, sayfa bozulmadan | Tarayıcı konsolu + başlık kontrolü | Yayın |
| 9.3 | 404 sayfası, `?lang=en` | Canlı adres | Yayın |
