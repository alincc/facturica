define(
    [
        'text!tpl/client/Edit.html',
        'models/client/PartnerModel',
        'controls/MessageManager'
    ],
    function (EditTemplate, PartnerModel, MessageManager)
    {
        var ClientEditView;

        ClientEditView = Backbone.View.extend({

            tagName:"div",

            events:{
                "click #save":"handleSave",
                "click #cancel":"handleCancel"
            },

            bindings:{
                'value input[name="partner.name"]':'partner.name',
                'value input[name="partner.fiscalCode"]':'partner.fiscalCode',
                'value input[name="partner.regcom"]':'partner.regcom',
                'value textarea[name="partner.address"]':'partner.address',
                'value input[name="partner.city"]':'partner.city',
                'value input[name="partner.bankAccount"]':'partner.bankAccount',
                'value input[name="partner.bankName"]':'partner.bankName',
                'value input[name="partner.contact"]':'partner.contact',
                'value input[name="partner.phone"]':'partner.phone',
                'value input[name="partner.email"]':'partner.email'
            },

            initialize:function ()
            {
                console.log('ClientEditView:initialize');

                this.template = _.template(EditTemplate);

                this.model.bind("destroy", this.close, this);
            },

            render:function ()
            {
                console.log('ClientEditView:render');

                var el = $(this.el);
                el.html(this.template(this.model.toJSON()));

                //this.viewValidation();

                return this.bindModel();
            },

            handleSave:function (e)
            {
                var partner, me = this;

                e.preventDefault();

                if (!me.model.isValid(true))
                {
                    messages = new MessageManager();
                    messages.error("Eroare - completati toate campurile campurile cu rosu");
                    return false;
                }

                this.model.save(
                    me.model.toJSON(),
                    {
                        wait:true,
                        success:function (model, fail, xhr)
                        {
                            console.log('ClientEditView:handleSuccessSave', me.model.get('id'));
                            me.model.trigger('save-success');
                        },
                        error:function (model, fail, xhr)
                        {
                            console.log('ClientEditView:handleError', model, fail, xhr);
                            messages = new MessageManager();
                            messages.error("Eroare server - clientul nu a fost salvat.");
                        }
                    });
            },

            handleCancel:function (e)
            {
                e.preventDefault();
                window.history.back();
            }
        });

        return ClientEditView;
    });