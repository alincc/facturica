define([
    'text!tpl/HomeView.html'
],
    function (HomeViewHtml)
    {

        var HomeView = Backbone.View.extend({

            initialize:function ()
            {
                console.log('HomeView initialized');
                this.template = _.template(HomeViewHtml);
            },

            render:function (eventName)
            {
                $(this.el).html(this.template());
                return this;
            }

        })

        return HomeView;

    });

