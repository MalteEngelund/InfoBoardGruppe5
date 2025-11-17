// main.js — bootstrapper for app'en. Importerer controller og starter app'en når DOM er klar.

// Importer app-controller (module) — mappen hedder "controler" (én 'l')
import Controller from './controler/controller.js';

// Hoved-bootstrap: start controller når DOM er klar. Hvis DOM allerede er loaded, kør straks.
function startApp() {
  Controller.init('cantineByJack');
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}