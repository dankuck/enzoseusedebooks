/**
 |----------------------
 | intercept
 |----------------------
 | Give this an object and the methods you want to replace on that object.
 | This will replace those methods, run your callback, and then reset the
 | object to its original state.
 |
 | Use the callback parameter `done` if you're going to do something async.
 | Call `done` when you're done.
 |
 | intercept will collect all the calls made to the routines you named
 | and give them back at the end as an array in this format:
 |  [
 |    [routine_name_as_string, args_as_array]
 |    ...
 |  ]
 |
 | If you ran in async mode (by using a `done` parameter in your callback)
 | the call array is passed to your `then`.
 |
 | If you ran in sync mode (by using no parameter in your callback), the
 | call array is returned from intercept.
 */

/**
 * @param  {object}   on
 * @param  {string|array<string>}   routines
 * @param  {Function} cb
 * @return {array|Promise}
 */
export default function intercept(on, routines, cb) {
    const calls = [];
    if (! (routines instanceof Array)) {
        routines = [routines];
    }
    const originals = {};
    routines.forEach(routine => originals[routine] = on[routine]);
    routines.forEach(routine => on[routine] = (...args) => calls.push({routine, args}));
    const reset = () => {
        routines.forEach(routine => on[routine] = originals[routine]);
    };
    if (cb.length > 0) {
        return new Promise((resolve, reject) => {
            cb(err => {
                reset();
                if (err) {
                    reject(err);
                } else {
                    resolve(calls);
                }
            });
        });
    } else {
        cb();
        reset();
        return calls;
    }
};
