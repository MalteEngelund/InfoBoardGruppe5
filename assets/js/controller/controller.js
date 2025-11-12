import { RotationController } from './rotationController.js';

export class FeedController {
  constructor(model, view, interval = 2 * 60 * 1000) {
    this.model = model;
    this.view = view;
    this.interval = interval;
    this.currentIndex = 0;
    this.rotation = new RotationController(() => this.next(), this.interval);

    this.model.onChange(items => {
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
      this.view.showLoading();
      await this.model.load();
    } catch (err) {
      console.error('[Controller] init error', err);
      this.view.showError('Kunne ikke hente nyheder.');
      this.stop();
    }
  }

  start() {
    const items = this.model.items;
    if (!items || items.length === 0) return;
    this.currentIndex = 0;
    this.showCurrent();
    this.rotation.start();
  }

  stop() {
    this.rotation.stop();
  }

  next() {
    const items = this.model.items;
    if (!items || items.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % items.length;
    this.showCurrent();
  }

  showCurrent() {
    const item = this.model.getItem(this.currentIndex);
    this.view.renderArticle(item);
  }
}
