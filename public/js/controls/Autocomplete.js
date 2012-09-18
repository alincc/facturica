// http://tinkerbin.com/gTmLJuRE
//
// sau alternativ la http://stackoverflow.com/questions/9663428/how-to-correctly-add-a-jquery-ui-autocomplete-widget-using-backbone-js
//

define(function ()
{
    var Autocomplete = Backbone.View.extend({
        render:function ()
        {
            var choices = this.options.choices,
                selected = this.options.selected,
                iterator = this.options.iterator,
                label = this.options.label,
                allowDupes = this.options.allowDupes,
                remoteQuery = this.options.remoteQuery,
                $el = $(this.el);

            $el.autocomplete({
                source:function (request, response)
                {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');

                    // Remote fetch collection
                    if (remoteQuery)
                    {
                        choices.fetch({
                            data:jQuery.param({query:request.term}),
                            success:function (c, r)
                            {
                                response(r.filter(function (model)
                                {
                                    return iterator(model, matcher);
                                }));
                            }
                        });
                    }
                    else
                    {
                        // Preloaded collection
                        response(choices.filter(function (model)
                        {
                            return iterator(model, matcher);
                        }));
                    }

                },
                focus:function (event, ui)
                {
                    $el.val(label(ui.item));
                    return false;
                },
                select:function (event, ui)
                {
                    selected.reset();
                    selected.add(ui.item);
                    if (!allowDupes)
                    {
                        choices.remove(ui.item);
                    }
                    $el.val(label(ui.item));
                    return false;
                }
            }).data('autocomplete')._renderItem = function (ul, item)
            {
                return $('<li/>')
                    .data('item.autocomplete', item)
                    .append($('<a/>').text(label(item)))
                    .appendTo(ul);
            };
            return this;
        }
    });

    return Autocomplete;

    /*
     el.find("#partner").autocomplete({
     minLength: 1,
     source: function (request, response)
     {
     $.getJSON("url" + this.storeId, {
     term: request.term
     }, function (data)
     {
     response($.map(data, function (item)
     {
     return {    value: item.title,
     obj : item
     };
     }));
     });
     },

     select: function(event, ui)
     {
     //your select code here
     var x = ui.item.obj;
     var categories = this.model.get("x");

     },
     error: function(event, ui)
     {
     //your error code here
     }
     });*/

});