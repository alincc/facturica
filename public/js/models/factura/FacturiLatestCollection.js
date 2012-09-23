define(
    ['models/factura/FacturaModel'],
    function (FacturaModel)
{
    var FacturiLatestCollection = Backbone.Collection.extend({
        url:"api/facturi/latest",
        model: FacturaModel
    });

    return FacturiLatestCollection;
});