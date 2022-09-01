// interface EventListeners {
//     [key: string]: <T>(key: T) => {};
// }
interface EventListeners {
  [key: string]: Array<(params?: any) => void>;
}

export default class EventEmitter {
  private _eventListeners: EventListeners = {};

  private _eventOnceListener: EventListeners = {};

  constructor() {
    this.eventReset();
  }

  eventReset() {
    if (this._eventListeners) {
      Object.keys(this._eventListeners).forEach((key: string) => {
        delete this._eventListeners[key];
      });
    }
    this._eventListeners = {};
    if (this._eventOnceListener) {
      Object.keys(this._eventOnceListener).forEach((key) => {
        delete this._eventOnceListener[key];
      });
    }
    this._eventOnceListener = {};
  }

  on(funKey: string, callback: () => void): void {
    if (!funKey) {
      throw Error('event listener funkey undefined');
    }
    if (!(callback instanceof Function)) {
      throw Error('event listener next param should be function');
    }
    if (!this._eventListeners[funKey]) {
      this._eventListeners[funKey] = [];
    }
    this._eventListeners[funKey].push(callback);
  }

  off(funKey: string): void {
    if (!funKey) {
      throw Error('event listener funkey undefined');
    }
    if (this._eventListeners[funKey]) {
      delete this._eventListeners[funKey];
    } else {
      throw Error('event listener unbind failed!');
    }
  }

  once(funKey: string, callback: () => void) {
    if (!funKey) {
      throw Error('event once listener funkey undefined');
    }
    if (!(callback instanceof Function)) {
      throw Error('event once listener next param should be function');
    }
    if (!this._eventOnceListener[funKey]) {
      this._eventOnceListener[funKey] = [];
    }
    this._eventListeners[funKey].push(callback);
  }

  emit<T>(funKey: string, params: T) {
    if (
      this._eventOnceListener && this._eventOnceListener[funKey] instanceof Array
    ) {
      const callbacks = this._eventOnceListener[funKey];
      callbacks.forEach(callback => callback(params));
      delete this._eventOnceListener[funKey];
    }
    if (
      this._eventListeners && this._eventListeners[funKey] instanceof Array
    ) {
      const callbacks = this._eventListeners[funKey];
      callbacks.forEach(callback => callback(params));
    }
  }
}
