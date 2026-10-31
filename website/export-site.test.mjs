import test from 'node:test';
import assert from 'node:assert/strict';
import { hostedHtml, deploymentConfig, siteEntries } from './export-site.mjs';

const config = {
  brandOrigin: 'https://brand.apex.test',
  productOrigin: 'https://product.apex.test',
  domainsVerified: false,
};

test('cross-site navigation preserves language and installation anchor', () => {
  assert.equal(
    hostedHtml('<a href="../en.html#instalacja">Install</a>', 'brand', config),
    '<a href="https://product.apex.test/en/#instalacja">Install</a>',
  );
  assert.equal(
    hostedHtml('<a href="brand/index.html">Apex</a>', 'product', config),
    '<a href="https://brand.apex.test/pl/">Apex</a>',
  );
  assert.equal(
    hostedHtml('<a href="privacy-en.html">Privacy</a><script src="../app.js"></script>', 'product', config),
    '<a href="/en/privacy/">Privacy</a><script src="/app.js"></script>',
  );
});

test('invalid origins and unrecognized local links fail before publication', () => {
  for (const value of ['http://apex.test', 'https://apex.test/pl', 'https://user:secret@apex.test']) {
    assert.throws(() => deploymentConfig({ ...config, brandOrigin: value }));
  }
  assert.throws(() => hostedHtml('<a href="missing.html">Broken</a>', 'product', config));
});

test('exports contain clean language routes and exclude developer files', () => {
  for (const kind of ['brand', 'product']) {
    const entries = siteEntries(kind, config);
    const files = new Map(entries.map((entry) => [entry.name, entry.data.toString()]));
    assert.ok(files.has('pl/index.html'));
    assert.ok(files.has('en/index.html'));
    assert.ok(files.has('index.html'));
    assert.ok(files.has('404.html'));
    assert.ok(files.get('_redirects').includes('/ /pl/ 302'));
    assert.ok(!entries.some(({ name }) => /README|\.mjs|config|node_modules|\.zip/.test(name)));
    for (const language of ['pl', 'en']) {
      const html = files.get(language + '/index.html');
      assert.ok(html.includes('href="/pl/"'));
      assert.ok(html.includes('href="/en/"'));
      assert.ok(html.includes('src="/assets/apex.svg"'));
    }
    if (kind === 'product') {
      const html = files.get('en/privacy/index.html');
      assert.ok(html.includes('href="/en/"'));
      assert.ok(html.includes('href="/pl/privacy/"'));
    } else {
      assert.ok(files.get('en/index.html').includes('https://product.apex.test/en/'));
    }
  }
});
