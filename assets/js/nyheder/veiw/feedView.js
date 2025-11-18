import { create } from './dom.js';
import { buildCard } from './cardView.js';

export class FeedView {
  // target: optional selector string or Element where view should be appended (e.g. '#cantineByJack')
  constructor(target = null) {
    this.target = target;
    console.debug('[FeedView] constructor - target:', target);
    this.buildLayout();
    // feed/loading/error references sikres i buildLayout - fallback til getElementById
    this.feedEl = this.feedEl || document.getElementById('feed');
    this.loadingEl = this.loadingEl || document.getElementById('loading');
    this.errorEl = this.errorEl || document.getElementById('error');
  }

  buildLayout() {
    // Hvis en target er angivet, find det element og byg app'en inde i det (uden at overskrive eksisterende indhold).
    let mountEl = null;
    if (this.target) {
      if (typeof this.target === 'string') mountEl = document.querySelector(this.target);
      else if (this.target instanceof Element) mountEl = this.target;
    }

    // Hvis der allerede findes en .app i mountEl eller i dokumentet, genbrug den og sæt references
    if (mountEl) {
      const existingApp = mountEl.querySelector('.app');
      if (existingApp) {
        console.debug('[FeedView] buildLayout - reusing existing app inside mountEl');
        this.feedEl = existingApp.querySelector('.feed') || existingApp.querySelector('#feed');
        this.loadingEl = existingApp.querySelector('#loading');
        this.errorEl = existingApp.querySelector('#error');
        return;
      }
    } else {
      const existingAppGlobal = document.querySelector('.app');
      if (existingAppGlobal) {
        console.debug('[FeedView] buildLayout - reusing existing global .app');
        this.feedEl = existingAppGlobal.querySelector('.feed') || existingAppGlobal.querySelector('#feed');
        this.loadingEl = existingAppGlobal.querySelector('#loading');
        this.errorEl = existingAppGlobal.querySelector('#error');
        return;
      }
    }

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

    if (mountEl) {
      mountEl.appendChild(app);
      console.debug('[FeedView] buildLayout - app appended inside mountEl');
    } else {
      document.body.appendChild(app);
      console.debug('[FeedView] buildLayout - app appended to document.body');
    }

    // Brug direkte referencer til de elementer vi netop oprettede
    this.feedEl = feed;
    this.loadingEl = loading;
    this.errorEl = error;
  }

  showLoading() {
    this.clear();
    if (this.loadingEl && this.feedEl) this.feedEl.appendChild(this.loadingEl);
    else console.warn('[FeedView] showLoading - loadingEl or feedEl missing', { loadingEl: this.loadingEl, feedEl: this.feedEl });
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
    console.debug('[FeedView] renderArticle - item:', item ? (item.title || '(no title)') : null);
    this.clear();
    const card = buildCard(item);
    if (!this.feedEl) {
      console.warn('[FeedView] renderArticle - feedEl missing, cannot append card');
      return;
    }
    this.feedEl.appendChild(card);
  }
}
