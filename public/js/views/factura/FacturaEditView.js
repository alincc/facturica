define(
    [
        'backbone',
        'utils/NumberUtil',
        'text!tpl/factura/Edit.html',
        'text!tpl/factura/EditListItemView.html',
        'text!tpl/factura/OtherDetails.html',
        'models/factura/FacturaModel',
        'models/client/ClientModel',
        'controls/DataGrid',

        'views/factura/FacturaTotalView',
        'views/client/ClientSelectPopupView',

        'models/client/ClientSearchCollection',
        'models/configuration/SeriesCollection',
        'controls/MessageManager',
        'utils/ClientUtil'
    ],
    function (Backbone, NumberMixin, EditTemplate, EditListItemViewTemplate, OtherDetailsTemplate, FacturaModel, ClientModel, DataGrid, FacturaTotalView, ClientSelectPopupView, ClientSearchCollection, SeriesCollection, MessageManager, ClientUtil)
    {
        var FacturaEditView = Backbone.View.extend({

            tagName:'div',

            events:{
                'click .addDataGridline':'handleAddLine',
                'click #saveBtn':'handleSave',
                'click #cancel':'handleCancel',

                'change #selectSerie':'handleChangeSerie',

                'click #selectClient':'handleSelectClient'
            },

            bindings:{
                'value #docNo':'docNo',
                'value #docDate':'docDate',
                'value #docDueDate':'docDueDate',
                'value #client-name':'client.name',
                'value #client-fiscalCode':'client.fiscalCode',
                'value #client-regcom':'client.regcom',
                'value #client-address':'client.address',
                'value #client-city':'client.city',
                'value #client-bankAccount':'client.bankAccount',
                'value #client-bankName':'client.bankName',
                'value #client-phone':'client.phone',
                'value #client-email':'client.email',
                'value #nraviz':'nraviz',
                'value #numeDelegat':'numeDelegat',
                'value #ciSeria':'ciSeria',
                'value #ciNumar':'ciNumar',
                'value #cnp':'cnp',
                'value #detaliuTransport':'detaliuTransport',
                'value #expDate':'expDate',
                'value #note':'note'
            },

            initialize:function ()
            {
                console.log('FacturaEditView:initialize');

                Backbone.Validation.bind(this);
                //this.viewValidation();

                this.template = _.template(EditTemplate);

                _.bindAll(this, 'handleChangeSerie', 'renderStats', 'rowUpdateHandler', 'handleClientSelectPopup', 'handleSave');
            },

            render:function ()
            {
                var me = this,
                    el = $(me.el),
                    otherDetailsTemplate;

                console.log('FacturaEditView:render');

                // Clear series
                me.model.set({'seriesId':'-1'}, {silent:true});

                el.html(me.template(me.model.toJSON()));

                // Other details view section rendering
                otherDetailsTemplate = _.template(OtherDetailsTemplate, me.model.toJSON());
                $('#altele', el).html(otherDetailsTemplate);

                me.clientSelectPopup = new ClientSelectPopupView({
                    el:$("#clientSelectPopup", el)
                });
                me.clientSelectPopup.render();
                me.clientSelectPopup.on('clientSelect', this.handleClientSelectPopup);

                // Statistics
                me.stats = new FacturaTotalView({
                    el:$('#stats', me.el),
                    model:me.model
                });

                me.listView = new DataGrid(
                    {
                        el:$('#facturaItemsBody', el),
                        model:me.model.items,
                        rowUpdateHandler:me.rowUpdateHandler,
                        rowAddHandler:me.renderStats,
                        rowRemoveHandler:me.renderStats,
                        itemRenderer:EditListItemViewTemplate,
                        scope:me
                    });

                me.listView.render();

                me.renderStats();

                el.find('#docDate,#docDueDate,#expDate').datepicker();

                ClientUtil.setupTypeAhead(el.find('#client-name'), function (selection)
                {
                    me.updatePartnerInfo(selection.get('partner'));
                });

                me.loadDocumentSeries(el);

                me.fixedPosition(el);

                return me.bindModel();
            },

            renderStats:function ()
            {
                console.log('FacturaEditView:renderStats');

                this.stats.render();
            },

            rowUpdateHandler:function (scope, e, m, attr, value)
            {
                var me = this;
                console.log('FacturaEditView:rowUpdateHandler');

                m[attr] = value;
                m.calculate();

                $('[name=subtotal]', scope.el).text(m.subtotal);
                $('[name=vatAmount]', scope.el).text(m.vatAmount);

                me.renderStats();
            },

            handleAddLine:function (e)
            {
                this.listView.addLine(e);
            },

            handleSave:function (e)
            {
                e.preventDefault();

                console.log('FacturaEditView:handleSave');

                var me = this, messages;

                me.model.set({'items':me.model.items});

                if (!me.model.isValid(true))
                {
                    messages = new MessageManager();
                    messages.error('Eroare - completati toate campurile campurile cu rosu');
                    return false;
                }

                console.log(me.model.items);

                me.model.save(
                    null
                    ,
                    {
                        wait:true,

                        success:function ()
                        {
                            console.log('FacturaEditView:handleSuccessSave');
                            me.model.trigger('save-success');
                        },
                        error:function (model, fail, xhr)
                        {
                            console.log('FacturiEditView:handleError', model, fail, xhr);
                            messages = new MessageManager();
                            messages.error('Eroare server - factura nu a fost salvata.');
                        }
                    });
            },

            handleCancel:function (e)
            {
                e.preventDefault();
                window.history.back();
            },

            handleChangeSerie:function (e)
            {
                var value = $(e.currentTarget).val();
                this.model.set({'seriesId':value});

                if (value === '-1')
                {
                    $('#docNo').removeAttr('readonly');
                }
                else
                {
                    this.model.set({'docNo':''});
                    $('#docNo').val('');
                    $('#docNo').attr('readonly', true);
                }
            },

            // Load and populate series drop down
            loadDocumentSeries:function (el)
            {
                var seriesCollection = new SeriesCollection();
                seriesCollection.fetch({
                    success:function ()
                    {
                        var ctrl = el.find('#selectSerie');

                        $.each(seriesCollection.models, function (index, obj)
                        {
                            ctrl.append($('<option />').val(obj.get('id')).text(obj.getSample()
                                + ' (' + obj.get('id') + ')')).attr('data-last', obj.getNextPossible());
                        })
                    }
                });
            },

            fixedPosition:function (el)
            {
                // Wait to render and after that update position of elements
                setTimeout(function ()
                {
                    var offset = $('#actionButtons', el).offset();

                    $(window).scroll(updateScroll);

                    function updateScroll()
                    {
                        var scrollTop = $(window).scrollTop() + 50;

                        if (offset.top < scrollTop)
                        {
                            $('#actionButtons').css({'width':$('#content-left').parent().width() - 40});
                            $('#actionButtons').addClass('fixed-actionsButtons');
                        }
                        else
                        {
                            $('#actionButtons').removeClass('fixed-actionsButtons');
                        }
                    }

                    updateScroll();

                }, 1000);
            },

            handleSelectClient:function (e)
            {
                e.preventDefault();
                this.clientSelectPopup.show();
            },

            handleClientSelectPopup:function (e)
            {
                var me = this;

                var clientModel = new ClientModel({id:e});
                clientModel.fetch({
                    success:function (data)
                    {
                        me.updatePartnerInfo(data.get('partner'));
                    }
                });
            },

            updatePartnerInfo:function (partner)
            {
                this.model.set({'client':partner});
            }
        });

        return FacturaEditView;
    });