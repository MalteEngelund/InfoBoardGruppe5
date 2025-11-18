// main.js — bootstrapper for app'en. Importerer controller og starter app'en når DOM er klar.

// Importer app-controller (module) — mappen hedder "controler" (én 'l')
import Controller from './controler/controller.js';

// Export a ready promise that resolves when the kantine controller has rendered.
function startApp() {
  return Controller.init('cantineByJack');
}

export const ready = (function() {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    return startApp();
  }
  return new Promise((resolve, reject) => {
    document.addEventListener('DOMContentLoaded', () => {
      startApp().then(resolve).catch(reject);
    }, { once: true });
  });
})();