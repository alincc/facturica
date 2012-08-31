define(
    [
        'backbone',
        'models/client/PartnerModel'
    ], function (Backbone, PartnerModel)
    {
        var ClientModel;

        ClientModel = Backbone.Model.extend({

            urlRoot:"api/clients",

            defaults:{
                partner:new PartnerModel()
            },

            init:function ()
            {
                this.set('partner', new PartnerModel());
            },

            validate:function (attrs)
            {
                if (!attrs._silent)
                {
                    if (_.isEmpty(attrs.partner.name))
                    {
                        return "Name cannot be null";
                    }
                }
            }

//            validate:function(attrs){
//                partner:{
//                    required:true,
//                    validation:{
//                        name:{
//                            required:true,
//                            msg:"Numele este obligatoriu"
//                        },
//
//                        email:{
//                            required:false,
//                            pattern:'email'
//                        }
//                    }
//                }
//            }

        });

        return ClientModel;
    })