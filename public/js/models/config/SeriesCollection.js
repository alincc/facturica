define(
    [
        'models/config/SerieModel'
    ],
    function (SerieModel)
    {
        "use strict";

        var SeriesCollection = Backbone.Collection.extend({
            model:SerieModel,

            url:"api/configSeries"
        });

        return SeriesCollection;
    });