window.FacturiListPage = Backbone.View.extend({
    tagName:"ul",

    className:"unstyled",

    events:{
        "click #reload":"handleReload",
        "click #delete":"handleDelete",
        "click #duplicate":"handleDuplicate",
        "click #filter":"handleFilter",
        "click #print":"handlePrint"
    },

    initialize:function ()
    {
        console.log('FacturiListPage:initialize');
        this.template = _.template(tpl.get('factura/List'));
        this.model.bind("reset", this.render, this);
    },

    render:function ()
    {
        var me = this;
        $(me.el).html(me.template({ model:me.model }));

        if (me.model.length > 0)
        {
            me.listView = new FacturiListView({
                el:$('#listView', me.el),
                model:me.model
            });
            me.listView.render();

            var coll = new FacturiStatsCollection();
            coll.fetch({success:function ()
            {
                me.stats = new FacturiListStats({
                    el:$("#stats", me.el),
                    model:coll
                });
                me.stats.render();
            }});

            $(me.el).find("#selectAll").click(me.handleSelectAll);
        }
        else
        {
            $("#listView", me.el).html("Nu exista facturi emise.");
        }

        return me;
    },

    handleReload:function ()
    {
        this.model.fetch();
    },

    handleSelectAll:function ()
    {
        var elements = $(this).closest("table").find(":checkbox");

        if ($(this).is(":checked"))
        {
            // Select all
            select = true;
        }
        else
        {
            // Unselect all
            select = false;
        }

        elements.each(function (index, ctrl)
        {
            $(ctrl).attr("checked", select);
        })
    },

    handleDelete:function ()
    {
        var elements = $("#listView").find(":checked");

        if (elements.length > 0 && confirm("Confirmati stergerea documentelor selectate?"))
        {
            elements.each(function (index, ctrl)
            {
                var ctrl = $(ctrl);
                var docid = ctrl.siblings("input[type='hidden']").val();
                if (docid != "")
                {
                    var model = new FacturaModel({id:docid});
                    model.destroy();
                    model = null;
                    ctrl.closest('tr').hide('highlight');
                }
            });

            this.handleReload();
        }
    },

    handleDuplicate:function ()
    {
        var element = $("#listView").find(".doc:checked").first();

        if (element != null)
        {
            console.log(element);

            var ctrl = $(element);
            var docid = ctrl.siblings("input[type='hidden']").val();

            if (docid != "")
            {
                app.navigate("/facturaNouaDup/" + docid, true);
            }
        }
    },

    handleFilter:function ()
    {
        var filter = $("#filterList");

        filter.toggle();
    },

    handlePrint:function ()
    {

    }
});

window.FacturiListView = Backbone.View.extend({

    initialize:function ()
    {
        console.log('FacturiListView:initialize');

        this.model.bind("reset", this.render, this);
        _.bindAll("render");
    },

    render:function (eventName)
    {
        _.each(this.model.models, function (m)
        {
            $(this.el).append(new FacturiListItemView({
                model:m
            }).render().el);

        }, this);

        return this;
    }
});

window.FacturiListItemView = Backbone.View.extend({

    tagName:"tr",

    initialize:function ()
    {
        console.log('FacturiListItemView:initialize');

        this.template = _.template(tpl.get('factura/ListItem'));
        this.model.bind("change", this.render, this);
        _.bindAll("render");
    },

    render:function (eventName)
    {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.FacturaDetail = Backbone.View.extend({

    events:{
        "click #delete":"handleDelete"
    },

    initialize:function ()
    {
        console.log('FacturaDetail:initialize');
        this.template = _.template(tpl.get('factura/Detail'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName)
    {
        var me = this;

        var el = $(me.el);
        el.html(me.template(me.model.toJSON()));
        el.find("input,textarea").attr("readonly", true);

        me.listView = new DataGrid({
            el:$('table.factura tbody', el),
            model:me.model.items,
            disabled:true,
            itemRenderer:'factura/EditListItemView'
        });
        me.listView.render();

        me.stats = new FacturaTotal({
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

})

window.FacturiListStats = Backbone.View.extend({
    render:function ()
    {
        $(this.el).empty();

        var data = this.model.models;

        if (data.length > 0)
        {
            $(this.el).append(
                '<tr><td>Valoare fara TVA</td><td class="numeric">' + _(data[0].get('subtotal')).money() + ' lei</td></tr>' +
                    '<tr><td>TVA</td><td class="numeric">' + _(data[0].get('vat')).money() + ' lei</td></tr>' +
                    '<tr><td>Total</td><td class="numeric">' + _(data[0].get('total')).money() + ' lei</td></tr>');
        }
    }
})

window.FacturaTotal = Backbone.View.extend({
    initialize:function ()
    {
        console.log('FacturaTotal:initialize');
        if (this.model != null)
        {
            this.model.bind("reset", this.render, this);
        }
    },

    render:function ()
    {
        var data = this.model;
        $(this.el).empty();
        if (data != null)
        {
            $(this.el).append(
                '<tr><td>Valoare fara TVA</td><td class="numeric">' + _(data.get('subtotal')).money() + ' lei</td></tr>' +
                    '<tr><td>TVA</td><td class="numeric">' + _(data.get('vat')).money() + ' lei</td></tr>' +
                    '<tr><td>Total</td><td class="numeric">' + _(data.get('total')).money() + ' lei</td></tr>');
        }
    }
})