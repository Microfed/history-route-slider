/**
 * Created by JetBrains PhpStorm.
 * User: Admin
 * Date: 02.08.12
 * Time: 18:49
 */

require.config({
    baseUrl:'js/lib',
    paths:{
        app:'js'
    }
});

require(['atom', 'signals', 'crossroads', 'hasher'],
    function (_atom, _signals, crossroads, hasher) {
        atom.dom(function () {
            //setup crossroads
            crossroads.addRoute('foo');
            crossroads.addRoute('lorem/ipsum');
            crossroads.routed.add(console.log, console); //log all routes

            //setup hasher
            function parseHash(newHash, oldHash){
                crossroads.parse(newHash);
            }
            hasher.initialized.add(parseHash); //parse initial hash
            hasher.changed.add(parseHash); //parse hash changes
            hasher.init(); //start listening for history change

            //update URL fragment generating new history record
            //hasher.setHash('lorem/ipsum');
        });
    }
);