import { RotationController } from './rotationController.js';

export class FeedController {
  constructor(model, view, interval = 2 * 60 * 1000) {
    this.model = model;
    this.view = view;
    this.interval = interval;
    this.currentIndex = 0;
    this.rotation = new RotationController(() => this.next(), this.interval);

    this.model.onChange(items => {
      console.debug('[FeedController] model.onChange - items length:', items ? items.length : 0);
      if (!items || items.length === 0) {
        this.view.showError('Ingen nyheder fundet.');
        this.stop();
      } else {
        this.start();
      }
    });
  }

  async init() {
    try {
      console.debug('[FeedController] init() - starting load');
      this.view.showLoading();
      await this.model.load();
      console.debug('[FeedController] init() - load finished');
    } catch (err) {
      console.error('[Controller] init error', err);
      this.view.showError('Kunne ikke hente nyheder.');
      this.stop();
    }
  }

  start() {
    const items = this.model.items;
    console.debug('[FeedController] start() - items:', items ? items.length : 0);
    if (!items || items.length === 0) return;
    this.currentIndex = 0;
    this.showCurrent();
    this.rotation.start();
  }

  stop() {
    console.debug('[FeedController] stop()');
    this.rotation.stop();
  }

  next() {
    const items = this.model.items;
    if (!items || items.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % items.length;
    console.debug('[FeedController] next() -> currentIndex:', this.currentIndex);
    this.showCurrent();
  }

  showCurrent() {
    const item = this.model.getItem(this.currentIndex);
    console.debug('[FeedController] showCurrent() - item:', item ? (item.title || item.guid || '(no title)') : null);
    this.view.renderArticle(item);
  }
}
