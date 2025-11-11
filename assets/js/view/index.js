import { createLeftHeader } from './header.js';
import { createLeftColumn } from './leftColumn.js';
import { createRightColumn } from './rightColumn.js';

export class View {
  constructor(rootId = 'app') {
    this.app = document.getElementById(rootId) || document.body;
  }

  clear() { this.app.innerHTML = ''; }

  renderError(message, raw) {
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
