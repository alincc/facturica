var app, factura_duplicate_id, currentView;
 'use strict';
var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "facturi":"facturi",
        "facturaNoua":"facturaNoua",
        "facturaNouaDup/:id":"facturaNoua",
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

    initialize: function()
    {
    },

    showView: function(view)
    {
        if (currentView)
        {
            currentView.close();
        }

        currentView = view;

        $("#content").html(currentView.render().el);
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

        var factura = new FacturaModel();
        if (id === undefined)
        {
            factura.initNew();
            this.facturaEditView = new FacturaEditView({model: factura});
            this.showView(this.facturaEditView);
        }
        else
        {
            facturaOrig = new FacturaModel();
            facturaOrig.set({id:id});
            facturaOrig.fetch({wait:true, success: function()
            {
                factura = facturaOrig.clone();
                factura.items = facturaOrig.get('items');
                factura.client = facturaOrig.get('client');
                factura.history = null;

                // Clear id for items
                for (var index in
                        facturaOrig.get('items'))
                {
                    factura.items[index].id = null;
                }
                factura.set({'items': factura.items});

                me.facturaEditView = new FacturaEditView({model: factura});
                me.showView(me.facturaEditView);

                factura.set({id:null});
            }});
        }
    },

    facturaDetail: function(id)
    {
        var me = this;

        nav.update("#facturi");

        var factura = new FacturaModel();
        factura.set({"id": id});

        factura.fetch({
            success: function()
            {
                me.view = new FacturaDetail({model: factura});
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

        var factura = new FacturaModel();
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
})

$(document).ready(function ()
{
    tpl.loadTemplates([
        'home',

        'factura/List','factura/Edit','factura/EditListItemView','factura/ListItem','factura/Detail', 'factura/AlteDetalii',

        'client/List', 'client/Detail', 'client/ListItem','client/Edit',

        'configView', 'configSeriesListView', 'configSeriesEditView', 'configSeriesPopupView'
    ],
            function ()
            {
                $("#right_loading_message").toggle();

                app = new AppRouter();

                Backbone.history.start();

                $.datepicker.setDefaults({dateFormat: 'dd/mm/yy'});

                $(".alert").alert();
                window.messages = new MessageManager();

                jQuery.fn.extend({
                    scrollToMe: function ()
                    {
                        var x = jQuery(this).position().top - 100;
                        jQuery('body').animate({scrollTop: x}, 200);
                        //$(window).scrollTop(this.position().top)
                    }});
            });

});

Backbone.View.prototype.close = function()
{
    console.log("Backbone.View.close");
    this.remove();
    this.unbind();
    if (this.onClose)
    {
        this.onClose();
    }
}


var activeRequests;
activeRequests = [];
Backbone._sync = Backbone.sync;
Backbone.sync = function(method, model, options)
{
    var asyncToken;
    asyncToken = Backbone._sync.apply(this, arguments);
    asyncToken.then(function()
    {
        activeRequests = _.without(activeRequests, asyncToken);
        if (activeRequests.length === 0)
        {
            $("#right_loading_message").hide();
        }
    });
    if (activeRequests.length === 0)
    {
        $("#right_loading_message").show();
    }
    return activeRequests.push(asyncToken);
};