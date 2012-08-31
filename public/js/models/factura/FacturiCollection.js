define(['models/factura/Factura'],
        function(FacturaModel)
        {
            var FacturiCollection = Backbone.Collection.extend({
                model:FacturaModel,
                url:"api/facturi"
            });

            return FacturiCollection;
        });