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

    // left column
    const left = document.createElement('div'); left.className = 'left-col';
    const leftHeader = document.createElement('div'); leftHeader.className = 'left-header';
    const hLeft = document.createElement('h2'); hLeft.textContent = 'Ugensmenu'; leftHeader.appendChild(hLeft);
    if (week) {
      const spanWeek = document.createElement('span'); spanWeek.className = 'week-badge'; spanWeek.textContent = `Uge ${week}`; leftHeader.appendChild(spanWeek);
    }
    left.appendChild(leftHeader);

    const listWrap = document.createElement('div'); listWrap.className = 'days-list';
    days.forEach((d, idx) => {
      const item = document.createElement('div'); item.className = 'day-list-item'; item.dataset.index = idx;
      const title = document.createElement('h3'); title.className = 'day-name-left'; title.textContent = d.day || 'Uden navn';
      title.setAttribute('data-idx', idx);
      item.appendChild(title);
      if (d.dishes && d.dishes.length) {
        const ul = document.createElement('ul');
        d.dishes.forEach(it => { const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
        item.appendChild(ul);
      } else {
        const p = document.createElement('p'); p.textContent = 'Ingen retter fundet for denne dag.'; item.appendChild(p);
      }
      listWrap.appendChild(item);
    });
    left.appendChild(listWrap);

    // right column
    const right = document.createElement('div'); right.className = 'right-col';
    const rightHeader = document.createElement('h2'); rightHeader.textContent = 'Dagens ret'; right.appendChild(rightHeader);
    const details = document.createElement('div'); details.className = 'today-details'; right.appendChild(details);

    container.appendChild(left);
    container.appendChild(right);
    this.app.appendChild(container);

    // expose nodes for controller
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
