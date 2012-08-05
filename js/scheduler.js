define('scheduler', function () {
    "use strict";

    return {
        getScheduler: function () {
            return {
                // event queue
                Events: [],

                // true if the scheduler is now processing events
                IsRunning: false,

                // add event (first in first out)
                Queue: function (e, t) {
                    if (!e || typeof (e) !== "function") {
                        throw "First argument to Scheduler.Queue must be a function";
                    }
                    if (t === null || typeof (t) !== "number") {
                        throw "Second argument to Scheduler.Queue must be an integer";
                    }

                    this.Events.push([ e, t ]);
                },

                // execute queued events
                Run: function () {
                    if (!this.IsRunning) { // don't run twice
                        this.IsRunning = true;
                        this.Next();
                    }
                },

                // execute next event
                Next: function () {
                    // return if no events
                    if (!this.Events || this.Events.length === 0) {
                        this.IsRunning = false;
                        if (this.OnComplete && typeof (this.OnComplete) === "function") {
                            this.OnComplete();
                        }
                        return;
                    }

                    if (this.IsRunning) {
                        // get next event - first-in-first-out
                        var o = this.Events[0], // next event
                            e = o[0],
                            t = o[1],
                            self = this;

                        setTimeout(
                            function () {
                                if (self.IsRunning) {
                                    e();
                                    self.Events.shift(); // take event off queue
                                    self.Next();
                                }
                            },
                            t
                        );
                    }
                },

                // empty event queue
                Clear: function () {
                    this.Events = [];
                },

                // pause execution of scheduled events without emptying event queue
                Pause: function () {
                    this.IsRunning = false;
                },

                // stop execution of scheduled events and empty event queue
                Stop: function () {
                    this.Pause();
                    this.Clear();
                },

                // optional callback when all events are processed
                OnComplete: null
            };
        }
    };
});