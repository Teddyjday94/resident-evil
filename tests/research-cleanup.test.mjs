import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (name) => fs.existsSync(new URL(`../${name}`, import.meta.url)) ? fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8') : '';

test('legacy organization and pathogen media layer is no longer loaded', () => {
  const css = read('styles.css');
  assert.doesNotMatch(css, /archive-media\.css/, 'legacy archive-media layer should be removed from the active stylesheet stack');
});

test('legacy faction stamp is removed rather than hidden', () => {
  const js = read('research-enhancements.js');
  assert.match(js, /stamp\)\s*stamp\.remove\(\)/, 'old faction stamp should be removed from the DOM');
  assert.doesNotMatch(js, /stamp\.hidden\s*=\s*true/, 'old faction stamp should not remain hidden under the new emblem');
});

test('pathogen cards render an explicit image with a local fallback', () => {
  const js = read('research-enhancements.js');
  assert.match(js, /pathogen-media-image/, 'pathogen image element is missing');
  assert.match(js, /assets\/pathogens\/\$\{meta\.slug\}\.svg/, 'local pathogen SVG fallback is missing');
  assert.match(js, /onerror/, 'pathogen image fallback handler is missing');
});

test('T-Virus and G-Virus no longer depend on CSS background hotlinks', () => {
  const css = read('research-redesign.css');
  assert.doesNotMatch(css, /data-pathogen=["']t-virus["'][^\n]*background-image/i);
  assert.doesNotMatch(css, /data-pathogen=["']g-virus["'][^\n]*background-image/i);
  assert.match(css, /\.pathogen-media-image\s*\{/);
});

test('organization emblems use a single explicit logo element with fallback', () => {
  const js = read('research-enhancements.js');
  assert.match(js, /faction-logo/);
  assert.match(js, /assets\/organizations\/\$\{meta\.slug\}\.svg/);
  const css = read('research-redesign.css');
  assert.match(css, /\.faction-logo\s*\{/);
  assert.doesNotMatch(css, /faction-emblem::before[^\n]*background-image/, 'stacked faction background logos should be removed');
});
