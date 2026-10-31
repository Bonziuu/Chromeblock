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
  const homeFile = language === 'pl' ? 'index.html' : 'en.html';
  const html = policyHtml(markdown, language)
    .replace('<nav>', '<nav><a href="' + homeFile + '">' + home + '</a> · ')
    .replace(
      '<meta name="generator"',
      '<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f5f9fa" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0b1d26" media="(prefers-color-scheme: dark)"><meta name="generator"',
    )
    .replace(
      '</style>',
      'html{background:#f5f9fa;color:#11323d}@media(prefers-color-scheme:dark){html{background:#0b1d26;color:#e0eef3}a{color:#75d3cc}}</style>',
    );
  const file = language === 'pl' ? 'privacy.html' : 'privacy-en.html';
  fs.writeFileSync(path.join(dir, file), html);
  console.log('Updated ' + file);
}
