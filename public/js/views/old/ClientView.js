window.ClientEditView = BaseFormEdit.extend({

    tagName: "div",

    events: {
        "click #save": "handleSave",
        "click #cancel": "handleCancel",
        "change input,textarea": "handleChange"
    },

    initialize: function()
    {
        console.log('ClientEditView:initialize');

        // super call
        BaseFormEdit.prototype.initialize.apply(this, arguments);

        this.template = _.template(tpl.get('client/Edit'));

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function ()
    {
        console.log('ClientEditView:render');
        var el = $(this.el);
        el.html(this.template(this.model.toJSON()));

        return this;
    },

    handleChange: function(e)
    {
        var ctrl = $(e.currentTarget);
        this.changes[ctrl.attr("name")] = ctrl.val();
    },

    handleSave: function(e)
    {
        e.preventDefault();

        this.model.set(this.changes);

        if (!this.model.isValid(true))
        {
            messages = new MessageManager();
            messages.error("Eroare - completati toate campurile campurile cu rosu");
            return false;
        }

        var success = function(model, fail, xhr)
        {
            console.log('ClientEditView:handleSuccessSave');
            app.navigate("clienti", true);
        };

        var error = function(model, fail, xhr)
        {
            console.log('ClientEditView:handleError', model, fail, xhr);
            messages = new MessageManager();
            messages.error("Eroare server - clientul nu a fost salvat.");
        };

        this.model.save(null, {wait:true, success: success, error: error});

        return false;
    },

    handleCancel: function(e)
    {
        window.history.back();
    }
});

window.ClientsListPage = Backbone.View.extend({
    tagName: "ul",

    className: "unstyled",

    events:{
        "click #reload": "handleReload"
    },

    initialize: function()
    {
        console.log('ClientsListPage:initialize');
        this.template = _.template(tpl.get('client/List'));
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName)
    {
        $(this.el).html(this.template({model:this.model}));

        if (this.model.length > 0)
        {
            this.listView = new ClientsListView({
                el: $('#listView', this.el),
                model: this.model});
            this.listView.render();
        }
        else
        {
            $("#listView", this.el).html("Nu exista nici un client.");
        }


        return this;
    },

    handleReload: function()
    {
        this.model.fetch();
    }
});

window.ClientsListView = Backbone.View.extend({

    initialize:function ()
    {
        console.log('ClientsListView:initialize');
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName)
    {
        _.each(this.model.models, function (m)
        {
            $(this.el).append(new ClientsListItemView({
                model:m
            }).render().el);
        }, this);

        return this;
    }
});

window.ClientsListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function ()
    {
        console.log('ClientsListItemView:initialize');
        this.template = _.template(tpl.get('client/ListItem'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName)
    {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.ClientDetail = Backbone.View.extend({

    events:{
        "click #delete": "handleDelete"
    },

    initialize:function ()
    {
        console.log('ClientDetail:initialize');
        this.template = _.template(tpl.get('client/Detail'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName)
    {
        var data = this.model.toJSON();
        $(this.el).html(this.template(data));
        $(this.el).find("input,textarea").attr("readonly", true);
        return this;
    },

    handleDelete : function()
    {
        if (confirm("Esti sigur ca vrei sa stergi clientul " + this.model.get("name") + "?"))
        {
            this.model.destroy();
            app.navigate("#/clienti", true);
        }
        return false;
    }

})