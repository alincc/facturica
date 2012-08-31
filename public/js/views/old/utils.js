tpl = {

    // Hash of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback)
    {

        var that = this;

        var loadTemplate = function (index)
        {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('public/tpl/' + name + '.html', function (data)
            {
                that.templates[name] = data;
                index++;
                if (index < names.length)
                {
                    loadTemplate(index);
                }
                else
                {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (selector)
    {
        //return this.templates[selector];

        if (!this.templates)
        {
            this.templates = {};
        }

        var template = this.templates[selector];
        if (!template)
        {
            template = $(selector).html();

            // precompile the template, for underscore.js templates
            template = _.template(template);

            this.templates[selector] = template;
        }

        return template;
    }

};


nav = {
    update: function(newMenu)
    {
        console.log("Switching menu to ", newMenu)
        $("li a").parent().removeClass('active');
        $("a[href$=" + newMenu + "]", ".nav").parent().addClass('active');
    }
}


dispath = _.extend({}, Backbone.Events);
/*

 Catch like:
 render: function(){
 ...
 dispatch.on("message:sent", this.addThreadMessage, this);
 ...
 },


 SEND like
 this.dispatch.trigger("message:sent", this.model);

 */


/* Update datepicker plugin so that MM/DD/YYYY format is used. */
$.extend($.fn.datepicker.defaults, {
    parse: function (string)
    {
        var matches;
        if ((matches = string.match(/^(\d{2,2})\/(\d{2,2})\/(\d{4,4})$/)))
        {
            return new Date(matches[3], matches[1] - 1, matches[2]);
        }
        else
        {
            return null;
        }
    },
    format: function (date)
    {
        var
                month = (date.getMonth() + 1).toString(),
                dom = date.getDate().toString();
        if (month.length === 1)
        {
            month = "0" + month;
        }
        if (dom.length === 1)
        {
            dom = "0" + dom;
        }
        return month + "/" + dom + "/" + date.getFullYear();
    }
});


/* ----------------------------------------------*/
/* UTILS */
window.Utils = {};
window.Utils.roundToTwo = function(value)
{
    return Math.round(value * 100) / 100;
};

window.Utils.round = function(value, dec)
{
    if (dec == undefined || dec == null)
    {
        dec = 1;
    }

    var m = Math.pow(10, dec);
    return Math.round(value * m) / m;
};

Number.prototype.round = function(value, dec)
{
    return Utils.round(value, dec);
}

Number.prototype.money = function(c, d, t)
{
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

_.mixin({round:function(v, d)
{
    return v.round(v,d);
}});

_.mixin({money:function(v)
{
    return v.money(2, ".", ",");
}});
/* ----------------------------------------------*/


/* ----------------------------------------------*/
var _underscore_template = _.template;
_.template = function(str, data)
{
    // match "<% include template-id %>"
    return _underscore_template(
        str.replace(
            /<%\s*include\s*(.*?)\s*%>/g,
            function(match, templateId) {
                /*var el = $('#' + templateId);
                return el ? el.html() : '';*/

                console.log('Including '+templateId);
                var el = tpl.get(templateId);
                return el ? el : '';
            }
        ),
        data
    );
};
