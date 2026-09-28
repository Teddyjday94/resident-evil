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

test('shared weapons archive has meaningful coverage and valid relations', () => {
  assert.ok(Array.isArray(data.weapons));
  assert.ok(data.weapons.length >= 16, 'expected meaningful initial armory coverage');
  const allowed = new Set(['Handgun','Shotgun','Magnum','Rifle','SMG','Launcher','Melee','Special']);
  const gameIds = new Set(data.games.map(x => x.id));
  const characterIds = new Set(data.characters.map(x => x.id));
  const weaponIds = new Set(data.weapons.map(x => x.id));
  for (const weapon of data.weapons) {
    assert.ok(weapon.id && weapon.name && allowed.has(weapon.class));
    assert.ok(Array.isArray(weapon.gameIds) && weapon.gameIds.length > 0);
    assert.ok(Array.isArray(weapon.characterIds));
    for (const id of weapon.gameIds) assert.ok(gameIds.has(id), `${weapon.id} references missing game ${id}`);
    for (const id of weapon.characterIds) assert.ok(characterIds.has(id), `${weapon.id} references missing character ${id}`);
  }
  for (const game of data.games) {
    for (const id of game.weaponIds) assert.ok(weaponIds.has(id), `${game.id}.weaponIds references missing ${id}`);
  }
});
