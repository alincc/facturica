var activeRequests = [];

define(['backbone','backboneValidation'], function (Backbone)
{
    Backbone.View.prototype.close = function ()
    {
        console.log("Backbone.View.close");
        this.remove();
        this.unbind();
        if (this.onClose)
        {
            this.onClose();
        }
    }

    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

    Backbone.View.prototype.viewValidation = function ()
    {
        Backbone.Validation.bind(this,
        {
            index: 0,
            forceUpdate: true,
            valid: function(view, attr)
            {
                var control = $("input[id='" + attr + "']");
                control.parents("div.control-group").removeClass("error");
                control.parent().find(".help-inline").remove();
            },
            invalid: function(view, attr, error)
            {
                var control = $("input[id='" + attr + "']");
                var group = control.parents("div.control-group");
                if (!group.hasClass("error"))
                {
                    group.addClass("error");
                    control.parent().append("<div class='help-inline'>" + error + "</div>");
                }

                // Scroll to first invalid item and focus on it
//                if (this.index == 0)
//                {
//                    group.scrollToMe();
//                    control.focus();
//                    this.index++;
//                }
            }
        });
    }

    //Backbone.Validation = Backbone.Validation || {};

    Backbone._sync = Backbone.sync;

    Backbone.sync = function (method, model, options)
    {
        var asyncToken = Backbone._sync.apply(this, arguments);

        asyncToken.then(function ()
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
})