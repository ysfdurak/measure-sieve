# Power BI Desktop ile uçtan uca test planı

Amaç: Measure Sieve'in gerçek Power BI Desktop'ta ilk kez denenmesi. Her adımda **beklenen** sonuç yazılı; farklı bir şey olursa not al, aynı gün düzeltilecek.

## Otomatik test (önerilen)

`tools/desktop-e2e.mjs` aşağıdaki adımların çoğunu kendi başına yapar ve `Belgeler\MeasureSieve-Test\<tarih>\rapor.md` dosyasını yazar:

1. Örnekleri indirir: Store Sales.pbix, Adventure Works (PBIX ve PBIP), pbip-demo.
2. Durağan test: tarama, temizlenmiş kopya, yapısal doğrulama.
3. PBIX: dosyanın kopyasını Desktop'ta açar → Desktop'ın kendi measure listesini bizimkiyle karşılaştırır → değerleri iki kez ölçer → aday measure'ları bellekteki modelden siler → tekrar ölçüp karşılaştırır → **kaydetmeden** kapatır.
4. PBIP: aslını ve temizlenmiş kopyasını sırayla açar; kopyanın açıldığını, silinenlerin gittiğini, kalanların durduğunu ve sorguların bozulmadığını kontrol eder.

Kurulum (bir kez, repo klasöründe PowerShell ile):

```powershell
powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1          # bir sonraki oturum açılışında bir kez çalışır
powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1 -Simdi   # hemen çalıştır
powershell -ExecutionPolicy Bypass -File tools\desktop-e2e-kur.ps1 -Kaldir  # görevi sil
```

Görev oturum açıldıktan 2 dakika sonra başlar, yaklaşık 10–20 dakika sürer, sonunda raporu açar ve kendini siler. Bu sırada bilgisayarı kullanabilirsin ama Desktop pencereleri açılıp kapanacak. Senin açık Desktop pencerelerine dokunmaz.

Sınırlar: GitHub'daki PBIP örneklerinde veri önbelleği olmadığı için o testlerde görseller boş açılır. Orada açılma, measure listesi ve sorgu hataları denetlenir, rakamlar PBIX testinde denetlenir. Açılışta Desktop bir iletişim kutusunda beklerse (oturum açma, sürüm yükseltme) test 6 dakika bekleyip o adımı "kaldı" olarak işaretler.

Aşağıdaki elle test listesi, otomatik testin yapamadığı adımlar (Tabular Editor, Farklı kaydet › PBIP) ve sorun çıkarsa ayrıntılı inceleme içindir.

## Hazırlık

- [ ] Power BI Desktop güncel (sürümü not al: Yardım › Hakkında).
- [ ] Node.js 20 veya üstü (`node -v`).
- [ ] İsteğe bağlı: Tabular Editor 2 (ücretsiz). Haziran 2025'ten beri Desktop, dış araçların tablo ve sütun silmesine de izin veriyor.
- [ ] Boş bir test klasörü, örn. `Belgeler\PowerBI-Test`. Claude masaüstü uygulamasında bu klasör sohbete eklendi.
- [ ] Örnek dosyalar: Microsoft'un [powerbi-desktop-samples](https://github.com/microsoft/powerbi-desktop-samples) deposundan **Store Sales.pbix** ve **Sales & Returns Sample v201912.pbix**.
- [ ] Repo klasörde: `cd measure-sieve\mcp && npm install`.
- [ ] Uygulamayı yerelde aç: `npm run web` → http://localhost:8080

Asıl PBIX'lere hiç yazılmaz. Her deneme bir kopya üzerinde yapılır.

## 1. Tarama (PBIX)

- [ ] Store Sales.pbix'i yükle. **Beklenen:** 32 measure'dan 18'i aday (bu sonuç bulut ortamında alındı).
- [ ] Sales & Returns'ü yükle. **Beklenen:** 58 measure'dan 15'i aday, 8'i "kontrol et".
- [ ] Rastgele 3 adayı Desktop'ta kontrol et: gerçekten hiçbir görselde yok mu?

## 2. Değerleri ölç (temizlikten önce)

- [ ] Store Sales.pbix'i Desktop'ta aç.
- [ ] `node mcp/server.mjs` üzerinden ya da Claude'a: "Store Sales için değerleri ölç." → `degerleri_olc`
- [ ] **Beklenen:** Açık Desktop otomatik bulunur, "N sorgu, M başarılı". Çalışmayan sorgular listelenir.
- Olası sorun: ADOMD bulunamadı → `MEASURE_SIEVE_ADOMD` ortam değişkenine DLL yolunu ver. Microsoft Store sürümünde DLL, `PBIDesktop.exe`'nin bulunduğu klasördedir.

## 3. PBIP olarak kaydet

- [ ] Desktop'ta **Dosya › Farklı kaydet › Power BI projesi (.pbip)** → `PowerBI-Test\StoreSales\`
- [ ] Gerekirse **Dosya › Seçenekler › Önizleme özellikleri › Power BI Project (.pbip) save option** açılır.

## 4. Temizlenmiş kopya

- [ ] Uygulamada PBIP klasörünü seç, adayları seç, **Kopyayı oluştur ve doğrula**. **Beklenen:** "Doğrulama geçti", 5 onay işareti.
- [ ] ZIP'i indir, `PowerBI-Test\StoreSales-temiz\` içine aç. Ya da MCP: `temiz_kopya_olustur` (klasörü kendisi yazar).
- [ ] Not: Kopyada veri önbelleği (`.pbi\cache.abf`) korunur; Desktop'ın yenilemeden açması beklenir.

## 5. Kopyayı Desktop'ta aç

- [ ] Asıl dosyayı kapat, `StoreSales-temiz\*.pbip`'i aç.
- [ ] **Beklenen:** Hata vermeden açılır, görseller dolu, silinen measure'lar alan listesinde yok.
- Hata verirse:
  - Mesajın tam metnini kopyala.
  - `.pbi\cache.abf`'yi silip tekrar aç (veri yenilemesi istenir).
  - İlgili TMDL dosyasını Claude'a göster.

## 6. Değerleri karşılaştır

- [ ] Kopya Desktop'ta açıkken: "Değerleri karşılaştır." → `degerleri_karsilastir`
- [ ] **Beklenen:** "Rakamlar aynı: N sorgu karşılaştırıldı, fark yok."
- Port değiştiyse `desktop_listele` ile yeni portu bul ve `port` olarak ver.

## 7. Tabular Editor betiği (PBIX yolu)

- [ ] Store Sales.pbix'in bir kopyasını aç.
- [ ] Uygulamada **Tabular Editor betiğini kopyala**.
- [ ] Desktop › Dış araçlar › Tabular Editor › C# Script → yapıştır → çalıştır → Ctrl+S.
- [ ] **Beklenen:** Measure'lar silinir, görseller bozulmaz. 6. adımı bu dosyayla da tekrarla.

## 8. PBIT (isteğe bağlı)

- [ ] Desktop'ta **Dosya › Dışarı aktar › Power BI şablonu** ile PBIT al, temizlenmiş kopyasını üret, Desktop'ta aç.
- Not: Değiştirilmiş PBIT'te bu bilgisayara bağlı kimlik bilgisi bağı (`SecurityBindings`) çıkarılır; Desktop veri kaynağı kimlik bilgisini yeniden sorabilir. Microsoft, PBIT'in dış araçlarla düzenlenmesini resmi olarak desteklemiyor; tercih edilen yol PBIP.

## Sonuç tablosu

| Adım | Sonuç | Not |
|---|---|---|
| 1 Tarama | | |
| 2 Ölçüm | | |
| 4 Kopya + yapısal doğrulama | | |
| 5 Kopya Desktop'ta açıldı | | |
| 6 Sayısal karşılaştırma | | |
| 7 Tabular Editor | | |
| 8 PBIT | | |
