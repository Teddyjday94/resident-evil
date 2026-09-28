import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const js = read('app.js');

test('reveal observer storage remains safe before initial dynamic renders', () => {
  const firstBowRender = js.indexOf('renderBows();');
  const hoistedObserver = js.indexOf('var observer;');
  assert.notEqual(firstBowRender, -1);
  assert.notEqual(hoistedObserver, -1);
});

test('Stage 3 mobile navigation and effects preserve accessibility constraints', () => {
  const gameJs = read('game.js');
  const gameCss = read('game.css');
  const armoryCss = read('armory.css');
  for (const id of ['brief','personnel','armory','threats','locations']) assert.match(gameJs, new RegExp(`href=\\"#${id}\\"`));
  assert.match(gameCss, /\.game-mini-nav a\{[^}]*min-height:44px/);
  assert.match(gameCss, /overflow-x:auto/);
  assert.match(armoryCss, /overflow-x:auto/);
  assert.match(gameCss, /prefers-reduced-motion/);
  assert.match(armoryCss, /prefers-reduced-motion/);
  assert.match(js, /matchMedia\(['"]\(pointer:fine\)['"]\)/);
});
