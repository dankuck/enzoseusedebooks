/**
 |------------------
 | wait(ms)
 |------------------
 | Call `wait(ms)` to get a Promise that resolves after `ms` seconds.
 |
 | In the future, it would be cool to be able to cancel() it.
 */

export default (ms) => new Promise(resolve => setTimeout(resolve, ms));
