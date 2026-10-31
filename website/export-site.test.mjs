import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hostedHtml, deploymentConfig, siteEntries, exportSites } from './export-site.mjs';

const config = { siteOrigin: 'https://apexsoftware.app', domainVerified: false };

test('brand links keep the brand language and route product links to the same domain', () => {
  assert.equal(
    hostedHtml('<a href="index.html">PL</a><a href="en.html">EN</a><a href="../en.html#instalacja">Install</a>', 'brand', config),
    '<a href="/pl/">PL</a><a href="/en/">EN</a><a href="/en/adblocker/#instalacja">Install</a>',
  );
  assert.equal(
    hostedHtml('<a href="../privacy.html">Privacy</a><script src="../app.js"></script>', 'brand', config),
    '<a href="/pl/adblocker/privacy/">Privacy</a><script src="/app.js"></script>',
  );
});

test('product links retain their own routes and return to the matching brand language', () => {
  assert.equal(
    hostedHtml('<a href="index.html#start">PL</a><a href="en.html">EN</a><a href="brand/en.html">Apex</a><a href="privacy-en.html">Privacy</a>', 'product', config),
    '<a href="/pl/adblocker/#start">PL</a><a href="/en/adblocker/">EN</a><a href="/en/">Apex</a><a href="/en/adblocker/privacy/">Privacy</a>',
  );
  const unchanged = '<a href="#main">Main</a><a href="https://github.com/Bonziuu/Apex-AdBlocker">GitHub</a><a href="mailto:author@example.com">Mail</a>';
  assert.equal(hostedHtml(unchanged, 'product', config), unchanged);
});

test('deployment config rejects non-origin URLs and does not claim domain verification', () => {
  for (const value of ['http://apex.test', 'https://apex.test/pl', 'https://user:secret@apex.test', 'https://apex.test:8443', 'https://apex.test/?query=1', 'https://apex.test/#fragment']) {
    assert.throws(() => deploymentConfig({ ...config, siteOrigin: value }));
  }
  assert.deepEqual(deploymentConfig({ siteOrigin: 'https://apexsoftware.app/' }), config);
  assert.equal(deploymentConfig({ ...config, domainVerified: 'true' }).domainVerified, false);
  assert.throws(() => hostedHtml('<a href="missing.html">Broken</a>', 'product', config));
  assert.throws(() => hostedHtml('<a href="index.html">Home</a>', 'unknown', config));
});

test('one public export contains brand, product and privacy pages with working local targets', () => {
  const entries = siteEntries(config);
  const files = new Map(entries.map(entry => [entry.name, entry.data.toString()]));
  assert.deepEqual([...files.keys()].sort(), [
    '.nojekyll', '404.html', '_redirects', 'app.js', 'assets/apex.svg', 'index.html',
    'pl/index.html', 'en/index.html',
    'pl/adblocker/index.html', 'en/adblocker/index.html',
    'pl/adblocker/privacy/index.html', 'en/adblocker/privacy/index.html', 'styles.css',
  ].sort());
  for (const language of ['pl', 'en']) {
    const brand = files.get(`${language}/index.html`);
    const product = files.get(`${language}/adblocker/index.html`);
    const policy = files.get(`${language}/adblocker/privacy/index.html`);
    assert.ok(brand.includes(`href="/${language}/adblocker/#instalacja"`));
    assert.ok(product.includes(`href="/${language}/"`));
    assert.ok(policy.includes(`href="/${language}/adblocker/"`));
    assert.ok(policy.includes(`href="/${language === 'pl' ? 'en' : 'pl'}/adblocker/privacy/"`));
  }
  for (const [name, html] of files) {
    if (!name.endsWith('.html')) continue;
    for (const [, value] of html.matchAll(/\b(?:href|src)="(\/[^\"]*)"/g)) {
      const route = value.split('#')[0];
      const target = route.slice(1) + (route.endsWith('/') ? 'index.html' : '');
      assert.ok(files.has(target), `${name} references missing ${value}`);
    }
  }
});

test('root and slash aliases are explicit while unknown routes retain a real 404 page', () => {
  const files = new Map(siteEntries(config).map(entry => [entry.name, entry.data.toString()]));
  const redirects = files.get('_redirects').split('\n');
  for (const rule of [
    '/ /pl/ 302', '/pl /pl/ 301', '/en /en/ 301',
    '/pl/adblocker /pl/adblocker/ 301', '/en/adblocker /en/adblocker/ 301',
    '/pl/adblocker/privacy /pl/adblocker/privacy/ 301', '/en/adblocker/privacy /en/adblocker/privacy/ 301',
  ]) assert.ok(redirects.includes(rule), rule);
  assert.ok(!files.get('_redirects').includes('/*'));
  assert.ok(files.get('index.html').includes('content="0;url=/pl/"'));
  assert.ok(files.get('404.html').includes('Nie znaleziono strony.'));
  assert.ok(files.get('404.html').includes('href="/en/"'));
});

test('all six public pages have absolute self canonical and context-specific reciprocal hreflang links', () => {
  const siteOrigin = 'https://preview.apex.test';
  const files = new Map(siteEntries({ ...config, siteOrigin }).map(entry => [entry.name, entry.data.toString()]));
  for (const suffix of ['', 'adblocker/', 'adblocker/privacy/']) {
    for (const language of ['pl', 'en']) {
      const route = `/${language}/${suffix}`;
      const html = files.get(route.slice(1) + 'index.html');
      const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html)[1];
      assert.deepEqual([...head.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map(match => match[1]), [siteOrigin + route]);
      assert.deepEqual([...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(match => [match[1], match[2]]), [
        ['pl', `${siteOrigin}/pl/${suffix}`],
        ['en', `${siteOrigin}/en/${suffix}`],
      ]);
      assert.equal((head.match(/\bhreflang\s*=/gi) || []).length, 2, 'existing alternate metadata must be replaced, not duplicated');
      const body = html.slice(html.indexOf('<body'));
      assert.ok(!body.includes(siteOrigin), 'ordinary navigation stays root-relative');
    }
  }
});

test('existing canonical and language metadata are replaced while unrelated alternate links remain', () => {
  const source = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-seo-source-'));
  try {
    fs.mkdirSync(path.join(source, 'brand'));
    fs.mkdirSync(path.join(source, 'assets'));
    for (const file of ['styles.css', 'app.js', 'assets/apex.svg']) fs.writeFileSync(path.join(source, file), '');
    const html = `<html lang="pl"><head><link href="https://stale.example/old" rel='canonical'><link href="index.html" hreflang="pl" rel="alternate"><link rel="alternate" type="application/rss+xml" href="https://feeds.example/news"></head><body><a href="index.html">Home</a></body></html>`;
    for (const file of ['brand/index.html', 'brand/en.html', 'index.html', 'en.html', 'privacy.html', 'privacy-en.html']) fs.writeFileSync(path.join(source, file), html);
    const files = new Map(siteEntries(config, source).map(entry => [entry.name, entry.data.toString()]));
    const result = files.get('pl/index.html');
    assert.ok(!result.includes('stale.example'));
    assert.equal((result.match(/\brel="canonical"/g) || []).length, 1);
    assert.equal((result.match(/\bhreflang\s*=/g) || []).length, 2);
    assert.ok(result.includes('<link rel="alternate" type="application/rss+xml" href="https://feeds.example/news">'));
    assert.ok(result.includes('<a href="/pl/">Home</a>'));
  } finally {
    fs.rmSync(source, { recursive: true, force: true });
  }
});

test('export writes a single combined hosting ZIP and its byte-identical legacy alias', () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-site-export-'));
  try {
    const result = exportSites({ config, outDir });
    assert.equal(result.siteOrigin, config.siteOrigin);
    assert.equal(result.domainVerified, false);
    assert.deepEqual(fs.readdirSync(outDir).sort(), ['Apex-Software-hosting.zip', 'Apex-Website-hosting.zip']);
    assert.ok(fs.readFileSync(result.files[0]).equals(fs.readFileSync(result.files[1])));
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});
