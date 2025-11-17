export class BusScheduleController {
  // Constructor: initialiserer model, view og polling-interval
  constructor(model, view, options = {}) {
    this.model = model;
    this.view = view;
    this.poll = options.poll || 30000;
    this._timer = null;
  }

  // Henter data fra modellen, filtrerer relevante buslinjer og sender til view
  async fetchAndRender() {
    const data = await this.model.getNearbyDepartures();
    const list = data?.Departure || data?.Departures || data?.StopVisits || data?.StopVisit || data?.departures || [];

    // Helper: extract leading digits from various possible fields and return number
    const extractLineNumber = (d) => {
      const raw = d?.name || d?.line || d?.product || '';
      const m = String(raw).match(/\d+/);
      return m ? parseInt(m[0], 10) : null;
    };

    // Helper: parse time strings into a timestamp (ms). Accepts ISO or HH:MM formats.
    const parseTimeToTs = (raw) => {
      if (!raw) return null;
      // try full ISO parse first
      const iso = Date.parse(raw);
      if (!Number.isNaN(iso)) return iso;

      // try HH:MM or HH:MM:SS -> attach to today and adjust if it's already past
      const m = String(raw).match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (m) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const hh = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10);
        const ss = m[3] ? parseInt(m[3], 10) : 0;
        let dt = new Date(year, month, date, hh, mm, ss);
        // if parsed time is more than 12 hours in the past, assume it's next day
        if (dt.getTime() < Date.now() - 1000 * 60 * 60 * 12) dt = new Date(dt.getTime() + 24 * 3600 * 1000);
        return dt.getTime();
      }

      return null;
    };

    // Build items with parsed timestamp, filter to lines 6/17/18
    const itemsWithTs = Array.isArray(list)
      ? list
          .map((d) => {
            const ln = extractLineNumber(d);
            if (ln == null) return null;
            if (![6, 17, 18].includes(ln)) return null;
            const timeRaw = d.time || d.rtTime || d.scheduledTime || d.departureTime || '';
            const ts = parseTimeToTs(timeRaw);
            return ts ? { line: String(ln), dest: d.direction || d.destination || d.towards || '--', time: timeRaw, ts } : null;
          })
          .filter(Boolean)
      : [];

    // Sort by timestamp ascending and keep the full sorted list (with ts)
    const sortedAll = itemsWithTs.sort((a, b) => a.ts - b.ts);

    // Filter out past departures (controller responsibility)
    const now = Date.now();
    const futureOnly = sortedAll.filter((it) => {
      if (!it.ts) return true; // keep items without timestamps
      const mins = Math.round((it.ts - now) / 60000);
      return mins > 0; // only keep future departures
    });

    // Hvis et view er til stede, send den filtrerede liste til view
    if (this.view && typeof this.view.render === 'function') this.view.render(futureOnly);
  }

  // Starter en loop som periodisk henter opdateringer fra API'et
  start() {
    // start a sequential polling loop: fetch -> wait -> fetch -> ...
    if (this._running) return; // already running
    this._running = true;

    const loop = async () => {
      while (this._running) {
        try {
          await this.fetchAndRender();
        } catch (err) {
          // handle fetch/render errors at top-level
          try {
            this.view?.renderError?.(err);
          } catch (e) {
            // ignore view errors
          }
        }

        // wait poll ms inden næste fetch; store timeout id  stop() fjerner det
        await new Promise((resolve) => {
          this._timeoutId = setTimeout(resolve, this.poll);
        });
      }
    };

    loop();
  }

  // Stopper polling-loopet og rydder timeout
  stop() {
    this._running = false;
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }
}
