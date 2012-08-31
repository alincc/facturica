define(
    [
        'models/client/ClientModel'
    ],
    function (ClientModel)
    {
        var ClientsSearchCollection = Backbone.Collection.extend({
            model:ClientModel,

            url:"api/clients/search",

            findByName:function (name)
            {
                var url = 'api/clients/search/' + name;

                var self = this;
                $.ajax({
                    url:url,
                    dataType:"json",
                    success:function (data)
                    {
                        console.log("search success: " + data.length);
                        self.reset(data);
                    }
                });
            }
        });

        return ClientsSearchCollection;
    }
)