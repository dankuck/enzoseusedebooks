/**
 |-------------------
 | Scheduler
 |-------------------
 | You want to schedule code to be executed later. You also want it to be
 | JSON-safe. Well the Scheduler is for you, friend.
 |
 | After you create this object, you need to `setTarget` to the object you want
 | to run calls on. Whenever you want to schedule an action, call `schedule`
 | with the milliseconds delay time and the name of the method to run.
 |
 | Your method will be run after that amount of time (at least). If you save
 | your scheduler and load it up again, the method will be run after you call
 | `setTarget` again.
 |
 | Hint: If you change your target between save and load, make sure it is
 | backwards compatible.
 |
 | Note: Catch your own errors if you need to. This won't do it for you
 */

export default class Scheduler {

    constructor(data = {}) {
        this.scheduled = [];
        this.target = null;
        this.timeouts = new Map();
        Object.assign(this, data);
    }

    setTarget(target) {
        this.target = target;
        this.start();
    }

    schedule(ms, routine) {
        const time = new Date();
        time.setMilliseconds(time.getMilliseconds() + ms);
        this.scheduled.push({time, routine});
        this.start();
    }

    start() {
        if (!this.target) {
            return;
        }
        const now = new Date();
        this.scheduled
            .filter(scheduled => !this.timeouts.has(scheduled))
            .forEach(scheduled => {
                const {routine, time} = scheduled;
                const ms = time.valueOf() - now.valueOf();
                const timeout = setTimeout(() => {
                    try {
                        this.target[routine]();
                    } catch (error) {
                        console && console.error && console.error('Scheduler error:', error);
                    }
                    this.timeouts.delete(scheduled);
                    const index = this.scheduled.indexOf(scheduled);
                    if (index >= 0) {
                        this.scheduled.splice(index, 1);
                    }
                }, ms)
                this.timeouts.set(scheduled, timeout);
            });
    }
};

Scheduler.registerReviver = function (reviver) {
    reviver.add(
        'Scheduler',
        Scheduler,
        (key, value) => new Scheduler(value),
        (key, value) => ({...value, target: null, timeouts: new Map()})
    );
};
