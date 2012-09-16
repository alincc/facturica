define(
    [
        'text!tpl/client/SelectPopupView.html',
        'text!tpl/client/SelectPopupItemView.html',

        'models/client/ClientSearchCollection'
    ],

    function (ClientSelectPopupViewTemplate, SelectPopupItemView, ClientSearchCollection)
    {
        var ClientSelectPopupView = Backbone.View.extend({
            events:{
                'click #searchButton':'handleSearch',
                'keypress #searchButton':'handleOnEnter',
                'click #clientSearchResults':'handleSelect'
            },

            initialize:function ()
            {
                this.template = _.template(ClientSelectPopupViewTemplate);
                _.bindAll(this, 'handleSearch')
            },

            render:function ()
            {
                $(this.el).html(this.template(this.model)).hide();
                this.delegateEvents(this.events);
                this.search = $(this.el).find('#search');
                this.clientSearchResults = $(this.el).find('#clientSearchResults');
                return this;
            },

            show:function ()
            {
                this.search.val('');
                this.clientSearchResults.html('');
                $(this.el).modal();
                this.search.focus();
            },

            handleSearch:function (e)
            {
                e.preventDefault();

                if (this.search.val() == "") return;
                var me = this;

                var searchResults = new ClientSearchCollection();
                searchResults.searchString = encodeURIComponent(this.search.val());
                searchResults.fetch({
                    success:function ()
                    {
                        var result = "";
                        result = _.template(SelectPopupItemView, {models:searchResults.toJSON()});

                        me.clientSearchResults.html(result);
                    },
                    error:function (err)
                    {
                        console.log(err);
                        me.clientSearchResults.html('Eroare');
                    }
                })
            },

            handleOnEnter:function (e)
            {
                e.preventDefault();

                if (e.keyCode == 13)
                {
                    this.handleSearch(e);
                }
            },

            handleSelect:function (e)
            {
                e.preventDefault();

                $(this.el).modal('hide');

                this.trigger('clientSelect', $(".modelId", e.target).val());
            }
        });

        return ClientSelectPopupView;
    }
);