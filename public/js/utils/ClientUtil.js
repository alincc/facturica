define(
    [
        'models/client/ClientSearchCollection'
    ],
    function (ClientSearchCollection)
    {
        "use strict";

        var ClientUtil = {};

        ClientUtil.setupTypeAhead = function (el, callback)
        {
            $(el).autocomplete({
                minLength:2,
                source:function (request, response)
                {
                    var collection = new ClientSearchCollection();
                    collection.on('reset', function (e)
                    {
                        response(collection.models);
                    });

                    collection.searchString = request.term;
                    collection.fetch();
                },

                focus:function (event, ui)
                {
                    $(this).val(ui.item.get('partner.name'));
                    return false;
                },

                select:function (event, ui)
                {
                    if (callback)
                    {
                        callback(ui.item);
                    }

                    $(this).val(ui.item.get('partner.name'));

                    return false;
                }
            }).data('autocomplete')._renderItem = function (ul, item)
            {
                return $('<li/>')
                    .data('item.autocomplete', item)
                    .append($('<a/>').text(item.get('partner.name')))
                    .appendTo(ul);
            };
            ;
        };

        return ClientUtil;
    });
