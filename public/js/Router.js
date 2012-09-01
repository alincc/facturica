define('Router',
    [
        'backbone',

        'utils/Navigation',
        'views/HomeView',

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
    function (Backbone, nav, HomeView, FacturaModel, FacturiCollection, FacturiListPage, FacturaEditView, FacturaDetailView, ClientModel, ClientsCollection, ClientsListPage, ClientDetailView, ClientEditView, SerieModel, SeriesCollection, ConfigView, ConfigSeriesView, ConfigSeriesEditView)
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

            showView:function (view)
            {
                if (this.currentView)
                {
                    this.currentView.close();
                }

                this.currentView = view;

                if (this.currentView != null)
                {
                    $('#content').html(this.currentView.render().el);
                }
            },

            home:function ()
            {
                nav.update('#');

                if (!this.homeView)
                {
                    this.homeView = new HomeView();
                }
                this.showView(this.homeView);
            },

            facturi:function ()
            {
                var me = this, list;

                nav.update('#facturi');

                list = new FacturiCollection();
                list.fetch({
                    success:function ()
                    {
                        me.view = new FacturiListPage({ model:list });
                        me.showView(me.view);
                    },
                    error:function (model, res)
                    {
                        console.log(res);

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                });
            },

            facturaNoua:function (id)
            {
                var me = this, view, model;

                nav.update('#facturi');

                model = new FacturaModel();
                model.initNew();

                view = new FacturaEditView({model:model});
                this.showView(view);

                view.model.on('save-success', function ()
                {
                    console.log(model, model.get('id'));
                    me.navigate('#/factura/' + model.get('id'), { trigger:true });
                });
            },

            facturaDetail:function (id)
            {
                var me = this, view;

                nav.update('#facturi');

                var model = new FacturaModel({'id':id});
                model.fetch({
                    success:function ()
                    {
                        view = new FacturaDetailView({model:model});
                        me.showView(view);

                        model.on('delete-success', function ()
                        {
                            me.navigate('#/facturi');
                        })
                    },
                    error:function (model, res)
                    {
                        console.log(res);

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                });
            },

            facturaEdit:function (id)
            {
                var me = this, view;

                nav.update('#facturi');

                var factura = new FacturaModel();
                factura.set('id', id);
                factura.fetch({
                    success:function ()
                    {
                        view = new FacturaEditView({model:factura});
                        me.showView(view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/factura/' + view.model.get('id'), { trigger:true });
                        });
                    },
                    error:function (model, res)
                    {
                        console.log(res);

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                });
            },


            clienti:function ()
            {
                var me = this;

                nav.update('#clienti');

                me.clientsColl = new ClientsCollection();
                me.clientsColl.fetch({
                    success:function ()
                    {
                        me.clientsListPage = new ClientsListPage({model:me.clientsColl});
                        me.showView(me.clientsListPage);
                    },
                    error:function (model, res)
                    {
                        console.log(res);

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                });
            },

            clientNou:function ()
            {
                var client, view, me = this;

                nav.update('#clienti');

                client = new ClientModel();

                view = new ClientEditView({model:client});
                this.showView(view);

                view.model.on('save-success', function ()
                {
                    me.navigate('#/client/' + view.model.get('id'), { trigger:true });
                });
            },

            clientDetail:function (id)
            {
                var me = this, model, view;

                nav.update('#clienti');

                var model = new ClientModel({id:id});
                model.fetch({
                    success:function (model)
                    {
                        view = new ClientDetailView({model:model});
                        me.showView(view);

                        view.on('delete-success', function ()
                        {
                            me.navigate('#/clienti', { trigger:true });
                        });
                    },
                    error:function (model, res)
                    {
                        console.log(res);
                        $('#right_loading_message').hide();

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                }, {silent:true});
            },

            clientEdit:function (id)
            {
                var me = this, model, view;

                nav.update('#clienti');

                model = new ClientModel({id:id}, {silent:true});
                model.fetch({
                    success:function (model)
                    {
                        view = new ClientEditView({model:model});
                        me.showView(view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/client/' + view.model.get('id'), { trigger:true });
                        });

                    },
                    error:function (model, res)
                    {
                        console.log(res);
                        $('#right_loading_message').hide();

                        if (res.status === 404)
                        {
                            // TODO: handle 404 Not Found
                        } else if (res.status === 500)
                        {
                            // TODO: handle 500 Internal Server Error
                        }
                    }
                });
            },

            config:function ()
            {
                var me = this;

                nav.update('#config');

                me.clientForm = new ConfigView();
                me.showView(me.clientForm);
            },

            configSeries:function ()
            {
                var me = this, view;

                nav.update('#config');

                var series = new SeriesCollection();
                series.fetch({
                    success:function ()
                    {
                        view = new ConfigSeriesView({model:series});
                        me.showView(view);

                        view.on('show', function (param)
                        {
                            me.navigate('#/config/serie/' + param.id, { trigger:true });
                        })
                    },
                    error:function ()
                    {
                        $('#right_loading_message').hide();
                    }
                });
            },

            configNewSeries:function ()
            {
                var me = this, model, view;

                nav.update('#config');

                model = new SerieModel();
                new ConfigSeriesEditView();
                view = new ConfigSeriesEditView({model:model});
                me.showView(view);

                // Events
                view.model.on('save-success', function ()
                {
                    me.navigate('#config/serii', { trigger:true });
                });
            },

            configEditSeries:function (id)
            {
                var me = this, model, view;

                nav.update('#config');

                // Load model
                model = new SerieModel({id:id});
                model.fetch({
                    success:function ()
                    {
                        view = new ConfigSeriesEditView({model:model});
                        me.showView(view);

                        // Events
                        view.model.on('save-success', function ()
                        {
                            me.navigate('#config/serii', { trigger:true });
                        });
                    },
                    error:function ()
                    {
                        $('#right_loading_message').hide();
                    }
                });
            },

            defaultAction:function (actions)
            {
                // No matching route

                // Hide error message
                $('#right_loading_message').hide();
            }
        });

        return AppRouter;

    });