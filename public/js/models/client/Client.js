define(function()
{
    var ClientModel = Backbone.Model.extend({

        urlRoot: function()
        {
            return "api/clients";
        },

        url: function()
        {
            if (this.isNew())
            {
                return "api/clients";
            }
            else
            {
                return "api/clients/" + this.id.toString();
            }
        },

        defaults:{
            partner:
            {
                name: '',
                fiscalCode: '',
                regcom: '',
                address: '',
                city: '',
                bankAccount: '',
                bankName: '',
                contact: '',
                email: '',
                phone: ''
            }
        },

        validation:
        {
            partner: {
                required: true,
                validation: {
                    name: {
                        required: true,
                        msg: "Numele este obligatoriu"
                    },

                    email: {
                        required: false,
                        pattern: 'email'
                    }
                }
            }
        }

    });

    return ClientModel;
})