define('Router',
    [
        'backbone',

        'views/HomeView',

        'views/layout/HeaderView',

        'views/common/ErrorView',

        'models/factura/FacturaModel',
        'models/factura/FacturiCollection',
        'views/factura/FacturiListPage',
        'views/factura/FacturaEditView',
        'views/factura/FacturaDetailView',

        'models/client/ClientModel',
        'models/client/ClientsCollection',
        'views/client/ClientsListPage',
        'views/client/ClientDetailView',
        'views/client/ClientEditView',


        'models/config/SerieModel',
        'models/config/SeriesCollection',
        'views/config/ConfigView',
        'views/config/ConfigSeriesView',
        'views/config/ConfigSeriesEditView'
    ],
    function (Backbone, HomeView, HeaderView, ErrorView, FacturaModel, FacturiCollection, FacturiListPage, FacturaEditView, FacturaDetailView, ClientModel, ClientsCollection, ClientsListPage, ClientDetailView, ClientEditView, SerieModel, SeriesCollection, ConfigView, ConfigSeriesView, ConfigSeriesEditView)
    {
        'use strict';

        var AppRouter = Backbone.Router.extend({

            routes:{
                '':'home',

                'facturi':'facturi',
                'facturaNoua':'facturaNoua',
                'factura/:id':'facturaDetail',
                'factura/:id/edit':'facturaEdit',

                'clienti':'clienti',
                'clientNou':'clientNou',
                'client/:id':'clientDetail',
                'client/:id/edit':'clientEdit',

                'config':'config',
                'config/serii':'configSeries',
                'config/serieNoua':'configNewSeries',
                'config/serie/:id':'configEditSeries',

                '*actions':'defaultAction'
            },

            /* ----------------------------------------------------------------------------- */
            initialize:function ()
            {
                console.log('Router:initialize');

                this.headerView = new HeaderView();
                $('header').html(this.headerView.render().el);
            },

            /* ----------------------------------------------------------------------------- */
            showView:function (menuToSelect, view)
            {
                // Close any active view
                if (this.currentView)
                {
                    this.currentView.close();
                }

                // Select menu
                this.headerView.selectMenu(menuToSelect);

                // Show view
                this.currentView = view;
                $('#content').html(this.currentView.render().el);
            },

            handleFetchError:function (model, res)
            {
                var view, model;

                console.log('Router:handleFetchError', model, res);

                $('#right_loading_message').hide();


                view = new ErrorView();


                if (res.status === 404)
                {
                    $('#content').html(view.render('404 Error', 'Page not found').el);
                } else if (res.status === 500)
                {
                    $('#content').html(view.render('500 Error', 'Server internal error').el);
                }
                else
                {
                    $('#content').html(view.render(res.status + ' Error', 'Server internal error').el);
                }
            },

            /* ----------------------------------------------------------------------------- */
            home:function ()
            {
                if (!this.homeView)
                {
                    this.homeView = new HomeView();
                }
                this.showView('#', this.homeView);
            },

            /* ----------------------------------------------------------------------------- */
            facturi:function ()
            {
                var me = this, list;

                list = new FacturiCollection();
                list.fetch({
                    success:function ()
                    {
                        me.view = new FacturiListPage({ model:list });
                        me.showView('#facturi', me.view);
                    },
                    error:this.handleFetchError
                });
            },

            facturaNoua:function (id)
            {
                var me = this, view, model;

                model = new FacturaModel();
                model.initNew();

                view = new FacturaEditView({model:model});
                this.showView('#facturi', view);

                view.model.on('save-success', function ()
                {
                    console.log(model, model.get('id'));
                    me.navigate('#/factura/' + model.get('id'), { trigger:true });
                });
            },

            facturaDetail:function (id)
            {
                var me = this, view;

                var model = new FacturaModel({'id':id});
                model.fetch({
                    success:function ()
                    {
                        view = new FacturaDetailView({model:model});
                        me.showView('#facturi', view);

                        model.on('delete-success', function ()
                        {
                            me.navigate('#/facturi');
                        })
                    },
                    error:this.handleFetchError
                });
            },

            facturaEdit:function (id)
            {
                var me = this, view;

                var factura = new FacturaModel({id:id});
                factura.fetch({
                    success:function ()
                    {
                        view = new FacturaEditView({model:factura});
                        me.showView('#facturi', view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/factura/' + view.model.get('id'), { trigger:true });
                        });
                    },
                    error:this.handleFetchError
                });
            },

            /* ----------------------------------------------------------------------------- */
            clienti:function ()
            {
                var me = this;

                me.clientsColl = new ClientsCollection();
                me.clientsColl.fetch({
                    success:function ()
                    {
                        me.clientsListPage = new ClientsListPage({model:me.clientsColl});
                        me.showView('#clienti', me.clientsListPage);
                    },
                    error:this.handleFetchError
                });
            },

            clientNou:function ()
            {
                var client, view, me = this;

                client = new ClientModel();

                view = new ClientEditView({model:client});
                this.showView('#clienti', view);

                view.model.on('save-success', function ()
                {
                    me.navigate('#/client/' + view.model.get('id'), { trigger:true });
                });
            },

            clientDetail:function (id)
            {
                var me = this, model, view;

                var model = new ClientModel({id:id});
                model.fetch({
                    success:function (model)
                    {
                        view = new ClientDetailView({model:model});
                        me.showView('#clienti', view);

                        view.on('delete-success', function ()
                        {
                            me.navigate('#/clienti', { trigger:true });
                        });
                    },
                    error:this.handleFetchError
                });
            },

            clientEdit:function (id)
            {
                var me = this, model, view;

                model = new ClientModel({id:id}, {silent:true});
                model.fetch({
                    success:function (model)
                    {
                        view = new ClientEditView({model:model});
                        me.showView('#clienti', view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/client/' + view.model.get('id'), { trigger:true });
                        });

                    },
                    error:this.handleFetchError
                });
            },

            /* ----------------------------------------------------------------------------- */
            config:function ()
            {
                var me = this;

                me.clientForm = new ConfigView();
                me.showView('#config', me.clientForm);
            },

            configSeries:function ()
            {
                var me = this, view;

                var series = new SeriesCollection();
                series.fetch({
                    success:function ()
                    {
                        view = new ConfigSeriesView({model:series});
                        me.showView('#config', view);

                        view.on('show', function (param)
                        {
                            me.navigate('#/config/serie/' + param.id, { trigger:true });
                        })
                    },
                    error:this.handleFetchError
                });
            },

            configNewSeries:function ()
            {
                var me = this, model, view;

                model = new SerieModel();
                new ConfigSeriesEditView();
                view = new ConfigSeriesEditView({model:model});
                me.showView('#config', view);

                // Events
                view.model.on('save-success', function ()
                {
                    me.navigate('#config/serii', { trigger:true });
                });
            },

            configEditSeries:function (id)
            {
                var me = this, model, view;

                // Load model
                model = new SerieModel({id:id});
                model.fetch({
                    success:function ()
                    {
                        view = new ConfigSeriesEditView({model:model});
                        me.showView('#config', view);

                        // Events
                        view.model.on('save-success', function ()
                        {
                            me.navigate('#config/serii', { trigger:true });
                        });
                    },
                    error:this.handleFetchError
                });
            },

            /* ----------------------------------------------------------------------------- */
            defaultAction:function (actions)
            {
                // No matching route

                // Hide error message
                $('#right_loading_message').hide();
            }
        });

        return AppRouter;

    });