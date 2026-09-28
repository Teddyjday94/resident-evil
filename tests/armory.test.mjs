import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

test('homepage exposes the Armory Archive hooks and filters', () => {
  const html = read('index.html');
  assert.match(html, /id=["']armory["']/);
  assert.match(html, /id=["']weaponGrid["']/);
  for (const value of ['all','Handgun','Shotgun','Magnum','Rifle','SMG','Launcher','Melee','Special']) {
    assert.match(html, new RegExp(`data-weapon-filter=["']${value}["']`));
  }
});

test('homepage renderer uses shared weapons, accessible expansion and image fallback', () => {
  const js = read('app.js');
  assert.match(js, /renderWeapons/);
  assert.match(js, /data\.weapons/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /fallbackImage/);
  assert.match(js, /weaponGrid/);
});

test('armory stylesheet is imported and has mobile/reduced motion rules', () => {
  const entry = read('styles.css');
  const css = read('armory.css');
  assert.match(entry, /armory\.css/);
  assert.match(css, /overflow-x:auto/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /prefers-reduced-motion/);
});
