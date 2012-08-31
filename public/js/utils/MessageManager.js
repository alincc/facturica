var MessageManager;
var __bind = function(fn, me)
{
    return function()
    {
        return fn.apply(me, arguments);
    };
}, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent)
{
    for (var key in
            parent)
    {
        if (__hasProp.call(parent, key))
        {
            child[key] = parent[key];
        }
    }
    function ctor()
    {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
};
MessageManager = (function()
{
    __extends(MessageManager, Backbone.View);
    function MessageManager()
    {
        this.success = __bind(this.success, this);
        this.error = __bind(this.error, this);
        this.render = __bind(this.render, this);
        MessageManager.__super__.constructor.apply(this, arguments);
    }

    MessageManager.prototype.el = '.alert';
    MessageManager.prototype.render = function(type, message, opts)
    {
        var defaults, typeClass;
        defaults = {
            fade: 50000
        };
        _.extend(defaults, opts);
        typeClass = "alert alert-" + type;
        this.$el.empty().prepend(message).removeClass().addClass(typeClass).fadeIn('fast');
        return setTimeout((__bind(function()
        {
            return this.$el.fadeOut();
        }, this)), defaults.fade);
    };
    MessageManager.prototype.error = function(message, opts)
    {
        if (!!message)
        {
            return this.render('error', message + '<a class="close" data-dismiss="alert" href="#">×</a>', opts);
        }
    };
    MessageManager.prototype.success = function(message, opts)
    {
        if (!!message)
        {
            return this.render('success', message + '<a class="close" data-dismiss="alert" href="#">×</a>', opts);
        }
    };
    return MessageManager;
})();