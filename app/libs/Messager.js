/*
 |---------------------------
 | Messager
 |---------------------------
 | A Messager is a queue of objects. Each object will be the Messager.message
 | value for `time` milliseconds, and then the next one in the queue will
 | replace it.
 */
export default class Messager
{
    constructor(time) {
        this.messages = [];
        this.message = null;
        this.timeout = null;
        this.time = time;
    }

    queue(message) {
        this.messages.push(message);
        this.start();
        return this;
    }

    clear() {
        this.messages.splice(0);
        this.stop();
        return this;
    }

    start() {
        if (this.timeout) {
            return;
        }
        if (this.messages.length === 0) {
            this.message = null;
            return;
        }
        this.message = this.messages.shift();
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.start();
        }, this.time);
    }

    stop() {
        if (!this.timeout) {
            return;
        }
        clearTimeout(this.timeout);
        this.timeout = null;
        this.message = null;
    }
};
