import { createLeftHeader } from './header.js';
import { createLeftColumn } from './leftColumn.js';
import { createRightColumn } from './rightColumn.js';

// View: bygger og opdaterer DOM. Returnerer noder controlleren bruger til events.
export class View {
  constructor(rootId = 'cantineByJack') {
    // rootId: id på element hvor app'en renderes (standard 'cantineByJack')
    this.app = document.getElementById(rootId) || document.body;
  }

  clear() {
    // Fjern kun den tidligere menu-grid vi selv har oprettet, behold øvrigt indhold
    const existing = this.app.querySelector('.menu-grid');
    if (existing) existing.remove();
    // fjern eventuelle tidligere fejl-boxer fra kantine hvis nødvendigt
    const oldError = this.app.querySelector('.canteen-box');
    if (oldError) oldError.remove();
  }

  renderError(message, raw) {
    // Vis simpel fejl-box med besked og evt. rå respons (forkortet)
    this.clear();
    const box = document.createElement('div');
    box.className = 'canteen-box';
    const h = document.createElement('h2'); h.textContent = 'Fejl'; box.appendChild(h);
    const p = document.createElement('p'); p.style.color = 'crimson'; p.textContent = message; box.appendChild(p);
    if (raw) {
      const pre = document.createElement('pre'); pre.textContent = String(raw).slice(0,2000); box.appendChild(pre);
    }
    this.app.appendChild(box);
  }

  renderMainGrid(days, week) {
    // Byg hoved-layout: venstre (liste) og højre (detaljer)
    // Returnerer { listWrap, details } så Controller kan binde events og opdatere detaljer.
    this.clear();
    const container = document.createElement('div'); container.className = 'menu-grid';

    const leftHeader = createLeftHeader(week);
    const { left, listWrap } = createLeftColumn(days);
    // insert header at top of left column
    left.insertBefore(leftHeader, left.firstChild);

    const { right, details } = createRightColumn();

    container.appendChild(left);
    container.appendChild(right);
    this.app.appendChild(container);

    return { listWrap, details, visibleDaysContainer: left };
  }

  renderDetails(detailsNode, dayObj) {
    // Opdater højre kolonne med retterne for den valgte dag
    detailsNode.innerHTML = '';
    if (dayObj && dayObj.dishes && dayObj.dishes.length) {
      const ul = document.createElement('ul');
      dayObj.dishes.forEach(it => { const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
      detailsNode.appendChild(ul);
    } else {
      const p = document.createElement('p'); p.textContent = 'Ingen retter fundet for denne dag.'; detailsNode.appendChild(p);
    }
  }
}
