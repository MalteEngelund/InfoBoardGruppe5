export default class BusScheduleModel {
  constructor(options = {}) {
    this.url = options.url || 'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
    this.timeout = options.timeout || 10000; // ms
  }

  async fetchJSON(url, timeout = this.timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // Henter "nearby departures" (standard url kan overskrives i constructor)
  async getNearbyDepartures() {
    const data = await this.fetchJSON(this.url);
    // Returner rå data — kaldende kode kan plukke felter ud.
    return data;
  }
}
