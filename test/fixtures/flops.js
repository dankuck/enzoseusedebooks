/**
 |------------------------
 | flops.js
 |------------------------
 | Provides an estimate of this system's flops and a function to estimate the
 | operation count of a callback.
 */
let time = 0;
let ops = 500000;

// retry this loop until time is at least 4 ms
do {
    ops = ops << 2; // double ops each time
    const before = new Date();
    for (let i = 0; i < ops; i++) {
        i % 1001;
    }
    const after = new Date();
    time = (after.valueOf() - before.valueOf());
} while (time < 4);

const flopms = ops / time;

export default flopms * 1000;

export function estimateOperations(cb) {
    const start = new Date();
    cb();
    const finish = new Date();
    const ms = finish.valueOf() - start.valueOf();
    return Math.round(ms * flopms);
}
