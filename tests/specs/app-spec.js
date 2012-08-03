require(['app'], function (app) {
    'use strict';
    describe("App", function () {
        it("should return defined object", function () {
            expect(app).toBeDefined();
        });
    });
});