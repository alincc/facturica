var BaseFormEdit = Backbone.View.extend({

    initialize:function ()
    {
        console.log('BaseFormEdit:initialize');

        // Holds all fields changed
        this.changes = {};

        _.bindAll(this, 'render');

        this.viewValidation();
    },

    viewValidation:function ()
    {
        Backbone.Validation.bind(this, {
            index:0,
            forceUpdate:true,
            valid:function (view, attr)
            {
                var control = $("input[id='" + attr + "']");
                control.parents("div.control-group").removeClass("error");
                control.parent().find(".help-inline").remove();
            },
            invalid:function (view, attr, error)
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
});

//_.extend(BaseFormEdit, Backbone.View);

_.extend(BaseFormEdit.prototype, Backbone.View);