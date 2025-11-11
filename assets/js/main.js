const API_URL = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json';

// Hent og render menu — JSON-only
async function fetchAndRenderMenu() {
  try {
    const res = await fetch(API_URL);
    const rawText = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — svar: ${rawText.slice(0,800)}`);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      throw new Error('Kunne ikke parse respons som JSON. Rå respons (forkortet):\n' + rawText.slice(0,2000));
    }

    const week = data?.Week || data?.week || null;
    const days = parseDaysFromJsonObject(data);
    if (!days || days.length === 0) {
      renderGrid([{ day: 'Ingen data', dishes: [] }], rawText, week);
      return;
    }

    renderGrid(days, rawText, week);
  } catch (err) {
    renderGrid([], String(err), null, 'Fejl ved hentning/parsing');
  }
}

// Normaliser JSON-objekt til { day, dishes, dateIso? }[]
function parseDaysFromJsonObject(obj) {
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
    const dateIso = dateKey && item[dateKey] ? tryNormalizeDate(String(item[dateKey])) : null;
    return { day, dishes, dateIso };
  });
}

function tryNormalizeDate(s) {
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

function dayNameToIndex(name) {
  if (!name) return null;
  const s = name.toLowerCase();
  const map = {
    mandag: 1, tirsdag: 2, onsdag: 3, torsdag: 4, fredag: 5, lordag:6, lørdag:6, søndag: 0, sonndag:0,
    monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:0
  };
  for (const k of Object.keys(map)) {
    if (s.includes(k)) return map[k];
  }
  return null;
}

function isPastDay(dayObj) {
  if (dayObj?.dateIso) {
    const d = new Date(dayObj.dateIso + 'T00:00:00');
    const today = new Date();
    d.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return d < today;
  }
  const di = dayNameToIndex(dayObj.day);
  if (di === null) return false;
  const todayIdx = new Date().getDay();
  return di < todayIdx;
}

// Render grid med venstre Ugensmenu og højre Dagens ret
function renderGrid(days, raw, week, error) {
  const app = document.getElementById('app') || document.body;
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'menu-grid';

  // Left column
  const left = document.createElement('div');
  left.className = 'left-col';

  const leftHeader = document.createElement('div');
  leftHeader.className = 'left-header';
  const hLeft = document.createElement('h2');
  hLeft.textContent = 'Ugensmenu';
  leftHeader.appendChild(hLeft);
  if (week) {
    const spanWeek = document.createElement('span');
    spanWeek.className = 'week-badge';
    spanWeek.textContent = `Uge ${week}`;
    leftHeader.appendChild(spanWeek);
  }
  left.appendChild(leftHeader);

  if (error) {
    const p = document.createElement('p');
    p.style.color = 'crimson';
    p.textContent = error;
    left.appendChild(p);

    const pre = document.createElement('pre');
    pre.textContent = raw ? String(raw).slice(0,2000) : 'Ingen yderligere oplysninger';
    left.appendChild(pre);
    container.appendChild(left);
    app.appendChild(container);
    return;
  }

  // filter out past days
  const visibleDays = (days || []).filter(d => !isPastDay(d));

  // Left: vis hver dag med fuldt liste (som før)
  const listWrap = document.createElement('div');
  listWrap.className = 'days-list';

  visibleDays.forEach((d, idx) => {
    const item = document.createElement('div');
    item.className = 'day-list-item';
    item.dataset.index = idx;

    const title = document.createElement('h3');
    title.className = 'day-name-left';
    title.textContent = d.day || 'Uden navn';
    // klik på titlen vælger dagen til højre
    title.addEventListener('click', () => setSelectedDay(idx));
    item.appendChild(title);

    if (d.dishes && d.dishes.length) {
      const ul = document.createElement('ul');
      d.dishes.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it;
        ul.appendChild(li);
      });
      item.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'Ingen retter fundet for denne dag.';
      item.appendChild(p);
    }

    listWrap.appendChild(item);
  });

  if (visibleDays.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Ingen fremtidige dage i denne uge.';
    listWrap.appendChild(p);
  }

  left.appendChild(listWrap);

  // Right column (uændret)
  const right = document.createElement('div');
  right.className = 'right-col';
  const rightHeader = document.createElement('h2');
  rightHeader.textContent = 'Dagens ret';
  right.appendChild(rightHeader);

  const details = document.createElement('div');
  details.className = 'today-details';
  right.appendChild(details);

  container.appendChild(left);
  container.appendChild(right);
  app.appendChild(container);

  // helper escape
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function renderDetailsFor(dayObj) {
    details.innerHTML = '';
    // fjernet titel og dato — kun retter vises
    if (dayObj.dishes && dayObj.dishes.length) {
      const ul = document.createElement('ul');
      dayObj.dishes.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it;
        ul.appendChild(li);
      });
      details.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'Ingen retter fundet for denne dag.';
      details.appendChild(p);
    }
  }

  function setSelectedDay(idx) {
    // fjernet visuel highlighting på venstre liste (ingen class toggling)
    const dayObj = visibleDays[idx];
    if (dayObj) {
      renderDetailsFor(dayObj);
      // scroll valgt element i venstre kolonne i view (valgfrit)
      const sel = listWrap.querySelectorAll('.day-list-item')[idx];
      if (sel && typeof sel.scrollIntoView === 'function') sel.scrollIntoView({ block: 'nearest' });
    } else {
      details.innerHTML = '<p>Ingen dag valgt.</p>';
    }
  }

  // selection logic: prefer today's day if present, else first visible
  const todayIndexInVisible = visibleDays.findIndex(d => {
    const di = dayNameToIndex(d.day);
    return di !== null && di === new Date().getDay();
  });
  const initialIndex = todayIndexInVisible >= 0 ? todayIndexInVisible : 0;

  if (visibleDays.length) setSelectedDay(initialIndex);
  else details.innerHTML = '<p>Ingen dage at vise.</p>';
}

document.addEventListener('DOMContentLoaded', fetchAndRenderMenu);