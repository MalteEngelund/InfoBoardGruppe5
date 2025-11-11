export class BusScheduleController {
  constructor(model, view, options = {}) {
    this.model = model;
    this.view = view;
    this.poll = options.poll || 30000;
    this._timer = null;
  }

  async fetchAndRender() {
    const data = await this.model.getNearbyDepartures();
    const list = data?.Departure || data?.Departures || data?.StopVisits || data?.StopVisit || data?.departures || [];
    const items = Array.isArray(list)
      ? list.slice(0, 8).map((d) => ({
          line: d.name || d.line || d.product || '--',
          dest: d.direction || d.destination || d.towards || '--',
          time: d.time || d.rtTime || d.scheduledTime || d.departureTime || '',
        }))
      : [];

    if (this.view && typeof this.view.render === 'function') this.view.render(items);
  }

  start() {
    // handle errors only at the top-level when fetching
    this.fetchAndRender().catch((err) => this.view?.renderError?.(err));
    if (this.poll > 0) {
      this._timer = setInterval(() => this.fetchAndRender().catch((err) => this.view?.renderError?.(err)), this.poll);
    }
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}
