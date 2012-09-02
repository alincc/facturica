define([
    'text!tpl/common/ErrorView.html'
],
    function (ErrorViewTemplate)
    {
        var ErrorView = Backbone.View.extend({

            initialize:function ()
            {
                console.log('ErrorView initialized');
                this.template = _.template(ErrorViewTemplate);
            },

            render:function (title, message)
            {
                console.log('ErrorView render');
                $(this.el).html(this.template({title: title, message: message}));
                return this;
            }
        })

        return ErrorView;
    });

