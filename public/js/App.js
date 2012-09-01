define('App',
    [
        'Router'
    ],
    function (AppRouter)
    {
        "use strict";

        var initialize = function ()
        {
            console.log("Router initialize");
            var app_router = new AppRouter;

            Backbone.history.start();


            $.datepicker.setDefaults({dateFormat:'dd/mm/yy'});
            $(".alert").alert();

            jQuery.fn.extend({
                scrollToMe:function ()
                {
                    var x = jQuery(this).position().top - 100;
                    jQuery('body').animate({scrollTop:x}, 200);
                    //$(window).scrollTop(this.position().top)
                }});
        };

        return {
            initialize:initialize
        };
    }
);