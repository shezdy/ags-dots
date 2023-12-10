export default class Mutex {
  _queue = [];
  _isLocked = false;

  /**
   * wait until the lock is acquired
   * @returns a function that releases the acquired lock
   */
  acquire() {
    return new Promise((resolve) => {
      this._queue.push({ resolve });
      this._dispatch();
    });
  }

  /**
   * enqueue a function to be run exclusively.
   *
   * @param callback function to be run exclusively
   * @returns the return value of "callback"
   */
  async runExclusive(callback, ...args) {
    const release = await this.acquire();
    try {
      return await callback(...args);
    } catch (e) {
      console.error(e);
    } finally {
      release();
    }
  }

  _dispatch() {
    if (this._isLocked) return; // wait

    const entry = this._queue.shift();
    if (!entry) return; // done because empty

    this._isLocked = true;

    const releaseFun = () => {
      this._isLocked = false; // unlock the resource
      this._dispatch(); // and call dispatch
    };

    entry.resolve(releaseFun);
  }
}
