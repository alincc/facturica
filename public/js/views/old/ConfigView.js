window.ConfigView = Backbone.View.extend({

    tagName: "div",

    events: {
    },

    initialize: function()
    {
        this.template = _.template(tpl.get('configView'));
    },

    render: function ()
    {
        var el = $(this.el);
        el.html(this.template());

        return this;
    }
});

window.ConfigSeriesView = Backbone.View.extend({

    tagName: "div",

    events: {
        'click .rowClick': 'editSerie'
    },

    initialize: function()
    {
        this.template = _.template(tpl.get('configSeriesListView'));
    },

    render: function ()
    {
        var el = $(this.el);
        el.html(this.template({model:this.model}));

        return this;
    },

    editSerie: function(e)
    {
        var id = $(e.currentTarget).attr('data-id');
        app.navigate("serie/" + id, true);
    }

});

window.ConfigSeriesEditView = Backbone.View.extend({

    tagName: "div",

    events: {
        'change #docType, #prefix, #suffix, #currentNumber': 'updateExample',
        'click #save': 'save',
        'click #cancel': 'cancel'
    },

    initialize: function()
    {
        _.bindAll(this, 'render', 'updateExample', 'save');

        this.template = _.template(tpl.get('configSeriesEditView'));

        Backbone.Validation.bind(this);
    },

    render: function ()
    {
        var el = $(this.el);
        el.html(this.template(this.model.toJSON()));

        this.updateExample();

        return this;
    },

    updateExample: function(e)
    {
        // Update model
        if (e != null)
        {
            var ctrl = $(e.currentTarget);
            this.model.set(ctrl.attr("name"), ctrl.val());
        }

        // Update html
        $('#example', this.el).html(this.model.getSample());
    },

    save: function()
    {
        if (!this.model.isValid(true))
        {
            messages = new MessageManager();
            messages.error("Eroare - completati toate campurile campurile obligatorii");
            return false;
        }

        var success = function(model, fail, xhr)
        {
            console.log('ConfigSeriesEditView:handleSuccessSave');
            app.navigate("serii", true);
        };

        var error = function(model, fail, xhr)
        {
            console.log('ConfigSeriesEditView:handleError', model, fail, xhr);
            messages = new MessageManager();
            messages.error("Eroare server - seria nu a fost salvata.");
        };

        this.model.save(null, {wait:true, success: success, error: error});

        return false;
    },

    cancel: function(e)
    {
        window.history.back();
    }
});

window.ConfigSeriesPopup = Backbone.View.extend({

    tagName: "div",

    initialize: function()
    {
        this.template = _.template(tpl.get('configSeriesPopupView'));
    },

    render: function()
    {
        var el = $(this.el);

        el.html(this.template(this.model));

        return this;
    }
});
