// Diskteki bir yolu (PBIT/PBIX/ZIP dosyası, PBIP klasörü, model.bim, .tmdl) çekirdeğin
// anladığı "giriş" listesine çevirir. Yalnızca okur; hiçbir dosyaya yazmaz.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { extractGroup, buildProjects, analyze, sniff, readZipEntry, entryLimit, LIMITS } from '../web/js/core.js';

const MAX_FILES = 20000;
const MAX_BYTES = 300 * 1024 * 1024;
const SKIP = new Set(['.git', 'node_modules', '.pbi', 'StaticResources']);

async function walkDir(root) {
  const out = []; let bytes = 0;
  async function rec(dir) {
    for (const d of await fs.readdir(dir, { withFileTypes: true })) {
      if (SKIP.has(d.name)) continue;
      const full = path.join(dir, d.name);
      if (d.isDirectory()) { await rec(full); continue; }
      if (!d.isFile()) continue;
      if (!/\.(json|tmdl|bim|pbir|pbism|pbip)$/i.test(d.name)) continue;
      const st = await fs.stat(full); bytes += st.size;
      if (out.length >= MAX_FILES || bytes > MAX_BYTES) throw new Error('tooLarge');
      out.push({ path: path.relative(root, full).split(path.sep).join('/'), read: async () => new Uint8Array(await fs.readFile(full)) });
    }
  }
  await rec(root);
  return out;
}

/** Bir yolu okur ve { label, extraction } ya da { label, error } döndürür. */
export async function readPath(p) {
  const st = await fs.stat(p);
  const label = path.basename(p);
  if (st.isDirectory()) {
    // .pbip dosyasının kendisi yalnızca işaretçidir; klasörün tamamı okunur
    return { label, extraction: await extractGroup({ label, kind: 'folder', entries: await walkDir(p) }) };
  }
  if (/\.pbip$/i.test(p)) return readPath(path.dirname(p));
  if (st.size > LIMITS.fileBytes) return { label, error: 'tooLarge' };
  const buf = await fs.readFile(p);
  if (/\.(pbit|pbix|zip)$/i.test(p)) {
    const kind = sniff(buf.subarray(0, 8));
    if (kind === 'protected') return { label, error: 'protected' };
    if (kind !== 'zip') return { label, error: 'notZip' };
    const zip = await JSZip.loadAsync(buf); const entries = [];
    zip.forEach((rel, e) => { if (!e.dir) entries.push({ path: rel, read: () => readZipEntry(e, entryLimit(rel)) }); });
    return { label, extraction: await extractGroup({ label, kind: 'zip', entries }) };
  }
  if (/\.(bim|json|tmdl)$/i.test(p)) {
    return { label, extraction: await extractGroup({ label, kind: 'folder', entries: [{ path: label, read: async () => new Uint8Array(buf) }] }) };
  }
  return { label, error: 'unsupported' };
}

/** Bir ya da birden çok yolu okuyup analiz sonuçlarını döndürür. */
export async function analyzePaths(paths) {
  const extractions = [], errors = [];
  for (const p of paths) {
    const r = await readPath(p);
    if (r.error) errors.push({ label: r.label, error: r.error });
    else extractions.push(r.extraction);
  }
  const { projects, notes } = buildProjects(extractions);
  return { results: projects.map(analyze), notes, errors };
}
