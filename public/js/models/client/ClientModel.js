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
                partner:new PartnerModel()
            },

            init:function ()
            {
                this.set('partner', new PartnerModel());
            },

            validation:{
                partner:{
                    required:true,
                    validation:
                    {
                        name:
                        {
                            required:true,
                            msg:'Numele este obligatoriu'
                        },

                        email:
                        {
                            required:false,
                            pattern:'email'
                        }
                    }
                }
            }

        });

        return ClientModel;
    })