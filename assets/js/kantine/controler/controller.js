import Model from '../model/index.js';
import { View } from '../view/index.js';
import { bindDayTitleClicks } from './events.js';
import { findTodayIndex } from './selection.js';

/*
 Controller: koordinerer Model og View.
 - Henter data fra Model
 - Beder View om at bygge DOM
 - Binder events og håndterer brugerinteraktion (valg af dag)
*/
const Controller = {
  view: null,
  model: Model,
  nodes: null,

  // Init: opret view-instans og start hent/render-flow
  init(rootId = 'cantineByJack') {
    // Start point: opret view med angivet rootId og læs data
    this.view = new View(rootId);
    this.loadAndRender();
  },

  // Hent data fra model, filtrer og render grid via view
  async loadAndRender() {
    try {
      const { days, week } = await this.model.fetchData();
      // Fjern dage der er overstået
      const visibleDays = days.filter(d => !this.isPastDay(d));
      // Render venstre/højre kolonne, gem DOM-noder for videre brug
      this.nodes = this.view.renderMainGrid(visibleDays, week);
      // Find bedste initialvalg (i dag hvis muligt)
      const todayIdx = findTodayIndex(visibleDays);
      const initial = (todayIdx >= 0 ? todayIdx : 0);
      this.selectDay(initial);
      this.bindEvents();
    } catch (err) {
      // Vis fejl via view hvis noget gik galt
      this.view.renderError(err.message || String(err));
    }
  },

  // Bind events — bruger delegat helper for at holde controller'en lille
  bindEvents() {
    // Bind klik-events i venstre liste (delegation via bindDayTitleClicks)
    if (!this.nodes || !this.nodes.listWrap) return;
    bindDayTitleClicks(this.nodes.listWrap, (idx) => this.selectDay(idx));
  },

  // Vælg dag: udtræk data fra DOM-elementet og bed view vise detaljer
  selectDay(idx) {
    // Når en dag vælges: hent data fra DOM-elementet og vis i højre kolonne
    const dayElems = this.nodes.listWrap.querySelectorAll('.day-list-item');
    const el = dayElems[idx];
    const dayObj = (el && this.getDayObjectFromElement(el)) || null;
    this.view.renderDetails(this.nodes.details, dayObj);
    // Scroll valgt element synligt i venstre kolonne
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  },

  // Bygger et simpelt day-objekt fra DOM-elementet (title + li-tekster)
  getDayObjectFromElement(el) {
    // Byg et simpelt day-objekt { day, dishes } fra et DOM-element
    const title = el.querySelector('.day-name-left')?.textContent || '';
    const lis = Array.from(el.querySelectorAll('ul li')).map(li => li.textContent.trim());
    return { day: title, dishes: lis };
  },

  // Tjek om en dag er i fortiden (brug dateIso hvis tilgængelig, ellers dayName mapping)
  isPastDay(dayObj) {
    // Returner true hvis dagObj er i fortiden.
    // Først brug dateIso hvis tilgængelig, ellers brug day-name mapping.
    if (dayObj?.dateIso) {
      const d = new Date(dayObj.dateIso + 'T00:00:00');
      const today = new Date(); d.setHours(0,0,0,0); today.setHours(0,0,0,0);
      return d < today;
    }
    // Fallback: brug navnet på dagen
    const di = (function(name){
      if (!name) return null;
      const s = name.toLowerCase();
      const map = {
        mandag: 1, tirsdag: 2, onsdag: 3, torsdag: 4, fredag: 5, lordag:6, lørdag:6, søndag: 0, sonndag:0,
        monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:0
      };
      for (const k of Object.keys(map)) if (s.includes(k)) return map[k];
      return null;
    })(dayObj.day);
    if (di === null) return false;
    const todayIdx = new Date().getDay();
    return di < todayIdx;
  }
};

export default Controller;
