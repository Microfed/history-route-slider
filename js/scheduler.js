define('scheduler', function () {
    "use strict";

    return {
        /**
         * @describe Return a new scheduler
         * @return {Object} Scheduler
         */
        getScheduler: function () {
            /**
             * @describe event queue
             * @type {Array}
             */
            var events = [],
                /**
                 * @describe true if the scheduler is now processing events
                 * @type {boolean}
                 */
                isRunning = false;

            return {
                /**
                 * @describe add event (first in first out)
                 * @param {function} event callback to execute
                 * @param {number} time time delay
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
                 * @describe execute queued events
                 */
                run: function () {
                    if (!isRunning) { // don't run twice
                        isRunning = true;
                        this.next();
                    }
                },

                /**
                 * @describe execute next event
                 */
                next: function () {
                    // return if no events
                    if (!events || events.length === 0) {
                        isRunning = false;
                        if (this.onComplete && typeof (this.onComplete) === "function") {
                            this.onComplete();
                        }
                        return;
                    }

                    if (isRunning) {
                        // get next event - FIFO
                        var eventObject = events[0], // next event
                            event = eventObject[0],
                            time = eventObject[1],
                            self = this;

                        setTimeout(
                            function () {
                                if (isRunning) {
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
                 * @describe empty event queue
                 */
                clear: function () {
                    events = [];
                },

                /**
                 * @describe pause execution of scheduled events without emptying event queue
                 */
                pause: function () {
                    isRunning = false;
                },

                /**
                 * @describe stop execution of scheduled events and empty event queue
                 */
                stop: function () {
                    this.pause();
                    this.clear();
                },

                /**
                 * [optional]
                 * @describe  callback when all events are processed
                 * @type {function}
                 */
                onComplete: null,

                /**
                 * @describe return copy of events queue
                 * @return {Array} copy of events queue
                 */
                getEventsQueue: function () {
                    return events.slice();
                }
            };
        }
    };
});