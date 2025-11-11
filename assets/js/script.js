import { BusScheduleController } from './controller/busScheduleController.js';
import BusScheduleModel from './model/busScheduleModel.js';

const model = new BusScheduleModel();
// view not implemented yet — pass null so controller runs without rendering
const controller = new BusScheduleController(model, null, { poll: 30000 });
controller.start();
window.app = { model, view: null, controller };
