define('layoutManager', ['jquery'],
    function ($) {
        "use strict";
        return function (config) {
            var layoutEl = $('#' + config.layoutElId),
                pagesEls = $('.' + config.pageElClass, layoutEl),
                pageIdSuffix = config.pageIdSuffix;

            return {
                displayPage: function (page) {
                    var targetScreen = layoutEl.find('#' + page + pageIdSuffix),
                        currentScreen = layoutEl.find('#' + config.oldHash + pageIdSuffix),
                        nextDivFromCurrentScreen = currentScreen.next(),
                        prevFromCurrentScreen = currentScreen.prev(),
                        targetScreenDivId = targetScreen.attr('id'),
                        nextDivFromCurrentScreenId = nextDivFromCurrentScreen.attr('id'),
                        prevFromCurrentScreenId = prevFromCurrentScreen.attr('id'),
                        divElHeight = currentScreen.height(),
                        slide = function (leftToRight) {
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
                            }, 500);

                            currentScreen.animate({
                                'margin-left': leftToRight ? '-100%' : '100%'
                            }, 500, function () {
                                targetScreen.css('margin-top', '0px');
                                pagesEls.hide();
                                targetScreen.show();
                            });
                        };

                    if (targetScreenDivId === nextDivFromCurrentScreenId) {
                        // target screen on the left
                        slide(true);
                    } else if (targetScreenDivId === prevFromCurrentScreenId) {
                        // target screen on the right
                        slide(false);
                    }
                }
            };
        };
    });