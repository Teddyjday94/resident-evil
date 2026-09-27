# Resident Evil Biohazard Archive — Stage 3 Design

**Date:** 2026-09-27  
**Status:** Proposed for implementation after user review  
**Project:** `Teddyjday94/resident-evil`

## Goal

Expand the current dependency-free Resident Evil fan archive into a richer, data-driven franchise database without replacing the working V2 architecture. Stage 3 adds two connected systems:

1. a reusable individual game archive page powered by query-string IDs, and
2. a shared weapons/armory database that appears both on the homepage and inside related game pages.

The result should feel like a compromised R.P.D./Umbrella terminal: cinematic, dense with cross-linked records, mobile-safe, and still deployable to Vercel with no build step.

## Current Constraints

- Keep the project static and dependency-free: semantic HTML, CSS, and vanilla JavaScript.
- Preserve the existing `window.RE_ARCHIVE` global data model rather than introducing a framework or module build pipeline.
- Preserve working character dossiers, search, B.O.W. filters, map interactions, mobile menu, scanner mode, reduced-motion behavior, and image fallbacks.
- Keep the unofficial/non-commercial disclaimer visible.
- Use media as visual reference with graceful fallbacks. Prefer official/credible sources when possible.
- Do not reproduce proprietary in-game map artwork directly.

## Chosen Architecture

### Reusable game page

Add a single `game.html` template and `game.js` renderer. Pages resolve a game with a URL such as:

- `game.html?id=re2`
- `game.html?id=re2r`
- `game.html?id=re4r`

This follows the existing `dossier.html?id=...` pattern and avoids twelve separate HTML files.

Invalid or missing IDs must produce a useful archive fallback state rather than a blank page or JavaScript exception. A missing ID may default to a known record; an explicitly unknown ID should show “record not found” with a path back to the main archive.

### Shared data relationships

Continue using `data.js` as the canonical archive source. Existing records are enriched with stable IDs and relation arrays. Related sections are assembled by ID at render time instead of copying lore between pages.

The game page must derive related content from shared records whenever possible so one content change propagates everywhere.

## Data Model

### Game records

Existing `games` records gain richer optional fields while retaining current fields used by the homepage.

Target fields:

- `id`
- `code`
- `title`
- `year`
- `release`
- `era`
- `summary`
- `overview`
- `setting`
- `image`
- `heroImage`
- `imagePosition`
- `heroPosition`
- `tags[]`
- `characterIds[]`
- `bowIds[]`
- `pathogenIds[]`
- `locationIds[]`
- `weaponIds[]`
- `incidentFacts[]`
- `media[]` or related media IDs where practical

Not every record must have every optional field in the first implementation. Rendering must tolerate partial content.

### Weapon records

Add `weapons` to `window.RE_ARCHIVE`.

Target fields:

- `id`
- `name`
- `class`
- `ammo`
- `summary`
- `image`
- `imagePosition`
- `gameIds[]`
- `characterIds[]`
- `variants[]`
- `attachments[]`
- optional `notes[]`

Initial filter classes:

- Handgun
- Shotgun
- Magnum
- Rifle
- SMG
- Launcher
- Melee
- Special

The first version is an archive, not a gameplay calculator. No damage stats, upgrade optimizer, comparison engine, inventory simulator, or backend is required.

### Stable IDs for cross-linking

Existing records that need relationships must receive stable IDs if they do not already have them, especially:

- B.O.W.s
- pathogens
- locations

References must point only to real IDs. Tests will validate referential integrity.

## Homepage Changes

### Game cards become archive links

The existing cinematic game cards remain visually recognizable but become navigable entries to `game.html?id=<game-id>`.

Requirements:

- preserve current search behavior
- preserve image fallback behavior
- preserve pointer tilt only on fine-pointer devices
- use semantic links or accessible click targets
- avoid nested invalid interactive elements

### New Armory Archive section

Add a homepage section dedicated to weapons.

Desktop behavior:

- filter controls across the top
- multi-column equipment cards
- large weapon image area
- class/ammo readout
- related game/character metadata
- subtle targeting-sweep hover effect
- expandable detail panel in place

Mobile behavior:

- single-column cards
- horizontally scrollable filter chips
- larger tap targets
- no hover-dependent information
- no pointer tilt/parallax

The homepage armory should not open separate weapon pages in the first Stage 3 implementation.

## Individual Game Page Design

### Hero

Each game page opens with a full-width cinematic hero using the game’s own media and metadata.

Hero content:

- archive classification line
- title
- release/year
- setting/location
- protagonist names
- primary threat/pathogen where available
- return-to-archive link

A compact HUD can show fields such as:

- STATUS
- PRIMARY THREAT
- PATHOGEN
- CLEARANCE

The exact labels may vary by record, but the layout must remain consistent.

### Sticky section navigation

Desktop/tablet game pages use a compact sticky mini-nav linking to:

- Brief
- Personnel
- Armory
- Threats
- Locations

Additional sections may appear below without joining the sticky nav.

On mobile, the nav becomes horizontally scrollable or a compact non-sticky row if sticky behavior would consume too much viewport height.

### Incident Brief

Displays the game overview, incident metadata, setting, and concise fact blocks. It should read like an incident report, not a Wikipedia article.

### Personnel

Resolve `characterIds` against `characters` and show linked personnel cards. Existing character dossier URLs remain the destination for deeper character records.

### Armory

Resolve weapons associated with the selected game. Reuse the weapon visual language from the homepage, but allow a tighter game-specific grid.

### Threats

Resolve related B.O.W.s. Reuse containment-card styling where possible rather than inventing a second visual system.

### Pathogens

Show related pathogen records with the established specimen/lab styling.

### Locations

Show game-relevant locations and imagery. Missing imagery must fall back gracefully.

### Timeline / Files

Where a game has game-specific event or incident facts, render them as concise archive records. The first implementation may use `incidentFacts[]` rather than creating a second complex timeline subsystem.

### Related Archive

End each game page with links back to the main archive and selected related game records when relationships are obvious and available.

## Visual Language

Keep the current black/red survival-horror identity while letting each game page gain visual character through its hero media and metadata.

Use:

- red emergency lighting accents
- CRT/scanline overlays
- subtle surveillance texture
- restrained terminal flicker
- high-contrast condensed typography
- dark equipment-locker styling for weapons
- thin technical borders/readouts
- short red targeting sweep on weapon hover

Do not create twelve unrelated visual themes. Consistency is more important than per-title novelty.

## Motion and Interaction

Desktop/fine pointer:

- subtle hero parallax only if it does not harm readability
- existing game-card tilt may remain
- weapon hover targeting sweep
- short section reveal transitions

Touch/mobile:

- no tilt
- no cursor-follow effects
- no hover-only content
- maintain at least comfortable touch targets

Reduced motion:

- bypass parallax and nonessential transitions
- retain all content and navigation

Audio/video:

- no autoplay audio
- no autoplay video required for Stage 3

## Accessibility

- All interactive game cards must be keyboard reachable.
- Filter controls use actual buttons and clear active states.
- Sticky navigation links target real section IDs.
- Images receive useful alt text where informative; decorative overlays remain hidden from assistive tech.
- No critical content may exist only in an animation, hover state, or background image.
- Invalid `?id=` states must remain readable and navigable.
- Preserve `prefers-reduced-motion` support.

## Performance

The site remains a static Vercel deployment.

- Lazy-load below-the-fold images.
- Avoid large background videos.
- Keep page-specific scripts small.
- Reuse existing CSS modules and add a Stage 3 stylesheet only if that reduces risk/duplication.
- Do not add a JavaScript framework, bundler, database, auth system, or runtime API.

## Proposed Files

New:

- `game.html`
- `game.js`
- optional `stage3.css` or `game.css` if separation is cleaner
- Stage 3 tests under `tests/`

Modified:

- `data.js`
- `index.html`
- `app.js`
- stylesheet entry/imports and responsive CSS as needed
- `README.md`

Existing character dossier files remain in place.

## Error Handling

### Unknown game IDs

`game.js` must validate the requested ID before accessing fields. Unknown records render a controlled archive error with a return link.

### Missing relations

A missing relation should omit that card or section safely. One malformed relationship must not stop the rest of the page from rendering.

### Missing images

Use the existing fallback pattern or an equivalent reusable helper. Broken external images must not collapse card dimensions or cover text.

### Storage/network independence

Stage 3 does not require login, localStorage, external APIs, or server state to render core content.

## Testing Strategy

Use Node’s built-in test runner and follow test-first implementation.

Required coverage:

1. `data.js` exposes `weapons` with meaningful initial coverage.
2. Every weapon `gameIds[]` entry points to an existing game.
3. Every weapon `characterIds[]` entry points to an existing character.
4. Game relationship arrays point only to existing records.
5. `game.html` loads `data.js` and `game.js` and provides required render roots.
6. `game.js` reads `URLSearchParams` and handles unknown IDs safely.
7. Homepage game cards link to `game.html?id=...`.
8. Armory filters and weapon rendering hooks exist.
9. Existing site smoke tests remain green.
10. Existing mobile runtime regression remains green.
11. Existing game-media regression remains green.
12. `node --check` passes for all JavaScript files touched or added.

Manual/browser verification after deployment should confirm:

- homepage remains fully usable on desktop and mobile
- mobile menu still works
- game links open the correct records
- sticky game navigation does not hide headings
- armory filter chips work on touch widths
- broken-image fallback does not distort layout
- no console errors on the homepage or game page

## Acceptance Criteria

Stage 3 is complete when:

- the homepage includes a functional, filterable Armory Archive
- all existing game cards link into reusable individual game archive pages
- game pages render shared personnel, weapons, threats, pathogens, and locations from `data.js`
- relationships are ID-driven rather than duplicated page content
- invalid game IDs fail gracefully
- desktop and mobile layouts are both usable
- reduced-motion behavior remains supported
- existing V2 features continue working
- automated tests and syntax checks pass
- Vercel production deployment is verified after implementation

## Explicit Non-Goals for This Stage

- no user accounts
- no backend/database
- no weapon stat calculator
- no inventory simulator
- no weapon-vs-weapon comparison tool
- no comment/community system
- no framework migration
- no autoplay audio/video
- no copied proprietary game maps

These can be considered later only if they serve a clear user goal.