import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

test('game page shell loads shared data and renderer', () => {
  const html = read('game.html');
  assert.match(html, /id=["']gameRoot["']/);
  assert.match(html, /data\.js/);
  assert.match(html, /game\.js/);
  assert.match(html, /Return to archive/i);
});

test('game query helpers resolve known ids and reject missing or unknown ids', () => {
  const js = read('game.js');
  assert.match(js, /URLSearchParams/);
  assert.match(js, /game-not-found/);
  const sandbox = { window: {}, URLSearchParams };
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox);
  const api = sandbox.window.RE_GAME_TEST;
  assert.ok(api, 'game.js must expose test helpers');
  assert.equal(api.getRequestedGameId('?id=re2r'), 're2r');
  assert.equal(api.getRequestedGameId(''), null);
  assert.equal(api.getRequestedGameId('?id='), null);
  const data = { games:[{id:'re2r'},{id:'re4r'}] };
  assert.equal(api.resolveGame(data, 're2r').id, 're2r');
  assert.equal(api.resolveGame(data, null), null);
  assert.equal(api.resolveGame(data, 'missing'), null);
});

test('relation resolver ignores malformed ids while preserving valid order', () => {
  const js = read('game.js');
  const sandbox = { window: {}, URLSearchParams };
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox);
  const { resolveMany } = sandbox.window.RE_GAME_TEST;
  assert.equal(typeof resolveMany, 'function');
  assert.deepEqual(JSON.parse(JSON.stringify(resolveMany([{id:'a'},{id:'b'}], ['a','missing','b']))), [{id:'a'},{id:'b'}]);
});

test('game renderer contains all cross-linked archive sections and fallbacks', () => {
  const js = read('game.js');
  for (const id of ['brief','personnel','armory','threats','pathogens','locations','files']) {
    assert.match(js, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
  assert.match(js, /dossier\.html\?id=/);
  assert.match(js, /addEventListener\(['"]error['"]/);
  assert.match(js, /MEDIA UNAVAILABLE/);
});
