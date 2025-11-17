export function injectTextBoxAndRightImageCss() {
  // Intentionally empty: styling is handled via SCSS now.
  // Hvis du senere vil genaktivere JS-injektion, kan du tilføje CSS her.
}

export function extractImage(item) {
  if (!item) return 'https://via.placeholder.com/300x200?text=Ingen+billede';
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  const html = item.content || item.description || '';
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  if (match && match[1]) return match[1];
  return 'https://via.placeholder.com/300x200?text=Ingen+billede';
}

export function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}

export function truncate(str, max = 200) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max).trim() + '…' : str;
}

export function buildCantineView(containerId = 'cantineByJack', menu = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Tilføj namespace-klasse så SCSS kan scoping styles uden at konflikte
  container.classList.add('nyheder-cantine');

  // Default eksempelmenu hvis ingen data er givet
  const today = new Date();
  const dateStr = today.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'numeric' });

  const defaultMenu = [
    { name: 'Dagens Ret', description: 'Kylling i karry med ris', price: '45,-' },
    { name: 'Vegetarisk', description: 'Grøntsagslasagne', price: '40,-' },
    { name: 'Salatbar', description: 'Fri adgang til salatbar', price: '25,-' }
  ];

  const items = Array.isArray(menu) && menu.length ? menu : defaultMenu;

  // Ryd eksisterende indhold
  container.innerHTML = '';

  // Simpelt layout (kan style via SCSS senere)
  const wrapper = document.createElement('div');
  wrapper.className = 'cantine-widget';

  const header = document.createElement('header');
  header.className = 'cantine-header';
  header.innerHTML = `<h3>Kantinen</h3><div class="cantine-date">${dateStr}</div>`;

  const list = document.createElement('ul');
  list.className = 'cantine-menu';
  for (const it of items) {
    const li = document.createElement('li');
    li.className = 'cantine-item';
    li.innerHTML = `
      <div class="cantine-item-left">
        <strong class="cantine-item-name">${escapeHtml(it.name)}</strong>
        <div class="cantine-item-desc">${escapeHtml(it.description)}</div>
      </div>
      <div class="cantine-item-right">
        <span class="cantine-price">${escapeHtml(it.price)}</span>
      </div>
    `;
    list.appendChild(li);
  }

  // Ekstra note / åbningstid
  const footer = document.createElement('div');
  footer.className = 'cantine-footer';
  footer.textContent = 'Åbent: 10:30 – 13:30';

  wrapper.appendChild(header);
  wrapper.appendChild(list);
  wrapper.appendChild(footer);
  container.appendChild(wrapper);

  // Hjælpefunktioner
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
