(function ()
{
    'use strict';

    require.config({
        paths:{
            jquery:'libs/jquery/jquery-1.7.1.min',
            jqueryUI:'libs/jquery-ui/js/jquery-ui-1.8.18.custom.min',
            underscore:'libs/backbone/lodash',
            backbone:'libs/backbone/backbone',
            backboneValidation:'libs/backbone.validation/backbone-validation-min',
            backboneNested:'libs/backbone-nested/backbone-nested-v1.1.2.min',
            bootstrap:'libs/bootstrap/js/bootstrap'
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
        'utils/UnderscoreMixin',

        'backboneNested',
        'backboneValidation',
        'bootstrap'
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