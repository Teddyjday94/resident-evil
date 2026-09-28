import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('.');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('loads the targeted media recovery stylesheet last', () => {
  const css = read('styles.css');
  assert.match(css, /@import url\(['"]media-recovery\.css['"]\);\s*$/m);
});

test('broken game media gets stable recovery selectors', () => {
  const css = read('media-recovery.css');
  for (const id of ['re1','re2','re3']) {
    assert.match(css, new RegExp(`game-card:has\\(a\\[href=["']game\\.html\\?id=${id}["']\\]\\)`));
  }
});

test('broken weapon media gets stable recovery selectors', () => {
  const css = read('media-recovery.css');
  for (const id of ['samurai-edge','classic-shotgun','grenade-launcher','magnum-revolver','m1897']) {
    assert.match(css, new RegExp(`weapon-card:has\\(#weapon-details-${id}\\)`));
  }
});
