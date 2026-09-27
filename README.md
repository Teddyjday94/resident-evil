# Resident Evil // Biohazard Archive

An unofficial, non-commercial Resident Evil fan-site and portfolio practice project built as a dependency-free static site.

## V2 features

- Cinematic Raccoon City hero with surveillance styling
- Searchable database covering 12 major Resident Evil game records
- Data-driven character cards and shareable character dossier pages
- B.O.W. containment database with threat-level filters
- Interactive stylized Raccoon City incident map
- Expanded outbreak timeline
- Virus, parasite and fungal pathogen archive
- Organizations, factions and incident locations
- Credited Capcom-hosted community screenshot gallery
- Scanner mode, scroll reveals and pointer-reactive 3D cards
- Responsive mobile navigation and reduced-motion accessibility support
- Image fallbacks so missing external references do not break the layout

## Project structure

- `index.html` — main archive experience
- `dossier.html` — reusable character dossier page
- `data.js` — archive content and records
- `app.js` — homepage rendering and interactions
- `dossier.js` — character dossier rendering
- `styles.css` — stylesheet entry point
- `styles-base.css`, `styles-modules.css`, `styles-adaptive.css` — modular styles
- `tests/site-smoke.test.mjs` — static smoke tests

## Run locally

No package install or build step is required. Serve the repository from its root, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Verify

```bash
node --test tests/site-smoke.test.mjs
node --check app.js
node --check data.js
node --check dossier.js
```

## Deploy to Vercel

Import the repository into Vercel as a static/Other project. No build command or environment variables are required.

## Media note

This practice site references selected screenshots hosted by Capcom through Capcom Snapshots community posts and keeps attribution visible in the gallery. External image references use graceful fallbacks where possible.

## Disclaimer

This is an unofficial fan/practice project and is not affiliated with or endorsed by Capcom. Resident Evil and related characters, artwork, names and trademarks belong to their respective rights holders.