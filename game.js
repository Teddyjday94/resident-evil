(() => {
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const getRequestedGameId = (search) => {
    const params = new URLSearchParams(search || '');
    const id = params.get('id');
    return id && id.trim() ? id.trim() : null;
  };
  const resolveGame = (data, id) => id && data?.games ? data.games.find((game) => game.id === id) || null : null;
  const resolveMany = (records, ids) => {
    if (!Array.isArray(records) || !Array.isArray(ids)) return [];
    const byId = new Map(records.filter((record) => record?.id).map((record) => [record.id, record]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  };

  const bindImageFallbacks = (root) => {
    root.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.addEventListener('error', () => {
        const wrapper = img.parentElement;
        if (!wrapper) return;
        img.remove();
        wrapper.classList.add('media-fallback');
        wrapper.textContent = 'MEDIA UNAVAILABLE';
      }, { once:true });
    });
  };

  const imageMarkup = (src, alt, position = '50% 50%') => src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" style="object-position:${esc(position)}" loading="lazy" data-fallback>`
    : `<span class="media-fallback">MEDIA UNAVAILABLE</span>`;

  const renderNotFound = (root) => {
    root.innerHTML = `<section class="game-not-found"><div class="container"><div class="eyebrow">Archive lookup failed</div><h1>Record not found</h1><p>The requested incident file does not exist or no game ID was supplied.</p><a class="btn primary" href="index.html#games">Return to archive</a></div></section>`;
  };

  const renderGame = (root, data, game) => {
    const personnel = resolveMany(data.characters, game.characterIds);
    const weapons = resolveMany(data.weapons || [], game.weaponIds);
    const threats = resolveMany(data.bows, game.bowIds);
    const pathogens = resolveMany(data.pathogens, game.pathogenIds);
    const locations = resolveMany(data.locations, game.locationIds);
    const primaryThreat = threats[0]?.name || 'Variable';
    const primaryPathogen = pathogens[0]?.name || 'Classified';
    const relatedGames = (data.games || []).filter((candidate) => candidate.id !== game.id && (
      candidate.characterIds?.some((id) => game.characterIds?.includes(id)) ||
      candidate.pathogenIds?.some((id) => game.pathogenIds?.includes(id))
    )).slice(0, 4);

    document.title = `${game.title} // Biohazard Archive`;
    root.innerHTML = `
      <header class="game-hero">
        <div class="game-hero-media">${imageMarkup(game.heroImage || game.image, `${game.title} archive artwork`, game.heroPosition || game.imagePosition)}</div>
        <div class="game-hero-shade"></div>
        <div class="container game-hero-copy">
          <div class="eyebrow">Incident file // ${esc(game.code)}</div>
          <h1>${esc(game.title)}</h1>
          <p>${esc(game.overview || game.summary)}</p>
          <div class="game-base-meta"><span>${esc(game.release || game.year)}</span><span>${esc(game.setting || game.era)}</span></div>
          <div class="game-hud" aria-label="Incident summary">
            <div><small>Status</small><strong>Archived</strong></div>
            <div><small>Primary threat</small><strong>${esc(primaryThreat)}</strong></div>
            <div><small>Pathogen</small><strong>${esc(primaryPathogen)}</strong></div>
            <div><small>Clearance</small><strong>Red</strong></div>
          </div>
        </div>
      </header>
      <nav class="game-mini-nav" aria-label="Game record sections">
        <div class="container"><a href="#brief">Brief</a><a href="#personnel">Personnel</a><a href="#armory">Armory</a><a href="#threats">Threats</a><a href="#locations">Locations</a></div>
      </nav>
      <section id="brief" class="game-section"><div class="container game-section-grid"><div><div class="eyebrow">Incident brief</div><h2>${esc(game.era)}</h2></div><div><p class="game-lede">${esc(game.overview || game.summary)}</p><div class="fact-grid">${(game.incidentFacts || []).map((fact, index) => `<article><small>File ${String(index + 1).padStart(2,'0')}</small><p>${esc(fact)}</p></article>`).join('')}</div></div></div></section>
      <section id="personnel" class="game-section dark-panel"><div class="container"><div class="game-section-head"><div class="eyebrow">Personnel</div><h2>Known operatives</h2></div><div class="record-grid personnel-grid">${personnel.length ? personnel.map((person) => `<article class="record-card"><div class="record-media">${imageMarkup(person.image, `${person.name} reference image`, person.imagePosition)}</div><div class="record-copy"><small>${esc(person.file)}</small><h3>${esc(person.name)}</h3><p>${esc(person.role)}</p><a href="dossier.html?id=${encodeURIComponent(person.id)}">Open dossier →</a></div></article>`).join('') : '<p class="empty-record">No personnel records linked.</p>'}</div></div></section>
      <section id="armory" class="game-section"><div class="container"><div class="game-section-head"><div class="eyebrow">Armory</div><h2>Recovered equipment</h2></div><div class="record-grid weapon-record-grid">${weapons.length ? weapons.map((weapon) => `<article class="record-card weapon-record"><div class="record-media">${imageMarkup(weapon.image, `${weapon.name} weapon reference`, weapon.imagePosition)}</div><div class="record-copy"><small>${esc(weapon.class)} // ${esc(weapon.ammo)}</small><h3>${esc(weapon.name)}</h3><p>${esc(weapon.summary)}</p></div></article>`).join('') : '<p class="empty-record">No armory records linked.</p>'}</div></div></section>
      <section id="threats" class="game-section dark-panel"><div class="container"><div class="game-section-head"><div class="eyebrow">Threat monitor</div><h2>Known B.O.W.s</h2></div><div class="data-grid">${threats.length ? threats.map((bow) => `<article class="data-card"><small>${esc(bow.code)} // ${esc(bow.threat)}</small><h3>${esc(bow.name)}</h3><p>${esc(bow.summary)}</p><div class="data-line"><span>${esc(bow.type)}</span><span>${esc(bow.source)}</span></div></article>`).join('') : '<p class="empty-record">No B.O.W. files linked.</p>'}</div></div></section>
      <section id="pathogens" class="game-section"><div class="container"><div class="game-section-head"><div class="eyebrow">Pathogen research</div><h2>Contamination vectors</h2></div><div class="data-grid">${pathogens.length ? pathogens.map((pathogen) => `<article class="data-card pathogen-record"><small>${esc(pathogen.code)}</small><h3>${esc(pathogen.name)}</h3><p>${esc(pathogen.text)}</p><div class="data-line"><span>${esc(pathogen.family)}</span><span>Level ${esc(pathogen.level)}</span></div></article>`).join('') : '<p class="empty-record">No pathogen files linked.</p>'}</div></div></section>
      <section id="locations" class="game-section dark-panel"><div class="container"><div class="game-section-head"><div class="eyebrow">Incident locations</div><h2>Known sites</h2></div><div class="record-grid location-record-grid">${locations.length ? locations.map((location) => `<article class="record-card location-record"><div class="record-media">${imageMarkup(location.image, `${location.name} location reference`)}</div><div class="record-copy"><small>${esc(location.code)}</small><h3>${esc(location.name)}</h3><p>${esc(location.note)}</p></div></article>`).join('') : '<p class="empty-record">No location files linked.</p>'}</div></div></section>
      <section id="files" class="game-section"><div class="container"><div class="game-section-head"><div class="eyebrow">Incident files</div><h2>Recovered timeline</h2></div><div class="file-stack">${(game.incidentFacts || []).map((fact, index) => `<article><span>${String(index + 1).padStart(2,'0')}</span><p>${esc(fact)}</p></article>`).join('')}</div>${relatedGames.length ? `<div class="related-archive"><div class="eyebrow">Related archive</div>${relatedGames.map((related) => `<a href="game.html?id=${encodeURIComponent(related.id)}"><span>${esc(related.code)}</span>${esc(related.title)}</a>`).join('')}</div>` : ''}</div></section>
    `;
    bindImageFallbacks(root);
  };

  window.RE_GAME_TEST = { getRequestedGameId, resolveGame, resolveMany };

  if (typeof document === 'undefined') return;
  const root = document.querySelector('#gameRoot');
  if (!root) return;
  const id = getRequestedGameId(location.search);
  const game = resolveGame(window.RE_ARCHIVE, id);
  if (!game) { renderNotFound(root); return; }
  renderGame(root, window.RE_ARCHIVE, game);
})();
