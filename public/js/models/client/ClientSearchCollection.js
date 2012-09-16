define(
    [
        'models/client/ClientModel'
    ],
    function (ClientModel)
    {

        var ClientSearchCollection;

        ClientSearchCollection = Backbone.Collection.extend({
            url:function ()
            {
                return "api/clients/searchExtended/" + this.searchString
            },
            model:ClientModel
        });

        return ClientSearchCollection;

    })
;
