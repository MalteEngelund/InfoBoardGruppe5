import { FeedModel } from './model/model.js';
import { FeedView } from './veiw/feedView.js';
import { FeedController } from './controller/controller.js';
import { injectTextBoxAndRightImageCss } from './utils.js';

// Konfiguration
const RSS_URL = 'https://www.dr.dk/nyheder/service/feeds/allenyheder';
const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
const ROTATION_INTERVAL = 2 * 60 * 1000; // 2 minutter

// Sæt styling (JS-injektion hvis ønsket)
injectTextBoxAndRightImageCss();

function startApp() {
  const model = new FeedModel(API);
  // Byg view inde i section#cantineByJack (tilføjer under eksisterende indhold)
  const view = new FeedView('#cantineByJack');
  console.debug('[nyheder/main] startApp - mount exists:', !!document.querySelector('#cantineByJack'), 'view.feedEl:', view.feedEl);
  const controller = new FeedController(model, view, ROTATION_INTERVAL);
  controller.init();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
