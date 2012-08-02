require.config({
    baseUrl:'js/lib',
    paths:{
        app:'js'
    }
});

require(['atom', 'signals', 'crossroads', 'hasher'],
    function (_atom, _signals, crossroads, hasher) {
        atom.dom(function () {
            // setup crossroads
            crossroads.addRoute('pages/{page}', function(page){
                atom.dom('.page').css('display', 'none');
                atom.dom('#' + page + '-page').css('display', 'block');
            });

            // setup hasher
            function parseHash(newHash, oldHash){
                crossroads.parse(newHash);
            }
            hasher.initialized.add(parseHash); // parse initial hash
            hasher.changed.add(parseHash); // parse hash changes
            hasher.init(); // start listening for history change

            // update URL fragment generating new history record
            hasher.setHash('pages/home');

            // adding onclick events on each button
            atom.dom('input').each(function (input, index) {
                atom.dom(input).bind({click: function () {
                    hasher.setHash('pages/' + input.id);
                }});
            });
        });
    }
);