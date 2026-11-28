# Sürüm notları

## 1.2.1 · Kasım 2026 (Windows testi düzeltmeleri)

Gerçek bir Power BI Desktop dosyasıyla (Store Sales örneği, PBIX ve PBIP) yapılan Windows testinde bulunanlar:

- **Görsel sayısı iki ekranda farklıydı** (Temizle 14, Belgele 13). Temizle rapordaki bütün görselleri sayar, Belgele modelden veri kullananları. Belgele artık farkı söylüyor: "13 görsel (+1 metin kutusu, resim ya da şekil)". Gruplar görsel sayılmıyor.
- **Aynı sayfada aynı tür ve başlıktaki görseller birleşiyordu** (ör. başlıksız iki kart tek görsel sayılırdı). Görseller artık rapordaki adlarıyla ayrılıyor.
- **SQL Server kaynağı "." diye görünüyordu.** ".", "(local)", "localhost" artık "bu bilgisayardaki yerel sunucu" diye açıklanıyor.
- **PBIP dosyaları "Dosya seç" ile tek tek seçilince** rapor sessizce kayboluyordu ("Rapor bulunamadı"). Artık ne olduğunu ve ne yapılacağını (klasör seç ya da ZIP'le) söyleyen bir uyarı çıkıyor; yüklenen ad da ".platform" yerine `.pbip` dosyasının adı.

## 1.2.0 · Kasım 2026 (Belgele modu)

- Yeni **Belgele** modu: Temizle'nin yanında. Aynı dosya, ikinci soru: "bu model ne yapıyor?"
- **Veri soyağacı:** kaynak → Power Query sorgusu → tablo → measure/sütun → görsel, iki yönde. Kaynaklar M kodundan kural tabanlı okunur (Excel, CSV, SQL, SharePoint, web, klasör, elle girilen veri ve 15+ bağlayıcı); kod çalıştırılmaz, tanınmayan bağlayıcı tahmin edilmez.
- Okuyucular artık Power Query bölümlerini, paylaşılan sorguları ve parametreleri, ilişki kardinalitesi ve filtre yönünü, nesne açıklamalarını da okuyor (PBIX, TMSL, TMDL). Aynı rapor 5 biçimde bayt bayt aynı M kodunu veriyor.
- **İlişki diyagramı** ve uyarılar: çift yönlü, çoka çok, pasif, bire bir ilişki; ilişkisiz tablo.
- **Measure açıklamaları:** modeldeki açıklama önce; yoksa formülden kural tabanlı TR/EN cümle. 20 ölçülük doğruluk seti 20/20; gerçek 733 measure'ın %77'si açıklanıyor, 46 örneklemde yanlış açıklama yok.
- **Devir belgesi:** Markdown ve yazdırılabilir HTML; betiksiz, sıkı CSP. Dosyada olmayan bilgiler (kaynak erişimi, yenileme zamanı, ağ geçidi, çalışma alanı, sahip, rol atamaları) için elle doldurulacak **devralan kontrol listesi**; hiçbiri tahmin edilmez.
- MCP: `soyagaci` ve `devir_belgesi` araçları.
- Temizle ↔ Belgele iki yönlü geçiş; `#belgele` bağlantısıyla doğrudan açılış.
- Güvenlik: tüm adlar kaçışlanıyor; kötü niyetli adlarla XSS denemesi sayfada ve indirilen belgede sonuçsuz. Portföy güvenlik taraması temiz.

## 1.1.5 · Kasım 2026 (Windows test turu 2)

- Tabular Editor betiği artık, silinmeyecek bir öğenin kullandığı öğeyi silmiyor; o satır açıklamasıyla yorum olarak kalıyor. Gerçek Desktop'ta bulundu: silinmeyen bir hesaplanmış tablo bozuluyordu.
- Power Query adımı, sütunun Power Query'deki adını (sourceColumn) kullanıyor; hesaplanmış tablo sütunları adıma girmiyor.
- `.ps1` dosyaları BOM'lu UTF-8: Windows PowerShell 5.1'de Türkçe iletiler bozulmuyor.
- Yeni test araçları: `desktop-e2e-ek.mjs` (Desktop'ın kaydettiği gerçek PBIP/PBIT, MCP, negatif test) ve `desktop-e2e-te.mjs` (Tabular Editor 2).

## 1.1.4 · Kasım 2026 (ilk Windows testi)

- Windows'ta `npm test` ve Desktop uçtan uca testi, `import()` mutlak yolu kabul etmediği için duruyordu; yollar file:// URL'ye çevrildi.
- Gerçek Power BI Desktop'ta (2.159, Microsoft Store) otomatik test: 10/10 adım geçti. PBIX measure listesi Desktop ile aynı, silme sonrası rakamlar aynı, temizlenmiş PBIP kopyaları Desktop'ta açılıyor.
- Canlı sitede güvenlik başlıkları, 404 ve İngilizce sürüm doğrulandı.

## 1.1.3 · Kasım 2026 (güvenlik temeli)

- Yazı tipleri depoda (Google Fonts kaldırıldı); sayfa hiçbir dış adrese istek atmıyor.
- Sıkı içerik güvenlik politikası (satır içi stil dahil yok), HSTS, X-Frame-Options, COOP, Permissions-Policy.
- Dosya okumada boyut sınırları: zip girdileri açılırken sayılır; PBIX parça ve SQLite kayıt boyutları denetlenir.
- Excel'e kopyalamada formül enjeksiyonuna karşı koruma; HTML özniteliklerine giden her değer kaçışlanıyor.
- Gizlilik notu, dependabot, GitHub Actions testi (izin: yalnız okuma), zod güvenlik güncellemesi (4.6.7).
- Portföy güvenlik taraması temiz; tarayıcı kaydı zehirleme testi: tetiklenen yok.

## 1.1.2 · Kasım 2026

- Otomatik Desktop testi (`tools/desktop-e2e.mjs`, `npm run desktop-test`): örnekleri indirir, Desktop'ı kendisi açar, PBIX okuyucuyu Desktop'ın gördüğü measure listesiyle karşılaştırır, değerleri ölçer, aday measure'ları bellekteki modelden silip rakamları karşılaştırır, temizlenmiş PBIP kopyalarını açar; rapor yazar.
- `tools/desktop-e2e-kur.ps1`: testi bir sonraki oturum açılışında bir kez çalışacak şekilde kurar.

## 1.1.1 · Kasım 2026 (Desktop testi öncesi)

- Desktop köprüsü: veri UTF-8 geçici dosyalarla taşınıyor (Türkçe karakterler bozulmaz); ADOMD istemcisi çalışan Desktop'ın klasöründen de bulunuyor; sınıf adı DLL içinden okunuyor; eski Desktop sürümlerinde tek açık pencere otomatik seçiliyor.
- Temizlenmiş kopya: veri önbelleği (cache.abf) korunuyor; Q&A dil verisi ve model diyagramı temizleniyor; PBIT'te SecurityBindings çıkarılıyor.
- claude.ai sayfasında kopya indirme çalışıyor (PBIT, ZIP içinde iner).
- `npm run web` ile yerel sunucu; Desktop test planı (docs/DESKTOP_TEST_PLANI.md).

## 1.1.0 · Kasım 2026

- Ad değişti: **Ölçü Eleği → Measure Sieve** (Power BI'da kullanılan terim; adres measure-sieve.ysfdurak.com). Türkçe arayüzde de "measure" kullanılıyor.
- **PBIX modeli tam okunuyor:** Xpress9 çözücüsü, ABF içindekiler ve SQLite okuyucu tarayıcıda; PBIT almaya gerek yok. 17 gerçek PBIX'te pbixray ile birebir aynı sonuç.
- **Temizlenmiş kopya:** PBIT, PBIP (TMDL/TMSL) ve model.bim için seçilen measure, hesaplanmış sütun ve hesaplanmış tabloları çıkarılmış yeni dosya. Güvenle kaldırılamayanlar gerekçesiyle listelenir.
- **Yapısal doğrulama:** Kopya yeniden taranıp aslıyla beş noktada karşılaştırılır.
- **Sayısal doğrulama (MCP, Windows):** açık Power BI Desktop'ta görsel değerlerini önce/sonra hesaplatıp karşılaştırma (`degerleri_olc`, `degerleri_karsilastir`).
- MCP'ye yeni araçlar: `temiz_kopya_olustur`, `desktop_listele`, `degerleri_olc`, `degerleri_karsilastir`.
- İndirilen dosya adlarında Türkçe karakter kullanılmıyor.

## 1.0.0 · Kasım 2026

İlk yayın (Ölçü Eleği adıyla): measure, sütun ve tablo kullanım analizi; PBIT/PBIP okuma; silme sırası ve Tabular Editor betiği; TR/EN arayüz; salt okunur MCP sunucusu.
