(() => {
  const factionMeta = {
    'Umbrella Corporation': { slug:'umbrella', type:'Pharmaceutical / Bioweapons', scope:'Global operations', status:'Legacy organization', logo:'https://upload.wikimedia.org/wikipedia/commons/a/a6/Umbrella_Corporation_logo_%28Simplified%29.svg' },
    'S.T.A.R.S.': { slug:'stars', type:'Special tactics unit', scope:'Raccoon City', status:'R.P.D. division', logo:'https://vignette.wikia.nocookie.net/residentevil/images/3/3e/STARS_Logo.png/revision/latest?cb=20150714205829&path-prefix=es' },
    'B.S.A.A.': { slug:'bsaa', type:'Counter-bioterror alliance', scope:'International', status:'Rapid-response network', logo:'https://image.api.playstation.com/cdn/UP0102/CUSA01068_00/4YdE68zTlG6cmJ2aoRMnFUpb359ZnLSU.png' },
    'R.P.D.': { slug:'rpd', type:'Municipal law enforcement', scope:'Raccoon City', status:'1998 incident archive', logo:'https://www.nicepng.com/png/full/959-9597947_super6props-super6props-super6props-super6props-super6props-resident-evil-rpd.png' },
    'TerraSave': { slug:'terrasave', type:'Humanitarian NGO', scope:'Bioterror relief', status:'Civilian support network', logo:'https://ih1.redbubble.net/image.377588515.1332/pp%2C504x498-pad%2C600x600%2Cf8f8f8.u2.jpg' }
  };
  const pathogenMeta = {
    'T-Virus': { slug:'t-virus', origin:'Progenitor-derived / Umbrella', transmission:'Fluid exposure / contamination', effect:'Necrosis, mutation, B.O.W. adaptation', status:'LEVEL RED // MASS OUTBREAK POTENTIAL', image:'assets/pathogens/t-virus.svg' },
    'G-Virus': { slug:'g-virus', origin:'William Birkin / Umbrella', transmission:'Bloodstream / embryo implantation', effect:'Extreme regeneration and uncontrolled evolution', status:'LEVEL CRIMSON // UNSTABLE GENETIC CASCADE', image:'assets/pathogens/g-virus.svg' },
    'Las Plagas': { slug:'las-plagas', origin:'Parasitic organism / rural Spain', transmission:'Parasite implantation', effect:'Neural control with host cognition retained', status:'LEVEL AMBER // HOST CONTROL RISK', image:'https://www.projectumbrella.net/uploads/1/3/0/6/130616230/erplaga025_orig.jpg' },
    'Uroboros': { slug:'uroboros', origin:'Progenitor-derived / Tricell', transmission:'Direct exposure / injection', effect:'Aggressive assimilation and tendril growth', status:'LEVEL BLACK // CATASTROPHIC HOST REJECTION', image:'https://vignette2.wikia.nocookie.net/evil/images/e/e8/The_Uroboros_Virus.jpg/revision/latest?cb=20160406184349' },
    'C-Virus': { slug:'c-virus', origin:'Engineered viral weapon', transmission:'Injection / aerosolized delivery', effect:'Chrysalid mutation and rapid transformation', status:'LEVEL ORANGE // WEAPONIZED MUTATION EVENT', image:'https://s.inside-games.jp/imgs/p/XDbCbghKzVCeRs9WXItNCQoLUAcGBQQDAgEA/298974.jpg?zoom=spacing' },
    'Mutamycete': { slug:'mutamycete', origin:'Fungal megamycete network', transmission:'Mold contact / biological integration', effect:'Regeneration and shared neural memory', status:'LEVEL WHITE // NETWORKED FUNGAL CONTAMINATION', image:'https://img.xboxachievements.com/images/monthly_2021_05/game/6865/11ddb105-493d-419b-b69c-66da488acc61-med.jpg' }
  };

  const useLocalFallback = (img, fallback) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = fallback;
    }, { once:false });
  };

  document.querySelectorAll('#factionGrid .faction-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim();
    const meta = factionMeta[title];
    if (!meta) return;
    card.dataset.faction = meta.slug;
    card.classList.add('faction-enhanced');
    const stamp = card.querySelector('.stamp');
    if (stamp) stamp.remove();
    const emblem = document.createElement('div');
    emblem.className = 'faction-emblem';
    const logo = document.createElement('img');
    logo.className = 'faction-logo';
    logo.src = meta.logo;
    logo.alt = `${title} emblem`;
    logo.loading = 'lazy';
    useLocalFallback(logo, `assets/organizations/${meta.slug}.svg`);
    emblem.appendChild(logo);
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
    const mediaImg = document.createElement('img');
    mediaImg.className = 'pathogen-media-image';
    mediaImg.src = meta.image;
    mediaImg.alt = `${title} specimen visual`;
    mediaImg.loading = 'lazy';
    useLocalFallback(mediaImg, `assets/pathogens/${meta.slug}.svg`);
    const scan = document.createElement('span');
    scan.className = 'pathogen-scan';
    const mediaLabel = document.createElement('span');
    mediaLabel.className = 'pathogen-media-label';
    mediaLabel.textContent = `SPECIMEN VISUAL // ${title.toUpperCase()}`;
    media.append(mediaImg, scan, mediaLabel);
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
