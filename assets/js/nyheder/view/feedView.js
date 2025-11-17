import { create } from './dom.js';
import { buildCard } from './cardView.js';

export class FeedView {
  constructor() {
    this.buildLayout();
    this.feedEl = document.getElementById('feed');
    this.loadingEl = document.getElementById('loading');
    this.errorEl = document.getElementById('error');
  }

  buildLayout() {
    // Hvis nyheder-app allerede findes, gør ikke noget
    if (document.querySelector('.app.nyheder-feed')) return;

    const app = create('main', 'app nyheder-feed');
    // Sørg for at app tilpasser sig containeren (default flow) — styling for overlay sker i SCSS
    app.style.width = '100%';
    app.style.boxSizing = 'border-box';
    app.style.maxWidth = '100%';

    const header = create('header', 'app__header');
    const h1 = create('h1', null, { text: 'Nyheder' });
    header.appendChild(h1);

    const feed = create('section', 'feed');
    feed.id = 'feed';
    const loading = create('div', 'feed__loading', { id: 'loading', text: 'Henter nyheder…' });
    feed.appendChild(loading);
    const error = create('div', 'feed__error', { id: 'error', text: 'Kunne ikke hente nyheder.' });
    error.hidden = true;

    app.appendChild(header);
    app.appendChild(feed);
    app.appendChild(error);

    // Liste af selectors vi forsøger at placere nyheder i (prioriteret)
    const selectors = [
      '#cantineByJack', // <- prioriteret: placer nyheder som overlay i kantine-sektionen hvis ønsket
      '#nyhederByJack',
      '#nyheder',
      '#feedHost',
      '.top-level-column-to-left-by-Marie-Pierre-Lessard',
      '.sub-column-to-left-by-Marie-Pierre-Lessard',
      '#left-column',
      '#main-column',
      '.sub-column-to-right-by-Marie-Pierre-Lessard',
      '.top-level-column-to-right-by-Marie-Pierre-Lessard',
      '.top-level-grid-by-Marie-Pierre-Lessard'
    ];

    let host = null;
    for (const sel of selectors) {
      host = document.querySelector(sel);
      if (host) break;
    }

    // Hvis vi fandt en host, gør den relativ hvis statisk, og append app som overlay
    if (host) {
      const cs = window.getComputedStyle(host);
      if (cs.position === 'static' || !cs.position) {
        host.style.position = 'relative';
      }

      // Hvis vi placer i cantine-sektionen, opret et overlay-wrapper så vi ikke sletter kantine-indhold
      if (host.id === 'cantineByJack') {
        // placer overlay i forælder-kolonnen så det kan overlappe under klokken
        const parentCol = host.parentElement || host; // normalt .sub-column-to-left-by-Marie-Pierre-Lessard
        if (window.getComputedStyle(parentCol).position === 'static') parentCol.style.position = 'relative';

        const overlay = document.createElement('div');
        overlay.className = 'nyheder-overlay';
        overlay.style.position = 'absolute';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'center';
        overlay.style.pointerEvents = 'auto';
        overlay.style.zIndex = '4'; // under klokken (klokken får højere z-index i SCSS)
        overlay.style.padding = '0.25rem';

        // Beregn top så overlay lander højere inde i billedet
        // NUDGE_UP trækker overlayet ekstra op (juster efter behov)
        const clockEl = document.getElementById('clock');
        const NUDGE_UP = 80; // px — øg for at rykke overlay mere op
        if (clockEl) {
          const parentRect = parentCol.getBoundingClientRect();
          const clockRect = clockEl.getBoundingClientRect();
          // afstand fra parent-top til clock-bottom + lille margin, minus nudge
          const topPx = Math.max(0, Math.round(clockRect.bottom - parentRect.top + 8 - NUDGE_UP));
          overlay.style.top = topPx + 'px';
        } else {
          overlay.style.top = '3.5rem';
        }

        parentCol.appendChild(overlay);

        // App placeres inde i overlay, relativt (så overlay styrer position)
        app.style.position = 'relative';
        app.style.width = 'min(760px, 86%)';
        app.style.maxWidth = '760px';
        app.style.maxHeight = '34vh';
        app.style.overflow = 'auto';
        app.style.boxSizing = 'border-box';
        app.style.borderRadius = '6px';
        overlay.appendChild(app);
      } else {
        // Standard overlay-indsættelse for andre hosts (centreret)
        app.style.position = 'absolute';
        app.style.top = '50%';
        app.style.left = '50%';
        app.style.transform = 'translate(-50%, -50%)';
        app.style.zIndex = '5';
        app.style.pointerEvents = 'auto';
        app.style.width = 'min(900px, 90%)';
        app.style.maxWidth = '900px';
        app.style.maxHeight = '56vh';    // mindre end før, undgå at fylde hele host
        app.style.overflow = 'auto';
        app.style.height = 'auto';
        app.style.boxSizing = 'border-box';
        app.style.padding = '1rem';

        const inner = host.querySelector && (host.querySelector('.content') || host.querySelector('.sub-column') || host.querySelector('.inner'));
        (inner || host).appendChild(app);
      }
    } else {
      // fallback: append i body (ikke overlay)
      document.body.appendChild(app);
    }

    // references
    this.feedEl = document.getElementById('feed');
    this.loadingEl = document.getElementById('loading');
    this.errorEl = document.getElementById('error');
  }

  showLoading() {
    this.clear();
    if (this.loadingEl) this.feedEl.appendChild(this.loadingEl);
  }

  showError(msg) {
    this.clear();
    const err = create('div', 'feed__error', { text: msg || 'Fejl' });
    this.feedEl.appendChild(err);
  }

  clear() {
    if (!this.feedEl) this.feedEl = document.getElementById('feed');
    if (!this.feedEl) return;
    this.feedEl.innerHTML = '';
  }

  renderArticle(item) {
    this.clear();
    const card = buildCard(item);
    this.feedEl.appendChild(card);
  }
}
