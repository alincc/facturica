define(
        [
            'models/client/Client'
        ],
        function(Client)
        {
            var ClientsSearchCollection = Backbone.Collection.extend({
                model: Client,

                url:"api/clients/search",

                findByName: function(name)
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