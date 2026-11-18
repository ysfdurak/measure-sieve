# Measure Sieve MCP sunucusu

Claude Desktop'a (ya da MCP destekleyen başka bir istemciye) eklendiğinde Claude, bilgisayarındaki Power BI dosyalarını okuyup soruları yanıtlayabilir, temizlenmiş kopya üretebilir ve rakamların değişmediğini açık Power BI Desktop'ta doğrulayabilir.

- **Yerel.** stdio ile çalışır, ağ portu açmaz, internete çıkmaz. VPS gerekmez.
- **Sınırlı erişim.** Yalnızca başlatırken verdiğin klasörlerin altını okur ve oraya yazar.
- **Aslına dokunmaz.** Tek yazan araç `temiz_kopya_olustur`'dur; o da yalnızca yeni bir kopya yazar, var olan dosyanın üzerine asla yazmaz.
- **Web ile aynı sonuç.** `web/js/` altındaki çekirdeği doğrudan kullanır.

## Kurulum

Gerekenler: [Node.js](https://nodejs.org) 20 veya üstü. Sayısal doğrulama için ayrıca Windows ve Power BI Desktop.

```bash
git clone https://github.com/ysfdurak/measure-sieve
cd measure-sieve/mcp
npm install
npm test        # isteğe bağlı
```

Claude Desktop'ta **Ayarlar › Geliştirici › Yapılandırmayı düzenle** ile `claude_desktop_config.json` dosyasını aç ve ekle (yolları kendine göre değiştir):

```json
{
  "mcpServers": {
    "measure-sieve": {
      "command": "node",
      "args": [
        "C:\\Kullanicilar\\yusuf\\measure-sieve\\mcp\\server.mjs",
        "C:\\Kullanicilar\\yusuf\\Belgeler\\Power BI"
      ]
    }
  }
}
```

İlk argümandan sonrakiler **izinli klasörlerdir**. Birden çok klasör verebilirsin. Hiç vermezsen ev klasörün kullanılır. Claude Desktop'ı yeniden başlat.

## Araçlar

| Araç | Ne yapar | Yazar mı? |
|---|---|---|
| `modeli_tara` | Özet ve adaylar: kullanılmayan measure, sütun, tablolar; aynı formüller; raporda olup modelde olmayan alanlar | Hayır |
| `oge_detayi` | Bir öğenin formülü, kullanıldığı yerler, onu kullananlar ve onun kullandıkları | Hayır |
| `silme_plani` | Silme sırası, etkiler, Tabular Editor betiği ve Power Query adımı | Hayır |
| `temiz_kopya_olustur` | Temizlenmiş kopyayı yazar (`X.temiz.pbit` ya da `klasör-temiz/`, veri önbelleği dahil) ve yapısal doğrulamayı çalıştırır | Yalnızca yeni kopya |
| `desktop_listele` | Açık Power BI Desktop pencerelerinin motor portları | Hayır |
| `degerleri_olc` | Açık Desktop'ta görsellerin ve measure'ların değerlerini hesaplatıp kaydeder | Hayır |
| `degerleri_karsilastir` | Aynı sorguları yeniden çalıştırıp kayıtla satır satır karşılaştırır | Hayır |

Çoğu araç `yollar` (dosya/klasör listesi), isteğe bağlı `model` (klasörde birden çok model varsa) ve `dil` (`tr`/`en`) alır. Kapsam seçenekleri: `measure`, `sutun`, `tablo`.

## Sayısal doğrulama nasıl çalışır?

1. Raporu Power BI Desktop'ta aç. Claude'a: *"Satış.pbix için değerleri ölç."* → `degerleri_olc` açık Desktop'ı model tablolarına bakarak bulur, her görsel için bir DAX sorgusu kurar ve sonuçları kaydeder.
2. Temizliği uygula: Tabular Editor betiğini açık dosyada çalıştır, ya da temizlenmiş PBIP kopyasını Desktop'ta açıp yenile.
3. Claude'a: *"Değerleri karşılaştır."* → `degerleri_karsilastir` aynı sorguları tekrar çalıştırır ve farkları listeler.

Ayrıntılar:
- Sorgular yalnızca `EVALUATE` ile başlar; modele hiçbir değişiklik gönderilmez.
- Bağlantı, Power BI Desktop ile gelen ADOMD istemcisiyle PowerShell üzerinden kurulur (`mcp/desktop.ps1`). DLL bulunamazsa `MEASURE_SIEVE_ADOMD` ortam değişkeniyle yolunu verebilirsin.
- Her görsel için sütunlar + measure'lar `SUMMARIZECOLUMNS` ile en fazla 500 satır olarak hesaplanır; ayrıca her kullanılan measure'ın toplamı alınır. Görsel ve sayfa filtreleri uygulanmaz: amaç raporu birebir kopyalamak değil, önceki ve sonraki hâli karşılaştırmaktır.
- Önceden de hata veren sorgular (ör. çok karmaşık görseller) karşılaştırmaya alınmaz ve ayrıca listelenir.
- Ölçümler geçici klasörde (`%TEMP%\measure-sieve`) saklanır.
- Sorgular ve sonuçlar Türkçe karakterler bozulmasın diye UTF-8 geçici dosyalarla taşınır.
- Kurumsal bilgisayarlarda PowerShell kısıtlı dil kipindeyse (Constrained Language Mode) köprü DLL yükleyemez; bu durumda BT'den izin gerekir.

## Örnek sorular

- "C:\Raporlar\Satış klasöründeki PBIP projesinde kullanılmayan measure'ları listele."
- "Brüt Kâr measure'ını silersem ne bozulur?"
- "Satış.pbit için kullanılmayan measure ve hesaplanmış tablolardan temizlenmiş bir kopya oluştur."
- "Açık Power BI Desktop'taki raporun değerlerini ölç; temizlikten sonra karşılaştıracağız."

## Sınırlar

- PBIX'e yazılmaz. Kopya için PBIP olarak kaydet ya da betiği Tabular Editor'da çalıştır.
- Yüklemediğin raporlar, Excel pivotları ve dışarıdan yazılan sorgular görülemez. Aynı modeli kullanan raporları da `yollar` içine ekle.
- Sayısal doğrulama yalnızca Windows'ta, Power BI Desktop açıkken çalışır.

---

## English (short)

A local stdio MCP server built on the same core as the web app. Install with `cd mcp && npm install`, then add `node <repo>/mcp/server.mjs <allowed folder> [...]` to `claude_desktop_config.json`. Tools: `modeli_tara` (scan), `oge_detayi` (item detail), `silme_plani` (removal plan and Tabular Editor script), `temiz_kopya_olustur` (writes a new cleaned copy and verifies it; never overwrites), `desktop_listele`, `degerleri_olc` and `degerleri_karsilastir` (numeric before/after check against an open Power BI Desktop on Windows, EVALUATE queries only). Pass `dil: "en"` for English output.
