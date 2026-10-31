// Refresh the website copies from the extension's actual policy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { policyHtml } from '../tools/webstore-materials.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(dir, '..', 'PRIVACY.md'), 'utf8');
const marker = '\n# Polityka prywatności Apex AdBlocker';
const split = source.indexOf(marker);
if (split < 0) throw new Error('Polish privacy-policy section is missing.');
const sections = {
  pl: source.slice(split + 1),
  en: source.slice(0, split).replace(/\n---\s*$/, '').trim(),
};
for (const [language, markdown] of Object.entries(sections)) {
  const home = language === 'pl' ? '← Strona główna Apex' : '← Apex home';
  const html = policyHtml(markdown, language)
    .replace('<nav>', '<nav><a href="index.html">' + home + '</a> · ')
    .replace('</style>', '@media(prefers-color-scheme:dark){a{color:#75d3cc}}</style>');
  const file = language === 'pl' ? 'privacy.html' : 'privacy-en.html';
  fs.writeFileSync(path.join(dir, file), html);
  console.log('Updated ' + file);
}
