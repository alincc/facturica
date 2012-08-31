define(
    [
        'models/client/ClientModel',
        'backbone'
    ],
    function (ClientModel, Backbone)
    {
        var ClientsCollection;

        ClientsCollection = Backbone.Collection.extend({
            model:ClientModel,
            url:"api/clients"
        });

        return ClientsCollection;
    });