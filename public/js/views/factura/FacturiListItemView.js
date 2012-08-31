define(
        [
            'text!tpl/factura/ListItem.html'
        ]
        ,
        function(listItemTemplate)
        {
            var FacturiListItemView = Backbone.View.extend({

                tagName:"tr",

                initialize:function ()
                {
                    console.log('FacturiListItemView:initialize');

                    this.template = _.template(listItemTemplate);
                    this.model.bind("change", this.render, this);

                    _.bindAll("render");
                },

                render:function (eventName)
                {
                    $(this.el).html(this.template(this.model.toJSON()));
                    return this;
                }

            });

            return FacturiListItemView;
        });