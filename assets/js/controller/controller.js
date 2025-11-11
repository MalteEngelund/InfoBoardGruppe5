import Model from '../model/index.js';
import { View } from '../view/index.js';
import { bindDayTitleClicks } from './events.js';
import { findTodayIndex } from './selection.js';

const Controller = {
  view: null,
  model: Model,
  nodes: null,

  init() {
    this.view = new View('app');
    this.loadAndRender();
  },

  async loadAndRender() {
    try {
      const { days, week } = await this.model.fetchData();
      const visibleDays = days.filter(d => !this.isPastDay(d));
      this.nodes = this.view.renderMainGrid(visibleDays, week);
      const todayIdx = findTodayIndex(visibleDays);
      const initial = (todayIdx >= 0 ? todayIdx : 0);
      this.selectDay(initial);
      this.bindEvents();
    } catch (err) {
      this.view.renderError(err.message || String(err));
    }
  },

  bindEvents() {
    if (!this.nodes || !this.nodes.listWrap) return;
    bindDayTitleClicks(this.nodes.listWrap, (idx) => this.selectDay(idx));
  },

  selectDay(idx) {
    const dayElems = this.nodes.listWrap.querySelectorAll('.day-list-item');
    const el = dayElems[idx];
    const dayObj = (el && this.getDayObjectFromElement(el)) || null;
    this.view.renderDetails(this.nodes.details, dayObj);
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  },

  getDayObjectFromElement(el) {
    const title = el.querySelector('.day-name-left')?.textContent || '';
    const lis = Array.from(el.querySelectorAll('ul li')).map(li => li.textContent.trim());
    return { day: title, dishes: lis };
  },

  isPastDay(dayObj) {
    if (dayObj?.dateIso) {
      const d = new Date(dayObj.dateIso + 'T00:00:00');
      const today = new Date(); d.setHours(0,0,0,0); today.setHours(0,0,0,0);
      return d < today;
    }
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
