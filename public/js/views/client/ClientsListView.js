define(
    [
        'views/client/ClientsListItemView'
    ],
    function (ClientsListItemView)
    {
        "use strict";

        var ClientsListView = Backbone.View.extend({

            initialize:function ()
            {
                console.log('ClientsListView:initialize');
                this.model.bind("reset", this.render, this);
            },

            render:function (eventName)
            {
                _.each(this.model.models, function (itemModel)
                {
                    $(this.el).append(new ClientsListItemView({
                        model:itemModel
                    }).render().el);
                }, this);

                return this;
            }
        });

        return ClientsListView;
    });