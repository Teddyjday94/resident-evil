(() => {
  const factionMeta = {
    'Umbrella Corporation': { slug:'umbrella', type:'Pharmaceutical / Bioweapons', scope:'Global operations', status:'Legacy organization' },
    'S.T.A.R.S.': { slug:'stars', type:'Special tactics unit', scope:'Raccoon City', status:'R.P.D. division' },
    'B.S.A.A.': { slug:'bsaa', type:'Counter-bioterror alliance', scope:'International', status:'Rapid-response network' },
    'R.P.D.': { slug:'rpd', type:'Municipal law enforcement', scope:'Raccoon City', status:'1998 incident archive' },
    'TerraSave': { slug:'terrasave', type:'Humanitarian NGO', scope:'Bioterror relief', status:'Civilian support network' }
  };
  const pathogenMeta = {
    'T-Virus': { slug:'t-virus', origin:'Progenitor-derived / Umbrella', transmission:'Fluid exposure / contamination', effect:'Necrosis, mutation, B.O.W. adaptation', status:'LEVEL RED // MASS OUTBREAK POTENTIAL' },
    'G-Virus': { slug:'g-virus', origin:'William Birkin / Umbrella', transmission:'Bloodstream / embryo implantation', effect:'Extreme regeneration and uncontrolled evolution', status:'LEVEL CRIMSON // UNSTABLE GENETIC CASCADE' },
    'Las Plagas': { slug:'las-plagas', origin:'Parasitic organism / rural Spain', transmission:'Parasite implantation', effect:'Neural control with host cognition retained', status:'LEVEL AMBER // HOST CONTROL RISK' },
    'Uroboros': { slug:'uroboros', origin:'Progenitor-derived / Tricell', transmission:'Direct exposure / injection', effect:'Aggressive assimilation and tendril growth', status:'LEVEL BLACK // CATASTROPHIC HOST REJECTION' },
    'C-Virus': { slug:'c-virus', origin:'Engineered viral weapon', transmission:'Injection / aerosolized delivery', effect:'Chrysalid mutation and rapid transformation', status:'LEVEL ORANGE // WEAPONIZED MUTATION EVENT' },
    'Mutamycete': { slug:'mutamycete', origin:'Fungal megamycete network', transmission:'Mold contact / biological integration', effect:'Regeneration and shared neural memory', status:'LEVEL WHITE // NETWORKED FUNGAL CONTAMINATION' }
  };

  document.querySelectorAll('#factionGrid .faction-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim();
    const meta = factionMeta[title];
    if (!meta) return;
    card.dataset.faction = meta.slug;
    card.classList.add('faction-enhanced');
    const stamp = card.querySelector('.stamp');
    if (stamp) stamp.hidden = true;
    const emblem = document.createElement('div');
    emblem.className = 'faction-emblem';
    emblem.setAttribute('aria-hidden', 'true');
    const body = document.createElement('div');
    body.className = 'faction-meta';
    body.innerHTML = `<span>${meta.type}</span><span>${meta.scope}</span><span>${meta.status}</span>`;
    card.prepend(emblem);
    card.append(body);
  });

  document.querySelectorAll('#pathogenGrid .pathogen-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim();
    const meta = pathogenMeta[title];
    if (!meta) return;
    card.dataset.pathogen = meta.slug;
    card.classList.add('pathogen-enhanced');
    const orb = card.querySelector('.specimen-orb');
    if (orb) orb.remove();
    const media = document.createElement('div');
    media.className = 'pathogen-media';
    media.innerHTML = `<span class="pathogen-scan"></span><span class="pathogen-media-label">SPECIMEN VISUAL // ${title.toUpperCase()}</span>`;
    const tags = document.createElement('div');
    tags.className = 'pathogen-tags';
    tags.innerHTML = `<span><small>ORIGIN</small>${meta.origin}</span><span><small>TRANSMISSION</small>${meta.transmission}</span><span><small>HOST EFFECT</small>${meta.effect}</span>`;
    const status = document.createElement('div');
    status.className = 'pathogen-status';
    status.textContent = meta.status;
    const code = card.querySelector('.pathogen-code');
    card.insertBefore(media, code || card.firstChild);
    const heading = card.querySelector('h3');
    if (heading) heading.insertAdjacentElement('afterend', tags);
    card.append(status);
  });
})();
