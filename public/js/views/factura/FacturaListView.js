define(
        [
                'views/factura/FacturiListItemView'
        ],
        function(FacturiListItemView)
{
    var FacturiListView = Backbone.View.extend({

        initialize:function ()
        {
            console.log('FacturiListView:initialize');

            this.model.bind("reset", this.render, this);
            _.bindAll("render");
        },

        render:function (eventName)
        {
            _.each(this.model.models, function (m)
            {
                $(this.el).append(new FacturiListItemView({model:m}).render().el);

            }, this);

            return this;
        }
    });

    return FacturiListView;
})