export default class CallbackRing
{
    constructor(time) {
        this.list = [];
        this.timeout = null;
        this.time = time;
        this.index = -1;
    }

    add(callback) {
        this.remove(callback);
        this.list.push(callback);
    }

    remove(callback) {
        this.list = this.list.filter(element => element !== callback);
    }

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

    stop() {
        if (!this.timeout) {
            return;
        }
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}
