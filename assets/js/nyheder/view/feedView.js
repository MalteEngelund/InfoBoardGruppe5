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
    // Sørg for at app tilpasser sig containeren
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
      '#nyhederByJack',
      '#nyheder',
      '#feedHost',
      '#left-column',
      '#main-column',
      '.sub-column-to-left-by-Marie-Pierre-Lessard',
      '.top-level-column-to-left-by-Marie-Pierre-Lessard',
      '.sub-column-to-right-by-Marie-Pierre-Lessard',
      '.top-level-column-to-right-by-Marie-Pierre-Lessard',
      '.top-level-grid-by-Marie-Pierre-Lessard',
      '.sub-column-to-left-by-Marie-Pierre-Lessard > .content',
      '.sub-column-to-right-by-Marie-Pierre-Lessard > .content'
    ];

    let host = null;
    for (const sel of selectors) {
      host = document.querySelector(sel);
      if (host) break;
    }

    // Hvis vi fandt en host, append der; ellers append til body som fallback
    if (host) {
      // Hvis host er en grid/column wrapper som forventer et indre flow-element,
      // prøv at finde et indre content-element først
      const inner = host.querySelector && (host.querySelector('.content') || host.querySelector('.sub-column') || host.querySelector('.inner'));
      (inner || host).appendChild(app);
    } else {
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
