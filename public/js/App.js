define('App',
    [
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
        'views/client/ClientEditView'
    ],
    function (nav, HomeView, Factura, FacturiCollection, FacturiListPage, FacturaEditView, FacturaDetailView, ClientModel, ClientsCollection, ClientsListPage, ClientDetailView, ClientEditView)
    {
        "use strict";

        var currentView;

        var Router = Backbone.Router.extend({

            routes:{
                "":"home",

                "facturi":"facturi",
                "facturaNoua":"facturaNoua",
                "factura/:id":"facturaDetail",
                "factura/:id/edit":"facturaEdit",

                "clienti":"clienti",
                "clientNou":"clientNou",
                "client/:id":"clientDetail",
                "client/:id/edit":"clientEdit",

                "configurare":"config",
                "serii":"series",
                "serieNoua":"newSeries",
                "serie/:id":"editSeries"
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
                    $("#content").html(this.currentView.render().el);
                }
            },

            home:function ()
            {
                nav.update("#");

                if (!this.homeView)
                {
                    this.homeView = new HomeView();
                }
                this.showView(this.homeView);
            },

            facturi:function ()
            {
                var me = this;
                nav.update("#facturi");

                me.list = new FacturiCollection();
                me.list.fetch({
                    success:function ()
                    {
                        me.view = new FacturiListPage({ model:me.list });
                        me.showView(me.view);
                    },
                    error:function ()
                    {
                    }
                });
            },

            facturaNoua:function (id)
            {
                var me = this, view;

                nav.update("#facturi");

                view = new FacturaEditView();
                this.showView(this.facturaEditView);
                view.model.on('save-success', function ()
                {
                    me.navigate('#/factura/' + id, { trigger:true });
                });
            },

            facturaDetail:function (id)
            {
                var me = this, view;

                nav.update("#facturi");

                var factura = new Factura();
                factura.set({"id":id});

                factura.fetch({
                    success:function ()
                    {
                        view = new FacturaDetailView({model:factura});
                        me.showView(view);
                    },
                    error:function ()
                    {
                    }
                });
            },

            facturaEdit:function (id)
            {
                var me = this, view;

                nav.update("#facturi");

                var factura = new Factura();
                factura.set("id", id);
                factura.fetch({
                    success:function ()
                    {
                        view = new FacturaEditView({model:factura});
                        me.showView(view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/client/' + id, { trigger:true });
                        });
                    },
                    error:function ()
                    {
                    }
                });
            },


            clienti:function ()
            {
                var me = this;

                nav.update("#clienti");

                me.clientsColl = new ClientsCollection();
                me.clientsColl.fetch({
                    success:function ()
                    {
                        me.clientsListPage = new ClientsListPage({model:me.clientsColl});
                        me.showView(me.clientsListPage);
                    },
                    error:function ()
                    {
                    }
                });
            },

            clientNou:function ()
            {
                nav.update("#clienti");

                var client, view;

                client = new ClientModel();

                view = new ClientEditView({model:client});
                this.showView(view);
            },

            clientDetail:function (id)
            {
                var me = this, model;

                nav.update("#clienti");

                var model = new ClientModel({id:id, _silent:true });
                model.fetch({
                    success:function (model)
                    {
                        model.unset('_silent');
                        me.clientDetail = new ClientDetailView({model:model});
                        me.showView(me.clientDetail);
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

            clientEdit:function (id)
            {
                var me = this, model, view;

                nav.update("#clienti");

                model = new ClientModel({id:id, _silent:true});
                model.fetch({
                    success:function (model)
                    {
                        view = new ClientEditView({model:model});
                        me.showView(view);

                        view.model.on('save-success', function ()
                        {
                            me.navigate('#/client/' + id, { trigger:true });
                        });

                    },
                    error:function (model, res)
                    {
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

                nav.update("#configurare");

                me.clientForm = new ConfigView();
                me.showView(me.clientForm);
            },

            series:function ()
            {
                var me = this;

                nav.update("#configurare");

                var series = new SeriesCollection();
                series.fetch({
                    success:function ()
                    {

                        me.clientForm = new ConfigSeriesView({model:series});
                        me.showView(me.clientForm);
                    },
                    error:function ()
                    {
                        $("#right_loading_message").hide();
                    }
                });
            },

            newSeries:function ()
            {
                var me = this;

                nav.update("#configurare");

                var series = new SerieModel();
                me.clientForm = new ConfigSeriesEditView({model:series});
                me.showView(me.clientForm);
            },

            editSeries:function (id)
            {
                var me = this;

                nav.update("#configurare");

                var client = new SerieModel();
                client.set("id", id)
                client.fetch({
                    success:function ()
                    {
                        me.clientForm = new ConfigSeriesEditView({model:client});
                        me.showView(me.clientForm);
                    },
                    error:function ()
                    {
                    }
                });
            }
        });

        return Router;
    }
)
;