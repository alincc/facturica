define(
    function ()
    {
        var PartnerModel = Backbone.NestedModel.extend({
            defaults:{
                name:'',
                fiscalCode:'',
                regcom:'',
                address:'',
                city:'',
                bankAccount:'',
                bankName:'',
                contact:'',
                email:'',
                phone:''
            },

            validate:function(attr){},

            validation:{
                name:{
                    required:true,
                    msg:'Numele este obligatoriu'
                },

                email:{
                    required:false,
                    pattern:'email'
                }
            }
        })

        return PartnerModel;
    });