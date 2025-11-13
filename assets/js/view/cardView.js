import { create } from './dom.js';
import { extractImage, stripHtml, truncate } from '../utils.js';

// Helper: prøv at loade et billede, afvises hvis det ikke loader inden timeout (ms)
function loadImageWithTimeout(url, timeout = 400) {
  return new Promise((resolve, reject) => {
    const testImg = new Image();
    let timer = setTimeout(() => {
      testImg.onload = testImg.onerror = null;
      reject(new Error('timeout'));
    }, timeout);

    testImg.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    testImg.onerror = () => {
      clearTimeout(timer);
      reject(new Error('error'));
    };
    // Kick off load
    testImg.src = url;
  });
}

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

  // Fallback-sti (tilføj filen TV2News.jpg i assets/img)
  const DEFAULT_IMG = 'assets/img/TV2News.jpg';

  // Forsøg at bruge fundet billede, men skift hurtigt til fallback hvis det ikke loader hurtigt
  const candidate = extractImage(item);
  if (!candidate) {
    img.src = DEFAULT_IMG;
  } else {
    // Start med fallback hurtigt; opdater kun hvis candidate loader inden timeout
    img.src = DEFAULT_IMG;
    const LOAD_TIMEOUT_MS = 400; // juster efter behov (kortere = hurtigere fallback)
    loadImageWithTimeout(candidate, LOAD_TIMEOUT_MS)
      .then(() => {
        img.src = candidate;
      })
      .catch(() => {
        // forbliver DEFAULT_IMG
      });
  }

  img.alt = item.title || 'Nyheds billede';
  img.loading = 'lazy';

  // Hvis billedet fejler ved indlæsning i DOM, skift til fallback (undgå uendelig loop)
  img.addEventListener('error', () => {
    if (img.src !== DEFAULT_IMG) {
      img.src = DEFAULT_IMG;
    }
  });

  imgWrap.appendChild(img);

  card.appendChild(content);
  card.appendChild(imgWrap);

  return card;
}
