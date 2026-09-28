# Resident Evil Stage 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable individual-game archive flow and a filterable shared weapons/armory database while preserving the current dependency-free Resident Evil archive and its working V2 behaviors.

**Architecture:** Keep `data.js` as the canonical `window.RE_ARCHIVE` source. Enrich existing records with stable relationship IDs, add a shared `weapons` collection, render a reusable `game.html?id=<game-id>` page from `game.js`, and reuse those same records for a new homepage Armory Archive. Preserve the current static Vercel deployment model and established vanilla-JS rendering patterns.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript, Node built-in test runner, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-09-27-resident-evil-stage-3-design.md`

## Global Constraints

- Keep the project static and dependency-free: semantic HTML, CSS, and vanilla JavaScript.
- Preserve `window.RE_ARCHIVE` as the canonical shared data model.
- Preserve working character dossiers, homepage search, B.O.W. filters, map interactions, mobile menu, scanner mode, reduced-motion behavior, and image fallbacks.
- Keep the unofficial/non-commercial disclaimer visible.
- Use media as visual reference with graceful fallbacks; prefer official/credible sources when possible.
- Do not reproduce proprietary in-game map artwork directly.
- No framework, bundler, backend, database, authentication, inventory simulator, weapon calculator, or autoplay audio/video.
- Missing or explicitly unknown game IDs must render a controlled “record not found” state with navigation back to the archive.

## Review Focus

- **Malformed relation IDs:** one bad `characterIds`, `bowIds`, `pathogenIds`, `locationIds`, or `weaponIds` value must not crash a game page; valid related records must still render.
- **Missing/unknown `?id=` values:** `game.html` must show the controlled not-found state rather than silently defaulting or throwing.
- **External image failure:** game and weapon cards must preserve their dimensions and readable copy when media fails.
- **Touch/mobile widths:** armory filters and game-page mini-nav must remain usable without horizontal page overflow or hover-only content.
- **Regression in existing runtime initialization:** new rendering code must not reintroduce an early exception that prevents the mobile menu or later homepage sections from binding.

---

## File Structure

### New files

- `game.html` — reusable individual-game page shell with section roots and static accessibility/fallback structure.
- `game.js` — query parsing, record resolution, relation resolution, page rendering, not-found handling, image fallback binding, game-page interactions.
- `game.css` — game-page hero, HUD, sticky mini-nav, related-record grids, game-page responsive treatment.
- `armory.css` — homepage weapon-card, filter, expand-panel, targeting-sweep, and responsive styles.
- `tests/archive-relations.test.mjs` — stable IDs, weapons schema, relation integrity, malformed relation behavior.
- `tests/game-page.test.mjs` — reusable page shell, query handling, not-found state, section rendering hooks.
- `tests/armory.test.mjs` — homepage armory hooks, filters, accessible card expansion, fallback wiring.

### Modified files

- `data.js` — add stable IDs/relationship arrays and `weapons` collection; enrich game records with page metadata.
- `index.html` — add Armory section.
- `app.js` — make game cards navigable; render/filter/expand homepage weapons without disturbing existing sections.
- `styles.css` — import `armory.css`; `game.html` loads existing `styles.css` plus `game.css` directly.
- `styles-adaptive.css` — only if existing global breakpoints need small shared adjustments.
- `README.md` — document Stage 3 routes, data relationships, and verification commands.

---

### Task 1: Stable Archive IDs and Relationship Integrity

**Files:**
- Modify: `data.js`
- Create: `tests/archive-relations.test.mjs`

**Interfaces:**
- Consumes: existing `window.RE_ARCHIVE.games`, `.characters`, `.bows`, `.pathogens`, `.locations`.
- Produces: stable `id` fields on B.O.W., pathogen, and location records; game relationship arrays `characterIds[]`, `bowIds[]`, `pathogenIds[]`, `locationIds[]`, `weaponIds[]`; richer optional game metadata fields used by later tasks.

- [ ] **Step 1: Write the failing schema/integrity tests**

Create tests that evaluate `data.js` in `vm` and assert:

```js
assert.ok(data.games.every(g => typeof g.id === 'string' && g.id));
assert.ok(data.bows.every(b => typeof b.id === 'string' && b.id));
assert.ok(data.pathogens.every(p => typeof p.id === 'string' && p.id));
assert.ok(data.locations.every(l => typeof l.id === 'string' && l.id));
for (const game of data.games) {
  for (const key of ['characterIds','bowIds','pathogenIds','locationIds','weaponIds']) {
    assert.ok(Array.isArray(game[key]), `${game.id}.${key} must be an array`);
  }
}
```

Add referential-integrity assertions for all non-weapon relation arrays against their target collections.

- [ ] **Step 2: Run the new test to verify RED**

Run: `node --test tests/archive-relations.test.mjs`

Expected: FAIL because B.O.W./pathogen/location IDs and game relation arrays are not yet present.

- [ ] **Step 3: Add stable IDs and game metadata in `data.js`**

Use stable lowercase kebab-safe IDs. Keep existing display fields intact so current homepage rendering still works. Add at minimum:

- `characterIds[]`
- `bowIds[]`
- `pathogenIds[]`
- `locationIds[]`
- `weaponIds[]` initialized as arrays for Task 2
- `overview`
- `setting`
- `release`
- `heroImage` (may initially reuse `image`)
- `heroPosition`
- `incidentFacts[]`

Do not make renderer changes in this task.

- [ ] **Step 4: Run the relation tests and the existing suite**

Run:

```bash
node --test tests/archive-relations.test.mjs
node --test tests/site-smoke.test.mjs tests/mobile-runtime-regression.test.mjs tests/game-media.test.mjs
node --check data.js
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add data.js tests/archive-relations.test.mjs
git commit -m "feat: add archive relationship ids"
```

---

### Task 2: Shared Weapons Data Model

**Files:**
- Modify: `data.js`
- Modify: `tests/archive-relations.test.mjs`

**Interfaces:**
- Consumes: stable game and character IDs from Task 1.
- Produces: `window.RE_ARCHIVE.weapons` records with `id`, `name`, `class`, `ammo`, `summary`, `image`, `imagePosition`, `gameIds[]`, `characterIds[]`, `variants[]`, `attachments[]`, optional `notes[]`; populated `game.weaponIds[]` relationships.

- [ ] **Step 1: Extend tests for meaningful weapon coverage and valid relations**

Add assertions equivalent to:

```js
assert.ok(Array.isArray(data.weapons));
assert.ok(data.weapons.length >= 16, 'expected meaningful initial armory coverage');
const allowed = new Set(['Handgun','Shotgun','Magnum','Rifle','SMG','Launcher','Melee','Special']);
for (const weapon of data.weapons) {
  assert.ok(weapon.id && weapon.name && allowed.has(weapon.class));
  assert.ok(Array.isArray(weapon.gameIds) && weapon.gameIds.length > 0);
  assert.ok(Array.isArray(weapon.characterIds));
}
```

Validate every `weapon.gameIds[]` against game IDs, every `weapon.characterIds[]` against character IDs, and every `game.weaponIds[]` against weapon IDs.

- [ ] **Step 2: Run the relation tests to verify RED**

Run: `node --test tests/archive-relations.test.mjs`

Expected: FAIL because `data.weapons` is absent.

- [ ] **Step 3: Add the initial weapons archive**

Populate a representative cross-game set across the eight approved classes. Favor recognizable entries tied to records already present in the archive. Give each weapon one stable local relationship model; do not duplicate full game-page copy into weapon records.

- [ ] **Step 4: Run relation and syntax tests**

Run:

```bash
node --test tests/archive-relations.test.mjs
node --check data.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data.js tests/archive-relations.test.mjs
git commit -m "feat: add shared weapons archive data"
```

---

### Task 3: Reusable Game Page Shell and Not-Found Flow

**Files:**
- Create: `game.html`
- Create: `game.js`
- Create: `game.css`
- Create: `tests/game-page.test.mjs`

**Interfaces:**
- Consumes: `window.RE_ARCHIVE.games` and shared collections from Tasks 1–2.
- Produces: `game.html?id=<game-id>`; browser/test utility interface `window.RE_GAME_UTILS = { getRequestedGameId, resolveGame }`; page rendering into `#gameRoot`; controlled `.game-not-found` state.

- [ ] **Step 1: Write failing shell/query tests**

Tests must assert:

```js
assert.match(html, /id=["']gameRoot["']/);
assert.match(html, /data\.js/);
assert.match(html, /game\.js/);
assert.match(js, /URLSearchParams/);
assert.match(js, /RE_GAME_UTILS/);
assert.match(js, /game-not-found/);
```

Evaluate `game.js` in a VM sandbox without a DOM and assert through `window.RE_GAME_UTILS` that an existing ID resolves, `null`/empty ID resolves to no record, and an unknown ID resolves to no record.

- [ ] **Step 2: Run game-page tests to verify RED**

Run: `node --test tests/game-page.test.mjs`

Expected: FAIL because `game.html`/`game.js` do not exist.

- [ ] **Step 3: Create `game.html`**

Include:

- shared archive branding and unofficial disclaimer
- `#gameRoot`
- static return-to-archive link available even if rendering fails
- stylesheet links for existing `styles.css` plus `game.css`
- scripts in safe order: `data.js` then `game.js`

- [ ] **Step 4: Implement deterministic query resolution in `game.js`**

Implement and expose before DOM bootstrap:

```js
getRequestedGameId(search) -> string | null
resolveGame(data, id) -> game | null
window.RE_GAME_UTILS = { getRequestedGameId, resolveGame }
```

Guard the DOM bootstrap so VM tests without `document` can load the utilities. Missing or unknown IDs both render `.game-not-found` with a return link in the browser. Do not default to the first game.

- [ ] **Step 5: Add base game-page CSS**

Style the not-found state, hero container, archive shell, and responsive foundation only. Defer related record grids to Task 4.

- [ ] **Step 6: Run tests and syntax checks**

Run:

```bash
node --test tests/game-page.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add game.html game.js game.css tests/game-page.test.mjs
git commit -m "feat: add reusable game archive page shell"
```

---

### Task 4: Game Page Related Sections and Graceful Relation Handling

**Files:**
- Modify: `game.js`
- Modify: `game.css`
- Modify: `tests/game-page.test.mjs`
- Modify: `tests/archive-relations.test.mjs`

**Interfaces:**
- Consumes: game relationship arrays and shared archive collections.
- Produces: rendered sections with IDs `brief`, `personnel`, `armory`, `threats`, `pathogens`, `locations`, `files`; extends `window.RE_GAME_UTILS` with `resolveMany(records, ids)`, which ignores unknown IDs while preserving valid results.

- [ ] **Step 1: Write failing relation-rendering tests**

Through `window.RE_GAME_UTILS`, assert:

```js
resolveMany([{id:'a'},{id:'b'}], ['a','missing','b'])
```

returns only `a` and `b` in requested order without throwing.

Add static assertions that `game.js` renders/targets the required section IDs and character dossier URLs. Add a fallback contract assertion that `game.js` binds an image `error` handler and `game.css` defines a fixed-dimension media-unavailable state for game-page media wrappers.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/game-page.test.mjs tests/archive-relations.test.mjs`

Expected: FAIL because the relation helper/sections are not implemented.

- [ ] **Step 3: Implement full game-page rendering**

Render:

- cinematic hero with title, release/year, setting, protagonists, primary threat/pathogen when present
- compact HUD fields
- sticky mini-nav for Brief / Personnel / Armory / Threats / Locations
- Incident Brief from `overview` + `incidentFacts[]`
- Personnel from `characterIds[]`, linking to `dossier.html?id=<character-id>`
- Armory from `weaponIds[]`
- Threats from `bowIds[]`
- Pathogens from `pathogenIds[]`
- Locations from `locationIds[]`
- Files/timeline from `incidentFacts[]`
- Related Archive links only when explicit related records are available; otherwise omit the block cleanly

If a relation is malformed, omit that specific missing card and continue rendering the page.

- [ ] **Step 4: Add game-page visual treatment**

In `game.css`, implement:

- full-width hero and metadata HUD
- sticky desktop mini-nav
- horizontally scrollable or compact mobile mini-nav
- reusable card styling that visually harmonizes with existing character/B.O.W./pathogen/location language
- no hover-only essential content
- reduced-motion overrides for page-specific effects

- [ ] **Step 5: Bind image fallbacks**

Use the same failure principle as the homepage: remove broken `<img>`, keep the wrapper dimensions, and show a readable media-unavailable treatment.

- [ ] **Step 6: Run tests and syntax checks**

Run:

```bash
node --test tests/game-page.test.mjs tests/archive-relations.test.mjs
node --check game.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add game.js game.css tests/game-page.test.mjs tests/archive-relations.test.mjs
git commit -m "feat: render cross-linked game archive records"
```

---

### Task 5: Homepage Armory Archive

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Create: `armory.css`
- Modify: `styles.css`
- Create: `tests/armory.test.mjs`

**Interfaces:**
- Consumes: `window.RE_ARCHIVE.weapons` from Task 2.
- Produces: homepage `#armory` section, `#weaponGrid`, `[data-weapon-filter]` controls, expandable weapon cards using `aria-expanded`, and renderer `renderWeapons(filter = 'all')` inside the existing homepage script.

- [ ] **Step 1: Write failing Armory tests**

Assert `index.html` contains:

```js
id="armory"
id="weaponGrid"
data-weapon-filter="all"
```

Assert `app.js` contains/render behavior for `renderWeapons`, uses the shared `data.weapons`, and binds card image failures through the existing fallback mechanism. Assert `armory.css` contains a fixed-height/fixed-min-height fallback treatment for failed weapon media so the card does not collapse.

- [ ] **Step 2: Run Armory tests to verify RED**

Run: `node --test tests/armory.test.mjs`

Expected: FAIL because the Armory section does not exist.

- [ ] **Step 3: Add the Armory section to `index.html`**

Place it after the Incident Database and before Personnel Dossiers so game records naturally flow into equipment records. Use an `Archive 01-B` eyebrow to avoid renumbering the existing archive sections. Include buttons for:

- All
- Handgun
- Shotgun
- Magnum
- Rifle
- SMG
- Launcher
- Melee
- Special

- [ ] **Step 4: Implement `renderWeapons(filter = 'all')` in `app.js`**

Keep this renderer below helper initialization and before final interaction binding to avoid temporal-dead-zone/runtime-order regressions.

Each card must expose:

- image/fallback
- name
- class
- ammo
- concise summary
- related games/characters as compact metadata
- an accessible expand/collapse control with `aria-expanded`
- optional variants/attachments/notes in the expanded panel

Do not give weapon cards the existing `.searchable` class in Stage 3; homepage archive search remains game/archive focused and Armory filtering stays independent. Filtering must rebuild only `#weaponGrid` and must not affect homepage archive search behavior.

- [ ] **Step 5: Add `armory.css` and import it from `styles.css`**

Desktop:

- multi-column equipment-locker grid
- large image panel
- thin technical readouts
- short red targeting-sweep hover effect

Mobile:

- single-column cards
- horizontally scrollable filter row without page overflow
- 44px+ controls
- expanded details visible without hover

Reduced motion disables the targeting sweep animation.

- [ ] **Step 6: Run Armory and regression tests**

Run:

```bash
node --test tests/armory.test.mjs tests/site-smoke.test.mjs tests/mobile-runtime-regression.test.mjs
node --check app.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add index.html app.js armory.css styles.css tests/armory.test.mjs
git commit -m "feat: add homepage armory archive"
```

---

### Task 6: Make Existing Game Cards Navigable

**Files:**
- Modify: `app.js`
- Modify: `styles-base.css`
- Modify: `tests/game-media.test.mjs`
- Modify: `tests/site-smoke.test.mjs`

**Interfaces:**
- Consumes: existing game-card renderer and stable `game.id`.
- Produces: accessible navigation to `game.html?id=<game-id>` from every rendered game card while preserving search, tilt, image media, and fallback behavior.

- [ ] **Step 1: Write failing navigation tests**

Assert the renderer constructs `game.html?id=${encodeURIComponent(game.id)}` and that game cards expose a keyboard-reachable semantic link rather than click-only navigation.

- [ ] **Step 2: Run targeted tests to verify RED**

Run: `node --test tests/game-media.test.mjs tests/site-smoke.test.mjs`

Expected: FAIL because game cards are not yet archive links.

- [ ] **Step 3: Update the game-card renderer**

Wrap the card’s navigable content in an anchor or make the card itself a semantic anchor structure without nesting interactive elements. Preserve `.game-card` as the tilt/search styling hook.

- [ ] **Step 4: Update focus styles**

Add an obvious `:focus-visible` state with the same archive-red visual language as hover.

- [ ] **Step 5: Run targeted and existing tests**

Run:

```bash
node --test tests/game-media.test.mjs tests/site-smoke.test.mjs tests/mobile-runtime-regression.test.mjs tests/armory.test.mjs
node --check app.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app.js styles-base.css tests/game-media.test.mjs tests/site-smoke.test.mjs
git commit -m "feat: link game cards to archive pages"
```

---

### Task 7: Mobile, Accessibility, and Reduced-Motion Integration

**Files:**
- Modify: `game.css`
- Modify: `armory.css`
- Modify: `styles-adaptive.css` only if shared rules are required
- Modify: `tests/game-page.test.mjs`
- Modify: `tests/armory.test.mjs`
- Modify: `tests/mobile-runtime-regression.test.mjs`

**Interfaces:**
- Consumes: page and Armory DOM from Tasks 4–6.
- Produces: mobile-safe mini-nav/filter rows, touch-safe controls, reduced-motion guards, and regression coverage that later homepage code still binds.

- [ ] **Step 1: Add failing static/mobile regression assertions**

Pin:

- game-page mini-nav has real section hrefs
- armory filter/expand controls are buttons, not hover-only divs
- page-specific styles contain a `prefers-reduced-motion` rule
- filter and mini-nav containers use local horizontal scrolling/containment rather than causing page-level overflow
- homepage runtime still declares/initializes reveal observer safely before render paths can invoke it

- [ ] **Step 2: Run targeted tests to verify RED where applicable**

Run: `node --test tests/game-page.test.mjs tests/armory.test.mjs tests/mobile-runtime-regression.test.mjs`

Expected: at least the new reduced-motion/mobile assertions FAIL before CSS/runtime adjustments.

- [ ] **Step 3: Finalize responsive and accessibility behavior**

Ensure:

- no page-level horizontal overflow at <=680px
- filter chips scroll inside their own row
- game mini-nav scrolls inside its own row or becomes non-sticky
- no tilt/parallax on coarse pointers
- all controls have visible focus states
- no essential content depends on hover
- `prefers-reduced-motion` disables new nonessential effects

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/game-page.test.mjs tests/armory.test.mjs tests/mobile-runtime-regression.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add game.css armory.css styles-adaptive.css tests/game-page.test.mjs tests/armory.test.mjs tests/mobile-runtime-regression.test.mjs
git commit -m "fix: harden Stage 3 mobile and accessibility"
```

---

### Task 8: Documentation and Full Verification

**Files:**
- Modify: `README.md`
- Modify: tests only if verification uncovers a missing regression case

**Interfaces:**
- Consumes: completed Stage 3 feature set.
- Produces: documented routes/data conventions and a verified deployable repository.

- [ ] **Step 1: Update README**

Document:

- `game.html?id=<game-id>` route
- `weapons` collection and relation arrays
- how to add a new game/weapon without breaking referential integrity
- all Stage 3 test commands
- static Vercel deployment remains build-free

- [ ] **Step 2: Run the full Node test suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 3: Run JavaScript syntax verification**

Run:

```bash
node --check data.js
node --check app.js
node --check dossier.js
node --check game.js
```

Expected: all exit 0.

- [ ] **Step 4: Verify deployment on Vercel**

Confirm the production deployment is READY and fetch at minimum:

- `/`
- `/data.js`
- `/app.js`
- `/game.html?id=re2r`
- `/game.js`

Verify the served files contain the Stage 3 markers and the game route returns HTTP 200.

- [ ] **Step 5: Browser/mobile acceptance check**

Confirm:

- homepage mobile menu opens/closes
- homepage search still filters archive records
- Armory filters work at desktop and mobile widths
- a weapon card expands/collapses with keyboard/touch
- game card opens the matching game page
- invalid game ID shows the controlled not-found state
- sticky/scrolling game mini-nav does not hide section headings
- broken image fallback preserves layout
- no console errors on homepage or game page

- [ ] **Step 6: Commit documentation/final verification fixes**

```bash
git add README.md tests
git commit -m "docs: document Resident Evil Stage 3"
```

---

## Completion Definition

The plan is complete when the homepage includes the filterable Armory Archive, every current game card links to the reusable game archive page, related records render from shared IDs, invalid game IDs fail gracefully, mobile/reduced-motion behavior remains usable, all existing and new tests pass, syntax checks pass, and the Vercel production deployment has been verified.