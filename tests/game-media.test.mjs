import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

test('every homepage game record provides media metadata', () => {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read('data.js'), sandbox);
  const games = sandbox.window.RE_ARCHIVE.games;
  assert.ok(games.length >= 10, 'expected the archive game set');
  for (const game of games) {
    assert.equal(typeof game.image, 'string', `${game.id} is missing an image`);
    assert.match(game.image, /^https:\/\//, `${game.id} image should use HTTPS`);
    assert.equal(typeof game.imagePosition, 'string', `${game.id} is missing imagePosition`);
  }
});

test('game cards render media with fallback and responsive styling', () => {
  const js = read('app.js');
  const css = [read('styles.css'), read('styles-modules.css'), read('styles-adaptive.css')].join('\n');
  assert.match(js, /class=["']game-media["']/, 'game cards should render a game-media region');
  assert.match(js, /fallbackImage\([^\n]*GAME MEDIA UNAVAILABLE/, 'game media should use the shared image fallback');
  assert.match(css, /\.game-media\s*\{/, 'game media needs dedicated styling');
  assert.match(css, /@media\s*\(max-width:\s*680px\)[\s\S]*\.game-media/, 'mobile should define a dedicated game media treatment');
});

test('game cards navigate with a semantic link', () => {
  const js = read('app.js');
  const css = read('styles-base.css');
  assert.match(js, /game\.html\?id=\$\{encodeURIComponent\(game\.id\)\}/);
  assert.match(js, /class=\\?"game-card-link\\?"/);
  assert.match(css, /\.game-card-link:focus-visible/);
});
