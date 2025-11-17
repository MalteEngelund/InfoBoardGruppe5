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
