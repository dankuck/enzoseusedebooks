/**
 |------------------------
 | flops.js
 |------------------------
 | Provides an estimate of this system's flops and a function to estimate the
 | operation count of a callback.
 */

// The time we will measure
let time = 1;
// The operations we will perform
let ops = 500000;
// The minimum time we'll accept to ensure a good count
let targetTime = 100;

// Run op number of operations and see if it's at least targetTime.
// If it's not, increase ops and try again.
do {
    // If the time is nowhere near the right time, only double the ops since we
    // don't have any idea how to get close.
    // If the time is pretty close to the right time, attempt to get just a
    // little over the target time.
    ops = time < targetTime / 2
        ? ops << 2
        : ops * (1.1 * targetTime / time);
    const before = new Date();
    for (let i = 0; i < ops; i++) {
        i % 1001;
    }
    const after = new Date();
    time = (after.valueOf() - before.valueOf());
} while (time < targetTime);

// Known floating point operations per measured millisecond
const flopms = ops / time;

// Export flops since that's what this library is called
export default flopms * 1000;

// Export this handy measuring function too
export function estimateOperations(cb) {
    const start = new Date();
    cb();
    const finish = new Date();
    const ms = finish.valueOf() - start.valueOf();
    return Math.round(ms * flopms);
}
