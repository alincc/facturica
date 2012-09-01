define(
    [
        'text!tpl/factura/List.html',

        'models/factura/FacturiStatsCollection',
        'models/factura/FacturaModel',

        'views/factura/FacturaListView',
        'views/factura/FacturiListStatsView'
    ],
    function (listTemplate, FacturaModel, FacturiStatsCollection, FacturiListView, FacturiListStatsView)
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

                    var coll = new FacturiStatsCollection();
                    coll.fetch({success:function ()
                    {
                        me.stats = new FacturiListStatsView({
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
                        var docId = ctrl.siblings("input[type='hidden']").val();
                        if (docId != "")
                        {
                            var model = new FacturaModel({id:docId});
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

        return FacturiListPage;

    })