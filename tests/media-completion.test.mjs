import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => {
  const path = new URL(`../${name}`, import.meta.url);
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
};

const characters = ['Jill Valentine','Chris Redfield','Ada Wong','Albert Wesker','Ethan Winters'];
const weapons = ['Samurai Edge','Shotgun','Grenade Launcher','Magnum Revolver','Bow Gun','Combat Knife','Chemical Flamethrower','TMP','Rocket Launcher','M92F','Ithaca M37','SIG 556','RPG-7','Wing Shooter','Assault Rifle for Special Tactics','Albert-01R','LEMI','F2 Rifle','M1851 Wolfsbane'];

test('media override stylesheet loads before the recovery layer and uses the Umbrella emblem', () => {
  const entry = read('styles.css');
  const media = read('media-overrides.css');
  assert.match(entry, /@import url\(['"]media-overrides\.css['"]\);[\s\S]*@import url\(['"]media-recovery\.css['"]\);\s*$/, 'media overrides should load before the final recovery layer');
  assert.match(media, /Umbrella_Corporation_logo|UmbrellaCorporation/i, 'nav mark should use an Umbrella Corporation emblem asset');
  assert.match(media, /\.mark\s*\{/, 'Umbrella mark override is missing');
});

test('all audited character cards have a specific media replacement', () => {
  const media = read('media-overrides.css');
  for (const name of characters) assert.match(media, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${name} media override`);
});

test('all audited weapon cards have a specific media replacement and item-safe fitting', () => {
  const media = read('media-overrides.css');
  for (const name of weapons) assert.match(media, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${name} media override`);
  assert.match(media, /object-fit:\s*contain|background-size:\s*contain/i, 'weapon replacements must preserve full weapon silhouettes');
});
