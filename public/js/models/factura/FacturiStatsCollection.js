define(function ()
{
    var FacturiStatsCollection = Backbone.Collection.extend({
        url:"api/facturi/stats"
    });

    return FacturiStatsCollection;
});