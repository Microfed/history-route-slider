define('router', ['crossroads', 'hasher'],
    function (crossroads, hasher) {
        "use strict";
        return function (layoutManager, config, firstPageName) {
            return {
                init: function () {
                    crossroads.addRoute('{page}', layoutManager.displayPage);
                    // setup hasher
                    function parseHash(newHash, oldHash) {
                        if (config.oldHash !== oldHash) {
                            config.oldHash = oldHash;
                        }
                        crossroads.parse(newHash);
                    }

                    hasher.initialized.add(parseHash); // parse initial hash
                    hasher.changed.add(parseHash); // parse hash changes
                    hasher.init(); // start listening for history change

                    // update URL fragment generating new history record
                    hasher.setHash(firstPageName);
                },
                setHash: function (hash) {
                    hasher.setHash(hash);
                }
            };
        };
    });