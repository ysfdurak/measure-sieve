// web/ klasöründen tek dosyalık bir sayfa üretir (claude.ai Artifact sürümü için).
// Her modül kendi kapsamında (IIFE) çalışır; import/export satırları ad alanı nesnelerine çevrilir.
// JSZip CDN'den yüklenir. Kullanım: node tools/build-artifact.mjs  →  dist/measure-sieve.html
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = p => readFile(path.join(root, 'web', p), 'utf8');
const ORDER = ['xpress9.js', 'pbix.js', 'core.js', 'i18n.js', 'sample.js', 'clean.js', 'app.js'];
const ns = f => '__m_' + f.replace(/\W/g, '_');

function wrap(file, src) {
  const exported = [];
  let body = src.split('\n').map(l => {
    let m = /^import\s+\*\s+as\s+(\w+)\s+from\s+['"]\.\/([\w.]+)['"];?\s*$/.exec(l);
    if (m) return `const ${m[1]} = ${ns(m[2])};`;
    m = /^import\s+\{([^}]*)\}\s+from\s+['"]\.\/([\w.]+)['"];?\s*$/.exec(l);
    if (m) return `const { ${m[1].split(',').map(x => x.trim()).filter(Boolean).map(x => x.replace(/\s+as\s+/, ': ')).join(', ')} } = ${ns(m[2])};`;
    m = /^export\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([\w$]+)/.exec(l);
    if (m) { exported.push(m[1]); return l.replace(/^export\s+/, ''); }
    return l;
  }).join('\n');
  return `const ${ns(file)} = (() => {\n${body}\nreturn { ${exported.join(', ')} };\n})();`;
}

const html = await web('index.html');
const body = /<body>([\s\S]*)<\/body>/.exec(html)[1]
  .replace(/<!--ZIP-->[\s\S]*?<!--\/ZIP-->/, '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>')
  .replace(/<script type="module" src="js\/app\.js"><\/script>/, () => '');
const js = [];
for (const f of ORDER) js.push(`// ---- ${f}\n` + wrap(f, await web('js/' + f)));
const fonts = /<link rel="stylesheet" href="(https:\/\/fonts[^"]+)">/.exec(html)[1];
const out = `<title>Measure Sieve</title>
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
await writeFile(path.join(root, 'dist', 'measure-sieve.html'), out);
console.log('dist/measure-sieve.html', (out.length / 1024).toFixed(0) + ' KB');
