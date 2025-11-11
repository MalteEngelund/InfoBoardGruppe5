export default class BusScheduleView {
  constructor(selector = '#busScheduleByMathias') {
    this.mount = document.querySelector(selector);
  }

  // items: array with objects that include {line, dest, time, ts}
  render(items = []) {
    // Select next 2 departures for each line (6, 17, 18)
    const lines = ['6', '17', '18'];
    const perLine = lines.flatMap((ln) => items.filter((i) => String(i.line) === ln).slice(0, 2));

    // Sort the selected departures by timestamp
    const selected = perLine.sort((a, b) => (a.ts || 0) - (b.ts || 0));

    // Convert timestamps to minutes-until-departure and log to console
    const now = Date.now();
    const withMinutes = selected.map((it) => {
      const mins = it.ts ? Math.round((it.ts - now) / 60000) : null;
      return Object.assign({}, it, { mins });
    });

    // Helper to trim seconds from time strings (e.g. 13:57:09 -> 13:57)
    const formatTimeHM = (raw) => {
      if (!raw) return '';
      const isoMatch = String(raw).match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}):\d{2}(?:[.Z].*)?/);
      if (isoMatch) return isoMatch[1].slice(-5);
      const hm = String(raw).match(/^(\d{1,2}:\d{2})/);
      if (hm) return hm[1];
      const m = String(raw).match(/(\d{1,2}:\d{2})/);
      return m ? m[1] : String(raw);
    };

    console.groupCollapsed('BusScheduleView - next departures', withMinutes.length);
    withMinutes.forEach((it) => console.log(`Bus ${it.line} → ${it.dest} @ ${formatTimeHM(it.time)} (${it.mins <= 0 ? 'Nu' : it.mins + ' min'})`));
    console.groupEnd();

    // Render simple DOM list
    if (!this.mount) return;
    if (!selected.length) {
      this.mount.innerHTML = '<div class="bus-empty">Ingen (6/17/18) afgange</div>';
      return;
    }

    this.mount.innerHTML = `
      <ul class="bus-departure-list">
        ${withMinutes
          .map((it) => {
            const displayTime = formatTimeHM(it.time);
            const minsLabel = it.mins == null ? this._esc(displayTime) : it.mins <= 0 ? 'Nu' : `${it.mins} min`;
            return `<li class="bus-item"><strong class="code">${this._esc(it.line)}</strong> <span class="dest">${this._esc(it.dest)}</span> <span class="time">${this._esc(
              displayTime
            )}</span> <span class="mins">${this._esc(minsLabel)}</span></li>`;
          })
          .join('')}
      </ul>
    `;
  }

  renderError(err) {
    console.error('BusScheduleView error', err);
    if (!this.mount) return;
    this.mount.innerHTML = `<div class="bus-error">Fejl: ${this._esc(err?.message || String(err))}</div>`;
  }

  _esc(s = '') {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
}
