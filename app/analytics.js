
export default function analytics(app, ga) {

    const send = function (...args) {
        if (app.config.googleAnalytics && app.config.googleAnalytics.on) {
            console.log('sending for real...');
            ga('send', ...args);
            console.log('sent for real');
        }
        if (app.config.googleAnalytics && app.config.googleAnalytics.log) {
            console.log('[GA]', ...args);
        }
    };

    app.$watch('world.location', () => {
        send('pageview', app.world.location);
    });

    app.$watch(
        () => { return [...app.world.inventory] },
        (after, before) => {
            const added = after.filter(item => ! before.includes(item));
            const removed = before.filter(item => ! after.includes(item));
            added.forEach(item => send('event', item.name, 'take'));
            removed.forEach(item => send('event', item.name, 'drop'));
        }
    );

    app.onEvent((item, action) => send('event', item, action));

};
