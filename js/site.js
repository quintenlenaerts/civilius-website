(() => {
  const DATA_URL = 'data/site.json';

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const getPage = () => document.body.dataset.page || '';

  async function loadData() {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load ${DATA_URL} (${response.status})`);
    return response.json();
  }

  function renderHeader(data) {
    const host = document.querySelector('[data-site-header]');
    if (!host) return;
    const page = getPage();
    const nav = data.navigation.map(item => {
      const active = item.url.startsWith(page) || (page === 'game' && item.url === 'games.html');
      return `<a class="${active ? 'active' : ''}" href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`;
    }).join('');

    host.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="index.html" aria-label="${escapeHtml(data.site.name)} home">
            <img src="${escapeHtml(data.site.logo)}" alt="${escapeHtml(data.site.name)}">
          </a>
          <div class="nav-wrap">
            <nav class="main-nav" aria-label="Main navigation">${nav}</nav>
            <div class="social-links">
              <a href="${escapeHtml(data.site.socials.discord)}" target="_blank" rel="noreferrer">Discord</a>
              <a href="${escapeHtml(data.site.socials.steam)}" target="_blank" rel="noreferrer">Steam</a>
            </div>
          </div>
        </div>
      </header>`;
  }

  function renderFooter(data) {
    const host = document.querySelector('[data-site-footer]');
    if (!host) return;
    const columns = data.footer.columns.map(column => `
      <div class="footer-col">
        <strong>${escapeHtml(column.title)}</strong>
        ${column.links.map(link => `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`).join('')}
      </div>`).join('');

    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="${escapeHtml(data.site.logo)}" alt="${escapeHtml(data.site.name)}">
              <p>${escapeHtml(data.site.description)}</p>
            </div>
            ${columns}
          </div>
          <div class="footer-bottom">${escapeHtml(data.site.copyright)}</div>
        </div>
      </footer>`;
  }

  function renderHome(data) {
    const host = document.querySelector('[data-home]');
    if (!host) return;
    const game = data.games.find(g => g.id === data.landing.featuredGame) || data.games[0];
    if (!game) return;
    host.innerHTML = `
      <section class="landing-hero">
<img
    class="hero-fallback"
    src="${escapeHtml(game.landingPoster)}"
    alt=""
>

<video
    autoplay
    muted
    loop
    playsinline
    poster="${escapeHtml(game.landingPoster)}"
>
    <source
        src="${escapeHtml(game.landingVideo)}"
        type="video/mp4"
    >
</video>
        <div class="hero-copy">
          <img src="${escapeHtml(game.logo)}" alt="${escapeHtml(game.title)}">
          <p>${escapeHtml(game.shortDescription)}</p>
          <div class="btn-row">
            <a class="btn btn-primary" href="game.html?id=${encodeURIComponent(game.id)}">Learn more</a>
            <a class="btn" href="${escapeHtml(game.steamUrl)}" target="_blank" rel="noreferrer">View on Steam</a>
          </div>
        </div>
      </section>`;
  }

  function renderGames(data) {
    const host = document.querySelector('[data-games]');
    if (!host) return;
    host.innerHTML = data.games.map(game => `
      <article class="game-row">
        <img class="game-row-image" src="${escapeHtml(game.cardImage)}" alt="${escapeHtml(game.title)}">
        <div class="game-row-info">
          <h2>${escapeHtml(game.title)}</h2>
          <p>${escapeHtml(game.status)}</p>
          <div class="btn-row">
            <a class="btn btn-primary" href="game.html?id=${encodeURIComponent(game.id)}">View</a>
            <a class="btn" href="${escapeHtml(game.steamUrl)}" target="_blank" rel="noreferrer">Steam</a>
          </div>
        </div>
      </article>`).join('');
  }

  function youtubeEmbed(url) {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      let id = '';
      if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1);
      if (parsed.hostname.includes('youtube.com')) id = parsed.searchParams.get('v') || '';
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : '';
    } catch { return ''; }
  }

  function renderGame(data) {
    const host = document.querySelector('[data-game]');
    if (!host) return;
    const id = new URLSearchParams(window.location.search).get('id') || data.games[0]?.id;
    const game = data.games.find(g => g.id === id);
    if (!game) {
      host.innerHTML = '<div class="error-box"><strong>Game not found.</strong><br>Check the game id in the URL and in <code>data/site.json</code>.</div>';
      return;
    }
    document.title = `${game.title} — ${data.site.name}`;
    const embed = youtubeEmbed(game.trailerUrl);
    const trailer = embed
      ? `<iframe src="${escapeHtml(embed)}" title="${escapeHtml(game.title)} trailer" allowfullscreen></iframe>`
      : `<div class="trailer-placeholder"><strong>Trailer</strong><br> i still gotta add a trailer gimme a sec  <code>trailerUrl</code> in <code>data/site.json</code>.</div>`;

    host.innerHTML = `
      <section class="game-hero">
        <img class="hero-bg" src="${escapeHtml(game.heroImage)}" alt="${escapeHtml(game.title)}">
        <img class="game-hero-logo" src="${escapeHtml(game.logo)}" alt="${escapeHtml(game.title)}">
      </section>
      <div class="container game-detail">
        <div class="media-store-grid">
          <div class="trailer-box">${trailer}</div>
          <aside class="store-card">
            <img src="${escapeHtml(game.steamCardImage)}" alt="${escapeHtml(game.title)} store artwork">
            <div class="store-card-body">
              <h2>${escapeHtml(game.title)}</h2>
              <p>${escapeHtml(game.shortDescription)}</p>
              <div class="meta-list">
                ${game.storeMeta.map(row => `<div class="meta-row"><span>${escapeHtml(row.label)}</span><span>${escapeHtml(row.value)}</span></div>`).join('')}
              </div>
              <a class="btn btn-primary" href="${escapeHtml(game.steamUrl)}" target="_blank" rel="noreferrer">View on Steam</a>
            </div>
          </aside>
        </div>
        <section class="content-section">
          <h2>About the game</h2>
          ${game.description.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
        </section>
        <section class="screenshots">
          <h2>Screenshots</h2>
          <div class="screenshot-grid">
            ${game.screenshots.map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(game.title)} screenshot ${index + 1}">`).join('')}
          </div>
        </section>
      </div>`;
  }

  function renderAbout(data) {
    const host = document.querySelector('[data-about]');
    if (!host) return;
    host.innerHTML = `
      <section class="page-intro container">
        <h1>${escapeHtml(data.about.title)}</h1>
        <p>${escapeHtml(data.about.intro)}</p>
      </section>
      <section class="simple-content container">
        <div class="prose">${data.about.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>
        <div class="info-grid">
          ${data.about.facts.map(item => `<div class="info-card"><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.value)}</strong></div>`).join('')}
        </div>
      </section>`;
  }

  function renderContact(data) {
    const host = document.querySelector('[data-contact]');
    if (!host) return;
    host.innerHTML = `
      <section class="page-intro container">
        <h1>${escapeHtml(data.contact.title)}</h1>
        <p>${escapeHtml(data.contact.intro)}</p>
      </section>
      <section class="simple-content container">
        <div class="contact-list">
          ${data.contact.items.map(item => `<div class="contact-card"><small>${escapeHtml(item.label)}</small><a href="${escapeHtml(item.href)}">${escapeHtml(item.value)}</a></div>`).join('')}
        </div>
      </section>`;
  }

  function showError(error) {
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="error-box">
        <strong>The site data could not be loaded.</strong><br>
        This site uses <code>data/site.json</code>, which browsers normally block when you open the HTML directly with <code>file://</code>.<br><br>
        Use <code>run.bat</code> on Windows or run <code>python tools/serve.py</code>. On GitHub Pages / Cloudflare Pages / normal web hosting, it works directly.<br><br>
        Technical message: ${escapeHtml(error.message)}
      </div>`);
  }

  loadData().then(data => {
    renderHeader(data);
    renderFooter(data);
    renderHome(data);
    renderGames(data);
    renderGame(data);
    renderAbout(data);
    renderContact(data);
  }).catch(showError);
})();
