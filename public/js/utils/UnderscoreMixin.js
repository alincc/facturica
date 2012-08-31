define(
        [
            'utils/NumberUtil'
        ],

        function()
        {
            _.mixin(
            {
                round:function(v, d)
                {
                    return v.round(v, d);
                }
            });

            _.mixin(
            {
                money:function(v)
                {
                    return v.money(2, ".", ",");
                }
            });

            // match "<% include template-id %>"
            var _underscore_template = _.template;
            _.template = function(str, data)
            {
                return _underscore_template(
                    str.replace(
                        /<%\s*include\s*(.*?)\s*%>/g,
                        function(match, templateId) {
                            console.log('Including '+templateId);

                            var result = "";

                            require(['text!' + templateId], function(value){
                                result = value;
                            });

                            return result ? result : '';
                        }
                    ),
                    data);
            };
        });