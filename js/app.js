define('app', ['jquery', 'layoutManager', 'router'],
    function ($, layoutManager, router) {
        'use strict';

        $(function () {
            var trimHash = function (hash) {
                    if (!hash) {
                        return '';
                    }
                    var regexp = new RegExp('^#/', 'g');
                    return hash.replace(regexp, '');
                },
                layoutManagerInst,
                routerInst,
                currentSlideId = 1,
                pagesNumber = $(".page").length,
                firstSlide = 'slide1',
                firstPage = firstSlide,
                config = {
                    layoutEl: $('#layout'),
                    pageIdSuffix: '',
                    pageElClass: 'page',
                    animationDuration: 300,
                    firstPage: firstPage,
                    firstSlide: firstSlide
                };

            layoutManagerInst = layoutManager(config);
            routerInst = router(layoutManagerInst, config);
            routerInst.init();

            $('.slide-prev').on('click', function () {
                if (currentSlideId !== 1) {
                    currentSlideId -= 1;
                }
                routerInst.setHash('slide' + currentSlideId);
                event.preventDefault();
            });

            $('.slide-next').on('click', function () {
                if (currentSlideId !== pagesNumber) {
                    currentSlideId += 1;
                }
                routerInst.setHash('slide' + currentSlideId);
                event.preventDefault();
            });
        });

        return {
            // TODO: make an object
        };
    });
