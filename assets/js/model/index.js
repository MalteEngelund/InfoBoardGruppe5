import { fetchRawMenu } from './fetcher.js';
import { parseDaysFromJsonObject } from './parser.js';

const Model = {
  async fetchData() {
    const { res, raw } = await fetchRawMenu();
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — svar: ${raw.slice(0,800)}`);
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      throw new Error('Kunne ikke parse respons som JSON.');
    }
    const week = obj?.Week || obj?.week || null;
    const days = parseDaysFromJsonObject(obj) || [];
    return { days, week, raw };
  }
};

export default Model;
