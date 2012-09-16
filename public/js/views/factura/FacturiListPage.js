define([
    'text!tpl/factura/List.html',

    'models/factura/FacturiStatsCollection',
    'models/factura/FacturaModel',

    'views/factura/FacturaListView',
    'views/factura/FacturiListStatsView'
],
    function (listTemplate, FacturiStatsCollection, FacturaModel, FacturiListView, FacturiListStatsView)
    {

        var FacturiListPage = Backbone.View.extend({
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
                this.template = _.template(listTemplate);
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

                    var facturiStatsCollection = new FacturiStatsCollection();
                    facturiStatsCollection.fetch({
                        success:function (a)
                        {
                            new FacturiListStatsView({
                                el:$("#stats", me.el),
                                model:a
                            }).render();
                        },
                        error:function()
                        {
                            console.log('Error loading FacturiStatsCollection');
                        }
                    });

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

                var select = $(this).is(":checked");

                elements.each(function (index, ctrl)
                {
                    $(ctrl).attr("checked", select);
                })
            },

            handleDelete:function (e)
            {
                e.preventDefault();

                var elements = $("#listView").find(":checked"), me = this;

                if (elements.length > 0 && confirm("Confirmati stergerea documentelor selectate?"))
                {
                    elements.each(function (index, ctrl)
                    {
                        var docIdSib = $(ctrl).siblings("input[type='hidden']").val();
                        if (docIdSib != "")
                        {
                            var invoice = me.model.get(docIdSib);
                            invoice.destroy();
                            me.model.remove(invoice);

                            $(ctrl).closest('tr').hide('highlight');
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
                    var docId = ctrl.siblings("input[type='hidden']").val();

                    if (docId != "")
                    {
                        App.navigate("/factura/" + docId + "/edit", true);
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

        return FacturiListPage;

    });