/**
 * @name scheduler
 * @module scheduler
 */
define('scheduler', function () {
    "use strict";
    /**
     * @lends scheduler
     * @exports scheduler
     * @version 0.4
     */
    return {
        /**
         * Return a new scheduler
         * @return {Object} Scheduler
         */
        getScheduler: function () {
            /**
             * event queue
             * @type {Array}
             * @memberOf Scheduler#
             * @private
             * @field
             */
            var events = [];

            /**
             * @class Scheduler
             */
            return {
                /**
                 * true if the scheduler is now processing events
                 * @type {boolean}
                 * @memberOf Scheduler#
                 * @field
                 */
                isRunning: false,
                /**
                 * add event (first in first out)
                 * @param {function} event callback to execute
                 * @param {number} time time delay
                 * @throws First argument to scheduler.queue must be a function
                 * @throws Second argument to scheduler.queue must be an integer
                 * @memberOf Scheduler#
                 * @example
                 *  var customScheduler = scheduler.getScheduler();
                 *      customScheduler.queue(function () {
                 *          doSomething();
                 *      }, 500);
                 *      customScheduler.run();
                 */
                queue: function (event, time) {
                    if (!event || typeof (event) !== "function") {
                        throw "First argument to scheduler.queue must be a function";
                    }
                    if (time === null || typeof (time) !== "number") {
                        throw "Second argument to scheduler.queue must be an integer";
                    }

                    events.push([ event, time ]);
                },

                /**
                 * execute queued events
                 * @memberOf Scheduler#
                 */
                run: function () {
                    if (!this.isRunning) { // don't run twice
                        this.isRunning = true;
                        this.next();
                    }
                },

                /**
                 * execute next event
                 * @memberOf Scheduler#
                 */
                next: function () {
                    // return if no events
                    if (!events || events.length === 0) {
                        this.isRunning = false;
                        if (this.onComplete && typeof (this.onComplete) === "function") {
                            this.onComplete();
                        }
                        return null;
                    }

                    if (this.isRunning) {
                        // get next event - FIFO
                        var eventObject = events[0], // next event
                            event = eventObject[0],
                            time = eventObject[1],
                            self = this;

                        setTimeout(
                            function () {
                                if (self.isRunning) {
                                    event();
                                    events.shift(); // take event off queue
                                    self.next();
                                }
                            },
                            time
                        );
                    }
                },

                /**
                 * empty event queue
                 * @memberOf Scheduler#
                 */
                clear: function () {
                    events = [];
                },

                /**
                 * pause execution of scheduled events without emptying event queue
                 * @memberOf Scheduler#
                 */
                pause: function () {
                    this.isRunning = false;
                },

                /**
                 * stop execution of scheduled events and empty event queue
                 * @memberOf Scheduler#
                 */
                stop: function () {
                    this.pause();
                    this.clear();
                },

                /**
                 * [optional]
                 * callback when all events are processed
                 * @type {function}
                 * @memberOf Scheduler#
                 * @field
                 */
                onComplete: null,

                /**
                 * return copy of events queue
                 * @return {Array} copy of events queue
                 * @memberOf Scheduler#
                 */
                getEventsQueue: function () {
                    return events.slice();
                }
            };
        }
    };
});