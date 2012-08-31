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
        var FacturaDetail = Backbone.View.extend({

            events:{
                "click #delete":"handleDelete"
            },

            initialize:function ()
            {
                console.log('FacturaDetail:initialize');
                this.template = _.template(DetailTemplate);
                this.model.bind("change", this.render, this);
                this.model.bind("destroy", this.close, this);
            },

            render:function (eventName)
            {
                var me = this;

                // Other details view section rendering
                otherDetailsTemplate = _.template(OtherDetailsTemplate);
                me.model.set('otherDetailsTemplateHtml', otherDetailsTemplate(me.model.toJSON()));

                var el = $(me.el);
                el.html(me.template(me.model.toJSON()));
                el.find("input,textarea").attr("readonly", true);

                me.listView = new DataGrid({
                    el:$('table.factura tbody', el),
                    model:me.model.items,
                    disabled:true,
                    itemRenderer:EditListItemViewTemplate
                });
                me.listView.render();

                me.stats = new FacturaTotalView({
                    el:$('#stats', me.el),
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
                    app.navigate("/facturi", true);
                }
                return false;
            }

        });

        return FacturaDetail;
    })