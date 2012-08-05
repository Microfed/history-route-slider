require(['scheduler'], function (scheduler) {
    'use strict';
    describe("Scheduler", function () {
        it("should return defined object", function () {
            expect(scheduler).toBeDefined();
        });

        it("should not expose an event array to the public", function () {
            var emptyScheduler = scheduler.getScheduler();

            expect(scheduler.events).toBeUndefined();
        });

        describe("getScheduler", function () {
            it("should return new object every time it's called", function () {
                var first = scheduler.getScheduler(),
                    second = scheduler.getScheduler();

                expect(first).not.toBe(second);
            });

        });

        describe("getEventQueue", function () {
            it("should return empty array if no event wasn't been added", function () {
                var emptyScheduler = scheduler.getScheduler();

                expect(emptyScheduler.getEventsQueue()).toEqual([]);
            });

            it("should return array with added events", function () {
                var schedulerWithEvents = scheduler.getScheduler();

                schedulerWithEvents.queue(function () {
                }, 0);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(1);
            });
        });
    });
});