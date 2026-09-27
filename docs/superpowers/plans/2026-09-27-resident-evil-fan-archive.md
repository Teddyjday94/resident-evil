# Resident Evil Fan Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished, unofficial Resident Evil franchise practice website that can deploy directly from this repository to Vercel.

**Architecture:** Use a dependency-free static single-page site so an empty repository can deploy immediately without build tooling. Keep layout, animation, searchable archive data, responsive behavior, and visual effects in one `index.html` for the first pass, then split into assets/components only if the site grows.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript, Google Fonts.

**Spec:** Conversation brief for a cinematic Resident Evil practice/fan archive.

## Global Constraints

- Clearly identify the project as unofficial/fan-made.
- Use a cinematic survival-horror look without copying Capcom's exact website.
- Include games, character dossiers, timeline, pathogens/B.O.W. lore, locations, factions/lore references, and archive-style search.
- Use responsive layouts and motion that degrades cleanly on smaller screens.
- Avoid dependencies so Vercel can serve the repository directly.

## Review Focus

- Mobile layouts must not horizontally overflow.
- Search must hide/show archive cards correctly.
- Motion must remain readable and not obscure navigation/content.
- Empty or partial search strings must not break the layout.
- The page must remain usable if external font loading fails.

---

### Task 1: Static archive shell

**Files:**
- Create: `index.html`

- [ ] Add fixed archive navigation and cinematic hero.
- [ ] Add responsive game, character, timeline, pathogen, faction, and location sections.
- [ ] Add accessible buttons, anchors, headings, and unofficial fan-project disclaimer.
- [ ] Add CSS-only atmosphere, scanlines, red alert lighting, hover depth, and reveal motion.
- [ ] Add vanilla-JS archive search, scanner mode, mobile menu, and pointer-reactive cards.

### Task 2: Repository guidance

**Files:**
- Create: `README.md`

- [ ] Document local preview and Vercel deployment.
- [ ] Explain where to add future franchise images/media without breaking the base build.

### Verification

- [ ] Confirm repository root contains `index.html`.
- [ ] Confirm all internal section links target existing IDs.
- [ ] Confirm all script selectors reference elements present in the document.
- [ ] Confirm no build command or environment variable is required for Vercel.
