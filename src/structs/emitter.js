const EventEmitter = require("events");
export default class BDEvents extends EventEmitter {
    dispatch(eventName, ...args) {
        this.emit(eventName, ...args);
    }

    off(eventName, eventAction) {
        this.removeListener(eventName, eventAction);
    }
}