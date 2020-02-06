/*
 |---------------------------
 | Messager
 |---------------------------
 | A Messager is a queue of values. Each value will be the `message` value
 | for `time` milliseconds, and then the next one in the queue will replace it.
 | Finally it will equal null.
 |
 | It exposes a property `message`.
 */

export default class Messager
{
    /**
     * Create
     * @param  {int} time Milliseconds to show a message
     */
    constructor(time) {
        this.messages = [];
        this.message = null;
        this.timeout = null;
        this.time = time;
    }

    /**
     * Add a message to the queue and ensure the queue is running. Return a
     * Promise that resolves when the message has finished showing.
     * @param  {any} message
     * @return {Promise}
     */
    queue(message) {
        return new Promise(resolve => {
            this.messages.push({message, resolve});
            this.start();
        });
    }

    /**
     * Clear the queue and clear any current message, too
     * @return {this}
     */
    clear() {
        this.messages.splice(0);
        this.stop();
        return this;
    }

    /**
     * Start the queue. If the queue is already running, do nothing. If there
     * are no more messages, clear the current one and do nothing else.
     * @return {void}
     */
    start() {
        if (this.timeout) {
            return;
        }
        if (this.messages.length === 0) {
            this.message = null;
            return;
        }
        const {message, resolve} = this.messages.shift();
        this.message = message;
        this.timeout = setTimeout(() => {
            resolve();
            this.timeout = null;
            this.start();
        }, this.time);
    }

    /**
     * Stop the queue. If there is no queue running, do nothing.
     * @return {void}
     */
    stop() {
        if (!this.timeout) {
            return;
        }
        clearTimeout(this.timeout);
        this.timeout = null;
        this.message = null;
    }
};
