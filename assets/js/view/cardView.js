import { create } from './dom.js';
import { extractImage, stripHtml, truncate } from '../utils.js';

export function buildCard(item) {
  const card = create('article', 'card');

  const content = create('div', 'card__content');
  const title = create('h2', 'card__title');
  const link = create('a', null, { href: item.link || '#', text: item.title || 'Uden titel' });
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  title.appendChild(link);

  const meta = create('div', 'card__meta', { text: new Date(item.pubDate || item.isoDate || Date.now()).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' }) });
  const excerpt = create('p', 'card__excerpt', { text: truncate(stripHtml(item.description || item.content || ''), 200) });

  content.appendChild(title);
  content.appendChild(meta);
  content.appendChild(excerpt);

  const imgWrap = create('div', 'card__image');
  const img = create('img');
  img.src = extractImage(item);
  img.alt = item.title || 'Nyheds billede';
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  card.appendChild(content);
  card.appendChild(imgWrap);

  return card;
}
