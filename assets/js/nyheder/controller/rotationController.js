export class RotationController {
  constructor(callback, interval = 2 * 60 * 1000) {
    this.callback = callback;
    this.interval = interval;
    this.timer = null;
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.callback(), this.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
