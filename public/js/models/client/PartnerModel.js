define(
    function ()
    {
        var PartnerModel = Backbone.Model.extend({
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

            validate: function(attrs)
            {
                if(name == '')
                    return false;
            }
        })

        return PartnerModel;
    });