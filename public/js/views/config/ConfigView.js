define(
    [
        'text!tpl/config/ConfigView.html'
    ],
    function (ConfigViewTemplate)
    {
        'use strict';

        var ConfigView = Backbone.View.extend({

            tagName:'div',

            events:{
            },

            initialize:function ()
            {
                this.template = _.template(ConfigViewTemplate);
            },

            render:function ()
            {
                var el = $(this.el);
                el.html(this.template());

                return this;
            }
        });

        return ConfigView;

    });