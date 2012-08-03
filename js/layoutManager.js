define('layoutManager', ['jquery'],
    function ($) {
        "use strict";
        return function (config) {
            var layoutEl = $('#' + config.layoutElId),
                pagesEls = $('.' + config.pageElClass, layoutEl),
                pageIdSuffix = config.pageIdSuffix,
                layoutManager = {
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
                             *  height of each element is identical + float: left;
                             *
                             *  @param {boolean} leftToRight Set sliding direction
                             */
                                slide = function (leftToRight, callback) {
                                var cssMarginTop = '-' + divElHeight + 'px';

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
                                    if (undefined !== callback && callback) {
                                        callback();
                                    }
                                });
                            };

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
                    }
                };

            return layoutManager;
        };
    });