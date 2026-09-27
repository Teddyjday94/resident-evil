(() => {
  const data = window.RE_ARCHIVE;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const escapeText = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const fallbackImage = (img, label) => {
    img.addEventListener('error', () => {
      const wrapper = img.parentElement;
      if (!wrapper) return;
      img.remove();
      wrapper.classList.add('img-fallback');
      wrapper.textContent = label || 'MEDIA UNAVAILABLE';
    }, { once:true });
  };

  const gameGrid = q('#gameGrid');
  data.games.forEach((game, index) => {
    const el = document.createElement('article');
    el.className = 'game-card reveal searchable';
    el.dataset.search = [game.title, game.year, game.era, game.summary, ...game.tags].join(' ').toLowerCase();
    el.style.setProperty('--x', `${22 + (index % 4) * 18}%`);
    el.style.setProperty('--accent', index % 3 === 0 ? 'rgba(170,0,0,.55)' : index % 3 === 1 ? 'rgba(90,25,25,.5)' : 'rgba(130,65,10,.38)');
    el.innerHTML = `<div class="game-code">${escapeText(game.code)}</div><div class="game-content"><div class="game-meta">INCIDENT // ${escapeText(game.year)} // ${escapeText(game.era)}</div><h3>${escapeText(game.title)}</h3><p>${escapeText(game.summary)}</p><div class="tag-row">${game.tags.slice(0,3).map(t => `<span class="tag">${escapeText(t)}</span>`).join('')}</div></div>`;
    gameGrid.appendChild(el);
  });

  const characterGrid = q('#characterGrid');
  data.characters.forEach((character) => {
    const el = document.createElement('article');
    el.className = 'character-card reveal searchable';
    el.dataset.search = [character.name, character.role, character.summary, ...character.incidents, ...character.affiliations].join(' ').toLowerCase();
    const initials = character.name.split(' ').map(n => n[0]).join('').slice(0,2);
    el.innerHTML = `<div class="character-photo">${character.image ? `<img src="${escapeText(character.image)}" alt="${escapeText(character.name)} reference image" style="object-position:${escapeText(character.imagePosition || '50% 50%')}" loading="lazy">` : `<div class="portrait-fallback" aria-hidden="true">${escapeText(initials)}</div>`}</div><div class="character-body"><div class="file-code">FILE // ${escapeText(character.file)}</div><h3>${escapeText(character.name)}</h3><div class="role">${escapeText(character.role)}</div><p>${escapeText(character.summary)}</p><a class="dossier-link" href="dossier.html?id=${encodeURIComponent(character.id)}">Open dossier →</a></div>`;
    const img = q('img', el); if (img) fallbackImage(img, character.name.toUpperCase());
    characterGrid.appendChild(el);
  });

  const bowGrid = q('#bowGrid');
  const renderBows = (filter = 'all') => {
    bowGrid.innerHTML = '';
    data.bows.filter(b => filter === 'all' || b.threat === filter).forEach((bow) => {
      const el = document.createElement('article');
      el.className = 'bow-card reveal searchable';
      el.dataset.search = [bow.name, bow.type, bow.threat, bow.source, bow.debut].join(' ').toLowerCase();
      el.innerHTML = `<div class="bow-top"><span>${escapeText(bow.code)}</span><span class="threat ${bow.threat.toLowerCase()}">${escapeText(bow.threat)} THREAT</span></div><div class="bow-symbol" aria-hidden="true">${escapeText(bow.code.slice(-3))}</div><h3>${escapeText(bow.name)}</h3><p>${escapeText(bow.summary)}</p><div class="bow-foot"><span>${escapeText(bow.type)}</span><span>${escapeText(bow.source)}</span></div>`;
      bowGrid.appendChild(el);
    });
    observeReveals();
  };
  renderBows();
  qa('[data-bow-filter]').forEach(btn => btn.addEventListener('click', () => {
    qa('[data-bow-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBows(btn.dataset.bowFilter);
  }));

  const mapHotspots = q('#mapHotspots');
  const mapReadout = q('#mapReadout');
  const showMapPoint = (point, button) => {
    qa('.map-hotspot').forEach(b => b.classList.toggle('active', b === button));
    mapReadout.innerHTML = `<div class="readout-code">RC // ${escapeText(point.id.toUpperCase())}</div><h3>${escapeText(point.title)}</h3><div class="risk-line"><span>RISK</span><strong>${escapeText(point.risk)}</strong></div><p>${escapeText(point.text)}</p><div class="readout-bars"><span></span><span></span><span></span><span></span><span></span></div>`;
  };
  data.mapPoints.forEach((point, index) => {
    const button = document.createElement('button');
    button.className = `map-hotspot${index === 0 ? ' active' : ''}`;
    button.style.left = `${point.x}%`; button.style.top = `${point.y}%`;
    button.dataset.label = point.label;
    button.setAttribute('aria-label', `Inspect ${point.title}`);
    button.addEventListener('click', () => showMapPoint(point, button));
    mapHotspots.appendChild(button);
  });

  const timelineGrid = q('#timelineGrid');
  data.timeline.forEach((event) => {
    const el = document.createElement('article'); el.className = 'event reveal searchable';
    el.dataset.search = [event.year,event.title,event.text].join(' ').toLowerCase();
    el.innerHTML = `<div class="event-year">${escapeText(event.year)}</div><div class="event-body"><h3>${escapeText(event.title)}</h3><p>${escapeText(event.text)}</p></div>`;
    timelineGrid.appendChild(el);
  });

  const pathogenGrid = q('#pathogenGrid');
  data.pathogens.forEach((p) => {
    const el = document.createElement('article'); el.className = 'pathogen-card reveal searchable';
    el.dataset.search = [p.name,p.family,p.level,p.text].join(' ').toLowerCase();
    el.innerHTML = `<div class="specimen-orb" aria-hidden="true"></div><div class="pathogen-code">${escapeText(p.code)}</div><h3>${escapeText(p.name)}</h3><div class="pathogen-family">${escapeText(p.family)} // LEVEL ${escapeText(p.level)}</div><p>${escapeText(p.text)}</p>`;
    pathogenGrid.appendChild(el);
  });

  const factionGrid = q('#factionGrid');
  data.factions.forEach((f) => {
    const el = document.createElement('article'); el.className = 'faction-card reveal searchable';
    el.dataset.search = [f.name,f.text].join(' ').toLowerCase();
    el.innerHTML = `<div class="stamp">${escapeText(f.abbr)}</div><h3>${escapeText(f.name)}</h3><p>${escapeText(f.text)}</p>`;
    factionGrid.appendChild(el);
  });

  const locationGrid = q('#locationGrid');
  data.locations.forEach((l) => {
    const el = document.createElement('article'); el.className = 'location-card reveal searchable';
    el.dataset.search = [l.code,l.name,l.note].join(' ').toLowerCase();
    el.innerHTML = `<div class="location-image" ${l.image ? `style="background-image:url('${escapeText(l.image)}')"` : ''}></div><div class="location-body"><small>${escapeText(l.code)}</small><h3>${escapeText(l.name)}</h3><p>${escapeText(l.note)}</p></div>`;
    locationGrid.appendChild(el);
  });

  const mediaGrid = q('#mediaGrid');
  data.media.forEach((m) => {
    const el = document.createElement('figure'); el.className = 'media-card reveal';
    el.innerHTML = `<img src="${escapeText(m.image)}" alt="${escapeText(m.title)}" loading="lazy"><figcaption class="media-caption"><strong>${escapeText(m.title)}</strong><span>${escapeText(m.credit)} // ${escapeText(m.source)}</span></figcaption>`;
    fallbackImage(q('img', el), 'MEDIA UNAVAILABLE');
    mediaGrid.appendChild(el);
  });

  var observer;
  function observeReveals() {
    if (reduceMotion || !('IntersectionObserver' in window)) { qa('.reveal').forEach(el => el.classList.add('show')); return; }
    if (!observer) observer = new IntersectionObserver((entries) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } }), { threshold:.1 });
    qa('.reveal:not(.show)').forEach(el => observer.observe(el));
  }
  observeReveals();

  const archiveSearch = q('#archiveSearch');
  const resultCount = q('#resultCount');
  archiveSearch.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();
    let visibleGames = 0;
    qa('.searchable').forEach(el => {
      const match = !term || (el.dataset.search || '').includes(term);
      el.hidden = !match;
      if (match && el.classList.contains('game-card')) visibleGames += 1;
    });
    resultCount.textContent = term ? `${visibleGames} GAME MATCH${visibleGames === 1 ? '' : 'ES'}` : `${data.games.length} RECORDS`;
  });

  q('#scannerBtn').addEventListener('click', (event) => {
    document.body.classList.toggle('scanner');
    event.currentTarget.textContent = document.body.classList.contains('scanner') ? 'Disable scanner' : 'Toggle scanner';
  });

  const menuBtn = q('#menuBtn'); const mobilePanel = q('#mobilePanel');
  menuBtn.addEventListener('click', () => { const open = mobilePanel.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
  qa('a', mobilePanel).forEach(a => a.addEventListener('click', () => { mobilePanel.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); }));

  if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
    document.addEventListener('pointermove', (event) => {
      qa('.game-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
          const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5;
          card.style.transform = `perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-6px)`;
        } else card.style.transform = '';
      });
    });
  }
})();