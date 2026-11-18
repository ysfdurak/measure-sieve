// Gerçek Power BI dosyalarıyla elle deneme. Dosyalar depoya konmaz (lisansları bize ait değil).
// Kullanım:  node tests/gercek-dosyalar.mjs <dosya veya klasör> [...]
// Örnek:     node tests/gercek-dosyalar.mjs "~/İndirilenler/Satış.pbit" ./PBIP-klasörü
import { analyzePaths } from '../mcp/files.mjs';
import { makeT, reasonText } from '../web/js/i18n.js';

const t = makeT('tr');
const paths = process.argv.slice(2);
if (!paths.length) { console.error('En az bir dosya ya da klasör yolu ver.'); process.exit(1); }
for (const p of paths) {
  const r = await analyzePaths([p]);
  console.log(`\n# ${p}`);
  r.errors.forEach(e => console.log(`  ! ${e.label}: ${e.error}`));
  for (const x of r.results) {
    const c = k => { const o = {}; x.items.filter(n => n.kind === k).forEach(n => { o[n.status] = (o[n.status] || 0) + 1; }); return JSON.stringify(o); };
    console.log(`  ${x.label}: ölçü ${c('measure')} · sütun ${c('column')} · aynı formül ${x.duplicates.length} · modelde olmayan ${x.missing.length}`);
    x.items.filter(n => n.kind === 'measure' && (n.status === 'unused' || n.status === 'chain')).forEach(n => console.log(`    - ${n.name}: ${reasonText(t, n.reason)}`));
  }
}
