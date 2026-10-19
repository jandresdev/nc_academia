// QA estático de dist/: enlaces, anclas, ids, metadatos, datos estructurados, imágenes, peso y textos pendientes.
// Uso: npm run build && npm run qa   (termina con código 1 si hay errores)
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pages = ['index.html', ...fs.readdirSync(dist).filter(d => fs.existsSync(path.join(dist, d, 'index.html'))).map(d => `${d}/index.html`)];
const errors = [];
const warns = [];
const rows = [];
const err = (p, m) => errors.push(`${p}: ${m}`);
const warn = (p, m) => warns.push(`${p}: ${m}`);
const kb = n => (n / 1024).toFixed(1);

const exists = rel => {
  const f = path.join(dist, rel);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
};

for (const page of pages) {
  const file = path.join(dist, page);
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(page);
  const meta = (re) => (html.match(re) || [])[1] || '';
  const title = meta(/<title>([^<]*)<\/title>/);
  const desc = meta(/<meta name="description" content="([^"]*)"/);
  const canonical = meta(/<link rel="canonical" href="([^"]*)"/);
  const h1s = (html.match(/<h1[ >]/g) || []).length;

  // Metadatos
  if (!title) err(page, 'sin <title>'); else if (title.length > 65) warn(page, `title de ${title.length} caracteres (ideal ≤ 60)`);
  if (!desc) err(page, 'sin meta description'); else if (desc.length < 70 || desc.length > 170) warn(page, `meta description de ${desc.length} caracteres (ideal 120-160)`);
  if (!canonical) err(page, 'sin canonical');
  if (h1s !== 1) err(page, `${h1s} etiquetas h1 (debe haber 1)`);
  if (!/<html lang="es/.test(html)) err(page, 'html sin lang es');
  if (!/name="viewport"/.test(html)) err(page, 'sin viewport');
  for (const og of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) if (!html.includes(`property="${og}"`)) warn(page, `falta ${og}`);
  if (!html.includes('name="twitter:card"')) warn(page, 'falta twitter:card');
  if (!html.includes('rel="alternate" hreflang')) warn(page, 'falta hreflang');
  const ogImg = meta(/property="og:image" content="([^"]*)"/);
  if (/\.webp$/.test(ogImg)) warn(page, 'og:image en WebP (algunas redes no lo muestran; mejor JPG/PNG 1200x630)');

  // Datos estructurados
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const m of ld) {
    try {
      const data = JSON.parse(m[1]);
      for (const d of (Array.isArray(data) ? data : data['@graph'] || [data])) types.push(d['@type']);
    } catch (e) { err(page, `JSON-LD inválido: ${e.message}`); }
  }
  if (!ld.length) warn(page, 'sin datos estructurados');

  // ids y anclas
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) err(page, `ids duplicados: ${[...new Set(dup)].join(', ')}`);
  const idSet = new Set(ids);

  // enlaces
  const links = [...html.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>/g)];
  for (const m of links) {
    const href = m[1];
    const tag = m[0];
    if (/^(mailto:|tel:|data:)/.test(href)) continue;
    if (/^https?:\/\//.test(href)) {
      if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) err(page, `enlace externo con _blank sin noopener: ${href}`);
      continue;
    }
    if (href.startsWith('#')) { if (href.length > 1 && !idSet.has(href.slice(1))) err(page, `ancla inexistente ${href}`); continue; }
    const [pathPart, frag] = href.split('#');
    const target = path.normalize(path.join(dir === '.' ? '' : dir, pathPart || '.'));
    if (!exists(target)) err(page, `enlace roto ${href}`);
    else if (frag && pathPart && fs.statSync(path.join(dist, target)).isFile()) {
      const tHtml = fs.readFileSync(path.join(dist, target), 'utf8');
      if (!new RegExp(`\\sid="${frag}"`).test(tHtml)) err(page, `ancla ${href} no existe en el destino`);
    }
  }

  // imágenes
  const imgs = [...html.matchAll(/<img\s[^>]*>/g)];
  for (const m of imgs) {
    const tag = m[0];
    if (!/\salt=/.test(tag)) err(page, `img sin alt: ${tag.slice(0, 80)}`);
    if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) warn(page, `img sin width/height (riesgo de CLS): ${tag.slice(0, 80)}`);
    const src = (tag.match(/\ssrc="([^"]*)"/) || [])[1];
    if (src && !src.startsWith('data:') && !/^https?:/.test(src)) {
      const rel = path.normalize(path.join(dir === '.' ? '' : dir, src));
      if (!fs.existsSync(path.join(dist, rel))) err(page, `imagen inexistente ${src}`);
      else { const s = fs.statSync(path.join(dist, rel)).size; if (s > 200 * 1024) warn(page, `imagen de ${kb(s)} KB: ${src}`); }
    }
  }

  // textos pendientes o internos visibles
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  const internal = (text.match(/\b(El PDF|La ficha|el PDF|ficha del curso)\b/g) || []).length;
  const pending = (text.match(/por confirmar|pendiente/gi) || []).length;
  if (internal) warn(page, `${internal} frases de redacción interna visibles (p. ej. "El PDF…", "La ficha…")`);
  if (/—/.test(text)) warn(page, 'contiene guion largo');

  const raw = Buffer.byteLength(html);
  rows.push({ page, title: title.length, desc: desc.length, h1: h1s, ld: types.join('+') || '-', htmlKB: kb(raw), gzKB: kb(zlib.gzipSync(html).length), brKB: kb(zlib.brotliCompressSync(html).length), imgs: imgs.length, pendientes: pending, internos: internal });
}

// robots y sitemap
const robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
const sitemap = fs.existsSync(path.join(dist, 'sitemap.xml')) ? fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '';
if (!robots) err('robots.txt', 'no existe');
if (!sitemap) err('sitemap.xml', 'no existe');
const smUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const canon = pages.map(p => fs.readFileSync(path.join(dist, p), 'utf8').match(/<link rel="canonical" href="([^"]*)"/)?.[1]).filter(Boolean);
for (const c of canon) if (!smUrls.includes(c)) warn('sitemap.xml', `falta la URL canónica ${c}`);
const hosts = new Set([...smUrls, ...canon].map(u => new URL(u).host));
if (hosts.size > 1) err('sitemap.xml', `mezcla de dominios: ${[...hosts].join(', ')}`);
console.log(`Dominio canónico/sitemap: ${[...hosts].join(', ')} (debe ser el dominio donde se publica; robots.txt y sitemap deben estar en ese mismo host)`);

console.table(rows);
console.log(`\nErrores: ${errors.length} | Avisos: ${warns.length}`);
for (const e of errors) console.log('  ERROR ', e);
const grouped = {};
for (const w of warns) { const k = w.replace(/^[^:]+: /, '').replace(/\d+(\.\d+)? KB/, 'N KB').replace(/^\d+ /, 'N ').replace(/de \d+ caracteres/, 'de N caracteres'); (grouped[k] ||= []).push(w.split(':')[0]); }
for (const [k, v] of Object.entries(grouped)) console.log(`  AVISO  ${k}  (${v.length} página${v.length === 1 ? '' : 's'})`);
process.exit(errors.length ? 1 : 0);
