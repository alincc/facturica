define(function ()
{
    var FacturaStatModel = Backbone.Model.extend({
    });

    var FacturiStatsCollection = Backbone.Collection.extend({
        url:"api/facturi/stats",
        model: FacturaStatModel
    });

    return FacturiStatsCollection;
});