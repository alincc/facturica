define([
    'text!tpl/layout/HeaderView.html'
],
    function (HeaderViewTemplate)
    {

        var HeaderView = Backbone.View.extend({

            initialize:function ()
            {
                console.log('HomeView initialized');
                this.template = _.template(HeaderViewTemplate);
            },

            render:function (eventName)
            {
                $(this.el).html(this.template());
                return this;
            },

            selectMenu: function(menuItem)
            {
                "use strict";

                console.log("Switching menu to ", menuItem)

                $(".nav li", this.el).removeClass('active');

                if (menuItem) {
                    $("a[href$=" + menuItem + "]", ".nav", this.el).parent().addClass('active');
                }
            },

            showError: function(message)
            {
                "use strict";


            }
        })

        return HeaderView;

    });

