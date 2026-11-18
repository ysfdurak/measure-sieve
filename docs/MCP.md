# Ölçü Eleği MCP sunucusu

Claude Desktop'a (ya da MCP destekleyen başka bir istemciye) eklendiğinde Claude, bilgisayarındaki Power BI dosyalarını okuyup "bu modelde kullanılmayan ölçüler hangileri?" gibi soruları yanıtlayabilir.

- **Salt okunur.** Hiçbir dosyayı değiştirmez, silmez. Silme betiğini üretir; çalıştırmak sana kalır.
- **Yerel.** stdio ile çalışır, ağ portu açmaz, internete çıkmaz. VPS gerekmez.
- **Sınırlı erişim.** Yalnızca başlatırken verdiğin klasörlerin altını okuyabilir.
- **Web ile aynı sonuç.** `web/js/core.js` dosyasını doğrudan kullanır.

## Kurulum

Gerekenler: [Node.js](https://nodejs.org) 20 veya üstü.

```bash
git clone https://github.com/ysfdurak/olcu-elegi
cd olcu-elegi/mcp
npm install
npm test        # isteğe bağlı: 9 testin geçtiğini gör
```

Claude Desktop'ta **Ayarlar › Geliştirici › Yapılandırmayı düzenle** ile `claude_desktop_config.json` dosyasını aç ve ekle (yolları kendine göre değiştir):

```json
{
  "mcpServers": {
    "olcu-elegi": {
      "command": "node",
      "args": [
        "C:\\Kullanicilar\\yusuf\\olcu-elegi\\mcp\\server.mjs",
        "C:\\Kullanicilar\\yusuf\\Belgeler\\Power BI"
      ]
    }
  }
}
```

İlk argümandan sonrakiler **izinli klasörlerdir**. Birden çok klasör verebilirsin. Hiç vermezsen ev klasörün kullanılır. Claude Desktop'ı yeniden başlat.

## Araçlar

| Araç | Ne yapar |
|---|---|
| `modeli_tara` | Özet ve aday listesi: kullanılmayan ölçü, sütun, tablolar; aynı formüller; raporda olup modelde olmayan alanlar |
| `oge_detayi` | Bir öğenin formülü, raporda nerelerde kullanıldığı, onu kullananlar ve onun kullandıkları |
| `silme_plani` | Seçilen öğeler (ya da adaylar) için silme sırası, etkiler, Tabular Editor betiği ve Power Query adımı |

Hepsi `yollar` (dosya/klasör listesi), isteğe bağlı `model` (klasörde birden çok model varsa) ve `dil` (`tr`/`en`) alır.

## Örnek sorular

- "C:\Raporlar\Satış klasöründeki PBIP projesinde kullanılmayan ölçüleri listele."
- "Brüt Kâr ölçüsünü silersem ne bozulur?"
- "Satış.pbit için kullanılmayan ölçü ve tabloların silme betiğini hazırla."
- "Aynı formüle sahip ölçüler var mı?"

## Sınırlar

- PBIX'te model sıkıştırılmış olduğu için yalnızca rapor tarafı okunur. PBIT ya da PBIP kullan.
- Yüklemediğin raporlar, Excel pivotları ve dışarıdan yazılan sorgular görülemez. Aynı modeli kullanan raporları da `yollar` içine ekle.

---

## English (short)

A local, read-only stdio MCP server built on the same core as the web app. Install with `cd mcp && npm install`, then add `node <repo>/mcp/server.mjs <allowed folder> [...]` to `claude_desktop_config.json`. Tools: `modeli_tara` (scan), `oge_detayi` (item detail), `silme_plani` (removal plan with Tabular Editor script). Pass `dil: "en"` for English output.
