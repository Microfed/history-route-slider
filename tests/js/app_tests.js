require.config({
    baseUrl:'../../js/lib',
    paths:{
        app:'../js'
    }
});


require(["app"], function (app) {

    TestCase('IsSupportedTest', {

        'test should support version greater than one':function () {
            assertTrue(true);
        },
        'test for normal':function () {
            assertNotUndefined(app);
        }
    });

});