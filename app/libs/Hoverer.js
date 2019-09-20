/*
 |---------------------------
 | Hoverer
 |---------------------------
 | A Hoverer holds a message until it is replaced by another call to `hover()`
 | or cleared by a call to `unhover()`.
 |
 | It exposes a property `message`.
 */

export default class Hoverer
{
    /**
     * Create
     * @param  {int} time milliseconds to wait after `unhover`
     */
    constructor(time) {
        this.message = null;
        this.time = time;
        this.timeout = null;
        this.holder = null;
    }

    /**
     * Sets the message and a reference to use to `unhover` later
     * @param  {any} holder  E.g., the component that is calling or an id
     * @param  {any} message
     * @return {void}
     */
    hover(holder, message) {
        this.message = message;
        this.holder = holder;
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    /**
     * Clears the message if it was set with the given holder
     * @param  {any} holder The same holder given to `hover`
     * @return {void}
     */
    unhover(holder) {
        this.timeout = setTimeout(() => {
            if (this.holder === holder) {
                this.message = null;
                this.timeout = null;
            }
        }, this.time);
    }
}
