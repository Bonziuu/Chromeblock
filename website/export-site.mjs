// Export only public static files, with index.html at the ZIP root.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createZip } from '../tools/package-dev.mjs';

const website = path.dirname(fileURLToPath(import.meta.url));
const files = [
  'index.html',
  'en.html',
  'styles.css',
  'app.js',
  'privacy.html',
  'privacy-en.html',
  'assets/apex.svg',
];
const entries = files.map((name) => ({
  name,
  data: fs.readFileSync(path.join(website, name)),
}));
// Also permits serving the same static export on GitHub Pages.
entries.push({ name: '.nojekyll', data: Buffer.alloc(0) });
const output = path.join(website, '..', 'docs', 'website', 'Apex-Website-hosting.zip');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, createZip(entries));
console.log(output);
