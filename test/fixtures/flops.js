/**
 |------------------------
 | flops.js
 |------------------------
 | Provides an estimate of this system's flops and a function to estimate the
 | operation count of a callback.
 */
const before = new Date();
for (let i = 0; i < 1000000; i++) {
    i % 1001;
}
const after = new Date();

const flopms = 1000000 / (after.valueOf() - before.valueOf());

export default flopms * 1000;

export function estimateOperations(cb) {
    const start = new Date();
    cb();
    const finish = new Date();
    const ms = finish.valueOf() - start.valueOf();
    return ms * flopms;
}
