(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

export default function analytics(app) {

    if (app.config.googleAnalytics && app.config.googleAnalytics.id) {
        ga('create', app.config.googleAnalytics.id, 'auto');
    }

    const send = function (...args) {
        if (app.config.googleAnalytics && app.config.googleAnalytics.on) {
            ga('send', ...args);
        }
        if (app.config.googleAnalytics && app.config.googleAnalytics.log) {
            console.log('[GA]', ...args);
        }
    };

    app.$watch('world.location', () => {
        send('pageview', app.world.location);
    }, {immediate: true});

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
