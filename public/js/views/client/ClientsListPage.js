define(
    [
    'views/client/ClientsListView',
    'text!tpl/client/List.html'
    ],
    function (ClientsListView, ListTemplate)
    {
        "use strict";
        var ClientsListPage = Backbone.View.extend({
            tagName:"ul",

            className:"unstyled",

            events:{
                "click #reload":"handleReload"
            },

            initialize:function ()
            {
                console.log('ClientsListPage:initialize');
                this.template = _.template(ListTemplate);
                this.model.bind("reset", this.render, this);
            },

            render:function (eventName)
            {
                $(this.el).html(this.template({model:this.model}));

                if (this.model.length > 0)
                {
                    this.listView = new ClientsListView({
                        el:$('#listView', this.el),
                        model:this.model});
                    this.listView.render();
                }
                else
                {
                    $("#listView", this.el).html("Nu exista nici un client.");
                }


                return this;
            },

            handleReload:function ()
            {
                this.model.fetch();
            }
        });

        return ClientsListPage;
    });