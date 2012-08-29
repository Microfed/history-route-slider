/**
 * @module layoutManager
 * @requires jquery
 * @requires scheduler
 */
define('layoutManager', ['jquery', 'scheduler'],
    function ($, scheduler) {
        "use strict";
        /**
         * @exports layoutManager
         * @version 0.6
         */

        /**
         * Event queue
         * @type {Object}
         * @member animationScheduler
         * @memberOf LayoutManager#
         * @private
         */
        var animationScheduler = scheduler.getScheduler();

        return function (config) {
            /**
             * Return a new configured layoutManager
             * @return {Object} layoutManager
             */
            var layoutEl = config.layoutEl,
                pagesEls = $('.' + config.pageElClass, layoutEl),
                pageIdSuffix = config.pageIdSuffix,
                /**
                 * Contain methods for work with screens
                 *  on the page.
                 *  @class LayoutManager
                 */
                    LayoutManager = {
                    /**
                     * CurrentScreen
                     * @type {HtmlObject}
                     * @memberOf LayoutManager#
                     * @field
                     */
                    currentScreen: null,
                    /**
                     * Animates the show of the page
                     * @param {String} page Page id
                     * @memberOf LayoutManager#
                     */
                    displayPage: function (page) {
                        var targetScreen = layoutEl.find('#' + page + pageIdSuffix),
                            currentScreen = layoutEl.find('#' + config.oldHash + pageIdSuffix),
                            nextDivFromCurrentScreen = currentScreen.next(),
                            prevFromCurrentScreen = currentScreen.prev(),
                            targetScreenDivId = targetScreen.attr('id'),
                            nextDivFromCurrentScreenId = nextDivFromCurrentScreen.attr('id'),
                            prevFromCurrentScreenId = prevFromCurrentScreen.attr('id'),
                            divElHeight = currentScreen.height(),
                            /**
                             *  Moves two html-elements in the way that
                             *  it seems like sequential sliding. It assumes that
                             *  height of each element is identical;
                             *
                             *  @param {boolean} leftToRight Set sliding direction
                             *  @param {function} callback
                             *  @memberOf displayPage#
                             */
                                slide = function (leftToRight) {
                                // skip the page movement animation, if the is a callback
                                var cssMarginTop = '-' + divElHeight + 'px',
                                    duration = animationScheduler.isEventsQueueEmpty() ? 0 : config.animationDuration + 20;

                                // Adding a slide animation to events queue
                                animationScheduler.queue(function () {
                                    if (leftToRight) {
                                        targetScreen.css('margin-top', cssMarginTop);
                                    } else {
                                        currentScreen.css('margin-top', cssMarginTop);
                                    }

                                    targetScreen.css('margin-left', leftToRight ? '100%' : '-100%');
                                    currentScreen.css('margin-left', '0%');

                                    targetScreen.show();

                                    targetScreen.animate({
                                        'margin-left': '0'
                                    }, config.animationDuration);

                                    currentScreen.animate({
                                        'margin-left': leftToRight ? '-100%' : '100%'
                                    }, config.animationDuration, function () {
                                        targetScreen.css('margin-top', '0px');
                                        currentScreen.css('margin-top', '0px');
                                        pagesEls.hide();
                                        targetScreen.show();
                                    });
                                }, duration);
                            };

                        // set current screen to target
                        LayoutManager.currentScreen = targetScreen[0];

                        if (targetScreenDivId === nextDivFromCurrentScreenId) {
                            // target screen on the left
                            slide(true);
                        } else if (targetScreenDivId === prevFromCurrentScreenId) {
                            // target screen on the right
                            slide(false);
                        }

                        animationScheduler.run();
                    },
                    /**
                     * Returns active screen
                     * @return {HtmlElemet}
                     * @memberOf LayoutManager#
                     */
                    getCurrentScreen: function () {
                        return LayoutManager.currentScreen;
                    }
                };

            return LayoutManager;
        };
    });