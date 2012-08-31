define('Router',
    [
        'order!Underscore',
        'order!Backbone'
    ],
    function (_, Backbone)
    {

        var AppRouter = Backbone.Router.extend({

        });

        var initialize = function ()
        {
            console.log("Router initialize");
            var app_router = new AppRouter;

            Backbone.history.start();
        };
        return {
            initialize:initialize
        };

    });