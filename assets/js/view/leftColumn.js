export function createLeftColumn(days) {
  const left = document.createElement('div');
  left.className = 'left-col';

  const listWrap = document.createElement('div');
  listWrap.className = 'days-list';

  days.forEach((d, idx) => {
    const item = document.createElement('div');
    item.className = 'day-list-item';
    item.dataset.index = idx;

    const title = document.createElement('h3');
    title.className = 'day-name-left';
    title.textContent = d.day || 'Uden navn';
    title.setAttribute('data-idx', idx);
    item.appendChild(title);

    if (d.dishes && d.dishes.length) {
      const ul = document.createElement('ul');
      d.dishes.forEach(it => { const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
      item.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'Ingen retter fundet for denne dag.';
      item.appendChild(p);
    }

    listWrap.appendChild(item);
  });

  left.appendChild(listWrap);
  return { left, listWrap };
}
