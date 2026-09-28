(() => {
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const getRequestedGameId = (search) => {
    const params = new URLSearchParams(search || '');
    const id = params.get('id');
    return id && id.trim() ? id.trim() : null;
  };
  const resolveGame = (data, id) => id && data?.games ? data.games.find((game) => game.id === id) || null : null;

  const renderNotFound = (root) => {
    root.innerHTML = `<section class="game-not-found"><div class="container"><div class="eyebrow">Archive lookup failed</div><h1>Record not found</h1><p>The requested incident file does not exist or no game ID was supplied.</p><a class="btn primary" href="index.html#games">Return to archive</a></div></section>`;
  };

  const renderBaseGame = (root, game) => {
    document.title = `${game.title} // Biohazard Archive`;
    root.innerHTML = `<header class="game-hero"><div class="game-hero-media" style="background-image:url('${esc(game.heroImage || game.image || '')}');background-position:${esc(game.heroPosition || game.imagePosition || '50% 50%')}"></div><div class="game-hero-shade"></div><div class="container game-hero-copy"><div class="eyebrow">Incident file // ${esc(game.code)}</div><h1>${esc(game.title)}</h1><p>${esc(game.overview || game.summary)}</p><div class="game-base-meta"><span>${esc(game.release || game.year)}</span><span>${esc(game.setting || game.era)}</span></div><a class="btn" href="index.html#games">Return to archive</a></div></header>`;
  };

  window.RE_GAME_TEST = { getRequestedGameId, resolveGame };

  if (typeof document === 'undefined') return;
  const root = document.querySelector('#gameRoot');
  if (!root) return;
  const id = getRequestedGameId(location.search);
  const game = resolveGame(window.RE_ARCHIVE, id);
  if (!game) { renderNotFound(root); return; }
  renderBaseGame(root, game);
})();
