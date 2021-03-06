(function ()
{
    'use strict';

    require.config({
        paths:{
            jquery:'libs/jquery/jquery-1.8.1.min',
            jqueryUI:'libs/jquery-ui/js/jquery-ui-1.8.23.custom.min',
//            underscore:'libs/backbone/lodash',
            underscore:'libs/backbone/underscore-min',
            backbone:'libs/backbone/backbone-min',
            backboneValidation:'libs/backbone.validation/backbone-validation-amd-min',
            //backboneNested:'libs/backbone-nested/backbone-nested-v1.1.2.min',
            backboneNested:'libs/backbone-nested/backbone-nested',
            bootstrap:'libs/bootstrap/js/bootstrap.min',
            backboneBindings:'libs/backbone-bindings/backbone-bindings'
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
                deps:['backbone']
            },
            backboneNested:{
                deps:['backbone']
            },
            bootstrap:{
                deps:['jquery']
            },
            backboneBindings:{
                deps:['backbone']
            }
        }
    });

    require([
        'jquery',
        'underscore',
        'backbone',
        'App',
        'bootstrap',
        'utils/BackboneMixin',
        'utils/UnderscoreMixin',

        'backboneNested',
        'backboneValidation',
        'bootstrap',
        'backboneBindings'
    ],
        function ($, _, Backbone, App)
        {
            $(function ()
            {
                App.initialize();

            });
        });
})();

define('main', function ()
{
});