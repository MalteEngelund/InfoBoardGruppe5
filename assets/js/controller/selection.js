export function dayNameToIndex(name) {
  if (!name) return null;
  const s = name.toLowerCase();
  const map = {
    mandag: 1, tirsdag: 2, onsdag: 3, torsdag: 4, fredag: 5, lordag:6, lørdag:6, søndag: 0, sonndag:0,
    monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:0
  };
  for (const k of Object.keys(map)) if (s.includes(k)) return map[k];
  return null;
}

export function findTodayIndex(days) {
  const todayIdx = new Date().getDay(); // 0=Sunday,1=Monday...
  for (let i = 0; i < days.length; i++) {
    const di = dayNameToIndex(days[i].day);
    if (di !== null && di === todayIdx) return i;
  }
  return -1;
}
