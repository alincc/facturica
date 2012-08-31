define(
    [
        'text!tpl/client/ListItem.html'
    ],
    function (ListItemTemplate)
    {
        "use strict";

        var ClientsListItemView;

        ClientsListItemView = Backbone.View.extend({

            tagName:"li",

            initialize:function ()
            {
                console.log('ClientsListItemView:initialize');
                this.template = _.template(ListItemTemplate);
                this.model.bind("change", this.render, this);
                this.model.bind("destroy", this.close, this);
            },

            render:function (eventName)
            {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            }

        });

        return ClientsListItemView;
    });