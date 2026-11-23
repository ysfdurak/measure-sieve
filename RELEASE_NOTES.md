# Sürüm notları

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
