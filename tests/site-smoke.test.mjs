import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve('.');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('homepage exposes the expanded archive sections and assets', () => {
  const html = read('index.html');
  for (const id of ['games','armory','characters','bows','raccoon-map','timeline','pathogens','factions','locations','media']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
  assert.match(html, /styles\.css/);
  assert.match(html, /data\.js/);
  assert.match(html, /app\.js/);
  assert.match(html, /dossier\.html\?id=/);
});

test('shared archive data has meaningful game, weapon, character, BOW and map coverage', () => {
  const code = read('data.js');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const data = sandbox.window.RE_ARCHIVE;
  assert.ok(data, 'window.RE_ARCHIVE must exist');
  assert.ok(data.games.length >= 10, 'expected 10+ games');
  assert.ok(data.weapons.length >= 16, 'expected meaningful armory coverage');
  assert.ok(data.characters.length >= 9, 'expected 9+ characters');
  assert.ok(data.bows.length >= 8, 'expected 8+ B.O.W.s');
  assert.ok(data.mapPoints.length >= 6, 'expected 6+ map points');
  assert.ok(data.media.length >= 5, 'expected 5+ media references');
  assert.ok(data.characters.some((c) => c.id === 'leon'));
  assert.ok(data.characters.some((c) => c.id === 'jill'));
  assert.ok(data.bows.some((b) => /Nemesis/i.test(b.name)));
});

test('character dossier page is data-driven and shareable', () => {
  const html = read('dossier.html');
  const js = read('dossier.js');
  assert.match(html, /id=["']dossierRoot["']/);
  assert.match(html, /data\.js/);
  assert.match(html, /dossier\.js/);
  assert.match(js, /URLSearchParams/);
  assert.match(js, /RE_ARCHIVE\.characters/);
  assert.match(js, /location\.search/);
});

test('homepage interactions include game navigation, filtering, map selection, image fallback and reduced-motion support', () => {
  const js = read('app.js');
  const css = [read('styles.css'), read('styles-base.css'), read('styles-modules.css'), read('styles-adaptive.css'), read('armory.css')].join('\n');
  assert.match(js, /game\.html\?id=\$\{encodeURIComponent\(game\.id\)\}/);
  assert.match(js, /archiveSearch/);
  assert.match(js, /renderWeapons/);
  assert.match(js, /mapPoints/);
  assert.match(js, /addEventListener\(['"]error['"]/);
  assert.match(js, /matchMedia\(['"]\(prefers-reduced-motion: reduce\)['"]\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.map-hotspot/);
  assert.match(css, /\.bow-card/);
  assert.match(css, /\.media-card/);
  assert.match(css, /\.weapon-card/);
});
