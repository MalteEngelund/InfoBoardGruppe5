// Opretter venstre header (titel + uge-badge). Returnerer DOM-node.
export function createLeftHeader(week) {
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
  return leftHeader;
}
