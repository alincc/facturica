define([
    'utils/Navigation',
    'views/HomeView',

    'models/factura/Factura',
    'models/factura/FacturiCollection',
    'views/factura/FacturiListPage',
    'views/factura/FacturaEditView',
    'views/factura/FacturaDetailView',

],
        function(nav, HomeView, Factura, FacturiCollection, FacturiListPage, FacturaEditView, FacturaDetailView)
        {
            "use strict";

            var currentView;

            var Router = Backbone.Router.extend({

                routes: {
                    "":                     "home",

                    "facturi":              "facturi",
                    "facturaNoua":          "facturaNoua",
                    "factura/:id":          "facturaDetail",
                    "factura/:id/edit":     "facturaEdit",

                    "clienti":              "clienti",
                    "clientNou":            "clientNou",
                    "client/:id":           "clientDetail",
                    "client/:id/edit":      "clientEdit",

                    "configurare":          "config",
                    "serii":                "series",
                    "serieNoua":            "newSeries",
                    "serie/:id":            "editSeries"
                },

                showView: function(view)
                {
                    if (this.currentView)
                    {
                        this.currentView.close();
                    }

                    this.currentView = view;

                    $("#content").html(this.currentView.render().el);
                },

                home: function()
                {
                    nav.update("#");

                    if (!this.homeView)
                    {
                        this.homeView = new HomeView();
                    }
                    this.showView(this.homeView);
                },

                facturi: function()
                {
                    var me = this;
                    nav.update("#facturi");

                    me.list = new FacturiCollection();
                    me.list.fetch({
                        success: function()
                        {
                            me.view = new FacturiListPage({ model:me.list });
                            me.showView(me.view);
                        },
                        error: function()
                        {
                        }
                    });
                },

                facturaNoua: function(id)
                {
                    nav.update("#facturi");

                    var me = this;

                    this.facturaEditView = new FacturaEditView();
                    this.showView(this.facturaEditView);
                },

                facturaDetail: function(id)
                {
                    var me = this;

                    nav.update("#facturi");

                    var factura = new Factura();
                    factura.set({"id": id});

                    factura.fetch({
                        success: function()
                        {
                            me.view = new FacturaDetailView({model: factura});
                            me.showView(me.view);
                        },
                        error: function()
                        {
                        }
                    });
                },

                facturaEdit: function(id)
                {
                    var me = this;

                    nav.update("#facturi");

                    var factura = new Factura();
                    factura.set("id", id);
                    factura.fetch({
                        success: function()
                        {
                            me.view = new FacturaEditView({model: factura});
                            me.showView(me.view);
                        },
                        error: function()
                        {
                        }
                    });
                },


                clienti: function()
                {
                    var me = this;

                    nav.update("#clienti");

                    me.clientsColl = new ClientsCollection();
                    me.clientsColl.fetch({
                        success: function()
                        {
                            me.clientsListPage = new ClientsListPage({model:me.clientsColl});
                            me.showView(me.clientsListPage);
                        },
                        error: function()
                        {
                        }
                    });
                },

                clientNou: function()
                {
                    nav.update("#clienti");

                    var client = new ClientModel();

                    this.clientEditView = new ClientEditView({model: client});
                    this.showView(this.clientEditView);
                },

                clientDetail: function(id)
                {
                    var me = this;

                    nav.update("#clienti");

                    var client = new ClientModel();
                    client.set("id", id);
                    client.fetch({
                        success: function()
                        {
                            me.clientDetail = new ClientDetail({model: client});
                            me.showView(me.clientDetail);
                        },
                        error: function()
                        {
                        }
                    });
                },

                clientEdit: function(id)
                {
                    var me = this;

                    nav.update("#clienti");

                    var client = new ClientModel();
                    client.set("id", id)
                    client.fetch({
                        success: function()
                        {
                            me.clientForm = new ClientEditView({model: client});
                            me.showView(me.clientForm);
                        },
                        error: function()
                        {
                        }
                    });
                },

                config: function()
                {
                    var me = this;

                    nav.update("#configurare");

                    me.clientForm = new ConfigView();
                    me.showView(me.clientForm);
                },

                series: function()
                {
                    var me = this;

                    nav.update("#configurare");

                    var series = new SeriesCollection();
                    series.fetch({
                        success: function()
                        {

                            me.clientForm = new ConfigSeriesView({model:series});
                            me.showView(me.clientForm);
                        },
                        error: function()
                        {
                            $("#right_loading_message").hide();
                        }
                    });
                },

                newSeries: function()
                {
                    var me = this;

                    nav.update("#configurare");

                    var series = new SerieModel();
                    me.clientForm = new ConfigSeriesEditView({model:series});
                    me.showView(me.clientForm);
                },

                editSeries: function(id)
                {
                    var me = this;

                    nav.update("#configurare");

                    var client = new SerieModel();
                    client.set("id", id)
                    client.fetch({
                        success: function()
                        {
                            me.clientForm = new ConfigSeriesEditView({model: client});
                            me.showView(me.clientForm);
                        },
                        error: function()
                        {
                        }
                    });
                }
            });

            return Router;
        });