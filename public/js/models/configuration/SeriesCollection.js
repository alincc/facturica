define(
        ['models/configuration/Serie'],
        function(Serie)
        {
            var SeriesCollection = Backbone.Collection.extend({
                model: Serie,

                url:"api/configSeries"
            });

            return SeriesCollection;
        })