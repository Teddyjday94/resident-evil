import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const data = sandbox.window.RE_ARCHIVE;

test('archive records expose stable relationship IDs', () => {
  assert.ok(data.games.every(g => typeof g.id === 'string' && g.id));
  assert.ok(data.bows.every(b => typeof b.id === 'string' && b.id));
  assert.ok(data.pathogens.every(p => typeof p.id === 'string' && p.id));
  assert.ok(data.locations.every(l => typeof l.id === 'string' && l.id));
  for (const game of data.games) {
    for (const key of ['characterIds','bowIds','pathogenIds','locationIds','weaponIds']) {
      assert.ok(Array.isArray(game[key]), `${game.id}.${key} must be an array`);
    }
  }
});

test('game relations point to existing non-weapon records', () => {
  const targets = {
    characterIds: new Set(data.characters.map(x => x.id)),
    bowIds: new Set(data.bows.map(x => x.id)),
    pathogenIds: new Set(data.pathogens.map(x => x.id)),
    locationIds: new Set(data.locations.map(x => x.id))
  };
  for (const game of data.games) {
    for (const [key, ids] of Object.entries(targets)) {
      for (const id of game[key] || []) assert.ok(ids.has(id), `${game.id}.${key} references missing ${id}`);
    }
  }
});
