export function createRightColumn() {
  const right = document.createElement('div');
  right.className = 'right-col';

  const rightHeader = document.createElement('h2');
  rightHeader.textContent = 'Dagens ret';
  right.appendChild(rightHeader);

  const details = document.createElement('div');
  details.className = 'today-details';
  right.appendChild(details);

  return { right, details };
}
