// web/ klasöründen tek dosyalık bir sayfa üretir (claude.ai Artifact sürümü için).
// Modüller sırayla birleştirilir; import/export satırları atılır; JSZip CDN'den yüklenir.
// Kullanım: node tools/build-artifact.mjs  →  dist/olcu-elegi.html
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = p => readFile(path.join(root, 'web', p), 'utf8');
const strip = src => src.split('\n').filter(l => !/^import\s.*from\s+['"].*['"];?\s*$/.test(l)).map(l => l.replace(/^export\s+(?=(const|function|async|let|class)\b)/, '')).join('\n');
const html = await web('index.html');
const body = /<body>([\s\S]*)<\/body>/.exec(html)[1]
  .replace(/<!--ZIP-->[\s\S]*?<!--\/ZIP-->/, '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>')
  .replace(/<script type="module" src="js\/app\.js"><\/script>/, () => '');
const js = [];
for (const f of ['core.js', 'i18n.js', 'sample.js', 'app.js']) js.push(`// ---- ${f}\n` + strip(await web('js/' + f)));
const fonts = /<link rel="stylesheet" href="(https:\/\/fonts[^"]+)">/.exec(html)[1];
const out = `<title>Ölçü Eleği</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="${fonts}">
<style>
${await web('app.css')}
</style>
${body.trim()}
<script>
"use strict";
${js.join('\n')}
</script>
`;
await mkdir(path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(root, 'dist', 'olcu-elegi.html'), out);
console.log('dist/olcu-elegi.html', (out.length / 1024).toFixed(0) + ' KB');
