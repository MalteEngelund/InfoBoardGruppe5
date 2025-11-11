export function bindDayTitleClicks(listWrap, handler) {
  if (!listWrap) return;
  listWrap.addEventListener('click', (e) => {
    const h = e.target.closest('.day-name-left');
    if (!h) return;
    const idx = parseInt(h.getAttribute('data-idx'), 10);
    if (!Number.isNaN(idx)) handler(idx);
  });
}
