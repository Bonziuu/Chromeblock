// Build one static site for the Apex brand and its products. No publishing or DNS changes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createZip } from '../tools/package-dev.mjs';

export const WEBSITE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ASSETS = ['styles.css', 'app.js', 'assets/apex.svg'];
const BRAND_PAGES = { 'index.html': '/pl/', 'en.html': '/en/' };
const PRODUCT_PAGES = {
  'index.html': '/pl/adblocker/',
  'en.html': '/en/adblocker/',
  'privacy.html': '/pl/adblocker/privacy/',
  'privacy-en.html': '/en/adblocker/privacy/',
};

function origin(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.port
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Site origin must be an HTTPS address without a path, port or credentials.');
  }
  return url.origin;
}

export function deploymentConfig(config) {
  return { siteOrigin: origin(config.siteOrigin), domainVerified: config.domainVerified === true };
}

/** Rewrite source-file links to the corresponding brand, product or privacy route. */
export function hostedHtml(html, kind, rawConfig) {
  deploymentConfig(rawConfig);
  if (!['brand', 'product'].includes(kind)) throw new Error('Unknown page kind.');
  return html.replace(/\b(href|src)="([^"]+)"/g, (attribute, key, value) => {
    if (/^(?:https?:|mailto:|data:|#|\/)/.test(value)) return attribute;
    const fragmentAt = value.indexOf('#');
    const file = fragmentAt < 0 ? value : value.slice(0, fragmentAt);
    const fragment = fragmentAt < 0 ? '' : value.slice(fragmentAt);
    let destination;
    if (kind === 'product' && file.startsWith('brand/')) {
      destination = BRAND_PAGES[file.slice(6)];
    } else if (kind === 'brand' && file.startsWith('../') && PRODUCT_PAGES[file.slice(3)]) {
      destination = PRODUCT_PAGES[file.slice(3)];
    } else {
      const local = file.replace(/^\.\.\//, '');
      destination = (kind === 'brand' ? BRAND_PAGES : PRODUCT_PAGES)[local]
        || (PUBLIC_ASSETS.includes(local) ? '/' + local : null);
    }
    if (!destination) throw new Error('Unmapped local link: ' + value);
    return key + '="' + destination + fragment + '"';
  });
}

function entryPage() {
  return '<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/pl/"><title>Apex</title></head><body><a href="/pl/" lang="pl">Polski</a> · <a href="/en/" lang="en">English</a></body></html>\n';
}

function notFoundPage() {
  return '<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><link rel="stylesheet" href="/styles.css"><title>404 — Apex</title></head><body><main class="container section"><p class="eyebrow">APEX / 404</p><h1>Nie znaleziono strony.</h1><p lang="en">This page could not be found.</p><p><a class="inline-link" href="/pl/" lang="pl">Strona główna</a> · <a class="inline-link" href="/en/" lang="en">Home</a></p></main></body></html>\n';
}

export function siteEntries(config, source = WEBSITE) {
  deploymentConfig(config);
  const entries = PUBLIC_ASSETS.map(name => ({ name, data: fs.readFileSync(path.join(source, name)) }));
  for (const [language, template] of [['pl', 'index.html'], ['en', 'en.html']]) {
    const pages = [
      { name: `${language}/index.html`, file: `brand/${template}`, kind: 'brand' },
      { name: `${language}/adblocker/index.html`, file: template, kind: 'product' },
      { name: `${language}/adblocker/privacy/index.html`, file: language === 'pl' ? 'privacy.html' : 'privacy-en.html', kind: 'product' },
    ];
    for (const page of pages) {
      entries.push({
        name: page.name,
        data: Buffer.from(hostedHtml(fs.readFileSync(path.join(source, page.file), 'utf8'), page.kind, config)),
      });
    }
  }
  const redirects = [
    '/ /pl/ 302',
    '/index.html /pl/ 301',
    '/en.html /en/ 301',
    '/pl /pl/ 301',
    '/en /en/ 301',
    '/pl/adblocker /pl/adblocker/ 301',
    '/en/adblocker /en/adblocker/ 301',
    '/pl/adblocker/privacy /pl/adblocker/privacy/ 301',
    '/en/adblocker/privacy /en/adblocker/privacy/ 301',
    '/privacy.html /pl/adblocker/privacy/ 301',
    '/privacy-en.html /en/adblocker/privacy/ 301',
  ];
  entries.push(
    { name: 'index.html', data: Buffer.from(entryPage()) },
    { name: '404.html', data: Buffer.from(notFoundPage()) },
    { name: '_redirects', data: Buffer.from(redirects.join('\n') + '\n') },
    { name: '.nojekyll', data: Buffer.alloc(0) },
  );
  return entries;
}

export function exportSites({
  config = JSON.parse(fs.readFileSync(path.join(WEBSITE, 'deployment.config.json'), 'utf8')),
  source = WEBSITE,
  outDir = path.join(WEBSITE, '..', 'docs', 'website'),
} = {}) {
  const checked = deploymentConfig(config);
  fs.mkdirSync(outDir, { recursive: true });
  const primary = path.join(outDir, 'Apex-Software-hosting.zip');
  const legacyAlias = path.join(outDir, 'Apex-Website-hosting.zip');
  fs.writeFileSync(primary, createZip(siteEntries(checked, source)));
  fs.copyFileSync(primary, legacyAlias);
  return { ...checked, files: [primary, legacyAlias] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = exportSites();
    console.log(JSON.stringify(result, null, 2));
    if (!result.domainVerified) console.log('Domain ownership is unverified. Export prepared; no purchase, DNS change or deployment was performed.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
