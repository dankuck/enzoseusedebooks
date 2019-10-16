/**
 |------------------------
 | flops.js
 |------------------------
 | Provides an estimate of this system's flops and a function to estimate the
 | operation count of a callback.
 |
 | On any given system a call to `estimateOperations(() => ... some code ...)`
 | should yield similar results. The speed of the system should not affect the
 | outcome, but the state of the system can affect it. Best practice is to
 | accept the result as long as it is under a certain boundary value.
 |
 | To find that value, run the function a few times and round up to some higher
 | boundary. If future runs go over that ops count, it may be due to some
 | change or failure in the code under test.
 */

/**
 * Run a few million ops and see how long they take in order to find an
 * estimate of the system's flops (in ms, though).
 * @return {int} operations per millisecond
 */
const measureSystem = function () {
    // The time we will measure, start at an arbitrarily low value
    let time = 1;

    // The operations we will perform, start at arbitrarily low value
    let ops = 500000;

    // The minimum time we'll need to spend to ensure a good count.
    // Since this will always be an integer, we should have a large enough
    // value to ensure we get a statistically useful result.
    let targetTime = 100;

    // Run op number of operations and see if it's at least targetTime.
    // If it's not, increase ops and try again.
    do {
        // If the time is pretty close to the right time, attempt to get just a
        // little over the target time.
        // Do not more than double the ops, or we could go way off the rails.
        ops = time > targetTime / 2
            ? ops * (1.1 * targetTime / time)
            : ops << 2;
        const cb = () => {
            for (let i = 0; i < ops; i++) {
                i % 1001;
            }
        };
        const [start, result, finish] = [
            Date.now(),
            cb(),
            Date.now(),
        ];
        time = finish - start;
    } while (time < targetTime);

    return ops / time;
};

/**
 * The measured floating-point operations per millisecond
 * @type {float}
 */
const flopms = measureSystem();

/**
 * @var int - Floating point operations per second
 */
export default Math.round(flopms * 1000);

/**
 * Run a callback and estimate the number of operations it required.
 * @param  {Function} cb the code to run
 * @return {int}      estimated count of operations
 */
export function estimateOperations(cb) {
    const [start, result, finish] = [
        Date.now(),
        cb(),
        Date.now(),
    ];
    const ms = finish - start;
    return Math.round(ms * flopms);
}
