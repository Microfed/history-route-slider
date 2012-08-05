define('layoutManager', ['jquery', 'scheduler'],
    function ($, scheduler) {
        "use strict";
        var animationScheduler = scheduler.getScheduler();

        return function (config) {
            var layoutEl = config.layoutEl,
                pagesEls = $('.' + config.pageElClass, layoutEl),
                pageIdSuffix = config.pageIdSuffix,
                /**
                 * @describe contain methods for work with screens
                 *  on the page.
                 */
                layoutManager = {
                    currentScreen: null,
                    /**
                     * @describe Animates the show of the page
                     * @param {String} page Page id
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
                             *  @describe Moves two html-elements in the way that
                             *  it seems like sequential sliding. It assumes that
                             *  height of each element is identical;
                             *
                             *  @param {boolean} leftToRight Set sliding direction
                             */
                            slide = function (leftToRight, callback) {
                                // skip the page movement animation, if the is a callback
                                if (undefined !== callback && callback) {
                                    callback();
                                } else {
                                    var cssMarginTop = '-' + divElHeight + 'px',
                                        duration = config.animationDuration + 20; // duration of event for scheduler

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
                                }
                            };

                        // set current screen to target
                        layoutManager.currentScreen = targetScreen;

                        if (targetScreenDivId === nextDivFromCurrentScreenId) {
                            // target screen on the left
                            slide(true, null);
                        } else if (targetScreenDivId === prevFromCurrentScreenId) {
                            // target screen on the right
                            slide(false, null);
                        } else if (nextDivFromCurrentScreenId !== undefined) {
                            // target screen on the left far away from current
                            config.oldHash = targetScreenDivId;
                            slide(true, layoutManager.displayPage(nextDivFromCurrentScreenId));
                        } else if (prevFromCurrentScreenId !== undefined) {
                            // target screen on the right far away from current
                            config.oldHash = targetScreenDivId;
                            slide(false, layoutManager.displayPage(prevFromCurrentScreenId));
                        }

                        animationScheduler.run();
                    },
                    getCurrentScreen: function () {
                        return layoutManager.currentScreen[0];
                    }
                };

            return layoutManager;
        };
    });