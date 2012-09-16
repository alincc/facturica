define(
    [
        'text!tpl/client/Detail.html'
    ],
    function (DetailTemplate)
    {
        var ClientDetailView;

        ClientDetailView = Backbone.View.extend({

            events:{
                "click #delete":"handleDelete"
            },

            initialize:function ()
            {
                console.log('ClientDetailView:initialize');
                this.template = _.template(DetailTemplate);

                //this.model.bind("change", this.render, this);
                this.model.bind("destroy", this.close, this);
            },

            render:function ()
            {
                var data = this.model.toJSON();
                $(this.el).html(this.template(data));
                $(this.el).find("input,textarea").attr("readonly", true);
                return this;
            },

            handleDelete:function (e)
            {
                e.preventDefault();

                if (confirm('Esti sigur ca vrei sa stergi clientul ' + this.model.get("name") + '?'))
                {
                    this.model.destroy({wait:true});

                    this.trigger('delete-success');

                    return true;
                }

                return false;
            }
        });

        return ClientDetailView;
    });
