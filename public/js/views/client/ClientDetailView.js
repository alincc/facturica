define(
    [
        'text!tpl/client/Detail.html'
    ],
    function (DetailTemplate)
    {
        "use strict";

        var ClientDetailView = Backbone.View.extend({

            events:{
                "click #delete":"handleDelete"
            },

            initialize:function ()
            {
                console.log('ClientDetailView:initialize');
                this.template = _.template(DetailTemplate);
                this.model.bind("change", this.render, this);
                this.model.bind("destroy", this.close, this);
            },

            render:function (eventName)
            {
                var data = this.model.toJSON();
                $(this.el).html(this.template(data));
                $(this.el).find("input,textarea").attr("readonly", true);
                return this;
            },

            handleDelete:function ()
            {
                if (confirm("Esti sigur ca vrei sa stergi clientul " + this.model.get("name") + "?"))
                {
                    this.model.destroy();
                    app.navigate("#/clienti", true);
                }
                return false;
            }

        })

        return ClientDetailView;
    });
