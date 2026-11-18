// Ölçü Eleği · arayüz ve sonuç metinleri (TR/EN)
// Çekirdek (core.js) metin üretmez; sonuçları kodlarla döndürür. Metne çevirme burada yapılır,
// böylece web arayüzü ve MCP sunucusu aynı cümleleri kullanır.

export const DICT = {
  tr: {
    'doc.title': 'Ölçü Eleği · Kullanılmayan Power BI ölçülerini bulun',
    'doc.desc': 'Power BI raporunuzdaki kullanılmayan ölçüleri, sütunları ve tabloları bulun, güvenli silme sırasını çıkarın. Ücretsiz, kurulumsuz; dosyanız tarayıcınızdan çıkmaz.',
    'brand.lead': 'Power BI modelinde hangi ölçü, sütun ve tabloların gerçekten kullanıldığını bulur; kullanılmayanları güvenli silme sırasıyla listeler. Dosyan bu sayfadan çıkmaz; analiz tarayıcında yapılır.',
    'lang.switch': 'English', 'lang.title': 'Switch to English',
    'drop.title': 'PBIT, PBIP veya PBIX dosyanı buraya bırak',
    'drop.hint': 'En iyi sonuç için PBIT ya da PBIP kullan. Aynı modele bağlı başka raporları da ekleyebilirsin.',
    'drop.file': 'Dosya seç', 'drop.dir': 'PBIP klasörü seç', 'drop.reset': 'Örneğe dön', 'drop.busy': 'Okunuyor…',
    'sample.badge': 'Örnek: Satış Raporu.pbit (örnek veri)',
    'scope.sample': 'Örnek veri gösteriliyor. Kendi dosyanı yüklediğinde sonuçlar onunla değişir.',
    'scope.files': 'Sonuç, yüklediğin {r} rapora göre hesaplandı ({p} sayfa, {v} görsel). Aynı modele bağlı başka bir rapor veya Excel dosyası varsa sonuç değişebilir.',
    'model.label': 'Model',
    'tab.measure': 'Ölçüler', 'tab.column': 'Sütunlar', 'tab.table': 'Tablolar', 'tabs.label': 'Öğe türü',
    'head.noModel': 'Raporda {n} ölçü kullanılıyor. Kullanılmayanları bulmak için ölçü listesi gerekiyor.',
    'head.noReport': 'Modelde {n} ölçü var. Görsel kullanımını görmek için raporu da yükle.',
    'head.allUsed.measure': 'Ölçülerin tamamı kullanılıyor ({n} ölçü).',
    'head.allUsed.column': 'Sütunların tamamı kullanılıyor ({n} sütun).',
    'head.allUsed.table': 'Tabloların tamamı kullanılıyor ({n} tablo).',
    'head.cand.measure': '{n} ölçüden <b>{c} tanesi</b> kullanılmıyor gibi görünüyor.',
    'head.cand.column': '{n} sütundan <b>{c} tanesi</b> kullanılmıyor gibi görünüyor.',
    'head.cand.table': '{n} tablodan <b>{c} tanesi</b> kullanılmıyor gibi görünüyor.',
    'head.review': ' {r} tanesini kontrol et.',
    'chip.all': 'Tümü',
    'st.unused': 'Kullanılmıyor gibi', 'st.chain': 'Zincirleme', 'st.review': 'Kontrol et', 'st.indirect': 'Dolaylı kullanım', 'st.used': 'Kullanılıyor', 'st.unknown': 'Rapor yok',
    'search': 'Ara', 'selCand': 'Adayları seç', 'selNone': 'Seçimi temizle',
    'tag.hidden': 'gizli', 'tag.calc': 'hesaplanmış', 'tag.reportMeasure': 'rapor ölçüsü', 'tag.dup': 'aynı formül',
    'row.select': '{name} temizlik listesine ekle',
    'd.formula': 'Formül', 'd.tableFormula': 'Tablo formülü', 'd.noFormula': 'Formül bu dosyadan okunamıyor.', 'd.dataColumn': 'Veri kaynağından gelen sütun (formülü yok).',
    'd.where': 'Raporda ve modelde kullanıldığı yerler', 'd.usedBy': 'Bunu kullanan öğeler', 'd.uses': 'Bunun kullandığı öğeler', 'd.dups': 'Aynı formüle sahip ölçüler', 'd.members': 'Tablodaki öğeler',
    'd.reportWide': 'Rapor geneli', 'd.textRef': 'metin olarak geçiyor, doğrulaması sende',
    'empty': 'Bu filtreyle eşleşen öğe yok.',
    'miss.title': 'Raporda kullanılan ama modelde olmayan {n} alan',
    'miss.text': '{names}. Bu görseller muhtemelen hata veriyor ya da yüklenmeyen başka bir modele bağlı.',
    'dup.title': 'Aynı formüle sahip {n} ölçü grubu',
    'dup.text': 'Aynı hesabı yapan ölçüler kafa karışıklığına yol açar. Birini tutup diğerlerini ona yönlendirebilirsin:',
    'auto.title': 'Modelde {n} otomatik tarih tablosu var',
    'auto.text': 'Power BI her tarih sütunu için gizli bir tablo üretir. Kendi tarih tablon varsa Dosya › Seçenekler › Veri yükü › Otomatik tarih/saat ayarını kapatmak modeli küçültür. Bu tablolar listede gösterilmez.',
    'panel.title': 'Temizlik listesi',
    'panel.count': '{n} öğe seçili. Yukarıdan aşağıya sil.',
    'panel.empty': 'Soldan öğe seçtiğinde silme sırası ve etkisi burada görünür.',
    'panel.safe': 'Yüklenen dosyalarda bozulan bir şey yok.', 'panel.safeSub': 'Yine de önce dosyanın bir kopyasını al.',
    'panel.warn': 'Bu seçim başka yerleri etkiler', 'panel.more': 've {n} etki daha',
    'w.breaks': '<b>{label}</b> silinirse {names} bozulur',
    'w.inReport': '<b>{label}</b> {n} rapor öğesinde kullanılıyor',
    'w.structural': '<b>{label}</b> {what} içinde kullanılıyor',
    'btn.script': 'Tabular Editor betiğini kopyala', 'btn.list': 'Silme listesini kopyala', 'btn.pq': 'Power Query adımını kopyala', 'btn.tsv': 'Tüm sonucu Excel için kopyala',
    'panel.reportNote': 'Rapor ölçüleri betikle silinmez, onları raporun içinden kaldır.',
    'panel.pqNote': 'Veri sütunlarını Power Query\'de kaldırmak daha doğrudur; betik bunları yalnızca not olarak listeler.',
    'copied.script': 'Betik kopyalandı. Tabular Editor\'da C# Script sekmesine yapıştır.',
    'copied.list': 'Silme listesi kopyalandı.', 'copied.pq': 'Power Query adımı kopyalandı.', 'copied.tsv': 'Sonuç kopyalandı. Excel\'e yapıştırabilirsin.',
    'copied.fail': 'Otomatik kopyalama engellendi. Aşağıdaki metin seçili; Ctrl+C ile kopyala.',
    'out.label': 'Kopyalanacak metin',
    'tsv.head': 'Tür\tTablo\tAd\tDurum\tNeden\tKullanım sayısı\tFormül',
    'kind.measure': 'Ölçü', 'kind.column': 'Sütun', 'kind.table': 'Tablo',
    'guide.files': 'Hangi dosya ne kadarını gösterir?', 'guide.th.file': 'Dosya', 'guide.th.model': 'Ölçü, sütun ve formüller', 'guide.th.report': 'Rapordaki kullanım',
    'guide.yes': 'Var', 'guide.pbixNo': 'Yok, model sıkıştırılmış durumda', 'guide.pbipFolder': '(klasör veya ZIP)',
    'guide.export': 'PBIX\'ten PBIT almak için Power BI Desktop\'ta <kbd>Dosya</kbd> › <kbd>Dışarı aktar</kbd> › <kbd>Power BI şablonu</kbd> yolunu izle. Şablon veri satırlarını taşımaz, yalnızca modeli ve raporu içerir.',
    'guide.scan': 'Tarama nereye bakar?',
    'guide.scan1': 'Görsel alanları, filtreler, koşullu biçimlendirme, dinamik başlıklar, gruplar ve kümeler',
    'guide.scan2': 'Ölçü ve hesaplanmış sütun formülleri, KPI ve dinamik biçim dizeleri, sıralama sütunları, hiyerarşiler',
    'guide.scan3': 'Araç ipucu, detay ve gizli sayfalar, yer imleri, görsel hesaplamalar',
    'guide.scan4': 'İlişkiler, alan parametreleri, hesaplama grupları, güvenlik rolleri, hesaplanmış tablolar',
    'guide.limit': 'Yüklemediğin raporları, Excel pivotlarını, sayfalandırılmış raporları ve modele dışarıdan yazılan sorguları göremez.',
    'guide.mcp': 'Claude ile kullan',
    'guide.mcpText': 'Aynı analiz bir MCP sunucusu olarak da çalışır. Claude Desktop\'a eklediğinde "Satış raporunda kullanılmayan ölçüler hangileri?" diye sorabilirsin. Sunucu yalnızca okur ve dosyan bilgisayarından çıkmaz.',
    'guide.mcpLink': 'Kurulum adımları',
    'foot.text': 'Ölçü Eleği · Yusuf Durak · PolyForm Shield 1.0.0 lisansı ile ücretsiz', 'foot.source': 'Kaynak kodu',
    'listSep': ', ', 'andMore': '{list} ve {n} öğe daha', 'autoDate': 'otomatik tarih tablosu',
    'k.field': 'görsel alanı', 'k.filter': 'filtre', 'k.format': 'biçimlendirme', 'k.title': 'dinamik başlık', 'k.bookmark': 'yer imi', 'k.viscalc': 'görsel hesaplama',
    'ps.hidden': 'gizli sayfa', 'ps.tooltip': 'araç ipucu sayfası', 'ps.drill': 'detay sayfası',
    'what.relationship': 'ilişki', 'what.role': 'güvenlik rolü', 'what.calcGroup': 'hesaplama grubu', 'what.key': 'tablo anahtarı', 'what.function': 'DAX işlevi', 'what.sort': 'sıralama sütunu',
    'v.reportFilter': 'Rapor filtresi', 'v.pageFilter': 'Sayfa filtresi', 'v.visual': 'Görsel', 'v.bookmark': 'Yer imi',
    'r.direct': '{counts}', 'r.directExtra': '{counts} · {extra}',
    'r.via': 'Şunlarda kullanılıyor: {names}', 'r.viaExtra': 'Şunlarda kullanılıyor: {names} · {extra}',
    'r.structural.relationship': 'İlişki anahtarı: {label}', 'r.structural.role': 'Güvenlik rolünde: {label}', 'r.structural.calcGroup': 'Hesaplama grubunda: {label}',
    'r.structural.key': 'Tablonun anahtar sütunu', 'r.structural.function': 'DAX işlevinde: {label}',
    'r.sortFor': 'Sıralama sütunu: {names}',
    'r.formulaOnly': 'Formüllerde kullanılıyor: {names}', 'r.noReport': 'Formüllerde kullanılmıyor. Görsel kullanımı için raporu da yükle.',
    'r.hiddenPage': 'Yalnızca gizli sayfada: {names}', 'r.bookmarkOnly': 'Yalnızca yer iminde kayıtlı', 'r.text': 'Metin olarak geçiyor: {names}',
    'r.viaReview': 'Kontrol edilecek öğede kullanılıyor: {names}',
    'r.onlyUnused': 'Yalnızca kullanılmayan öğelerde: {names}', 'r.onlyParam': 'Yalnızca kullanılmayan alan parametresinde: {names}',
    'r.none': 'Görsellerde, filtrelerde ve formüllerde bulunamadı.',
    'r.tableUsed': '{n}/{total} öğesi kullanılıyor', 'r.calcGroupTable': 'Hesaplama grubu', 'r.bridge': 'Köprü tablo: {names} arasında',
    'r.tableReview': 'Bazı öğeleri yalnızca gizli sayfada ya da yer iminde', 'r.tableNone': 'Hiçbir sütunu ya da ölçüsü kullanılmıyor.', 'r.tableNoneRel': 'Hiçbir sütunu ya da ölçüsü kullanılmıyor. {r} ilişkisi de silinir.',
    'r.noModel': 'Model bu dosyada okunamıyor.',
    'n.modelUnreadable': '{name} modeli okunamadı|Model bölümü geçerli bir JSON veya TMDL değil. Dosyayı Power BI Desktop ile yeniden kaydetmeyi dene.',
    'n.reportUnreadable': 'Rapor okunamadı|Rapor düzeni çözümlenemedi: {name}',
    'n.assumedBinding': 'Raporlar tek modele bağlandı|{reports} raporu {model} modeline bağlı kabul edildi. Farklı bir modele bağlıysa o modeli de yükle.',
    'n.unboundReports': 'Bazı raporların modeli bulunamadı|{reports} hangi modele bağlı anlaşılamadı. Bu raporlar ayrı gösteriliyor.',
    'n.binary': 'PBIX ölçü listesini vermiyor|Model bu dosyada sıkıştırılmış olduğu için yalnızca raporda kullanılan ölçüler görünüyor. Power BI Desktop\'tan PBIT alıp yükle.',
    'n.live': 'Rapor başka bir modele bağlı|Bu dosyada model yok. Bağlı olduğu modelin PBIT veya PBIP dosyasını da ekle.',
    'n.noReport': 'Rapor bulunamadı|Şu an yalnızca formüller arası bağlantılar görünüyor. Rapor dosyasını eklemeden silme adayı önerilmez.',
    'n.protected': '{name} açılamadı|Dosya şifreli görünüyor; bu genellikle duyarlılık etiketinden (Microsoft Information Protection) kaynaklanır. Etiketsiz bir kopya veya PBIP sürümü dene.',
    'n.notZip': '{name} açılamadı|Dosya geçerli bir PBIT, PBIX veya ZIP değil. Power BI Desktop ile yeniden kaydetmeyi dene.',
    'n.noContent': '{name} içinde rapor veya model bulunamadı|PBIT, PBIX, PBIP klasörü veya model.bim yüklemeyi dene.',
    'n.pbipPointer': '{name} yalnızca bir işaretçi|.pbip dosyası tek başına bir şey içermez. Dosyanın bulunduğu klasörün tamamını seç.',
    'n.zipMissing': 'ZIP okuyucu yüklenemedi|İnternet bağlantını kontrol edip sayfayı yenile. PBIP klasörü zip gerektirmeden çalışır.',
    'n.unsupported': '{name} desteklenmiyor|PBIT, PBIX, PBIP klasörü, ZIP, model.bim veya .tmdl yükle.',
    'n.tooLarge': '{name} çok büyük|Klasörde 20.000\'den fazla dosya var. Yalnızca PBIP klasörünü seç.',
    'script.head1': '// Ölçü Eleği silme betiği. Çalıştırmadan önce modelin bir kopyasını al.',
    'script.head2': '// Sıra önemli: bir öğeyi kullanan öğe, ondan önce silinir.',
    'script.skipReport': 'Atlandı (rapor ölçüsü, raporun içinden kaldır): {name}',
    'script.pqNote': 'Bu veri sütunlarını Power Query\'de kaldır (Sütunları kaldır), modelden silmek yenilemede geri getirebilir:',
    'script.prevStep': 'Önceki adım'
  },
  en: {
    'doc.title': 'Ölçü Eleği · Find unused Power BI measures',
    'doc.desc': 'Find unused measures, columns and tables in your Power BI report and get a safe removal order. Free, no install; your file never leaves your browser.',
    'brand.lead': 'Finds which measures, columns and tables in a Power BI model are really used, and lists the unused ones in a safe removal order. Your file stays on this page; the analysis runs in your browser.',
    'lang.switch': 'Türkçe', 'lang.title': 'Türkçeye geç',
    'drop.title': 'Drop your PBIT, PBIP or PBIX file here',
    'drop.hint': 'PBIT or PBIP gives the best result. You can also add other reports that use the same model.',
    'drop.file': 'Choose file', 'drop.dir': 'Choose PBIP folder', 'drop.reset': 'Back to sample', 'drop.busy': 'Reading…',
    'sample.badge': 'Sample: Sales Report.pbit (sample data)',
    'scope.sample': 'Showing sample data. Results change to your own file when you load one.',
    'scope.files': 'Based on the {r} report(s) you loaded ({p} pages, {v} visuals). Another report or Excel file on the same model may change the result.',
    'model.label': 'Model',
    'tab.measure': 'Measures', 'tab.column': 'Columns', 'tab.table': 'Tables', 'tabs.label': 'Item type',
    'head.noModel': 'The report uses {n} measures. Finding unused ones needs the model.',
    'head.noReport': 'The model has {n} measures. Load the report too to see visual usage.',
    'head.allUsed.measure': 'Every measure is used ({n} in total).',
    'head.allUsed.column': 'Every column is used ({n} in total).',
    'head.allUsed.table': 'Every table is used ({n} in total).',
    'head.cand.measure': '<b>{c} of {n}</b> measures look unused.',
    'head.cand.column': '<b>{c} of {n}</b> columns look unused.',
    'head.cand.table': '<b>{c} of {n}</b> tables look unused.',
    'head.review': ' Check {r} more.',
    'chip.all': 'All',
    'st.unused': 'Looks unused', 'st.chain': 'Chained', 'st.review': 'Check', 'st.indirect': 'Indirect use', 'st.used': 'Used', 'st.unknown': 'No report',
    'search': 'Search', 'selCand': 'Select candidates', 'selNone': 'Clear selection',
    'tag.hidden': 'hidden', 'tag.calc': 'calculated', 'tag.reportMeasure': 'report measure', 'tag.dup': 'same formula',
    'row.select': 'Add {name} to the cleanup list',
    'd.formula': 'Formula', 'd.tableFormula': 'Table formula', 'd.noFormula': 'The formula cannot be read from this file.', 'd.dataColumn': 'Column loaded from the data source (no formula).',
    'd.where': 'Where it is used in the report and model', 'd.usedBy': 'Used by', 'd.uses': 'Uses', 'd.dups': 'Measures with the same formula', 'd.members': 'Items in this table',
    'd.reportWide': 'Whole report', 'd.textRef': 'appears as text, please verify',
    'empty': 'No items match this filter.',
    'miss.title': '{n} field(s) used in the report but missing from the model',
    'miss.text': '{names}. These visuals probably show an error, or they use another model you did not load.',
    'dup.title': '{n} group(s) of measures with the same formula',
    'dup.text': 'Measures that compute the same thing cause confusion. Keep one and point the others to it:',
    'auto.title': 'The model has {n} auto date table(s)',
    'auto.text': 'Power BI creates a hidden table for every date column. If you have your own date table, turning off File › Options › Data load › Auto date/time makes the model smaller. These tables are not listed.',
    'panel.title': 'Cleanup list',
    'panel.count': '{n} item(s) selected. Remove them top to bottom.',
    'panel.empty': 'Select items on the left to see the removal order and its impact here.',
    'panel.safe': 'Nothing breaks in the files you loaded.', 'panel.safeSub': 'Still, make a copy of the file first.',
    'panel.warn': 'This selection affects other items', 'panel.more': 'and {n} more',
    'w.breaks': 'Removing <b>{label}</b> breaks {names}',
    'w.inReport': '<b>{label}</b> is used in {n} report item(s)',
    'w.structural': '<b>{label}</b> is used in a {what}',
    'btn.script': 'Copy Tabular Editor script', 'btn.list': 'Copy removal list', 'btn.pq': 'Copy Power Query step', 'btn.tsv': 'Copy full result for Excel',
    'panel.reportNote': 'Report measures are not removed by the script; remove them inside the report.',
    'panel.pqNote': 'Data columns are better removed in Power Query; the script only lists them as notes.',
    'copied.script': 'Script copied. Paste it into the C# Script tab in Tabular Editor.',
    'copied.list': 'Removal list copied.', 'copied.pq': 'Power Query step copied.', 'copied.tsv': 'Result copied. You can paste it into Excel.',
    'copied.fail': 'Automatic copy was blocked. The text below is selected; press Ctrl+C.',
    'out.label': 'Text to copy',
    'tsv.head': 'Type\tTable\tName\tStatus\tReason\tUsage count\tFormula',
    'kind.measure': 'Measure', 'kind.column': 'Column', 'kind.table': 'Table',
    'guide.files': 'What does each file type show?', 'guide.th.file': 'File', 'guide.th.model': 'Measures, columns and formulas', 'guide.th.report': 'Usage in the report',
    'guide.yes': 'Yes', 'guide.pbixNo': 'No, the model is compressed', 'guide.pbipFolder': '(folder or ZIP)',
    'guide.export': 'To get a PBIT from a PBIX, use <kbd>File</kbd> › <kbd>Export</kbd> › <kbd>Power BI template</kbd> in Power BI Desktop. A template carries the model and the report, not the data rows.',
    'guide.scan': 'Where does the scan look?',
    'guide.scan1': 'Visual fields, filters, conditional formatting, dynamic titles, groups and clusters',
    'guide.scan2': 'Measure and calculated column formulas, KPI and dynamic format strings, sort-by columns, hierarchies',
    'guide.scan3': 'Tooltip, drillthrough and hidden pages, bookmarks, visual calculations',
    'guide.scan4': 'Relationships, field parameters, calculation groups, security roles, calculated tables',
    'guide.limit': 'It cannot see reports you did not load, Excel pivots, paginated reports, or queries written against the model from outside.',
    'guide.mcp': 'Use it with Claude',
    'guide.mcpText': 'The same analysis also runs as an MCP server. Add it to Claude Desktop and ask "Which measures are unused in the sales report?". The server only reads, and your file never leaves your computer.',
    'guide.mcpLink': 'Setup steps',
    'foot.text': 'Ölçü Eleği · Yusuf Durak · Free under the PolyForm Shield 1.0.0 licence', 'foot.source': 'Source code',
    'listSep': ', ', 'andMore': '{list} and {n} more', 'autoDate': 'auto date table',
    'k.field': 'visual field', 'k.filter': 'filter', 'k.format': 'formatting', 'k.title': 'dynamic title', 'k.bookmark': 'bookmark', 'k.viscalc': 'visual calculation',
    'k.field.pl': 'visual fields', 'k.filter.pl': 'filters', 'k.format.pl': 'formatting rules', 'k.title.pl': 'dynamic titles', 'k.bookmark.pl': 'bookmarks', 'k.viscalc.pl': 'visual calculations',
    'ps.hidden': 'hidden page', 'ps.tooltip': 'tooltip page', 'ps.drill': 'drillthrough page',
    'what.relationship': 'relationship', 'what.role': 'security role', 'what.calcGroup': 'calculation group', 'what.key': 'table key', 'what.function': 'DAX function', 'what.sort': 'sort-by column',
    'v.reportFilter': 'Report filter', 'v.pageFilter': 'Page filter', 'v.visual': 'Visual', 'v.bookmark': 'Bookmark',
    'r.direct': '{counts}', 'r.directExtra': '{counts} · {extra}',
    'r.via': 'Used in: {names}', 'r.viaExtra': 'Used in: {names} · {extra}',
    'r.structural.relationship': 'Relationship key: {label}', 'r.structural.role': 'In security role: {label}', 'r.structural.calcGroup': 'In calculation group: {label}',
    'r.structural.key': 'Key column of the table', 'r.structural.function': 'In DAX function: {label}',
    'r.sortFor': 'Sort-by column for {names}',
    'r.formulaOnly': 'Used in formulas: {names}', 'r.noReport': 'Not used in formulas. Load the report to see visual usage.',
    'r.hiddenPage': 'Only on a hidden page: {names}', 'r.bookmarkOnly': 'Only saved in a bookmark', 'r.text': 'Appears as text: {names}',
    'r.viaReview': 'Used by an item to check: {names}',
    'r.onlyUnused': 'Only used by unused items: {names}', 'r.onlyParam': 'Only in an unused field parameter: {names}',
    'r.none': 'Not found in visuals, filters or formulas.',
    'r.tableUsed': '{n}/{total} items used', 'r.calcGroupTable': 'Calculation group', 'r.bridge': 'Bridge table between {names}',
    'r.tableReview': 'Some items only on hidden pages or in bookmarks', 'r.tableNone': 'None of its columns or measures are used.', 'r.tableNoneRel': 'None of its columns or measures are used. Its {r} relationship(s) go too.',
    'r.noModel': 'The model cannot be read from this file.',
    'n.modelUnreadable': 'Could not read the {name} model|The model part is not valid JSON or TMDL. Try saving the file again in Power BI Desktop.',
    'n.reportUnreadable': 'Could not read a report|The report layout could not be parsed: {name}',
    'n.assumedBinding': 'Reports linked to the only model|{reports} assumed to use the {model} model. If they use another model, load that one too.',
    'n.unboundReports': 'Model not found for some reports|Could not tell which model {reports} use. They are shown separately.',
    'n.binary': 'PBIX does not expose the measure list|The model is compressed in this file, so only the measures used in the report are shown. Export a PBIT from Power BI Desktop and load it.',
    'n.live': 'The report uses another model|This file has no model. Add the PBIT or PBIP of the model it connects to.',
    'n.noReport': 'No report found|Only links between formulas are shown. Without the report file, no removal candidates are suggested.',
    'n.protected': 'Could not open {name}|The file looks encrypted, usually by a sensitivity label (Microsoft Information Protection). Try an unlabelled copy or the PBIP version.',
    'n.notZip': 'Could not open {name}|The file is not a valid PBIT, PBIX or ZIP. Try saving it again in Power BI Desktop.',
    'n.noContent': 'No report or model found in {name}|Try a PBIT, PBIX, PBIP folder or model.bim.',
    'n.pbipPointer': '{name} is only a pointer|A .pbip file holds nothing by itself. Choose the whole folder it sits in.',
    'n.zipMissing': 'The ZIP reader did not load|Check your connection and reload the page. PBIP folders work without it.',
    'n.unsupported': '{name} is not supported|Load a PBIT, PBIX, PBIP folder, ZIP, model.bim or .tmdl.',
    'n.tooLarge': '{name} is too large|The folder has more than 20,000 files. Choose just the PBIP folder.',
    'script.head1': '// Ölçü Eleği removal script. Make a copy of the model before running it.',
    'script.head2': '// Order matters: an item is removed before the items it uses.',
    'script.skipReport': 'Skipped (report measure, remove it inside the report): {name}',
    'script.pqNote': 'Remove these data columns in Power Query (Remove columns); deleting them from the model may bring them back on refresh:',
    'script.prevStep': 'Previous step'
  }
};

// Görsel türlerinin adları
const VIS = {
  card: ['Kart', 'card'], cardVisual: ['Kart', 'card'], multiRowCard: ['Çok satırlı kart', 'multi-row card'], kpi: ['KPI', 'KPI'], gauge: ['Gösterge', 'gauge'],
  tableEx: ['Tablo', 'table'], pivotTable: ['Matris', 'matrix'], lineChart: ['Çizgi grafik', 'line chart'], areaChart: ['Alan grafik', 'area chart'],
  barChart: ['Çubuk grafik', 'bar chart'], clusteredBarChart: ['Çubuk grafik', 'bar chart'], stackedBarChart: ['Yığılmış çubuk', 'stacked bar'],
  columnChart: ['Sütun grafik', 'column chart'], clusteredColumnChart: ['Sütun grafik', 'column chart'], stackedColumnChart: ['Yığılmış sütun', 'stacked column'],
  lineClusteredColumnComboChart: ['Birleşik grafik', 'combo chart'], lineStackedColumnComboChart: ['Birleşik grafik', 'combo chart'], pieChart: ['Pasta grafik', 'pie chart'],
  donutChart: ['Halka grafik', 'donut chart'], treemap: ['Ağaç haritası', 'treemap'], map: ['Harita', 'map'], filledMap: ['Dolgulu harita', 'filled map'],
  scatterChart: ['Dağılım grafiği', 'scatter chart'], slicer: ['Dilimleyici', 'slicer'], waterfallChart: ['Şelale grafik', 'waterfall'], funnel: ['Huni', 'funnel'],
  textbox: ['Metin kutusu', 'text box'], shape: ['Şekil', 'shape'], actionButton: ['Düğme', 'button'], group: ['Görsel grubu', 'visual group'], visual: ['Görsel', 'visual']
};
Object.entries(VIS).forEach(([k, [tr, en]]) => { DICT.tr['vis.' + k] = tr; DICT.en['vis.' + k] = en; });

export const LANGS = ['tr', 'en'];
export function makeT(lang) {
  const d = DICT[lang] || DICT.tr;
  return (key, params) => {
    let s = d[key]; if (s == null) s = DICT.tr[key]; if (s == null) return key;
    return params ? s.replace(/\{(\w+)\}/g, (m, k) => params[k] == null ? m : String(params[k])) : s;
  };
}

/** "A, B ve 3 öğe daha" */
export function listNames(t, names, max = 2) {
  const a = (names || []).map(n => n === '@autoDate' ? t('autoDate') : n);
  if (a.length <= max) return a.join(t('listSep'));
  return t('andMore', { list: a.slice(0, max).join(t('listSep')), n: a.length - max });
}
const countsText = (t, counts) => Object.entries(counts || {}).map(([k, n]) => { const pl = t('k.' + k + '.pl'); return `${n} ${n > 1 && pl !== 'k.' + k + '.pl' ? pl : t('k.' + k)}`; }).join(' · ');
const extraText = (t, extra) => (extra || []).filter(w => w !== 'key').map(w => t('what.' + w)).join(' · ');

/** Bir ölçü/sütun/tablonun "neden bu durumda" açıklaması. */
export function reasonText(t, r) {
  if (!r) return '';
  switch (r.code) {
    case 'direct': { const c = countsText(t, r.counts), e = extraText(t, r.extra); return e ? (c ? t('r.directExtra', { counts: c, extra: e }) : e) : c; }
    case 'via': { const e = extraText(t, r.extra); return t(e ? 'r.viaExtra' : 'r.via', { names: listNames(t, r.names), extra: e }); }
    case 'structural': return t('r.structural.' + r.what, { label: r.label });
    case 'tableNone': return r.relationships ? t('r.tableNoneRel', { r: r.relationships }) : t('r.tableNone');
    case 'tableUsed': return t('r.tableUsed', { n: r.n, total: r.total });
    case 'bridge': return t('r.bridge', { names: listNames(t, r.names, 3) });
    default: return t('r.' + r.code, { names: listNames(t, r.names) });
  }
}
/** Not kodunu {title, text} yapar. */
export function noteText(t, note) {
  const a = note.args || {};
  const p = { ...a, reports: Array.isArray(a.reports) ? a.reports.join(', ') : a.reports };
  const [title, text] = t('n.' + note.code, p).split('|');
  return { title, text: text || '', err: !!note.err };
}
/** Bir rapor kullanımının nerede olduğunu anlatır: "Rapor › Sayfa › Görsel · görsel alanı · gizli sayfa" */
export function usageText(t, u, multiReport) {
  const v = u.visual;
  let vis = null;
  if (typeof v === 'string') vis = t('v.bookmark') + (v ? ': ' + v : '');
  else if (v) vis = v.type === 'reportFilter' ? t('v.reportFilter') : v.type === 'pageFilter' ? t('v.pageFilter') : (v.title ? `${v.title} (${visualName(t, v.type)})` : visualName(t, v.type));
  const place = [multiReport ? u.report : null, u.page, vis].filter(Boolean).join(' › ') || t('d.reportWide');
  const extra = [t('k.' + u.kind)]; if (u.state && u.state !== 'normal') extra.push(t('ps.' + u.state));
  return { place, extra: extra.join(' · ') };
}
const visualName = (t, type) => { const k = 'vis.' + (type || 'visual'), r = t(k); return r === k ? type : r; };
