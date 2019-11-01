export default {
    /**
     * Show the development tools button
     * @type {Boolean}
     */
    developmentMode: true,

    /**
     * How long flash messages should be shown before going away or moving to
     * the next message
     * @type {Number} milliseconds
     */
    messagerSpeed: 2500,

    /**
     * How long hover names should be shown after the mouse leaves the hovered
     * item. Hovering over a new item will immediately replace the message,
     * disregarding this number.
     * @type {Number} milliseconds
     */
    hovererLag: 250,

    /**
     * How long the auto-hover mechanism should linger on each item.
     * @type {Number} milliseconds
     */
    autoHoverSpeed: 3000,

    /**
     * What about Google Analytics?
     */
    googleAnalytics: {
        /**
         * Send events to Google Analytics
         * @type {Boolean}
         */
        on: false,

        /**
         * Show Google Analytics activity in console?
         * @type {Boolean}
         */
        log: true,
    },
};
