window.FacturaEditView = BaseFormEdit.extend({

    tagName:"div",

    events:{
        "change #docNo,#docDate,#docDueDate,#client-name,#client-fiscalCode, #client-regcom":"handleChange",
        "change #client-address, #client-city, #client-bankAccount, #client-bankName":"handleChange",
        "change #client-phone, #client-email":"handleChange",
        "change #nraviz, #numeDelegat, #ciSeria, #ciNumar, #cnp, #detaliuTransport, #expDate, #note":"handleChange",
        "click .addDataGridline":"handleAddLine",
        "click #saveBtn":"handleSave",
        "click #cancel":"handleCancel",

        "change #selectSerie":"handleChangeSerie"
    },

    initialize:function ()
    {
        console.log('FacturaEditView:initialize');

        // super call
        BaseFormEdit.prototype.initialize.apply(this, arguments);

        this.template = _.template(tpl.get('factura/Edit'));

        _.bindAll(this, 'renderStats', 'handleChangeSerie');
    },

    render:function ()
    {
        console.log('FacturaEditView:render');

        var me = this;
        var el = $(me.el);

        // Clear series
        me.model.set({"seriesId":"-1"});

        el.html(me.template(me.model.toJSON()));

        me.listView = new DataGrid(
            {
                el:$('table.factura tbody', el),
                model:me.model.items,
                rowUpdateHandler:me.rowUpdateHandler,
                rowAddHandler:me.renderStats,
                rowRemoveHandler:me.renderStats,
                itemRenderer:'factura/EditListItemView',
                postCreationEvent:function (grid)
                {
                    // todo: add code that setup grid
                },
                scope:me
            });

        me.listView.render();

        me.renderStats(me);

        el.find("#docDate,#docDueDate,#expDate").datepicker();

        me.selectableRowItem(me.listView.el);

        me.setupPartnerSelection(el);

        me.loadDocumentSeries(el);

        // If not a new invoice
        if (!me.model.isNew())
        {
            // Render current client info
            me.updatePartnerInfo(el, me.model.get("client"));
            me.selectedPartner = {};
            me.selectedPartner.partner = me.model.get("client");
        }

        me.fixedPosition(el);

        return me;
    },

    renderStats:function (scope)
    {
        console.log("FacturaEditView:renderStats");

        var total = 0, subtotal = 0, vat = 0;

        var me = scope;

        if (scope.model != null)
        {
            _.each(scope.model.items, function (v)
            {
                total += parseFloat(v.total);
                subtotal += parseFloat(v.subtotal);
                vat += parseFloat(v.vatAmount);
            });

            scope.model.set({
                total:Utils.round(total, 2),
                subtotal:Utils.round(subtotal, 2),
                vat:Utils.round(vat, 2)
            });

            me.stats = new FacturaTotal({
                el:$('#stats', me.el),
                model:me.model
            });

            me.stats.render();
        }
    },

    rowUpdateHandler:function (scope, e, m, attr, value)
    {
        console.log("FacturaEditView:rowUpdateHandler");

        m[attr] = value;
        m.calculate();
        $('[name=subtotal]', this.el).text(m.subtotal);
        $('[name=vatAmount]', this.el).text(m.vatAmount);

        me.renderStats(me);
    },

    handleAddLine:function (e)
    {
        this.listView.addLine(e);
    },

    handleSort:function (event, ui)
    {
        console.log(ui);
    },

    handleChange:function (e)
    {
        var ctrl = $(e.currentTarget);
        this.changes[ctrl.attr("name")] = ctrl.val();
        this.renderStats(this);
    },

    handleSave:function (e)
    {
        console.log('FacturaEditView:handleSave');

        var me = this;

        me.model.set(me.changes);
        me.model.set({'items':me.model.items});

        if (!me.model.isValid(true))
        {
            messages.error("Eroare - completati toate campurile campurile cu rosu");
            return false;
        }

        var success = function (e)
        {
            console.log('FacturaEditView:handleSuccessSave');
            app.navigate("facturi", true);
        };

        var error = function (model, fail, xhr)
        {
            console.log('FacturiEditView:handleError', model, fail, xhr);
            messages = new MessageManager();
            messages.error("Eroare server - factura nu a fost salvata.");
        }

        me.model.save(
            {
            },
            {
                success:success,
                error:error
            });
    },

    handleCancel:function (e)
    {
        window.history.back();
    },

    handleChangeSerie:function (e)
    {
        var value = $(e.currentTarget).val();
        this.model.set({'seriesId':value});

        if (value === "-1")
        {
            $("#docNo").removeAttr('readonly');
        }
        else
        {
            this.model.set({'docNo':""});
            $("#docNo").val("");
            $("#docNo").attr('readonly', true);
        }
    },

    setupPartnerSelection:function (el)
    {
        me = this;

        var choices = new ClientsSearchCollection();

        var selected = new ClientsSearchCollection();

        selected.bind('add', function (model)
        {
            var loadModel = new ClientModel();
            loadModel.set("id", model.get('id'))
            loadModel.fetch({
                success:function (data)
                {
                    me.updatePartnerInfo(el, data.get("partner"));
                }});
        });

        var input = new Autocomplete({
            el:el.find('#client-name'),
            choices:choices,
            selected:selected,
            allowDupes:true,
            remoteQuery:true,
            iterator:function (model, matcher, selected)
            {
                return matcher.test(model.partner.name);
            },
            label:function (model)
            {
                var data = model;
                return  data.partner.name;
            }
        }).render();
    },

    updatePartnerInfo:function (el, json)
    {
        this.selectedPartner = json;
        this.model.set("client", json);
        el.find("#client-name").val(json.name);
        el.find("#client-fiscalCode").val(json.fiscalCode);
        el.find("#client-regcom").val(json.regcom);
        el.find("#client-address").val(json.address);
        el.find("#client-city").val(json.city);
        el.find("#client-bankAccount").val(json.bankAccount);
        el.find("#client-bankName").val(json.bankName);
        el.find("#client-phone").val(json.phone);
        el.find("#client-email").val(json.email);
    },

    selectableRowItem:function (lv)
    {
        $(lv).sortable({
            axis:'y',
            containment:'parent',
            change:this.handleSort
        }).disableSelection();
    },

    loadDocumentSeries:function (el)
    {
        var seriesCollection = new SeriesCollection();
        seriesCollection.fetch({
            success:function ()
            {
                var ctrl = el.find('#selectSerie');

                $.each(seriesCollection.models, function (index, obj)
                {
                    ctrl.append($("<option />").val(obj.get('id')).text(obj.getSample())).attr('data-last', obj.getNextPossible());
                })
            }
        });
    },

    fixedPosition:function (el)
    {
        setTimeout(function ()
        {
            var offset = $('#actionButtons', el).offset();

            $(window).scroll(function ()
            {
                var scrollTop = $(window).scrollTop() + 55;

                if (offset.top < scrollTop)
                {
                    $('#actionButtons').css({'width':$("#content-left").parent().width() - 40});
                    $('#actionButtons').addClass('fixed');
                    $('#content-right').addClass('fixed-content-right');
                }
                else
                {
                    $('#actionButtons').removeClass('fixed');
                    $('#content-right').removeClass('fixed-content-right');
                }
            });
        }, 1500);
    }
})
