// main.js — bootstrapper for app'en. Importerer controller og starter app'en når DOM er klar.

// Importer app-controller (module)
import Controller from './controller/controller.js';

// Hoved-bootstrap: starter controller når DOM er klar.
document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});