/**
 * @module router
 * @requires crossroads
 * @requires hasher
 */
define('router', ['crossroads', 'hasher'],
    function (crossroads, hasher) {
        "use strict";
        /**
         * @exports layoutManager
         * @version 0.2
         */

        /**
         * Returns a configured router object
         * @param {Object} layoutManager Instance of layoutManager
         * @param {Object} config Configuration for router and layoutManager
         * @param {String} firstPageName Name of the page to show when router is initialized
         * @return {Object} Configured router object
         * @constructor  Router
         * @example
         *  var config = {
         *   layoutEl: $('#layout'),
         *   pageIdSuffix: '-page',
         *   pageElClass: 'page',
         *   animationDuration: 300
         *   },
         *   layoutManagerInst = layoutManager(config),
         *   routerInst = router(layoutManagerInst, config, 'home');
         */
        return function (layoutManager, config, firstPageName) {
            /**
             * Contain methods for hash (URL) routing.
             * @class Router
             */
            return {
                /**
                 * Initializing router and rigging it with
                 * layoutManager for handling route changes
                 * @memberOf  Router#
                 */
                init: function () {
                    // layout updates every time the URL meets the condition defined in first arg
                    crossroads.addRoute('{page}', layoutManager.displayPage);

                    // setup hasher
                    function parseHash(newHash, oldHash) {
                        if (newHash && oldHash) {
                            // we need old state for proper slide animation on layout
                            config.oldHash = oldHash;
                            crossroads.parse(newHash);
                        }
                    }

                    hasher.initialized.add(parseHash); // parse initial hash
                    hasher.changed.add(parseHash); // parse hash changes
                    hasher.init(); // start listening for history change


                    config.oldHash = firstPageName;
                    // update URL fragment generating new history record
                    hasher.setHash(firstPageName);
                },
                /**
                 * Setting hash (part of page URL)
                 * @param {String} hash Value to set
                 * @memberOf  Router#
                 */
                setHash: function (hash) {
                    hasher.setHash(hash);
                }
            };
        };
    });