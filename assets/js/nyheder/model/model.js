import { fetchFeedJson } from './fetchService.js';

export class FeedModel {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.items = [];
    this.listeners = [];
  }

  async load() {
    const data = await fetchFeedJson(this.apiUrl);
    this.items = data.items || [];
    console.debug('[FeedModel] load() - items fetched:', Array.isArray(this.items) ? this.items.length : 0);
    this._notify();
    return this.items;
  }

  getItem(index) {
    if (!this.items || this.items.length === 0) return null;
    return this.items[index % this.items.length];
  }

  onChange(cb) {
    this.listeners.push(cb);
  }

  _notify() {
    this.listeners.forEach(cb => {
      try { cb(this.items); } catch (e) { console.error(e); }
    });
  }
}
