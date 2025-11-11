import { BusScheduleController } from './controller/busScheduleController.js';
import BusScheduleModel from './model/busScheduleModel.js';
import BusScheduleView from './view/busScheduleView.js';

const model = new BusScheduleModel();
const view = new BusScheduleView('#busScheduleByMathias');
// Poll interval: 300000ms = 5 minutes
const controller = new BusScheduleController(model, view, { poll: 300000 });
controller.start();
window.app = { model, view, controller };
