require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery',
        'signals': 'lib/signals',
        'crossroads': 'lib/crossroads',
        'hasher': 'lib/hasher'
    }
});

define('app', ['jquery', 'layoutManager', 'router'],
    function ($, layoutManager, router) {
        'use strict';

        $(function () {
            var config = {
                    layoutEl: $('#layout'),
                    pageIdSuffix: '',
                    pageElClass: 'page',
                    animationDuration: 300
                },
                layoutManagerInst = layoutManager(config),
                routerInst = router(layoutManagerInst, config, 'slide1'),
                currentSlideId = 1,
                pagesNumber = $(".page").length;

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
