// Tarayıcı sürümünü yerelde açar (Python gerekmez). Kullanım: node tools/serve.mjs [port]
// Yalnızca bu bilgisayardan erişilir (127.0.0.1). Dosyalar web/ klasöründen sunulur.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'web');
const port = +process.argv[2] || 8080;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(root, u === '/' ? 'index.html' : u);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try { const b = await readFile(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(b); }
  catch (e) { res.writeHead(404).end('Bulunamadı'); }
}).listen(port, '127.0.0.1', () => console.log(`Measure Sieve: http://localhost:${port}`));
