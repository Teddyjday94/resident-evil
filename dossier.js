(() => {
  const root = document.querySelector('#dossierRoot');
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'leon';
  const character = window.RE_ARCHIVE.characters.find(c => c.id === id) || window.RE_ARCHIVE.characters[0];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  document.title = `${character.name} // Biohazard Archive`;
  const initials = character.name.split(' ').map(n => n[0]).join('').slice(0,2);
  root.innerHTML = `<article class="dossier-layout"><div class="dossier-visual">${character.image ? `<img src="${esc(character.image)}" alt="${esc(character.name)} reference image" style="object-position:${esc(character.imagePosition || '50% 50%')}">` : `<div class="portrait-fallback" aria-hidden="true">${esc(initials)}</div>`}</div><div class="dossier-copy"><div class="dossier-overline">PERSONNEL FILE // ${esc(character.file)}</div><h1>${esc(character.name)}</h1><div class="dossier-role">${esc(character.role)}</div><p class="dossier-summary">${esc(character.summary)}</p><p class="dossier-bio">${esc(character.bio)}</p><div class="dossier-facts"><div class="dossier-fact"><small>Status</small><strong>${esc(character.status)}</strong></div><div class="dossier-fact"><small>First record</small><strong>${esc(character.first)}</strong></div><div class="dossier-fact"><small>File ID</small><strong>${esc(character.file)}</strong></div></div><div class="dossier-lists"><div><h2>Known incidents</h2><ul>${character.incidents.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h2>Affiliations</h2><ul>${character.affiliations.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div></div></article>`;
  const img = root.querySelector('img');
  if (img) img.addEventListener('error', () => { const parent = img.parentElement; img.remove(); parent.classList.add('img-fallback'); parent.textContent = character.name.toUpperCase(); }, { once:true });
})();