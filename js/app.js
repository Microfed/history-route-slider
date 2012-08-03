require.config({
    baseUrl: 'js/lib',
    paths:{
        'app': 'js'
    }
});

define('app', ['jquery', 'signals', 'crossroads', 'hasher'],
    function ($, _signals, crossroads, hasher) {
        $(function () {
            // setup crossroads
            crossroads.addRoute('pages/{page}', function (page) {
                $('div.page').hide();
                $('div#' + page + '-page').show();
            });

            // setup hasher
            function parseHash(newHash, oldHash) {
                crossroads.parse(newHash);
            }

            hasher.initialized.add(parseHash); // parse initial hash
            hasher.changed.add(parseHash); // parse hash changes
            hasher.init(); // start listening for history change

            // update URL fragment generating new history record
            hasher.setHash('pages/home');

            // adding onclick events on each button
            $('input').each(function (index) {
                $(this).on('click', function (event) {
                    hasher.setHash('pages/' + this.id);
                });
            });
        });

        return {
            // TODO: make an object
        }
    }
);