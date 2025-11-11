// ...existing code...
import BusScheduleModel from './model/busScheduleModel.js';
import BusScheduleView from './view/busScheduleView.js';
import BusScheduleController from './controller/busScheduleController.js';

// safe to run immediately because module scripts are deferred
const model = new BusScheduleModel();
const view = new BusScheduleView('#busScheduleByMathias');
const controller = new BusScheduleController(model, view, { poll: 30000 });
controller.start();
window.app = { model, view, controller };
