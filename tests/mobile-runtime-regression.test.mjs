import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');

test('reveal observer storage is initialized before the first B.O.W. render can call observeReveals', () => {
  const firstInitialRender = js.indexOf('\n  renderBows();');
  const lexicalObserver = js.indexOf('let observer;');
  const hoistedObserver = js.indexOf('var observer;');

  assert.notEqual(firstInitialRender, -1, 'expected initial renderBows() call');
  assert.ok(
    hoistedObserver !== -1 || (lexicalObserver !== -1 && lexicalObserver < firstInitialRender),
    'observer storage must be initialized before renderBows() invokes observeReveals()'
  );
});