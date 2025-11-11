export const API_URL = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json';

export const Model = {
  async fetchData() {
    const res = await fetch(API_URL);
    const raw = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — svar: ${raw.slice(0,800)}`);
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      throw new Error('Kunne ikke parse respons som JSON.');
    }
    const week = obj?.Week || obj?.week || null;
    const days = this.parseDaysFromJsonObject(obj) || [];
    return { days, week, raw };
  },

  parseDaysFromJsonObject(obj) {
    if (!obj) return null;
    const daysArr = obj?.Days || obj?.days || obj?.MenuDays || obj?.menu || (Array.isArray(obj) ? obj : null);
    if (!daysArr || !Array.isArray(daysArr)) return null;

    return daysArr.map(item => {
      if (!item || typeof item !== 'object') return { day: 'Ukendt dag', dishes: [String(item)], dateIso: null };
      const keys = Object.keys(item);
      const dayNameKey = keys.find(k => /dayname/i.test(k) || /^name$/i.test(k) || /^day$/i.test(k));
      const dishKey = keys.find(k => /dish/i.test(k) || /dishes/i.test(k) || /meal/i.test(k) || /items?/i.test(k));
      const dateKey = keys.find(k => /date/i.test(k) || /daydate/i.test(k) || /dateiso/i.test(k));

      const day = dayNameKey ? String(item[dayNameKey]).trim() : 'Uden dag';
      let dishes = [];
      if (dishKey) {
        const rawD = item[dishKey];
        if (Array.isArray(rawD)) dishes = rawD.map(d => String(d).trim()).filter(Boolean);
        else if (rawD == null) dishes = [];
        else dishes = String(rawD).split(/\r?\n|\s*;\s*|\s*\|\s*/).map(s => s.trim()).filter(Boolean);
      }
      const dateIso = dateKey && item[dateKey] ? this.tryNormalizeDate(String(item[dateKey])) : null;
      return { day, dishes, dateIso };
    });
  },

  tryNormalizeDate(s) {
    s = (s || '').trim();
    if (!s) return null;
    const isoCandidate = s.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoCandidate) return isoCandidate[0];
    const dm = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dm) {
      const d = dm[3] + '-' + dm[2].padStart(2,'0') + '-' + dm[1].padStart(2,'0');
      return d;
    }
    return null;
  }
};
