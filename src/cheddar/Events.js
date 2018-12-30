// this class controls events
class Events {
  constructor() {
    this.queue = {};
  }

  // creates an event with a callback
  on(name, cb) {
    this.queue[name] = {};
    this.queue[name].cb = cb;
    this.queue[name].emitted = true;
  }

  // emits data and calls the callback created on the previous method
  emit(name, data) {
    this.queue[name].data = data;
    this.queue[name].emitted = true;
    this.queue[name].cb();
  }

  // resets the emition of the event so callback can be called again
  reset(name) {
    if (this.queue[name]) {
      this.queue[name].emitted = false;
    }
  }

  // returns if event was emitteed or not
  emitted(name) {
    return this.queue[name].emitted;
  }

  // gets data from event
  data(name) {
    return this.queue[name].data;
  }
}
module.exports = Events;
