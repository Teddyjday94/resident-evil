import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => fs.existsSync(new URL(`../${name}`, import.meta.url)) ? fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8') : '';

test('research redesign script is loaded after the main archive renderer', () => {
  const html = read('index.html');
  assert.match(html, /<script\s+src=["']research-enhancements\.js["'][^>]*><\/script>/, 'research enhancement script is not loaded');
  assert.ok(html.indexOf('app.js') < html.indexOf('research-enhancements.js'), 'research enhancements must run after app.js renders the cards');
});

test('organization cards receive emblem metadata for all five factions', () => {
  const js = read('research-enhancements.js');
  for (const name of ['Umbrella Corporation','S.T.A.R.S.','B.S.A.A.','R.P.D.','TerraSave']) {
    assert.match(js, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing faction metadata for ${name}`);
  }
  assert.match(js, /faction-emblem/);
  assert.match(js, /faction-logo/);
  assert.match(js, /faction-meta/);
  assert.match(js, /assets\/organizations\/\$\{meta\.slug\}\.svg/);
});

test('pathogen cards receive image-rich research metadata for all six specimens', () => {
  const js = read('research-enhancements.js');
  for (const name of ['T-Virus','G-Virus','Las Plagas','Uroboros','C-Virus','Mutamycete']) {
    assert.match(js, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing pathogen metadata for ${name}`);
  }
  for (const field of ['origin','transmission','effect','status']) assert.match(js, new RegExp(field), `missing ${field} research field`);
  assert.match(js, /pathogen-media/);
  assert.match(js, /pathogen-media-image/);
  assert.match(js, /pathogen-status/);
  assert.match(js, /assets\/pathogens\/\$\{meta\.slug\}\.svg/);
});

test('research stylesheet defines explicit media panels and mobile-safe layout', () => {
  const css = read('research-redesign.css');
  assert.match(css, /\.faction-emblem/);
  assert.match(css, /\.faction-logo\s*\{/);
  assert.match(css, /\.pathogen-media/);
  assert.match(css, /\.pathogen-media-image\s*\{/);
  assert.match(css, /@media\s*\(max-width:\s*680px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
