define('app', ['lib/jquery', 'layoutManager', 'router'],
    function ($, layoutManager, router) {
        'use strict';

        $(function () {
            var config = {
                    layoutEl: $('#layout'),
                    pageIdSuffix: '-page',
                    pageElClass: 'page',
                    animationDuration: 300
                },
                layoutManagerInst = layoutManager(config),
                routerInst = router(layoutManagerInst, config, 'home');

            routerInst.init();

            // adding onclick events on each button
            $('input').each(function () {
                $(this).on('click', function (event) {
                    routerInst.setHash(this.id);
                    event.preventDefault();
                });
            });
        });

        return {
            // TODO: make an object
        };
    });
