require.config({
    baseUrl:'js',
    paths:{
        'jquery':'lib/jquery',
        'signals':'lib/signals',
        'crossroads':'lib/crossroads',
        'hasher':'lib/hasher'
    }
});

define('app', ['jquery', 'layoutManager', 'router'],
    function ($, layoutManager, router) {
        $(function () {
            'use strict';
            var config = {
                    layoutElId:'layout',
                    pageIdSuffix:'-page',
                    pageElClass:'page'
                },
                layoutManagerInst = layoutManager(config),
                routerInst = router(layoutManagerInst, config, 'home');

            routerInst.init();

            // adding onclick events on each button
            $('input').each(function (index) {
                $(this).on('click', function (event) {
                    routerInst.setHash(this.id);
                    event.preventDefault();
                });
            });
        });

        return {
            // TODO: make an object
        }
    }
);