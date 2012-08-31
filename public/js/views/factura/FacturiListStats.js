define(function ()
{
    var FacturiListStats = Backbone.View.extend({
        render:function ()
        {
            $(this.el).empty();

            var data = this.model.models;

            if (data.length > 0)
            {
                $(this.el).append(
                    '<tr><td>Valoare fara TVA</td><td class="numeric">' + _(data[0].get('subtotal')).money() + ' lei</td></tr>' +
                        '<tr><td>TVA</td><td class="numeric">' + _(data[0].get('vat')).money() + ' lei</td></tr>' +
                        '<tr><td>Total</td><td class="numeric">' + _(data[0].get('total')).money() + ' lei</td></tr>');
            }
        }
    });

    return FacturiListStats;
});