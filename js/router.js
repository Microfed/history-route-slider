define('router', ['crossroads', 'hasher'],
    function (crossroads, hasher) {
        "use strict";
        /**
         * @describe Returns a configured router object
         * @param {Object} layoutManager Instance of layoutManager
         * @param {Object} config Configuration for router and layoutManager
         * @param {String} firstPageName Name of the page to show when router is initialized
         * @return {Object} Configured router object
         */
        return function (layoutManager, config, firstPageName) {
            /**
             * @describe contain methods for hash (URL) routing.
             */
            return {
                /**
                 * @describe initializing router and rigging it with
                 * layoutManager for handling route changes
                 */
                init: function () {
                    // layout updates every time the URL meets the condition defined in first arg
                    crossroads.addRoute('{page}', layoutManager.displayPage);

                    // setup hasher
                    function parseHash(newHash, oldHash) {
                        if (config.oldHash !== oldHash) {
                            // we need old state for proper slide animation on layout
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
                /**
                 * @describe Setting hash (part of page URL)
                 * @param {String} hash Value to set
                 */
                setHash: function (hash) {
                    hasher.setHash(hash);
                }
            };
        };
    });