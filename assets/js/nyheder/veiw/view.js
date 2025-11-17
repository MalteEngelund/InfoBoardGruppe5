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
    if (document.querySelector('.app')) return;
    const app = create('main', 'app');
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
    document.body.appendChild(app);

    // references
    this.feedEl = document.getElementById('feed');
    this.loadingEl = document.getElementById('loading');
    this.errorEl = document.getElementById('error');
  }

  showLoading() {
    this.clear();
    this.loadingEl = document.getElementById('loading');
    if (this.loadingEl) this.feedEl.appendChild(this.loadingEl);
  }

  showError(msg) {
    this.errorEl = document.getElementById('error');
    if (this.errorEl) {
      this.errorEl.textContent = msg || 'Fejl';
      this.errorEl.hidden = false;
    }
  }

  clear() {
    if (!this.feedEl) return;
    this.feedEl.innerHTML = '';
  }

  renderArticle(item) {
    this.clear();
    if (!item) {
      const noEl = create('div', null, { text: 'Ingen nyheder at vise.' });
      this.feedEl.appendChild(noEl);
      return;
    }

    const card = buildCard(item);
    this.feedEl.appendChild(card);
  }
}
