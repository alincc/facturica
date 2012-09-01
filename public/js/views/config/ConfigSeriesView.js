define(
    [
        'text!tpl/config/ConfigSeriesListView.html'
    ],
    function (ConfigSeriesListViewTemplate)
    {
        'use strict';

        var ConfigSeriesView = Backbone.View.extend({

            tagName:'div',

            events:{
                'click .rowClick':'editSerie'
            },

            initialize:function ()
            {
                this.template = _.template(ConfigSeriesListViewTemplate);
            },

            render:function ()
            {
                var el = $(this.el);
                el.html(this.template({model:this.model}));

                return this;
            },

            editSerie:function (e)
            {
                e.preventDefault();
                var id = $(e.currentTarget).attr('data-id');
                this.trigger('show', {id:id});
            }

        });

        return ConfigSeriesView;
    });