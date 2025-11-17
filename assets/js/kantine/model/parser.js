// Parser: konverterer rå JSON til et konsistent format som resten af app'en bruger.

/**
 * Forsøger at normalisere dato-strenge til ISO 'YYYY-MM-DD'.
 * Understøtter allerede ISO eller dd/mm/yyyy / dd-mm-yyyy.
 * Returnerer ISO-streng eller null hvis ikke genkendt.
 */
export function tryNormalizeDate(s) {
  s = (s || '').trim();
  if (!s) return null;
  // Direkte ISO (fx 2025-11-12)
  const isoCandidate = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoCandidate) return isoCandidate[0];
  // Forsøg dd/mm/yyyy eller dd-mm-yyyy
  const dm = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dm) {
    return dm[3] + '-' + dm[2].padStart(2,'0') + '-' + dm[1].padStart(2,'0');
  }
  return null;
}

/**
 * Parse JSON-objektet og returner et array af days:
 * [ { day: 'Mandag', dishes: ['ret1','ret2'], dateIso: 'YYYY-MM-DD' }, ... ]
 *
 * - Finder array under flere almindelige nøgler (Days, days, MenuDays, menu)
 * - For hver dag forsøger den at finde nøgler til dayname, dish og date
 * - Normaliserer retter til en liste af strings
 */
export function parseDaysFromJsonObject(obj) {
  if (!obj) return null;
  const daysArr = obj?.Days || obj?.days || obj?.MenuDays || obj?.menu || (Array.isArray(obj) ? obj : null);
  if (!daysArr || !Array.isArray(daysArr)) return null;

  return daysArr.map(item => {
    if (!item || typeof item !== 'object') return { day: 'Ukendt dag', dishes: [String(item)], dateIso: null };
    const keys = Object.keys(item);
    // Find sandsynlige nøgler (case-insensitive match)
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
    const dateIso = dateKey && item[dateKey] ? tryNormalizeDate(String(item[dateKey])) : null;
    return { day, dishes, dateIso };
  });
}
