/**
 |---------------------------------
 | CallbackRing
 |---------------------------------
 | A class that keeps a list of callbacks and calls them on a given interval,
 | looping at the end of the list.
 */

export default class CallbackRing
{
    /**
     * Create
     * @param  {int} time millisecond interval to wait between calls
     * @return {void}
     */
    constructor(time) {
        this.list = [];
        this.timeout = null;
        this.time = time;
        this.index = -1;
    }

    /**
     * Add a callback to the list
     * @param {Function} callback - receives no parameters
     * @return {void}
     */
    add(callback) {
        this.remove(callback);
        this.list.push(callback);
    }

    /**
     * Removes a callback from the list
     * @param  {Function} callback - must be the same reference
     * @return {void}
     */
    remove(callback) {
        this.list = this.list.filter(element => element !== callback);
    }

    /**
     * Start the queue. No callbacks will be called until this method is
     * called. When this is called, the first callback will be called
     * immediately, and each subsequent callback will be called in turn after
     * intervals. When the end of the list is reached, the process will start
     * over from the beginning.
     * @return {void}
     */
    start() {
        if (this.timeout) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.start();
        }, this.time)
        this.index = (this.index + 1) % this.list.length;
        this.list[this.index]();
    }

    /**
     * Stop the queue. No more callbacks will be called after this.
     * @return {void}
     */
    stop() {
        if (!this.timeout) {
            return;
        }
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}
