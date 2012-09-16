define(
    ['text!tpl/Factura/TotalView.html'],
    function (TotalViewTemplate)
    {
        var FacturaTotal = Backbone.View.extend({
            initialize:function ()
            {
                console.log('FacturaTotal:initialize');

                this.template = _.template(TotalViewTemplate);

//            this.model.bind("sync", this.render, this);
//            this.model.bind("change", this.render, this);
//            this.model.bind("reset", this.render, this);
            },

            render:function ()
            {
                $(this.el).empty();

                if (this.model != null)
                {
                    this.updateTotals();

                    $(this.el).html(this.template(this.model.toJSON()));
                }

                return this;
            },

            updateTotals:function ()
            {
                console.log('FacturaTotalView:updateTotals');

                var total = 0, subtotal = 0, vat = 0;
                var me = this;

                if (me.model != null)
                {
                    _.each(me.model.items, function (v)
                    {
                        total += parseFloat(v.total);
                        subtotal += parseFloat(v.subtotal);
                        vat += parseFloat(v.vatAmount);
                    });
                }

                me.model.set({
                    total:total.round(2),
                    subtotal:subtotal.round(2),
                    vat:vat.round(2)
                });
            }
        });
        return FacturaTotal;

    });