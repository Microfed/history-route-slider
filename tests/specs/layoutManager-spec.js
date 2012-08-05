require(['layoutManager'], function (layoutManager) {
    'use strict';
    describe("LayoutManager", function () {
//        beforeEach(function () {
//            jasmine.getFixtures().fixturesPath = '/fixtures';
//            loadFixtures('index.html');
//        });

        it("should return defined object", function () {
            expect(layoutManager).toBeDefined();
        });

        describe("getCurrentPage", function () {
            it("should return current page", function () {
                var html = '<div id="layout">\
                    <div id="home-page" class="page">\
                    </div>\
                    <div id="first-page" class="page">\
                    </div>\
                </div>',
                    config = {
                        layoutEl: $('#layout', $(html)),
                        pageIdSuffix: '-page',
                        pageElClass: 'page',
                        animationDuration: 1
                    },
                    layoutManagerInst = layoutManager(config);

                waitsFor(function () {
                    layoutManagerInst.displayPage('first');
                    return layoutManagerInst.getCurrentScreen() === $('#first-page')[0];
                }, "current page should be set to 'first-page'", 50);
            });
        });

        describe("getCurrentPage", function () {
            it("should return null if current page is not set", function () {
                var config = {
                        layoutEl: $('.some.element'),
                        pageIdSuffix: '-page',
                        pageElClass: 'page',
                        animationDuration: 300
                    },
                    layoutManagerInst = layoutManager(config);
                expect(layoutManagerInst.getCurrentScreen()).toBeNull();
            });
        });


    });
});