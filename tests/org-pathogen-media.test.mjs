import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const orgs = ['umbrella','stars','bsaa','rpd','terrasave'];
const pathogens = ['t-virus','g-virus','las-plagas','uroboros','c-virus','mutamycete'];

test('all organization archive illustrations exist', () => {
  for (const id of orgs) assert.equal(fs.existsSync(new URL(`assets/organizations/${id}.svg`, root)), true, `missing organization media: ${id}`);
});

test('all pathogen archive illustrations exist', () => {
  for (const id of pathogens) assert.equal(fs.existsSync(new URL(`assets/pathogens/${id}.svg`, root)), true, `missing pathogen media: ${id}`);
});

test('archive media stylesheet maps both grids to repo-hosted assets', () => {
  const file = new URL('archive-media.css', root);
  assert.equal(fs.existsSync(file), true, 'archive-media.css missing');
  const css = fs.readFileSync(file, 'utf8');
  assert.match(css, /\.faction-card:nth-child\(1\)/);
  assert.match(css, /\.pathogen-card:nth-child\(6\)/);
  assert.match(css, /assets\/organizations\/umbrella\.svg/);
  assert.match(css, /assets\/pathogens\/mutamycete\.svg/);
});
