define(
    [
        'text!tpl/factura/Latest.html'
    ],
    function (LatestTemplate)
{
    var FacturaLatestView = Backbone.View.extend({
        initialize: function()
        {
            this.template = _.template(LatestTemplate)
        },

        render:function ()
        {
            console.log('FacturaLatestView:render');

            $(this.el).empty();

            var data = this.model.models;

            if (data && data.length > 0)
            {
                $(this.el).html(this.template(data[0].toJSON()));
            }
        }
    });

    return FacturaLatestView;
});