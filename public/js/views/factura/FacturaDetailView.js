define(
    [
        'controls/DataGrid',
        'views/factura/FacturaTotalView',
        'text!tpl/factura/Detail.html',
        'text!tpl/factura/OtherDetails.html',
        'text!tpl/factura/EditListItemView.html'
    ],
    function (DataGrid, FacturaTotalView, DetailTemplate, OtherDetailsTemplate, EditListItemViewTemplate)
    {
        var FacturaDetailView = Backbone.View.extend({

            events:{
                "click #delete":"handleDelete"
            },

            initialize:function ()
            {
                console.log('FacturaDetailView:initialize');
                this.template = _.template(DetailTemplate);
            },

            render:function ()
            {
                var me = this,
                    otherDetailsTemplate,
                    el = $(me.el);

                el.html(me.template(me.model.toJSON()));

                // Other details view section rendering
                otherDetailsTemplate = _.template(OtherDetailsTemplate, me.model.toJSON());
                $('#altele', el).html(otherDetailsTemplate);

                el.find("input,textarea").attr("readonly", true);

                me.listView = new DataGrid({
                    el:$('#facturaItemsBody', el),
                    model:me.model.items,
                    disabled:true,
                    itemRenderer:EditListItemViewTemplate
                });
                me.listView.render();

                // Statistics
                me.stats = new FacturaTotalView({
                    el:$('#stats', el),
                    model:me.model
                });
                me.stats.render();

                return me;
            },

            handleDelete:function ()
            {
                if (confirm("Esti sigur ca vrei sa stergi factura " + this.model.get("docNo") + "?"))
                {
                    this.model.destroy();
                    this.model.trigger('delete-success');
                }
                return false;
            }

        });

        return FacturaDetailView;
    });