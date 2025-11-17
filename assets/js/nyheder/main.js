import { FeedModel } from './model/model.js';
import { FeedView } from './view/feedView.js';
import { FeedController } from './controller/controller.js';
import { injectTextBoxAndRightImageCss, buildCantineView } from './utils.js';

// Konfiguration
const RSS_URL = 'https://www.dr.dk/nyheder/service/feeds/allenyheder';
const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
const ROTATION_INTERVAL = 2 * 60 * 1000; // 2 minutter

// Sæt styling (JS-injektion hvis ønsket)
injectTextBoxAndRightImageCss();

// Init MVC når DOM klar (robust: kør straks hvis DOM allerede er loadet)
function initNyheder() {
  // Byg kantine-view i sektionen med id="cantineByJack"
  buildCantineView();

  const model = new FeedModel(API);
  const view = new FeedView();
  const controller = new FeedController(model, view, ROTATION_INTERVAL);
  controller.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNyheder);
} else {
  initNyheder();
}
