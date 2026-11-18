# Gerçek dosya testleri

Measure Sieve, GitHub'da herkese açık paylaşılmış gerçek Power BI dosyalarıyla denendi (Kasım 2026). Dosyalar bu depoya konmadı; lisansları sahiplerine aittir. Aynı denemeyi kendi dosyalarınla yapmak için:

```bash
node tests/gercek-dosyalar.mjs <dosya veya klasör> [...]
```

## Kullanılan kaynaklar

| Kaynak | İçerik |
|---|---|
| [microsoft/powerbi-desktop-samples](https://github.com/microsoft/powerbi-desktop-samples) | Microsoft'un resmi örnek raporları: 15 PBIX, 1 PBIT |
| [alisonpezzott/pbi_file_formats](https://github.com/alisonpezzott/pbi_file_formats) | Aynı rapor 5 biçimde: PBIX, PBIT, PBIP (TMSL), PBIP (TMDL), PBIR |
| [RuiRomano/pbip-demo](https://github.com/RuiRomano/pbip-demo) | Tek klasörde 3 model ve 5 rapor; alan parametresi, hesaplama grubu, KPI, güvenlik rolü |
| [45afeef/PowerBI-Templates](https://github.com/45afeef/PowerBI-Templates) | 2 PBIX (finans raporları) |
| [playfab/PlayFabPowerBITemplates](https://github.com/playfab/PlayFabPowerBITemplates) | Duyarlılık etiketiyle şifrelenmiş 1 PBIT |

## Nasıl doğrulandı?

1. **Biçim tutarlılığı:** Aynı Adventure Works raporu PBIT, PBIP-TMSL, PBIP-TMDL ve PBIR biçimlerinde aynı measure ve tablo sonuçlarını verdi.
2. **Kaçan kullanım taraması:** Her "kullanılmıyor gibi" ya da "zincirleme" öğe için ham rapor metninde aynı tablo ve adla bir alan başvurusu arandı. 16 PBIX'te bu tarama tek bir kaçak buldu: gruplanmış/kümelenmiş alanlar (`GroupRef`). Düzeltildikten sonra kaçak kalmadı.
3. **Elle kontrol:** COVID-19 örneğinde "Methodology" measure'ı yalnızca sabit bir başlık metninde geçiyor (kullanılmıyor, doğru). Aynı raporda `COVID[County Name - Copy]` filtresi modelde artık olmayan bir sütuna bakıyor; uygulama bunu "raporda olup modelde olmayan alan" olarak bildirdi.
4. **PBIX modeli:** Kendi PBIX okuyucumuzun (`web/js/pbix.js`) çıkardığı model, Python'daki [pbixray](https://github.com/Hugoberry/pbixray) aracıyla karşılaştırıldı. 17 PBIX'in hepsinde measure adları ve formülleri birebir aynı çıktı (394/394). İlişki, hiyerarşi ve sıralama sütunu bilgileri de okunuyor.

## Sonuçlar (PBIX, doğrudan)

Measure ve sütun sütunlarında: toplam / silme adayı (kullanılmıyor gibi + zincirleme).

| Rapor | Sayfa, görsel | Measure | Sütun | Aynı formül | Modelde olmayan alan |
|---|---|---|---|---|---|
| AdventureWorks Sales | 1, 17 | 20 / 11 | 62 / 28 | 0 | 0 |
| Artificial Intelligence Sample | 3, 40 | 29 / 24 | 135 / 92 | 0 | 0 |
| Competitive Marketing Analysis | 5, 26 | 22 / 15 | 52 / 24 | 0 | 1 |
| Corporate Spend | 3, 20 | 19 / 1 | 36 / 5 | 0 | 0 |
| Employee Hiring and History | 4, 16 | 25 / 10 | 45 / 10 | 0 | 1 |
| Regional Sales Sample | 9, 147 | 15 / 0 | 70 / 26 | 0 | 2 |
| Revenue Opportunities | 3, 12 | 6 / 2 | 69 / 43 | 0 | 0 |
| Store Sales | 3, 14 | 32 / 18 | 69 / 31 | 0 | 0 |
| Adventure Works DW 2020 | 1, 2 | 0 / 0 | 72 / 50 | 0 | 0 |
| Power BI Visuals | 23, 296 | 68 / 26 | 60 / 15 | 0 | 6 |
| Human Resources Sample | 5, 36 | 30 / 14 | 45 / 7 | 1 | 0 |
| Sales & Returns Sample | 18, 166 | 58 / 15 | 72 / 18 | 1 | 1 |
| Supply Chain Sample | 4, 23 | 4 / 2 | 40 / 11 | 1 | 1 |
| 2020SU11 Blog Demo - November | 5, 55 | 5 / 0 | 104 / 62 | 0 | 0 |
| Financial Sample | 1, 10 | 1 / 0 | 14 / 5 | 0 | 0 |
| Metricalist Financial Performance | 1, 46 | 59 / 8 | 69 / 36 | 0 | 1 |
| Adventure Works (alisonpezzott) | 1, 5 | 1 / 0 | 67 / 48 | 0 | 0 |

Toplam 394 measure'ın 146'sı aday çıktı. Her PBIX 0,05–0,45 saniyede okundu. Microsoft örneklerinin çoğu eğitim amaçlı olduğundan çok sayıda "gösterim için yazılmış ama rapora konmamış" measure içeriyor; yüksek oran bundan.

## PBIT ve PBIP sonuçları

| Dosya | Sonuç |
|---|---|
| COVID-19 US Tracking Sample.pbit | 10 measure'dan 1 aday; 1 eski filtre (modelde olmayan sütun) |
| Adventure Works (5 biçim) | 1 measure, kullanılıyor; 3 boyut tablosu kullanılmıyor gibi |
| pbip-demo / Model01 (3 rapor) | 16 measure'dan 6 aday; kullanılmayan alan parametresi tablo olarak işaretlendi, içindeki measure "yalnızca kullanılmayan alan parametresinde" |
| pbip-demo / Model02 | 4 otomatik tarih tablosu gizlendi; raporda modelde olmayan 1 tablo başvurusu |
| pbip-demo / Model03 | 6 measure'dan 3 aday |
| OverviewReport.pbit (şifreli) | "Duyarlılık etiketiyle şifrelenmiş" mesajı, çökme yok |

## Temizlenmiş kopya ve yapısal doğrulama

Bütün adaylar seçilip kopya üretildi, ardından kopya yeniden tarandı:

| Kaynak | Biçim | Kaldırılan | Atlanan (neden) | Doğrulama |
|---|---|---|---|---|
| COVID-19 US Tracking Sample.pbit | PBIT | 1 measure | 4 veri sütunu | Geçti |
| pbip-demo / Model01 | TMDL | 6 measure, 1 hesaplanmış sütun, alan parametresi tablosu (perspektif kayıtları dahil) | veri sütunları | Geçti |
| pbip-demo / Model03 | TMDL | 3 measure, 1 hesaplanmış sütun | 1 içe aktarılan tablo, veri sütunları | Geçti |
| Adventure Works PBIP-TMSL | model.bim | 1 hesaplanmış sütun | 3 içe aktarılan tablo, veri sütunları | Geçti |
| Örnek rapor | PBIT | 5 measure, 1 hesaplanmış sütun | 2 içe aktarılan tablo, veri sütunları | Geçti; kopya yeniden yüklenip tarandı |

TMDL düzenlemeleri satır satır diff ile de kontrol edildi: yalnızca hedef bloklar ve ilgili `ref table` / perspektif satırları çıkıyor.

**Henüz yapılmadı:** Temizlenmiş kopyaların Power BI Desktop'ta açılması ve sayısal doğrulamanın gerçek bir Desktop'a bağlanması. Bu ortamda Windows ve Power BI Desktop yok. PowerShell köprüsü sahte motorla uçtan uca test edildi (sorgu gönderme, JSON dönüşü, karşılaştırma). Gerçek bağlantı ilk kullanımda doğrulanmalı.

## Bu testlerin bulduğu ve düzeltilen hatalar

- Bir klasörde birden çok model olduğunda measure'lar birbirine karışıyordu. Artık her rapor `definition.pbir` üzerinden kendi modeline bağlanıyor.
- Şifreli (MIP) dosyalar "geçersiz dosya" diye raporlanıyordu. Artık ayrı ve açıklayıcı bir mesaj var.
- Gruplar ve kümeler (`GroupRef`) kullanım sayılmıyordu.
- Alt sorgu ve tahmin çizgisi gibi tablo adı olmayan başvurular "modelde yok" diye gösteriliyordu.
- TMDL formülleri dosyadaki girintiyle gösteriliyordu.
- Hiyerarşi düzeyi adı sütun adıyla aynıysa çözülemiyordu.
- PBIX okuyucu: SQLite'ta tablo düzeyinde `PRIMARY KEY("ID" ASC)` ile tanımlanan kimlikler okunmuyordu; measure tablosu olarak kullanılan bazı tablolar (SystemFlags=2) yanlışlıkla sistem tablosu sanılıyordu.
- Temizlik: perspektif dosyaları okuma sırasında atlandığı için ilk sürümde güncellenmiyordu; son blok silinince dosya sonundaki satır sonu kayboluyordu.
