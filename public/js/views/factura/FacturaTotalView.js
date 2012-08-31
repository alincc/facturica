define(function()
{
    var FacturaTotal = Backbone.View.extend({
        initialize:function ()
        {
            console.log('FacturaTotal:initialize');
            if (this.model != null)
            {
                this.model.bind("reset", this.render, this);
            }
        },

        render:function()
        {
            var data = this.model;
            $(this.el).empty();
            if (data != null)
            {
                $(this.el).append(
                        '<tr><td>Valoare fara TVA</td><td class="numeric">' + _(data.get('subtotal')).money() + ' lei</td></tr>' +
                                '<tr><td>TVA</td><td class="numeric">' + _(data.get('vat')).money() + ' lei</td></tr>' +
                                '<tr><td>Total</td><td class="numeric">' + _(data.get('total')).money() + ' lei</td></tr>');
            }
        }
    });
    return FacturaTotal;

})