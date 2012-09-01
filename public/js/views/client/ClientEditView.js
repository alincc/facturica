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

                Backbone.Validation.bind(this);
                this.viewValidation();
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
                var partner, me = this;

                e.preventDefault();

                partner = new PartnerModel();
                partner.set({'name':$.trim($("#name").val()),
                    'fiscalCode':$("#fiscalCode").val(),
                    'regcom':$("#regcom").val(),
                    'address':$("#address").val(),
                    'city':$("#city").val(),
                    'bankAccount':$("#bankAccount").val(),
                    'bankName':$("#bankName").val(),
                    'contact':$("#contact").val(),
                    'phone':$("#phone").val(),
                    'email':$("#email").val()});

                this.model.set({'partner':partner}, {silent:true});

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
                            console.log('ClientEditView:handleSuccessSave', me.model.get('id'));
                            me.model.trigger('save-success');
                            return true;
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