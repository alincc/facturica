define(
    [
        'controls/MessageManager',
        'text!tpl/config/ConfigSeriesEditView.html'
    ],
    function (MessageManager, ConfigSeriesEditViewTemplate)
    {
        "use strict";

        var ConfigSeriesEditView = Backbone.View.extend({

            tagName:"div",

            events:{
                'change #docType, #prefix, #suffix, #currentNumber':'updateExample',
                'click #save':'save',
                'click #cancel':'cancel'
            },

            initialize:function ()
            {
                _.bindAll(this, 'render', 'updateExample', 'save');

                this.template = _.template(ConfigSeriesEditViewTemplate);
            },

            render:function ()
            {

                Backbone.Validation.bind(this);

                var el = $(this.el);
                el.html(this.template(this.model.toJSON()));

                this.updateExample();

                return this;
            },

            updateExample:function (e)
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

            save:function (e)
            {
                var me = this;

                e.preventDefault();

                if (!this.model.isValid(true))
                {
                    var messages = new MessageManager();
                    messages.error("Eroare - completati toate campurile campurile obligatorii");
                    return false;
                }

                var success = function (model, fail, xhr)
                {
                    console.log('ConfigSeriesEditView:handleSuccessSave');
                    model.trigger("save-success");
                };

                var error = function (model, fail, xhr)
                {
                    console.log('ConfigSeriesEditView:handleError', model, fail, xhr);
                    messages = new MessageManager();
                    messages.error("Eroare server - seria nu a fost salvata.");
                };

                this.model.save(null, {wait:true, success:success, error:error});

                return false;
            },

            cancel:function (e)
            {
                e.preventDefault();
                window.history.back();
            }
        });

        return ConfigSeriesEditView;

    });