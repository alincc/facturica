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

            initialize:function ()
            {
                console.log('ClientEditView:initialize');

                this.template = _.template(EditTemplate);

                this.model.bind("change", this.render, this);
                this.model.bind("destroy", this.close, this);
            },

            render:function ()
            {
                console.log('ClientEditView:render');
                var el = $(this.el);
                el.html(this.template(this.model.toJSON()));

                return this;
            },

            handleSave:function (e)
            {
                var partner;

                e.preventDefault();

                partner = new PartnerModel();
                partner.set('name', $.trim($("#name").val()));
                partner.set('fiscalCode', $("#fiscalCode").val());
                partner.set('regcom', $("#regcom").val());
                partner.set('address', $("#address").val());
                partner.set('city', $("#city").val());
                partner.set('bankAccount', $("#bankAccount").val());
                partner.set('bankName', $("#bankName").val());
                partner.set('contact', $("#contact").val());
                partner.set('phone', $("#phone").val());
                partner.set('email', $("#email").val());

                this.model.set('partner', partner);

                if (!this.model.isValid(true))
                {
                    messages = new MessageManager();
                    messages.error("Eroare - completati toate campurile campurile cu rosu");
                    return false;
                }

                this.model.save(
                    null,
                    {
                        wait:true,
                        success:function (model, fail, xhr)
                        {
                            console.log('ClientEditView:handleSuccessSave');
                            model.trigger('save-success', model.get('id'));
                        },
                        error:function (model, fail, xhr)
                        {
                            console.log('ClientEditView:handleError', model, fail, xhr);
                            messages = new MessageManager();
                            messages.error("Eroare server - clientul nu a fost salvat.");
                        }
                    });

                return false;
            },

            handleCancel:function (e)
            {
                e.preventDefault();
                window.history.back();
            }
        });

        return ClientEditView;
    });