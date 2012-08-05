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

        describe("queue", function () {
            var schedulerWithEvents;

            beforeEach(function () {
                schedulerWithEvents = scheduler.getScheduler();
            });

            it("should add event to events queue", function () {
                schedulerWithEvents.queue(function () {
                }, 0);
                schedulerWithEvents.queue(function () {
                }, 0);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(2);
            });

            it("should throw exception when first argument is not a function", function () {
                expect(function () {
                    schedulerWithEvents.queue({}, 0);
                }).toThrow("First argument to scheduler.queue must be a function");
            });

            it("should throw exception when first argument is null", function () {
                expect(function () {
                    schedulerWithEvents.queue(null, 0);
                }).toThrow("First argument to scheduler.queue must be a function");
            });

            it("should throw exception when second argument is not a number", function () {
                expect(function () {
                    schedulerWithEvents.queue(function () {
                    }, {});
                }).toThrow("Second argument to scheduler.queue must be an integer");
            });

            it("should throw exception when second argument is null", function () {
                expect(function () {
                    schedulerWithEvents.queue(function () {
                    }, null);
                }).toThrow("Second argument to scheduler.queue must be an integer");
            });
        });

        describe("run", function () {
            var schedulerWithEvents;

            beforeEach(function () {
                schedulerWithEvents = scheduler.getScheduler();
                jasmine.Clock.useMock();
            });

            it("should fire the next event in the queue", function () {
                var testValue = null;

                schedulerWithEvents.queue(function () {
                    testValue = 1;
                }, 0);

                schedulerWithEvents.run();
                jasmine.Clock.tick(100);
                expect(testValue).toEqual(1);
            });

            it("should fire every event in queue one after another", function () {
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.run();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(0);
            });

            it("should not fire events when scheduler is already running", function () {
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.isRunning = true;
                schedulerWithEvents.run();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(1);
            });
        });

        describe("next", function () {
            var schedulerWithEvents;

            beforeEach(function () {
                schedulerWithEvents = scheduler.getScheduler();
                jasmine.Clock.useMock();
            });

            it("should return null if the is no events in the queue", function () {
                var schedulerWithoutEvents = scheduler.getScheduler(),
                    nextReturned = schedulerWithoutEvents.next();

                jasmine.Clock.tick(100);

                expect(nextReturned).toBeNull();
            });

            it("should not fire event if scheduler is paused", function () {
                var testValue = null;
                schedulerWithEvents.queue(function () {
                    testValue = {};
                }, 1);

                schedulerWithEvents.pause();
                schedulerWithEvents.next();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(1);
                expect(testValue).toBeNull();
            });

            it("should fire every event in the queue one after another when scheduler is running", function () {
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.isRunning = true;
                schedulerWithEvents.next();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(0);
            });

            it("should execute onComplete function after playing all events in the queue", function () {
                var onCompleteExecuted = false;
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.onComplete = function () {
                    onCompleteExecuted = true;
                };

                schedulerWithEvents.isRunning = true;
                schedulerWithEvents.next();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(0);
                expect(onCompleteExecuted).toBeTruthy();
            });

            it("should set isRunning property to false after executing all events in the queue", function () {
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.isRunning = true;
                schedulerWithEvents.next();
                jasmine.Clock.tick(100);

                expect(schedulerWithEvents.isRunning).toBeFalsy();
            });
        });

        describe("clear", function () {
            it("should erase event queue", function () {
                var schedulerWithEvents = scheduler.getScheduler();
                schedulerWithEvents.queue(function () {
                }, 1);
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.clear();

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(0);
            });
        });

        describe("pause", function () {
            it("should paused scheduler when it's running", function () {
                var schedulerWithEvents = scheduler.getScheduler();
                schedulerWithEvents.isRunning = true;
                schedulerWithEvents.pause();

                expect(schedulerWithEvents.isRunning).toBeFalsy();
            });
        });

        describe("stop", function () {
            it("should erase event queue and paused scheduler when it's running", function () {
                var schedulerWithEvents = scheduler.getScheduler();
                schedulerWithEvents.queue(function () {
                }, 1);

                schedulerWithEvents.stop();

                expect(schedulerWithEvents.getEventsQueue().length).toEqual(0);
                expect(schedulerWithEvents.isRunning).toBeFalsy();
            });
        });

        describe("onComplete", function () {
            it("should be null by default", function () {
                var schedulerWithEvents = scheduler.getScheduler();

                expect(schedulerWithEvents.onComplete).toBeNull();
            });
        });
    });
});