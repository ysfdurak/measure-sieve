# Gerçek dosya testleri

Ölçü Eleği, GitHub'da herkese açık paylaşılmış gerçek Power BI dosyalarıyla denendi (Kasım 2026). Dosyalar bu depoya konmadı; lisansları sahiplerine aittir. Aynı denemeyi kendi dosyalarınla yapmak için:

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

1. **Biçim tutarlılığı:** Aynı Adventure Works raporu PBIT, PBIP-TMSL, PBIP-TMDL ve PBIR biçimlerinde aynı ölçü ve tablo sonuçlarını verdi.
2. **Kaçan kullanım taraması:** Her "kullanılmıyor gibi" ya da "zincirleme" öğe için ham rapor metninde aynı tablo ve adla bir alan başvurusu arandı. 16 PBIX'te bu tarama tek bir kaçak buldu: gruplanmış/kümelenmiş alanlar (`GroupRef`). Düzeltildikten sonra kaçak kalmadı.
3. **Elle kontrol:** COVID-19 örneğinde "Methodology" ölçüsü yalnızca sabit bir başlık metninde geçiyor (kullanılmıyor, doğru). Aynı raporda `COVID[County Name - Copy]` filtresi modelde artık olmayan bir sütuna bakıyor; uygulama bunu "raporda olup modelde olmayan alan" olarak bildirdi.
4. **PBIX için model:** PBIX'teki sıkıştırılmış model tarayıcıda okunamıyor. Test için model, [pbixray](https://github.com/Hugoberry/pbixray) ile ayrıca çıkarıldı ve raporla birlikte çalıştırıldı. Bu çıkarımda hiyerarşi ve sıralama sütunu bilgisi olmadığı için sütun sayıları yaklaşıktır; ölçü sonuçları geçerlidir.

## Sonuçlar (PBIX + çıkarılan model)

Ölçü ve sütun sütunlarında: toplam / silme adayı (kullanılmıyor gibi + zincirleme).

| Rapor | Sayfa, görsel | Ölçü | Sütun | Aynı formül | Modelde olmayan alan |
|---|---|---|---|---|---|
| AdventureWorks Sales | 1, 17 | 20 / 11 | 62 / 31 | 0 | 0 |
| Artificial Intelligence Sample | 3, 40 | 29 / 24 | 135 / 96 | 0 | 0 |
| Competitive Marketing Analysis | 5, 26 | 22 / 15 | 52 / 25 | 0 | 1 |
| Corporate Spend | 3, 20 | 19 / 1 | 36 / 7 | 0 | 0 |
| Employee Hiring and History | 4, 16 | 25 / 10 | 45 / 12 | 0 | 1 |
| Regional Sales Sample | 9, 147 | 15 / 0 | 70 / 27 | 0 | 2 |
| Revenue Opportunities | 3, 12 | 6 / 2 | 69 / 45 | 0 | 0 |
| Store Sales | 3, 14 | 32 / 18 | 69 / 37 | 0 | 0 |
| Adventure Works DW 2020 | 1, 2 | 0 / 0 | 72 / 51 | 0 | 0 |
| Power BI Visuals | 23, 296 | 68 / 26 | 60 / 18 | 0 | 6 |
| Human Resources Sample | 5, 36 | 30 / 14 | 45 / 11 | 1 | 0 |
| Sales & Returns Sample | 18, 166 | 58 / 15 | 72 / 21 | 1 | 1 |
| Supply Chain Sample | 4, 23 | 4 / 2 | 40 / 12 | 1 | 1 |
| 2020SU11 Blog Demo - November | 5, 55 | 5 / 0 | 104 / 65 | 0 | 2 |
| Financial Sample | 1, 10 | 1 / 0 | 14 / 5 | 0 | 0 |
| Metricalist Financial Performance | 1, 46 | 59 / 8 | 69 / 41 | 0 | 1 |

Toplam 393 ölçünün 146'sı aday çıktı. Microsoft örneklerinin çoğu eğitim amaçlı olduğundan çok sayıda "gösterim için yazılmış ama rapora konmamış" ölçü içeriyor; yüksek oran bundan.

## PBIT ve PBIP sonuçları

| Dosya | Sonuç |
|---|---|
| COVID-19 US Tracking Sample.pbit | 10 ölçüden 1 aday; 1 eski filtre (modelde olmayan sütun) |
| Adventure Works (4 biçim) | 1 ölçü, kullanılıyor; 3 boyut tablosu kullanılmıyor gibi |
| pbip-demo / Model01 (3 rapor) | 16 ölçüden 6 aday; kullanılmayan alan parametresi tablo olarak işaretlendi, içindeki ölçü "yalnızca kullanılmayan alan parametresinde" |
| pbip-demo / Model02 | 4 otomatik tarih tablosu gizlendi; raporda modelde olmayan 1 tablo başvurusu |
| pbip-demo / Model03 | 6 ölçüden 3 aday |
| OverviewReport.pbit (şifreli) | "Duyarlılık etiketiyle şifrelenmiş" mesajı, çökme yok |

## Bu testlerin bulduğu ve düzeltilen hatalar

- Bir klasörde birden çok model olduğunda ölçüler birbirine karışıyordu. Artık her rapor `definition.pbir` üzerinden kendi modeline bağlanıyor.
- Şifreli (MIP) dosyalar "geçersiz dosya" diye raporlanıyordu. Artık ayrı ve açıklayıcı bir mesaj var.
- Gruplar ve kümeler (`GroupRef`) kullanım sayılmıyordu.
- Alt sorgu ve tahmin çizgisi gibi tablo adı olmayan başvurular "modelde yok" diye gösteriliyordu.
- TMDL formülleri dosyadaki girintiyle gösteriliyordu.
- Hiyerarşi düzeyi adı sütun adıyla aynıysa çözülemiyordu.
