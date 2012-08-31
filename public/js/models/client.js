window.ClientModel = Backbone.NestedModel.extend({

    urlRoot:function ()
    {
        return "api/clients";
    },

    url:function ()
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
        partner:{
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
        }
    },

    validation:{
        partner:{
            required:true,
            validation:{
                name:{
                    required:true,
                    msg:"Numele este obligatoriu"
                },

                email:{
                    required:false,
                    pattern:'email'
                }
            }
        }
    }

});

window.ClientsSearchCollection = Backbone.Collection.extend({
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
})

window.ClientsCollection = Backbone.Collection.extend({
    model:ClientModel,

    url:"api/clients"
})
