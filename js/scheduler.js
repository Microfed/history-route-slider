/**
 * @module scheduler
 */
define('scheduler', function () {
    "use strict";
    return {
        /**
         * Return a new scheduler
         * @return {Object} Scheduler
         */
        getScheduler: function () {
            /**
             * event queue
             * @type {Array}
             * @property events
             * @private
             */
            var events = [];
            /**
             * @class Scheduler
             */
            return {
                /**
                 * true if the scheduler is now processing events
                 * @type {boolean}
                 * @for Scheduler
                 * @property isRunning
                 */
                isRunning: false,
                /**
                 * add event (first in first out)
                 * @param {function} event callback to execute
                 * @param {number} time time delay
                 * @throws First argument to scheduler.queue must be a function
                 * @throws Second argument to scheduler.queue must be an integer
                 * @method queue
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
                 * @method run
                 */
                run: function () {
                    if (!this.isRunning) { // don't run twice
                        this.isRunning = true;
                        this.next();
                    }
                },

                /**
                 * execute next event
                 * @method next
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
                 * @method clear
                 */
                clear: function () {
                    events = [];
                },

                /**
                 * pause execution of scheduled events without emptying event queue
                 * @method pause
                 */
                pause: function () {
                    this.isRunning = false;
                },

                /**
                 * stop execution of scheduled events and empty event queue
                 * @method stop
                 */
                stop: function () {
                    this.pause();
                    this.clear();
                },

                /**
                 * [optional]
                 * callback when all events are processed
                 * @type {function}
                 * @property onComplete
                 */
                onComplete: null,

                /**
                 * return copy of events queue
                 * @return {Array} copy of events queue
                 * @method getEventsQueue
                 */
                getEventsQueue: function () {
                    return events.slice();
                },

                /**
                 * Return true, if events queue is empty and false otherwise.
                 * @return {Boolean}
                 * @method isEventsQueueEmpty
                 */
                isEventsQueueEmpty: function () {
                    return events.length === 0;
                }
            };
        }
    };
});
