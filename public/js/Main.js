(function () {
    "use strict";

    require.config({
        paths:{
            jquery:"libs/jquery/jquery-1.7.1.min",
            jqueryUI:"libs/jquery-ui/js/jquery-ui-1.8.18.custom.min",
            underscore:"libs/backbone/lodash",
            backbone:"libs/backbone/backbone",
            backboneValidation:"libs/backbone.validation/backbone.validation.min",
            bootstrap:"libs/bootstrap/js/bootstrap"
        },
        shim:{
            jquery:{
                exports:'$'
            },
            underscore:{
                exports:'_'
            },
            backbone:{
                deps:['jquery', 'underscore'],
                exports:'Backbone'
            },
            backboneValidation:{
                deps:['backbone'],
                exports:'Validation'
            },
            bootstrap:['jquery']
        }
    });

    require([
        'jquery',
        'underscore',
        'backbone',
        'App',
        'bootstrap',
        'utils/BackboneMixin',
        'utils/UnderscoreMixin'

    ],
        function ($, _, Backbone, app) {
            $(function () {
                var router = new app();

                Backbone.history.start();

                $.datepicker.setDefaults({dateFormat:'dd/mm/yy'});
                $(".alert").alert();

                //window.messages = new MessageManager();

                jQuery.fn.extend({
                    scrollToMe:function () {
                        var x = jQuery(this).position().top - 100;
                        jQuery('body').animate({scrollTop:x}, 200);
                        //$(window).scrollTop(this.position().top)
                    }});
            });
        });
})();

define("main", function () {
});