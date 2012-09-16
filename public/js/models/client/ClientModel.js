define(
    [
        'backbone',
        'models/client/PartnerModel'
    ], function (Backbone, PartnerModel)
    {
        var ClientModel;

        ClientModel = Backbone.NestedModel.extend({

            urlRoot:"api/clients",

            defaults:{
                partner:{}
            },

            validate: function()
            {

            },

            validation:{
                'partner':function (value)
                {
                    if (!this.silent)
                    {
                        if ($.trim(value.name) == '')
                        {
                            return 'Trebuie un nume pentru client'
                        }
                    }
                }
            }

        });

        return ClientModel;
    })