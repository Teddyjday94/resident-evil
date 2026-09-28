# Resident Evil // Biohazard Archive

An unofficial, non-commercial Resident Evil fan-site and portfolio practice project built as a dependency-free static site.

## Stage 3 features

- Cinematic Raccoon City homepage with surveillance styling
- Searchable database covering 12 major Resident Evil game records
- Clickable game cards that open reusable `game.html?id=<game-id>` incident pages
- Cross-linked game pages for incident briefs, personnel, weapons, B.O.W.s, pathogens, locations and recovered files
- Filterable Armory Archive with 28 shared weapon records, class filters and expandable equipment details
- Data-driven character cards and shareable character dossier pages
- B.O.W. containment database with threat-level filters
- Interactive stylized Raccoon City incident map
- Expanded outbreak timeline and pathogen archive
- Organizations, factions and incident locations
- Scanner mode, scroll reveals and pointer-reactive desktop cards
- Responsive mobile navigation, horizontal filter/mini-nav rows and reduced-motion support
- Graceful image fallbacks so missing external references do not break layouts

## Project structure

- `index.html` — main archive experience and Armory Archive
- `game.html` / `game.js` / `game.css` — reusable individual-game archive route and rendering
- `dossier.html` / `dossier.js` — reusable character dossier page
- `data.js` — canonical `window.RE_ARCHIVE` data and relationships
- `app.js` — homepage rendering and interactions
- `styles.css` — homepage stylesheet entry point
- `styles-base.css`, `styles-modules.css`, `styles-adaptive.css` — modular shared styles
- `armory.css` — homepage equipment/weapon styling
- `bow-media.css` — B.O.W. media treatment
- `tests/` — Node built-in regression, relation, media, Armory and game-page tests

## Data relationships

Archive records use stable IDs. Game records reference related content through arrays such as:

- `characterIds`
- `bowIds`
- `pathogenIds`
- `locationIds`
- `weaponIds`

Weapon records use `gameIds` and `characterIds`. When adding a game or weapon, use an existing stable ID or add the corresponding record first; `tests/archive-relations.test.mjs` validates referential integrity.

## Routes

Homepage:

```text
/index.html
```

Individual game record:

```text
/game.html?id=re2r
/game.html?id=re4r
```

Missing or unknown `id` values render a controlled record-not-found state rather than silently opening another game.

Character dossier:

```text
/dossier.html?id=leon
```

## Run locally

No package install or build step is required. Serve the repository from its root, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Verify

```bash
node --test tests/*.test.mjs
node --check data.js
node --check app.js
node --check dossier.js
node --check game.js
```

## Deploy to Vercel

Import the repository into Vercel as a static/Other project. No build command or environment variables are required.

## Media note

This practice site uses external visual references from official/credible and community sources where practical. External images use graceful fallbacks so a blocked or unavailable source does not collapse the archive layout.

## Disclaimer

This is an unofficial fan/practice project and is not affiliated with or endorsed by Capcom. Resident Evil and related characters, artwork, names and trademarks belong to their respective rights holders.
