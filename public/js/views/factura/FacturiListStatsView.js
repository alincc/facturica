define(
    [
        'text!tpl/factura/ListStatsView.html'
    ],
    function (FacturiListStatsViewTemplate)
{
    var FacturiListStatsView = Backbone.View.extend({
        initialize: function()
        {
            this.template = _.template(FacturiListStatsViewTemplate)
        },

        render:function ()
        {
            console.log('FacturiListStatsView:render');

            $(this.el).empty();

            var data = this.model.models;

            if (data && data.length > 0)
            {
                $(this.el).html(this.template(data[0].toJSON()));
            }
        }
    });

    return FacturiListStatsView;
});