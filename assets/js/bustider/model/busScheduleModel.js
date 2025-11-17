export default class BusScheduleModel {
  constructor(options = {}) {
    this.url = options.url || 'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
    this.timeout = options.timeout || 10000; // ms
  }

  async getNearbyDepartures() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch bus departures:', err);
      throw err;
    }
  }
}
